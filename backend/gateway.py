"""YUJ Studio frontend gateway v1.

Serves the responsive frontend and proxies a deliberately small allow-list of
existing Social Studio v0.6 and Renderer v0.1 routes. Secrets live on the server,
not in browser JavaScript, URLs, cookies, or the HTML payload.

This is a single-operator console security boundary; use an identity provider and
role-based access for multi-user production deployments.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import time
from collections import defaultdict, deque
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = (ROOT.parent / "frontend") if (ROOT.parent / "frontend" / "index.html").exists() else ROOT
SESSION_COOKIE = "yuj_console_session"
SESSION_SECONDS = 8 * 60 * 60
SAFE_PATH = re.compile(r"^[a-zA-Z0-9._/-]{1,220}$")

# Method-specific allow-list. The gateway deliberately cannot call arbitrary
# endpoints, approve via renderer, read credentials, or bypass Social Studio.
ALLOWED_SOCIAL = {
    "GET": [
        r"/health/(?:live|ready)",
        r"/v1/accounts", r"/v1/campaigns", r"/v1/campaigns/[a-zA-Z0-9._-]{3,100}",
        r"/v1/plans", r"/v1/plans/[a-zA-Z0-9-]{1,80}",
        r"/v1/content", r"/v1/jobs", r"/v1/calendar", r"/v1/production/status",
        r"/v1/production/jobs", r"/v1/production/jobs/[a-zA-Z0-9-]{1,80}",
        r"/v1/ops/overview", r"/v1/analytics/overview", r"/v1/analytics/campaigns",
        r"/v1/creative/imports", r"/v1/metrics", r"/v1/assets/[a-zA-Z0-9-]{1,80}",
    ],
    "POST": [
        r"/v1/campaigns", r"/v1/campaigns/[a-zA-Z0-9._-]{3,100}/transition",
        r"/v1/planning/objective-preview", r"/v1/plans/weekly",
        r"/v1/production/slots/[a-zA-Z0-9-]{1,80}",
        r"/v1/production/jobs/[a-zA-Z0-9-]{1,80}/caption-suggestions",
        r"/v1/content", r"/v1/content/[a-zA-Z0-9-]{1,80}/approve",
        r"/v1/content/[a-zA-Z0-9-]{1,80}/schedule",
        r"/v1/jobs/[a-zA-Z0-9-]{1,80}/reschedule", r"/v1/assets",
    ],
    "PATCH": [r"/v1/content/[a-zA-Z0-9-]{1,80}"],
}
ALLOWED_RENDERER = {
    "GET": [r"/health/(?:live|ready)", r"/v1/capabilities", r"/v1/metrics", r"/v1/render-jobs/[a-zA-Z0-9._:-]{1,120}"]
}


def b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def b64decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def valid_upstream(url: str, allow_http: bool) -> str:
    url = url.rstrip("/")
    parts = urlsplit(url)
    if not parts.hostname or parts.username or parts.password or parts.fragment or parts.query or parts.path not in ("", "/"):
        raise ValueError("Upstream must be an explicit origin URL without path, credentials, query or fragment")
    if parts.scheme != "https":
        if not allow_http or parts.scheme != "http":
            raise ValueError("Upstream URL must use HTTPS except explicitly permitted local test setups")
    return url


@dataclass(frozen=True)
class Config:
    social_base_url: str = ""
    social_api_key: str = ""
    renderer_base_url: str = ""
    renderer_api_key: str = ""
    console_password: str = ""
    session_secret: str = ""
    console_origin: str = ""
    cookie_secure: bool = True
    allow_http_upstream: bool = False

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            social_base_url=os.getenv("SOCIAL_BASE_URL", ""),
            social_api_key=os.getenv("SOCIAL_ADMIN_KEY", ""),
            renderer_base_url=os.getenv("RENDERER_BASE_URL", ""),
            renderer_api_key=os.getenv("RENDERER_API_KEY", ""),
            console_password=os.getenv("YUJ_CONSOLE_PASSWORD", ""),
            session_secret=os.getenv("YUJ_SESSION_SECRET", ""),
            console_origin=os.getenv("YUJ_CONSOLE_ORIGIN", ""),
            cookie_secure=os.getenv("YUJ_COOKIE_SECURE", "true").lower() not in ("0", "false", "no"),
            allow_http_upstream=os.getenv("YUJ_ALLOW_HTTP_UPSTREAM", "false").lower() in ("1", "true", "yes"),
        )

    def validate(self):
        if bool(self.social_base_url) != bool(self.social_api_key):
            raise ValueError("SOCIAL_BASE_URL and SOCIAL_ADMIN_KEY must both be provided")
        if bool(self.renderer_base_url) != bool(self.renderer_api_key):
            raise ValueError("RENDERER_BASE_URL and RENDERER_API_KEY must both be provided")
        if self.social_base_url:
            valid_upstream(self.social_base_url, self.allow_http_upstream)
            if len(self.console_password) < 12 or len(self.session_secret) < 32:
                raise ValueError("Live mode requires console password >=12 characters and session secret >=32 characters")
        if self.renderer_base_url:
            valid_upstream(self.renderer_base_url, self.allow_http_upstream)
        if self.console_origin:
            p=urlsplit(self.console_origin)
            if p.scheme not in ("http", "https") or not p.netloc or p.path not in ("", "/"):
                raise ValueError("YUJ_CONSOLE_ORIGIN must be a browser origin, such as https://studio.example.org")


class PasswordIn(BaseModel):
    password: str = Field(min_length=1, max_length=400)


def allowlisted(method: str, route: str, table: dict[str, list[str]]) -> bool:
    if not SAFE_PATH.fullmatch(route) or ".." in route or "//" in route or "\\" in route:
        return False
    return any(re.fullmatch(pattern, route) for pattern in table.get(method, []))


def create_app(settings: Config | None = None) -> FastAPI:
    config = settings or Config.from_env()
    config.validate()
    live = bool(config.social_base_url)
    app = FastAPI(title="YUJ Integrated Marketing Console", docs_url=None, redoc_url=None, openapi_url=None)
    app.state.config = config
    app.state.outbound_transport = None  # test-only override; HTTPX otherwise uses real network
    attempts = defaultdict(deque)

    def digest(value: str) -> str:
        return b64(hmac.new(config.session_secret.encode(), value.encode(), hashlib.sha256).digest())

    def signed_session() -> str:
        payload = {"v": 1, "sub": "workspace_admin", "iat": int(time.time()),
                   "exp": int(time.time()) + SESSION_SECONDS, "nonce": secrets.token_hex(16)}
        data = b64(json.dumps(payload, separators=(",", ":")).encode())
        return data + "." + digest(data)

    def session(request: Request) -> str | None:
        if not live:
            return None
        token = request.cookies.get(SESSION_COOKIE, "")
        try:
            data, signature = token.split(".", 1)
            if len(data) > 640 or not hmac.compare_digest(signature, digest(data)):
                return None
            payload = json.loads(b64decode(data))
            if payload.get("v") != 1 or payload.get("sub") != "workspace_admin":
                return None
            if not int(payload.get("iat", -1)) <= int(time.time()) < int(payload.get("exp", 0)):
                return None
            return token
        except (KeyError, TypeError, ValueError, OverflowError):
            return None

    def csrf_value(token: str) -> str:
        return digest("csrf:" + token)

    def validate_origin(request: Request) -> None:
        origin = request.headers.get("origin")
        if origin and config.console_origin and origin.rstrip("/") != config.console_origin.rstrip("/"):
            raise HTTPException(403, "Cross-origin operator requests are forbidden")
        if origin and not config.console_origin:
            # Without a configured public origin, accept only same-origin browser requests.
            incoming = urlsplit(origin)
            if incoming.netloc.lower() != request.url.netloc.lower() or incoming.scheme != request.url.scheme:
                raise HTTPException(403, "Cross-origin operator requests are forbidden")

    def require_session(request: Request, write: bool = False) -> str:
        token = session(request)
        if not token:
            raise HTTPException(401, "Console sign-in required")
        if write:
            validate_origin(request)
            header = request.headers.get("X-CSRF-Token", "")
            if not hmac.compare_digest(header, csrf_value(token)):
                raise HTTPException(403, "Invalid or missing CSRF token")
        return token

    @app.middleware("http")
    async def protections(request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https: http:; connect-src 'self'; "
            "font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
        )
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.get("/")
    async def home():
        return FileResponse(FRONTEND_DIR / "index.html", media_type="text/html", headers={"Cache-Control": "no-store"})

    @app.get("/styles.css")
    async def stylesheet():
        return FileResponse(FRONTEND_DIR / "styles.css", media_type="text/css")

    @app.get("/app.js")
    async def javascript():
        return FileResponse(FRONTEND_DIR / "app.js", media_type="text/javascript", headers={"Cache-Control": "no-cache"})

    @app.get("/assets/engine15-sample.png")
    async def sample_image():
        return FileResponse(FRONTEND_DIR / "assets" / "engine15-sample.png", media_type="image/png")

    @app.get("/health/live")
    async def health():
        return {"status": "ok", "service": "yuj-marketing-console", "mode": "live" if live else "demo"}

    @app.get("/api/config")
    async def frontend_config():
        return {"mode": "live" if live else "demo", "social_configured": bool(config.social_base_url),
                "renderer_configured": bool(config.renderer_base_url)}

    @app.get("/api/session")
    async def current_session(request: Request):
        if not live:
            return {"authenticated": False, "mode": "demo"}
        token = session(request)
        return {"authenticated": bool(token), "user": "Workspace Admin" if token else None,
                "csrf": csrf_value(token) if token else None}

    @app.post("/api/login")
    async def login(request: Request, credentials: PasswordIn, response: Response):
        if not live:
            raise HTTPException(503, "Preview mode has no live authentication")
        validate_origin(request)
        ip = request.client.host if request.client else "unknown"
        t = time.monotonic()
        bucket = attempts[ip]
        while bucket and bucket[0] < t - 300:
            bucket.popleft()
        if len(bucket) >= 10:
            raise HTTPException(429, "Too many sign-in attempts. Try again later")
        if not hmac.compare_digest(credentials.password, config.console_password):
            bucket.append(t)
            raise HTTPException(401, "Incorrect console credentials")
        bucket.clear()
        token = signed_session()
        response.set_cookie(SESSION_COOKIE, token, httponly=True, secure=config.cookie_secure,
                            samesite="strict", max_age=SESSION_SECONDS, path="/")
        return {"authenticated": True, "csrf": csrf_value(token)}

    @app.post("/api/logout")
    async def logout(request: Request, response: Response):
        require_session(request, write=True)
        response.delete_cookie(SESSION_COOKIE, path="/", secure=config.cookie_secure, samesite="strict")
        return {"authenticated": False}

    async def forward(request: Request, upstream: str, key: str, header: str, allow: dict[str, list[str]], route: str):
        require_session(request, write=request.method != "GET")
        if not allowlisted(request.method, route, allow):
            raise HTTPException(404, "This service operation is not exposed in the console")
        content_length = request.headers.get("content-length", "")
        if content_length:
            try:
                declared_length = int(content_length)
            except ValueError:
                raise HTTPException(400, "Invalid request content length")
            if declared_length < 0 or declared_length > 10 * 1024 * 1024:
                raise HTTPException(413, "Console request exceeds size limit")
        raw = b""
        if request.method in {"POST", "PATCH"}:
            raw = await request.body()
            if len(raw) > 10 * 1024 * 1024:
                raise HTTPException(413, "Console request exceeds size limit")
        headers = {header: key}
        content_type = request.headers.get("content-type", "")
        if content_type:
            headers["Content-Type"] = content_type
        url = upstream.rstrip("/") + route
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(25, connect=5), transport=app.state.outbound_transport,
                                         follow_redirects=False, trust_env=False) as client:
                r = await client.request(request.method, url, params=request.query_params.multi_items(),
                                         headers=headers, content=raw or None)
        except (httpx.RequestError, httpx.TimeoutException):
            raise HTTPException(502, "Upstream service unreachable")
        # Do not follow redirects that could carry credentials to another origin.
        if 300 <= r.status_code < 400:
            raise HTTPException(502, "Unexpected upstream redirect refused")
        if len(r.content) > 4 * 1024 * 1024:
            raise HTTPException(502, "Upstream response too large for the console")
        allowed_type = r.headers.get("content-type", "application/json")
        if "application/json" not in allowed_type:
            raise HTTPException(502, "Unexpected upstream response type")
        return Response(content=r.content, media_type="application/json", status_code=r.status_code)

    @app.api_route("/api/social/{path:path}", methods=["GET", "POST", "PATCH"])
    async def social_proxy(path: str, request: Request):
        if not live:
            raise HTTPException(503, "Demo mode cannot perform Social Studio operations")
        return await forward(request, valid_upstream(config.social_base_url, config.allow_http_upstream),
                             config.social_api_key, "X-YUJ-Social-Key", ALLOWED_SOCIAL, "/" + path)

    @app.get("/api/renderer/{path:path}")
    async def renderer_proxy(path: str, request: Request):
        if not config.renderer_base_url:
            raise HTTPException(503, "Renderer adapter is not configured")
        return await forward(request, valid_upstream(config.renderer_base_url, config.allow_http_upstream),
                             config.renderer_api_key, "X-YUJ-Renderer-Key", ALLOWED_RENDERER, "/" + path)

    return app


app = create_app()
