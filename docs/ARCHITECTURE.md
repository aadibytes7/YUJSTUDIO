# YUJ Studio — System Architecture Specification

## 1. Executive Architecture Overview

**YUJ Studio (Marketing Intelligence OS / 01)** is a unified marketing automation and analytics platform connecting strategic intent, creative generation, human verification, scheduled multi-platform publishing, and performance measurement.

The architecture strictly enforces **zero-phantom metrics**, **deterministic brand safety**, **credential isolation**, and **mandatory human-in-the-loop approvals**.

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend Client (Browser Runtime)"]
        UI["Modern Responsive Dashboard\n(9 Operational Modules)"]
        StateEngine["Reactive State Manager (state)\n(In-Memory + LocalStorage)"]
        OfflineEngine["Offline Seeded Engine\n(freshDemo / demoInsights)"]
        APIAdapter["API Gateway Client (api)\n(Auto-CSRF + Session Headers)"]
        UI --> StateEngine
        StateEngine --> APIAdapter
        StateEngine -.-> OfflineEngine
    end

    subgraph SecurityGateway["FastAPI Security Gateway (:8088)"]
        ReverseProxy["FastAPI Reverse Proxy & Allowlist"]
        AuthMiddleware["Session & Auth Middleware\n(Cookie session_id)"]
        CSRFMiddleware["CSRF Invariant Enforcer\n(Header X-CSRF-Token)"]
        RateLimiter["Token-Bucket Rate Limiter"]
        CredentialVault["Server-Only Secrets Store\n(Social Admin Key / Renderer Key)"]
        
        ReverseProxy --> AuthMiddleware
        AuthMiddleware --> CSRFMiddleware
        CSRFMiddleware --> RateLimiter
        RateLimiter --> CredentialVault
    end

    subgraph CoreServices["Upstream Microservices (:8000, :8001, :8002)"]
        SocialStudio["Social Studio v0.6\n(Campaigns, Plans, Drafts, Scheduling)"]
        RendererAdapter["Engine15 Renderer Adapter v0.1\n(Brand-Safe Deterministic Composition)"]
        EventBus["YUJ Event Bus v0.3.6\n(Audit Logging & Async Events)"]
        SocialDB[(SQLite / social.db)]
        RendererDB[(SQLite / renderer.db)]

        SocialStudio --> SocialDB
        RendererAdapter --> RendererDB
    end

    subgraph ExternalEcosystem["External Marketing Platforms"]
        MetaGraph["Meta Graph API\n(Instagram & Facebook Publishing)"]
        LinkedInAPI["LinkedIn Marketing API\n(Organizational Posts & UGC Shares)"]
        Webhooks["Social Ingestion Webhooks"]
    end

    APIAdapter ==>|HTTP JSON / Same-Origin| ReverseProxy
    CredentialVault ==>|Authorized Internal Calls| SocialStudio
    CredentialVault ==>|Render Briefs| RendererAdapter
    CredentialVault ==>|Event Dispatch| EventBus
    SocialStudio ==>|Encrypted OAuth API| MetaGraph
    SocialStudio ==>|OAuth 2.0 REST| LinkedInAPI
    Webhooks -.->|Incoming Ingestion| SocialStudio
```

---

## 2. Component Boundaries & Core Invariants

### A. Frontend Boundary
- **Zero-Build Vanilla Architecture**: Pure ES2022 JavaScript, CSS3, and semantic HTML5. No bloated bundlers, Webpack, or Babel. Instant load times and complete transparency.
- **Offline / Online Dual Execution**:
  - `Demo Mode`: Operates 100% offline with zero external network calls. Pre-seeded campaign portfolios, simulated approval transitions, and audited demo metrics.
  - `Live Mode`: Operates strictly against the FastAPI Security Gateway using credentials held on the server.
- **Zero-Phantom Data Principle**: Never synthesize fake reach, conversions, impressions, or ROI. Missing or unobserved metrics render strictly as em dashes (`—`).

### B. Security Gateway Boundary
- **Credential Isolation**: Client applications never receive Meta access tokens, LinkedIn secrets, or database master keys. All external platform communication originates server-side.
- **CSRF Protection**: All state-mutating requests (`POST`, `PUT`, `DELETE`) require an active session and a valid `X-CSRF-Token` header.
- **Route Allowlisting**: Only explicitly enumerated API routes are proxied to upstream services. Unrecognized routes trigger `404 Not Found` or `403 Forbidden`.
- **Timing-Safe Cryptography**: Authentication tokens and password hashes are verified using constant-time comparisons (`hmac.compare_digest`) to prevent timing attack vulnerabilities.

### C. Upstream Microservices Layer
- **Social Studio v0.6**: Manages campaign lifecycles, editorial weekly planners, slot allocations, draft reviews, and scheduling queues.
- **Engine15 Renderer Adapter v0.1**: Translates campaign briefs into pixel-perfect brand visuals grounded in verified facts. No unverified or hallucinatory images are ever composed.
- **YUJ Event Bus v0.3.6**: Centralized telemetry bus capturing immutable audit records for campaign creation, draft sign-offs, and publishing dispatches.

---

## 3. Communication Protocols

| Leg | Protocol | Transport | Auth Mechanism | Payload Format |
|---|---|---|---|---|
| Browser → Gateway | HTTPS / HTTP (Dev) | TCP | Cookie (`session_id`) + Header (`X-CSRF-Token`) | JSON |
| Gateway → Social Studio | HTTP (Internal) | Private Network / localhost | Bearer Admin Key (`SOCIAL_ADMIN_KEY`) | JSON |
| Gateway → Engine15 | HTTP (Internal) | Private Network / localhost | Header Key (`RENDERER_API_KEY`) | JSON / Multipart |
| Social Studio → Meta Graph | HTTPS | Public Internet | Long-Lived System User Access Token | JSON REST |
| Social Studio → LinkedIn | HTTPS | Public Internet | OAuth 2.0 Bearer Token | JSON REST |
