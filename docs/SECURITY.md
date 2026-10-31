# YUJ Studio — Security Specification

## 1. Security Philosophy & Threat Model

YUJ Studio is designed for enterprise marketing operations where unauthorized social media dispatches can cause severe brand damage, legal exposure, or regulatory sanctions.

The platform enforces a **Zero-Trust Client** security model:
1. The browser runtime is considered untrusted.
2. No external platform API tokens (Meta App Tokens, Page Tokens, LinkedIn OAuth Keys) ever leave the backend gateway.
3. Every mutating action requires verified authentication, origin validation, and CSRF token proof.

```mermaid
flowchart TD
    Browser["Untrusted Browser Client"] -->|1. Incoming Mutation Request| Gateway["FastAPI Security Gateway"]
    
    subgraph GatewayChecks["Gateway Security Invariants"]
        Check1{"Origin Allowed?"}
        Check2{"Valid Session Cookie?"}
        Check3{"Valid CSRF Token?"}
        Check4{"Route Allowlisted?"}
        Check5{"Payload Size <= 10MB?"}
        Check1 -->|Pass| Check2
        Check2 -->|Pass| Check3
        Check3 -->|Pass| Check4
        Check4 -->|Pass| Check5
    end

    Gateway --> GatewayChecks
    Check5 -->|All Invariants Verified| Upstream["Authorized Upstream Microservice"]
    Check1 -->|Fail| R1["403 Forbidden"]
    Check2 -->|Fail| R2["401 Unauthorized"]
    Check3 -->|Fail| R3["403 Invalid CSRF"]
    Check4 -->|Fail| R4["404 Not Exposed"]
    Check5 -->|Fail| R5["413 Payload Too Large"]
```

---

## 2. Authentication & Session Management

- **Signed Session Cookies**: Operator sessions are issued as cryptographic HMAC-SHA256 signed tokens (`SESSION_COOKIE`), stored with `HttpOnly`, `SameSite=Strict`, and `Secure` attributes.
- **Timing-Safe Evaluation**: Password hashes and HMAC signatures are validated using `hmac.compare_digest` to eliminate timing side-channel attacks.
- **Session Expiration**: Sessions automatically invalidate after 12 hours (`43,200 seconds`).

---

## 3. Cross-Site Request Forgery (CSRF) Invariant

- Every operator session generates an associated CSRF token derived cryptographically from the session secret (`digest("csrf:" + token)`).
- For all state-mutating HTTP methods (`POST`, `PATCH`, `DELETE`), the gateway demands an identical `X-CSRF-Token` header.
- Cross-origin requests from foreign domains are blocked via strict `Origin` header validation against `YUJ_CONSOLE_ORIGIN`.

---

## 4. HTTP Security Headers

Every response emitted by the gateway includes hardened HTTP security headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
Cache-Control: no-store (for all /api/* routes)
```

---

## 5. Rate Limiting & Denial-of-Service Defenses

- **Brute-Force Login Throttling**: The `/api/login` endpoint maintains sliding-window IP rate limiting (maximum 10 attempts per 5 minutes per client IP).
- **Payload Size Caps**: Requests exceeding 10MB are rejected immediately before body buffer allocation (`413 Payload Too Large`).
- **Response Size Caps**: Upstream microservice responses exceeding 4MB are dropped to prevent memory exhaustion attacks.
