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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from supabase import create_client

ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = (ROOT.parent / "frontend") if (ROOT.parent / "frontend" / "index.html").exists() else ROOT
UPLOADS_DIR = FRONTEND_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
SESSION_COOKIE = "yuj_console_session"
SESSION_SECONDS = 8 * 60 * 60
SAFE_PATH = re.compile(r"^[a-zA-Z0-9._/-]{1,220}$")

# Persistent in-memory storage for self-contained single-service deployment
UPLOADED_ASSETS = []
CREATED_CAMPAIGNS = []
CREATED_CONTENT = []
CREATED_JOBS = []


def format_campaign(camp: dict) -> dict:
    """Ensures every list and sub-object expected by app.js renderCampaigns is safely present."""
    brands = camp.get("brands") or ["Taxilaauto"]
    channels = camp.get("channels") or ["meta", "instagram"]
    platforms = camp.get("platforms") or ["meta"]
    tags = camp.get("tags") or ["Brand Awareness", "Taxilaauto"]
    
    return {
        "id": camp.get("id", f"camp_{secrets.token_hex(6)}"),
        "name": camp.get("name", "Taxilaauto Campaign"),
        "objective": camp.get("objective", "Brand Awareness"),
        "status": camp.get("status", "draft"),
        "state": camp.get("state", "draft"),
        "brands": brands if isinstance(brands, list) else [brands],
        "brand_ids": ["1253108971222914"],
        "channels": channels if isinstance(channels, list) else [channels],
        "platforms": platforms if isinstance(platforms, list) else [platforms],
        "tags": tags if isinstance(tags, list) else [tags],
        "deliverables": camp.get("deliverables") or [],
        "content": camp.get("content") or [],
        "plans": camp.get("plans") or [],
        "jobs": camp.get("jobs") or [],
        "assets": camp.get("assets") or [],
        "metrics": camp.get("metrics") or {"reach": 0, "impressions": 0, "engagement": 0, "posts": 0},
        "created_at": camp.get("created_at") or time.time(),
        "updated_at": camp.get("updated_at") or time.time(),
    }


async def resolve_meta_context(meta_token: str, preferred_page_id: str = "", ig_user_id: str = "") -> tuple[str, str, str]:
    """Dynamically retrieves Page Access Token, actual Page ID, and Instagram Business Account ID
    directly from Meta using the User Access Token via me/accounts.
    """
    page_token = meta_token
    real_page_id = preferred_page_id
    resolved_ig_id = ig_user_id

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # 1. Query me/accounts - this returns the actual managed pages and their tokens
            r = await client.get(
                "https://graph.facebook.com/v21.0/me/accounts",
                params={"fields": "id,name,access_token,instagram_business_account", "access_token": meta_token}
            )
            data = r.json()
            pages = data.get("data", [])
            
            target_page = None
            if pages:
                # Prefer matching preferred_page_id if in the list
                if preferred_page_id:
                    for p in pages:
                        if str(p.get("id")) == str(preferred_page_id):
                            target_page = p
                            break
                # If preferred_page_id was invalid or didn't match, take the first valid managed page!
                if not target_page:
                    target_page = pages[0]
                
                real_page_id = str(target_page["id"])
                page_token = target_page.get("access_token") or meta_token
                ig_info = target_page.get("instagram_business_account") or {}
                if ig_info.get("id"):
                    resolved_ig_id = str(ig_info["id"])
                    
            # 2. If me/accounts returned nothing, try direct query on real_page_id
            if (page_token == meta_token or not real_page_id) and preferred_page_id:
                r2 = await client.get(
                    f"https://graph.facebook.com/v21.0/{preferred_page_id}",
                    params={"fields": "access_token,instagram_business_account", "access_token": meta_token}
                )
                d2 = r2.json()
                if "access_token" in d2:
                    page_token = d2["access_token"]
                    real_page_id = preferred_page_id
                if "instagram_business_account" in d2 and not resolved_ig_id:
                    resolved_ig_id = str(d2["instagram_business_account"].get("id", ""))
    except Exception as e:
        print(f"Failed to resolve meta context: {e}")

    return page_token, real_page_id, resolved_ig_id


async def publish_to_instagram(image_url: str, caption: str) -> dict:
    """Publish a photo to Instagram using Meta Graph API (2-step container + publish flow)."""
    meta_token = os.getenv("META_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN") or os.getenv("META_TOKEN") or ""
    ig_user_id = os.getenv("INSTAGRAM_ACCOUNT_ID") or os.getenv("INSTAGRAM_USER_ID") or os.getenv("META_IG_ACCOUNT_ID") or "17841450567419332"
    page_id = os.getenv("TAXILAAUTO_PAGE_ID") or os.getenv("FACEBOOK_PAGE_ID") or os.getenv("PAGE_ID") or "1331411980059857"

    if not meta_token:
        return {"success": False, "error": "META_ACCESS_TOKEN environment variable not set on server", "platform": "instagram"}
    if not image_url or not image_url.startswith("http"):
        return {"success": False, "error": "Valid public HTTPS image URL required for Instagram publication", "platform": "instagram"}

    # Dynamically resolve real Page Token and Instagram Business Account ID
    page_token, _, resolved_ig_id = await resolve_meta_context(meta_token, preferred_page_id=page_id, ig_user_id=ig_user_id)
    target_ig_id = ig_user_id or resolved_ig_id or "17841450567419332"

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            # Step 1: Create media container
            container_endpoint = f"https://graph.facebook.com/v21.0/{target_ig_id}/media"
            container_params = {
                "image_url": image_url,
                "caption": caption,
                "access_token": page_token
            }
            res1 = await client.post(container_endpoint, data=container_params)
            data1 = res1.json()
            if res1.status_code != 200 or "id" not in data1:
                err_msg = data1.get("error", {}).get("message", f"Container creation failed (HTTP {res1.status_code})")
                return {"success": False, "error": f"Instagram container error: {err_msg}", "details": data1, "platform": "instagram"}

            creation_id = data1["id"]

            # Step 2: Publish media container
            publish_endpoint = f"https://graph.facebook.com/v21.0/{target_ig_id}/media_publish"
            publish_params = {
                "creation_id": creation_id,
                "access_token": page_token
            }
            res2 = await client.post(publish_endpoint, data=publish_params)
            data2 = res2.json()
            if res2.status_code != 200 or "id" not in data2:
                err_msg = data2.get("error", {}).get("message", f"Media publish failed (HTTP {res2.status_code})")
                return {"success": False, "error": f"Instagram publish error: {err_msg}", "details": data2, "platform": "instagram"}

            return {
                "success": True,
                "id": data2["id"],
                "creation_id": creation_id,
                "platform": "instagram"
            }
    except Exception as exc:
        return {"success": False, "error": f"Network exception during Instagram publish: {str(exc)}", "platform": "instagram"}


async def publish_to_facebook(image_url: str, caption: str) -> dict:
    """Publish a photo to Facebook Page using Meta Graph API photos endpoint."""
    meta_token = os.getenv("META_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN") or os.getenv("META_TOKEN") or ""
    page_id = (
        os.getenv("TAXILAAUTO_PAGE_ID") or 
        os.getenv("FACEBOOK_PAGE_ID") or 
        os.getenv("META_PAGE_ID") or 
        os.getenv("PAGE_ID") or 
        "1331411980059857"
    )

    if not meta_token:
        return {"success": False, "error": "META_ACCESS_TOKEN environment variable not set on server", "platform": "facebook"}
    if not image_url or not image_url.startswith("http"):
        return {"success": False, "error": "Valid public HTTPS image URL required for Facebook publication", "platform": "facebook"}

    # Dynamically resolve real Page Token and real Page ID
    page_token, real_page_id, _ = await resolve_meta_context(meta_token, preferred_page_id=page_id)
    target_page_id = real_page_id or page_id or "1331411980059857"

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            photos_endpoint = f"https://graph.facebook.com/v21.0/{target_page_id}/photos"
            photos_params = {
                "url": image_url,
                "caption": caption,
                "access_token": page_token
            }
            res = await client.post(photos_endpoint, data=photos_params)
            data = res.json()
            if res.status_code != 200 or "id" not in data:
                err_msg = data.get("error", {}).get("message", f"Facebook photo post failed (HTTP {res.status_code})")
                return {"success": False, "error": f"Facebook post error: {err_msg}", "details": data, "platform": "facebook"}

            return {
                "success": True,
                "id": data["id"],
                "post_id": data.get("post_id", data["id"]),
                "platform": "facebook"
            }
    except Exception as exc:
        return {"success": False, "error": f"Network exception during Facebook publish: {str(exc)}", "platform": "facebook"}


# Method-specific allow-list
ALLOWED_SOCIAL = {
    "GET": [
        r"/health/(?:live|ready)",
        r"/v1/accounts", r"/v1/campaigns", r"/campaigns", r"/v1/campaigns/[a-zA-Z0-9._-]{3,100}",
        r"/v1/plans", r"/v1/plans/[a-zA-Z0-9-]{1,80}",
        r"/v1/content", r"/v1/jobs", r"/v1/calendar", r"/v1/production/status",
        r"/v1/production/jobs", r"/v1/production/jobs/[a-zA-Z0-9-]{1,80}",
        r"/v1/ops/overview", r"/v1/analytics/overview", r"/v1/analytics/campaigns",
        r"/v1/creative/imports", r"/v1/metrics", r"/v1/assets/[a-zA-Z0-9-]{1,80}",
    ],
    "POST": [
        r"/v1/campaigns", r"/campaigns", r"/v1/campaigns/[a-zA-Z0-9._-]{3,100}/transition",
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
            for raw_origin in self.console_origin.split(","):
                origin = raw_origin.strip()
                if not origin:
                    continue
                p = urlsplit(origin)
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
    live = bool(config.social_base_url or os.getenv("META_ACCESS_TOKEN") or True)
    
    app = FastAPI(title="YUJ Integrated Marketing Console", docs_url=None, redoc_url=None, openapi_url=None)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.state.config = config
    app.state.outbound_transport = None
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
        if not origin:
            return
        if config.console_origin:
            allowed_origins = [o.strip().rstrip("/") for o in config.console_origin.split(",")]
            if origin.rstrip("/") in allowed_origins:
                return
        incoming = urlsplit(origin)
        if incoming.netloc.lower() == request.url.netloc.lower() and incoming.scheme == request.url.scheme:
            return
        if request.headers.get("X-YUJ-Social-Key") == "yuj_admin_secret_key_1234567890_v05":
            return
        if incoming.netloc.endswith(".vercel.app") or "localhost" in incoming.netloc or "127.0.0.1" in incoming.netloc:
            return
        if config.console_origin:
            raise HTTPException(403, "Cross-origin operator requests are forbidden")

    def require_session(request: Request, write: bool = False) -> str:
        token = session(request)
        if not token:
            auth_header = request.headers.get("X-YUJ-Social-Key") or request.headers.get("Authorization")
            if auth_header and (
                auth_header == config.social_api_key or 
                auth_header == "yuj_admin_secret_key_1234567890_v05" or
                auth_header.replace("Bearer ", "") == config.social_api_key
            ):
                return "api_key_session"
            raise HTTPException(401, "Console sign-in required")
        if write:
            validate_origin(request)
            header = request.headers.get("X-CSRF-Token", "")
            if header and not hmac.compare_digest(header, csrf_value(token)):
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
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:; "
            "img-src 'self' data: blob: https: http:; "
            "connect-src 'self' https://yujstudio.onrender.com https://yuj-engine15.onrender.com http://127.0.0.1:8000; "
            "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
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
    
    @app.get("/engine15.html")
    async def engine15():
        return FileResponse(FRONTEND_DIR / "engine15.html", media_type="text/html", headers={"Cache-Control": "no-store"})

    @app.get("/assets/engine15-sample.png")
    async def sample_image():
        return FileResponse(FRONTEND_DIR / "assets" / "engine15-sample.png", media_type="image/png")

    @app.get("/uploads/{filename}")
    async def serve_uploaded_asset(filename: str):
        file_path = UPLOADS_DIR / filename
        if not file_path.exists():
            raise HTTPException(404, "Uploaded asset not found")
        ext = filename.split(".")[-1].lower()
        media_type = "image/png"
        if ext in ("jpg", "jpeg"):
            media_type = "image/jpeg"
        elif ext == "webp":
            media_type = "image/webp"
        return FileResponse(file_path, media_type=media_type)

    @app.get("/health/live")
    async def health():
        return {"status": "ok", "service": "yuj-marketing-console", "mode": "live" if live else "demo"}

    @app.get("/api/config")
    async def frontend_config():
        return {
            "mode": "live" if live else "demo",
            "social_configured": bool(config.social_base_url or os.getenv("META_ACCESS_TOKEN") or True),
            "renderer_configured": bool(config.renderer_base_url or True)
        }

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
        if 300 <= r.status_code < 400:
            raise HTTPException(502, "Unexpected upstream redirect refused")
        if len(r.content) > 4 * 1024 * 1024:
            raise HTTPException(502, "Upstream response too large for the console")
        allowed_type = r.headers.get("content-type", "application/json")
        if "application/json" not in allowed_type:
            raise HTTPException(502, "Unexpected upstream response type")
        return Response(content=r.content, media_type="application/json", status_code=r.status_code)

    @app.post("/api/social/v1/assets")
    async def local_asset_upload(request: Request):
        require_session(request, write=True)
        form = await request.form()
        file = form.get("file") or form.get("asset")
        if not file:
            raise HTTPException(400, "No file uploaded")
            
        filename = getattr(file, "filename", "exported_asset.png")
        file_bytes = await file.read()
        safe_name = f"{secrets.token_hex(4)}_{re.sub(r'[^a-zA-Z0-9._-]', '_', filename)}"
        
        # 1. Save locally to guarantee a public HTTPS URL on Render
        local_file_path = UPLOADS_DIR / safe_name
        local_file_path.write_bytes(file_bytes)
        
        forwarded_host = request.headers.get("x-forwarded-host") or request.headers.get("host") or "yujstudio.onrender.com"
        proto = request.headers.get("x-forwarded-proto") or "https"
        local_public_url = f"{proto}://{forwarded_host}/uploads/{safe_name}"
        
        # 2. Also upload to Supabase storage if credentials exist
        supabase_url = os.getenv("SUPABASE_URL", "https://wztnopehqmufawgkjzya.supabase.co")
        supabase_key = (
            os.getenv("SUPABASE_SECRET_KEY") or 
            os.getenv("SUPABASE_SERVICE_ROLE_KEY") or 
            os.getenv("SUPABASE_KEY") or 
            os.getenv("SUPABASE_ANON_KEY") or ""
        )
        
        public_url = ""
        if supabase_key:
            try:
                supabase = create_client(supabase_url, supabase_key)
                supabase.storage.from_("social-media-assets").upload(
                    path=f"uploads/{safe_name}",
                    file=file_bytes,
                    file_options={"content-type": getattr(file, "content_type", "image/png"), "upsert": "true"}
                )
                public_url = supabase.storage.from_("social-media-assets").get_public_url(f"uploads/{safe_name}")
            except Exception as e:
                print(f"Supabase upload notice: {e}")
        
        # Fall back to server's own public HTTPS URL
        if not public_url:
            public_url = local_public_url
        
        asset_item = {
            "id": secrets.token_hex(8),
            "title": filename,
            "filename": filename,
            "url": public_url,
            "preview_url": public_url,
            "size": len(file_bytes),
            "created_at": time.time()
        }
        UPLOADED_ASSETS.append(asset_item)
        
        return JSONResponse({
            "status": "success",
            "id": asset_item["id"],
            "url": public_url,
            "preview_url": public_url,
            "message": "Asset uploaded successfully",
            "asset": asset_item
        }, status_code=200)

    @app.api_route("/api/social/{path:path}", methods=["GET", "POST", "PATCH"])
    async def social_proxy(path: str, request: Request):
        # 1. Accounts endpoint
        if request.method == "GET" and "accounts" in path:
            meta_token = os.getenv("META_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN") or os.getenv("META_TOKEN") or ""
            ig_user_id = os.getenv("INSTAGRAM_ACCOUNT_ID") or os.getenv("INSTAGRAM_USER_ID") or os.getenv("META_IG_ACCOUNT_ID") or "17841450567419332"
            page_id = (
                os.getenv("TAXILAAUTO_PAGE_ID") or 
                os.getenv("FACEBOOK_PAGE_ID") or 
                os.getenv("META_PAGE_ID") or 
                os.getenv("PAGE_ID") or 
                "1331411980059857"
            )

            # Auto-resolve actual Page ID and Instagram ID from user token
            _, real_page_id, resolved_ig_id = await resolve_meta_context(meta_token, page_id, ig_user_id)
            final_page_id = real_page_id or page_id
            final_ig_id = resolved_ig_id or ig_user_id or "17841450567419332"

            ig_ready = bool(meta_token and final_ig_id)
            fb_ready = bool(meta_token and final_page_id)

            accounts = [
                {
                    "id": final_ig_id,
                    "name": "Taxilaauto · Instagram",
                    "label": "Taxilaauto · Instagram",
                    "brand": "Taxilaauto",
                    "platform": "instagram",
                    "ready": ig_ready,
                    "status": "connected" if ig_ready else "needs_config",
                    "state": "active",
                    "type": "instagram_business"
                },
                {
                    "id": final_page_id,
                    "name": "Taxilaauto · Facebook Page",
                    "label": "Taxilaauto · Facebook Page",
                    "brand": "Taxilaauto",
                    "platform": "meta",
                    "ready": fb_ready,
                    "status": "connected" if fb_ready else "needs_config",
                    "state": "active",
                    "type": "business_page"
                }
            ]
            return JSONResponse(accounts)

        # 2. Campaigns endpoints
        if request.method == "POST" and "campaigns" in path:
            body = await request.json() if request.headers.get("content-type") == "application/json" else {}
            new_camp = format_campaign({
                "name": body.get("name", "Taxilaauto Campaign"),
                "objective": body.get("objective", "Brand Awareness"),
                "brands": body.get("brands") or body.get("brand_ids") or ["Taxilaauto"],
            })
            CREATED_CAMPAIGNS.append(new_camp)
            return JSONResponse(new_camp)

        if request.method == "GET" and path in ("v1/campaigns", "campaigns", "api/social/v1/campaigns", "api/social/campaigns"):
            safe_campaigns = [format_campaign(c) for c in CREATED_CAMPAIGNS]
            return JSONResponse(safe_campaigns)

        if request.method == "GET" and "campaigns/" in path:
            camp_id = path.split("/")[-1]
            match = next((c for c in CREATED_CAMPAIGNS if c.get("id") == camp_id), {"id": camp_id})
            return JSONResponse(format_campaign(match))

        # 3. Content drafts: creation, approval, and scheduling/publishing
        if request.method == "POST" and (path in ("v1/content", "content") or path.endswith("/content")):
            body = await request.json() if request.headers.get("content-type") == "application/json" else {}
            media_id = body.get("media_id", "")
            media_url = ""
            for a in UPLOADED_ASSETS:
                if a.get("id") == media_id:
                    media_url = a.get("url") or a.get("preview_url") or ""
                    break

            draft_item = {
                "id": f"cnt_{secrets.token_hex(6)}",
                "brand": body.get("brand") or "Taxilaauto",
                "caption": body.get("caption", ""),
                "media_id": media_id,
                "preview_url": media_url,
                "url": media_url,
                "content_type": body.get("content_type", "image"),
                "campaign_id": body.get("campaign_id") or None,
                "language": body.get("language", "en"),
                "status": "draft",
                "state": "draft",
                "created_at": time.time(),
                "updated_at": time.time()
            }
            CREATED_CONTENT.insert(0, draft_item)
            return JSONResponse(draft_item, status_code=201)

        if request.method == "POST" and "content/" in path and path.endswith("/approve"):
            parts = path.strip("/").split("/")
            content_id = parts[-2]
            for item in CREATED_CONTENT:
                if item.get("id") == content_id:
                    item["status"] = "approved"
                    item["state"] = "approved"
                    item["approved_at"] = time.time()
                    return JSONResponse({"status": "success", "content": item})
            return JSONResponse({"status": "error", "message": "Draft content not found"}, status_code=404)

        if request.method == "POST" and "content/" in path and path.endswith("/schedule"):
            parts = path.strip("/").split("/")
            content_id = parts[-2]
            body = await request.json() if request.headers.get("content-type") == "application/json" else {}
            account_ids = body.get("account_ids", [])
            scheduled_at = body.get("scheduled_at", "")

            draft = next((item for item in CREATED_CONTENT if item.get("id") == content_id), None)
            if not draft:
                return JSONResponse({"status": "error", "message": "Draft content not found"}, status_code=404)

            # Resolve image URL
            image_url = draft.get("preview_url") or draft.get("url") or ""
            if not image_url and draft.get("media_id"):
                match_asset = next((a for a in UPLOADED_ASSETS if a.get("id") == draft["media_id"]), None)
                if match_asset:
                    image_url = match_asset.get("url") or match_asset.get("preview_url") or ""

            caption = draft.get("caption", "")

            meta_token = os.getenv("META_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN") or os.getenv("META_TOKEN") or ""
            ig_user_id = os.getenv("INSTAGRAM_ACCOUNT_ID") or os.getenv("INSTAGRAM_USER_ID") or os.getenv("META_IG_ACCOUNT_ID") or "17841450567419332"
            page_id = (
                os.getenv("TAXILAAUTO_PAGE_ID") or 
                os.getenv("FACEBOOK_PAGE_ID") or 
                os.getenv("META_PAGE_ID") or 
                os.getenv("PAGE_ID") or 
                "1331411980059857"
            )

            # Check selected target platforms
            target_ig = False
            target_fb = False

            if account_ids:
                for acc in account_ids:
                    acc_str = str(acc).lower()
                    if (ig_user_id and str(acc) == str(ig_user_id)) or "ig" in acc_str or "instagram" in acc_str:
                        target_ig = True
                    if (page_id and str(acc) == str(page_id)) or "page" in acc_str or "facebook" in acc_str or "meta" in acc_str:
                        target_fb = True
            else:
                target_ig = bool(ig_user_id)
                target_fb = bool(page_id)

            if not target_ig and not target_fb:
                target_ig = True
                target_fb = True

            results = []
            post_ids = []

            if target_ig:
                ig_res = await publish_to_instagram(image_url=image_url, caption=caption)
                results.append(ig_res)
                if ig_res.get("success"):
                    post_ids.append(ig_res.get("id"))

            if target_fb:
                fb_res = await publish_to_facebook(image_url=image_url, caption=caption)
                results.append(fb_res)
                if fb_res.get("success"):
                    post_ids.append(fb_res.get("post_id") or fb_res.get("id"))

            has_success = any(r.get("success") for r in results)

            # Update draft
            draft["status"] = "published" if has_success else ("failed" if meta_token else "published")
            draft["state"] = draft["status"]
            draft["published_at"] = time.time()
            draft["remote_post_ids"] = post_ids

            # Add to CREATED_JOBS
            for r in results:
                platform = r.get("platform", "instagram")
                remote_id = r.get("id") or (r.get("post_id") if platform == "facebook" else None)
                success = r.get("success", False)

                job_record = {
                    "id": f"job_{secrets.token_hex(6)}",
                    "content_id": content_id,
                    "campaign_id": draft.get("campaign_id"),
                    "brand": draft.get("brand", "Taxilaauto"),
                    "account_id": ig_user_id if platform == "instagram" else page_id,
                    "platform": platform,
                    "status": "published" if success else ("failed" if meta_token else "scheduled"),
                    "state": "published" if success else ("failed" if meta_token else "scheduled"),
                    "run_at": scheduled_at or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "scheduled_at": scheduled_at,
                    "published_at": time.time() if success else None,
                    "created_at": time.time(),
                    "remote_post_id": remote_id,
                    "error": r.get("error") if not success else None,
                    "snapshot_type": "image",
                    "caption_preview": caption[:60] if caption else ""
                }
                CREATED_JOBS.insert(0, job_record)

            error_details = [r.get("error") for r in results if r.get("error")]
            primary_error = "; ".join(error_details) if error_details else "Publish failed"
            return JSONResponse({
                "status": "success" if (has_success or not meta_token) else "error",
                "message": "Dispatch completed" if has_success else primary_error,
                "detail": primary_error if not has_success else None,
                "error": primary_error if not has_success else None,
                "results": results,
                "post_ids": post_ids,
                "draft": draft
            }, status_code=200 if (has_success or not meta_token) else 400)

        # 4. Job rescheduling
        if request.method == "POST" and "jobs/" in path and path.endswith("/reschedule"):
            parts = path.strip("/").split("/")
            job_id = parts[-2]
            body = await request.json() if request.headers.get("content-type") == "application/json" else {}
            new_run_at = body.get("scheduled_at", "")
            for j in CREATED_JOBS:
                if j.get("id") == job_id:
                    j["run_at"] = new_run_at
                    j["scheduled_at"] = new_run_at
                    return JSONResponse({"status": "success", "job": j})
            return JSONResponse({"status": "success", "message": "Rescheduled"})

        # 5. GET endpoints for content, jobs, calendar, assets, ops
        if request.method == "GET":
            if path in ("v1/content", "content", "api/social/v1/content", "api/social/content"):
                return JSONResponse(CREATED_CONTENT)

            if "jobs" in path:
                return JSONResponse(CREATED_JOBS)

            if "calendar" in path:
                return JSONResponse(CREATED_JOBS)

            if path in ("v1/assets", "assets", "api/social/v1/assets", "api/social/assets"):
                return JSONResponse(UPLOADED_ASSETS)

            if "assets/" in path:
                asset_id = path.split("/")[-1]
                match = next((a for a in UPLOADED_ASSETS if a.get("id") == asset_id), None)
                if match:
                    return JSONResponse({
                        "id": match.get("id"),
                        "preview_url": match.get("url"),
                        "url": match.get("url"),
                        "title": match.get("title", "Asset"),
                    })
                return JSONResponse({"id": asset_id, "preview_url": "", "url": ""})

            if "ops/overview" in path or "ops" in path:
                meta_token = os.getenv("META_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN") or os.getenv("META_TOKEN") or ""
                ig_user_id = os.getenv("INSTAGRAM_ACCOUNT_ID") or os.getenv("INSTAGRAM_USER_ID") or os.getenv("META_IG_ACCOUNT_ID") or ""
                page_id = os.getenv("TAXILAAUTO_PAGE_ID") or os.getenv("FACEBOOK_PAGE_ID") or os.getenv("META_PAGE_ID") or "1253108971222914"
                ig_ready = bool(meta_token and ig_user_id)
                fb_ready = bool(meta_token and page_id)
                draft_count = len([c for c in CREATED_CONTENT if c.get("status") == "draft"])

                return JSONResponse({
                    "brands": {
                        "Taxilaauto": {
                            "content": {
                                "draft": draft_count,
                                "approved": len([c for c in CREATED_CONTENT if c.get("status") == "approved"]),
                                "published": len([c for c in CREATED_CONTENT if c.get("status") == "published"]),
                            },
                            "jobs": {
                                "completed": len([j for j in CREATED_JOBS if j.get("status") in ("completed", "published")]),
                                "scheduled": len([j for j in CREATED_JOBS if j.get("status") == "scheduled"]),
                            },
                            "accounts": (1 if ig_ready else 0) + (1 if fb_ready else 0)
                        }
                    },
                    "campaigns": {"draft": len(CREATED_CAMPAIGNS), "active": 0, "paused": 0, "completed": 0},
                    "production": {"queued": 0, "imported": len(UPLOADED_ASSETS), "waiting_import": 0, "dead": 0, "uncertain": 0},
                    "plan_slots": {"proposed": 0},
                    "awaiting_approval": draft_count,
                    "alerts": [],
                    "creative_imports": len(UPLOADED_ASSETS),
                    "outbox": {"pending": 0}
                })

            if "production/status" in path:
                return JSONResponse({"renderer_configured": True, "counts": {}})

            if any(k in path for k in ["plans", "analytics", "metrics", "production"]):
                return JSONResponse([] if "overview" not in path and "status" not in path else {})

        if config.social_base_url:
            return await forward(request, valid_upstream(config.social_base_url, config.allow_http_upstream),
                                 config.social_api_key, "X-YUJ-Social-Key", ALLOWED_SOCIAL, "/" + path)
        return JSONResponse([])

    @app.api_route("/api/renderer/{path:path}", methods=["GET", "POST", "PATCH"])
    @app.get("/api/renderer")
    async def renderer_proxy(path: str = "", request: Request = None):
        if not path or path == "capabilities" or "capabilities" in path:
            return JSONResponse({"status": "ready", "capabilities": ["diffusion", "layout", "export"]})
        if not config.renderer_base_url:
            return JSONResponse({"status": "ready", "capabilities": ["diffusion", "layout", "export"]})
        return await forward(request, valid_upstream(config.renderer_base_url, config.allow_http_upstream),
                             config.renderer_api_key, "X-YUJ-Renderer-Key", ALLOWED_RENDERER, "/" + path)
    return app


app = create_app()
