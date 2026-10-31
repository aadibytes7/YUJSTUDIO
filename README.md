# YUJ Studio — Marketing Intelligence OS

<div align="center">

![YUJ Studio Banner](screenshots/command_center_hero.png)

### The Autonomous, Brand-Safe Marketing Command Center

**AI-powered marketing campaign management, creative production, content planning, human approval workflows, multi-platform publishing, and performance analytics.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://aadibytes7.github.io/YUJSTUDIO/)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![JavaScript](https://img.shields.io/badge/ES2022-Vanilla%20JS-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design%20System-1572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Zero Build](https://img.shields.io/badge/Build-Zero--Dependency-success.svg?style=for-the-badge)](#frontend-architecture)
[![Security Audited](https://img.shields.io/badge/Security-CSRF%20%2B%20Strict%20Origin-red.svg?style=for-the-badge)](docs/SECURITY.md)

[Overview](#overview) • [Key Features](#key-features) • [System Architecture](#system-architecture) • [Workflow](#complete-workflow) • [Screenshots](#screenshots) • [Quickstart](#installation-instructions) • [Documentation](#technical-documentation-hub)

</div>

---

## 1. Overview

**YUJ Studio (Marketing Intelligence OS / 01)** is a unified enterprise marketing command center that closes the loop between strategic campaign briefs, editorial planning, deterministic creative rendering, human approval checkpoints, automated social media publishing, and multi-channel performance telemetry.

Built on an **Obsidian Deep Graphite (`#0B0E13`)**, **Burnt Orange (`#FF873E`)**, and **Electric Teal (`#27C7C1`)** design system, YUJ Studio replaces fragmented marketing stacks with a cohesive, mission-critical operations center.

---

## 2. Problem Statement

Modern enterprise marketing teams face severe operational friction:
1. **Disconnected Stacks**: Strategy happens in documents, planning in spreadsheets, creative generation in separate AI tools, approvals over email, and scheduling inside native social platform dashboards.
2. **Generative AI Hallucination & Brand Drift**: Unconstrained diffusion models output ungrounded visuals that violate brand guidelines, mangle logos, and display inaccurate product facts.
3. **Accidental Dispatches**: Lacking hard automated barriers, unreviewed drafts or test copy frequently leak into live production social channels.
4. **Manufactured Metrics**: Marketing dashboards routinely fabricate synthetic conversion numbers, phantom ROAS, or unverified projections.

---

## 3. Our Solution

YUJ Studio solves these problems through an invariant-enforced architecture:
- **Unified Command Center**: A single cohesive interface covering all nine operational stages.
- **Engine15 Deterministic Renderer Adapter v0.1**: Vector-layered, brand-safe composition grounded strictly in verified fact briefs.
- **Mandatory Human-in-the-Loop Barrier**: Mathematical impossibility of dispatching unapproved creative.
- **Zero-Phantom Data Principle**: Every insight is anchored in verified Meta Graph and LinkedIn API telemetry. Unobserved values render honestly as em dashes (`—`), never synthetic projections.

---

## 4. Key Features

- **Flagship Command Center (`/overview`)**: Complete operational visibility with atmospheric celestial hero, 4 orbital KPI cards, real-time Marketing Operations Pulse SVG visualizer, and a 5-stage interactive pipeline rail.
- **Strategic Campaign Portfolio (`/campaigns`)**: Multi-brand initiative management (`YUJ Foundation`, `YUJ World`, `YUJ GreenBuild`, `YUJ Ahaar`).
- **Weekly Content Planner (`/planner`)**: Matrix-based editorial scheduling across platforms (Instagram, Facebook, LinkedIn) and formats (Carousel, Reel, Story, Post).
- **Engine15 Creative Lab (`/creative`)**: Brand-safe parameterized visual generation with verified fact injection.
- **Human Review Queue (`/reviews`)**: High-resolution visual inspection drawer with one-click approval or structured rejection.
- **Publishing Calendar Workspace (`/calendar`)**: Interactive 3-part layout (Toolbar, 7-column monthly grid, and chronological right-hand daily schedule inspector with inline rescheduling).
- **Performance Intelligence Command Center (`/analytics`)**: 7-card KPI summary strip with SVG circular gauges, daily engagement area curves with milestone badges, platform reach vs. target bars, Share of Voice (SOV) segmentation, and top posts sorting.
- **Pipeline Health & Operations (`/operations`)**: Real-time service heartbeat monitoring, rate limits, and severity-coded alert feeds.
- **Dual Execution Engine**: 100% functional offline seeded demonstration mode paired with a secure live gateway mode.

---

## 5. System Architecture

### High-Level Architecture Diagram

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

## 6. Complete Workflow

```mermaid
flowchart TD
    A["1. Strategic Brief Inception\n(Define Objectives & Brand)"] --> B["2. Weekly Content Planning\n(Slot Allocation & Topic Angles)"]
    B --> C["3. Creative Production\n(Engine15 Verified-Fact Rendering)"]
    C --> D{"4. Human Review Gate\n(Operator Inspection)"}
    
    D -->|Rejected with Feedback| B
    D -->|Approved by Operator| E["5. Time Slot Scheduling\n(Publishing Calendar Queue)"]
    
    E --> F["6. Automated Meta & LinkedIn Dispatch\n(Cryptographic OAuth Dispatches)"]
    F --> G["7. Provenance Verification\n(Immutable remote_post_id Receipt)"]
    G --> H["8. Performance Intelligence\n(Observed Telemetry & SOV Analysis)"]
    H -->|Actionable Learnings| A
```

---

## 7. Technology Stack

| Layer | Technologies | Key Characteristics |
|---|---|---|
| **Frontend UI** | HTML5, CSS3 Custom Properties, Vanilla ES2022 JavaScript | Zero-build toolchain, zero external package bloat, instant browser startup |
| **Data Visualization** | Raw Scalable Vector Graphics (SVG), CSS Keyframe Animations | High DPI rendering, responsive viewBox scaling, zero heavy charting libraries |
| **Security Gateway** | Python 3.10+, FastAPI, Starlette, Uvicorn, HTTPX, Pydantic | Sub-millisecond latency, CSRF token validation, reverse-proxy credential vault |
| **Persistence** | SQLite with WAL Journaling (`social.db`, `renderer.db`) | High-concurrency reads, atomic ACID transaction guarantees |
| **Creative Engine** | YUJ Engine15 Renderer Adapter v0.1 | Layered vector synthesis, WCAG AA contrast verification, brand asset locking |
| **External APIs** | Meta Graph API (v20.0), LinkedIn Marketing API (v2) | OAuth 2.0 token management, webhook subscription handling |

---

## 8. Frontend Architecture

```mermaid
flowchart TD
    BrowserEvent["User Interaction / DOM Event"] --> Dispatcher["Global Action Dispatcher (handleAction)"]
    FormSubmit["Form Submission"] --> FormHandler["Form Serialization (handleForm)"]
    
    Dispatcher --> StateStore["Reactive State Object (state)"]
    FormHandler --> StateStore
    
    StateStore --> ModeCheck{"Execution Mode?"}
    ModeCheck -->|Demo Mode| LocalMock["Offline Seed Engine (freshDemo)"]
    ModeCheck -->|Live Mode| APIClient["API Gateway Adapter (api)"]
    
    APIClient --> RemoteGateway["FastAPI Gateway (/api/*)"]
    RemoteGateway --> StateStore
    LocalMock --> StateStore
    
    StateStore --> RenderEngine["Modular Screen Renderers (render)"]
    RenderEngine --> DOM["Virtual Shell Container (#appView)"]
    DOM --> ToastNotification["Feedback Toast Engine (toast)"]
```

---

## 9. Backend Architecture

```mermaid
flowchart TD
    ClientReq["Incoming HTTP Request"] --> SecurityHeaders["Protective Security Headers Middleware\n(CSP, X-Frame-Options, HSTS, Referrer)"]
    SecurityHeaders --> OriginValidation{"Origin Validated?"}
    OriginValidation -->|No| RejectOrigin["403 Forbidden: Cross-Origin Blocked"]
    OriginValidation -->|Yes| SessionValidation{"Session Active?"}
    
    SessionValidation -->|No & Live Mode| RejectSession["401 Unauthorized: Console Login Required"]
    SessionValidation -->|Yes| CSRFCheck{"State Mutating Method?"}
    
    CSRFCheck -->|GET / HEAD| RouteCheck{"Allowlisted Route?"}
    CSRFCheck -->|POST / PATCH / DELETE| TokenCompare{"Header X-CSRF-Token Valid?"}
    TokenCompare -->|No| RejectCSRF["403 Forbidden: Invalid CSRF Token"]
    TokenCompare -->|Yes| RateLimitCheck{"Rate Limit Exceeded?"}
    
    RateLimitCheck -->|Yes| RejectRate["429 Too Many Requests"]
    RateLimitCheck -->|No| RouteCheck
    
    RouteCheck -->|No| RejectRoute["404 Not Found: Route Not Exposed"]
    RouteCheck -->|Yes| UpstreamDispatch["Forward Request with Injected Server Key"]
```

---

## 10. AI Integration Architecture

```mermaid
flowchart LR
    subgraph Input["Input Parameters"]
        BrandGuidelines["Brand Guidelines\n(Palette, Fonts, Margins)"]
        VerifiedFacts["Verified Fact Claims\n(Zero Hallucination Input)"]
        TopicBrief["Campaign Thematic Slot"]
    end

    subgraph Engine15Pipeline["Engine15 Renderer Pipeline"]
        LLM["Gemini Angle Generator"]
        Composer["Vector Layer Layout Engine"]
        Validator["Brand Invariant Checker\n(Contrast, Padding, Glyphs)"]
    end

    subgraph Output["Output Artifacts"]
        RenderPNG["Brand-Safe Creative Asset\n(PNG / JPEG / WebP)"]
        SocialCopy["Synchronized Post Copy\n(Captions & Hashtags)"]
    end

    Input --> LLM
    LLM --> Composer
    VerifiedFacts --> Composer
    BrandGuidelines --> Validator
    Composer --> Validator
    Validator --> Output
```

---

## 11. Database Architecture

```mermaid
erDiagram
    CAMPAIGN ||--o{ PLAN : contains
    CAMPAIGN ||--o{ CONTENT : produces
    PLAN ||--o{ PLAN_SLOT : schedules
    PLAN_SLOT ||--o| CONTENT : targets
    CONTENT ||--o{ JOB : dispatches
    ACCOUNT ||--o{ JOB : publishes_to

    CAMPAIGN {
        string id PK
        string name
        string objective
        string status
        json brands
        string created_by
    }
    CONTENT {
        string id PK
        string caption
        string media_id
        string status
        string brand
    }
    JOB {
        string id PK
        string platform
        string status
        datetime run_at
        string remote_post_id
    }
```

---

## 12. API Communication

Detailed in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

```http
# Example: Creating a Campaign via Security Gateway
POST /api/social/v1/campaigns HTTP/1.1
Host: 127.0.0.1:8088
Origin: http://127.0.0.1:8080
Cookie: session_id=s%3A...
X-CSRF-Token: 9e8a7f6c...
Content-Type: application/json

{
  "name": "Life Education 2026",
  "objective": "awareness",
  "brands": ["yuj-foundation"]
}
```

---

## 13. Security Architecture

Detailed in [docs/SECURITY.md](docs/SECURITY.md).
- **Zero-Trust Client Boundary**: Browser code holds no API master keys or platform credentials.
- **CSRF Token Invariant**: Every state-mutating request validates cryptographic HMAC token equality.
- **Timing-Attack Resistance**: Password hashes and HMAC signatures use `hmac.compare_digest`.
- **Brute-Force Protection**: IP rate limiting enforces backoff on repeated authentication failures.

---

## 14. Screenshots

<div align="center">

### Command Center Flagship Dashboard
![Command Center](screenshots/command_center_hero.png)
*Atmospheric celestial hero, 4 orbital KPI cards, Marketing Operations Pulse SVG chart, 5-stage interactive pipeline rail, Creative Production Workbench, and Needs Your Decision approval queue.*

### Performance Intelligence Command Center
![Performance Intelligence](screenshots/performance_intelligence_dashboard.jpg)
*7-card KPI strip with circular SVG gauges, Daily Engagement Trend area curves, Platform Reach vs. Target comparison bars, Share of Voice (SOV %) segmentation, top-performing posts table, and real-time alert feed.*

</div>

---

## 15. Installation Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ (for UI test automation runners)
- Git 2.30+

### Setup
```bash
# 1. Clone the repository
git clone https://github.com/aadibytes7/YUJSTUDIO.git
cd YUJSTUDIO

# 2. Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
```

---

## 16. Environment Configuration

Copy the template and configure server-side parameters:
```bash
cp .env.example .env
```
Key variables:
- `ENV_MODE`: `demo` (offline simulation) or `live` (connected upstream mode).
- `SOCIAL_BASE_URL`: Endpoint for Social Studio v0.6.
- `SOCIAL_ADMIN_KEY`: Bearer key for Social Studio administrative operations.
- `RENDERER_BASE_URL`: Endpoint for Engine15 Renderer Adapter.
- `YUJ_CONSOLE_PASSWORD`: Password for workspace administrator.
- `YUJ_SESSION_SECRET`: 32+ character random hex secret for session signing.

---

## 17. Running the Application Locally

```bash
# Terminal 1: Launch Security Gateway on Port 8088
cd backend
uvicorn gateway:app --host 127.0.0.1 --port 8088

# Terminal 2: Serve Frontend on Port 8080
cd frontend
python -m http.server 8080 --bind 127.0.0.1
```

Open your browser at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

---

## 18. Testing Instructions

YUJ Studio includes end-to-end UI automation runners and a pytest suite:

```bash
# 1. Run Node.js UI Screen Runtime Test (verifies all 9 screen renderers)
node frontend/tests/check_ui_runtime.cjs

# 2. Run UI Flow Simulation (Campaign Creation → Draft Approval → Post Scheduling)
node frontend/tests/check_ui_flows.cjs

# 3. Run Backend Pytest Suite (Security Gateway, CSRF, E2E Full-Stack Verification)
cd backend
pytest tests/ -v
```

---

## 19. Technical Documentation Hub

Explore in-depth documentation in the [`docs/`](docs/) directory:
- [System Architecture (ARCHITECTURE.md)](docs/ARCHITECTURE.md)
- [System Design & Module Breakdown (SYSTEM_DESIGN.md)](docs/SYSTEM_DESIGN.md)
- [REST API Documentation (API_DOCUMENTATION.md)](docs/API_DOCUMENTATION.md)
- [Database Schema (DATABASE_SCHEMA.md)](docs/DATABASE_SCHEMA.md)
- [AI & Engine15 Pipeline (AI_PIPELINE.md)](docs/AI_PIPELINE.md)
- [End-to-End Workflow (WORKFLOW.md)](docs/WORKFLOW.md)
- [Deployment Guide (DEPLOYMENT.md)](docs/DEPLOYMENT.md)
- [Security Specification (SECURITY.md)](docs/SECURITY.md)

---

## 20. Future Roadmap

- [ ] **Multi-Brand Workspace Partitioning**: Full RBAC isolation across independent organizational tenants.
- [ ] **TikTok & YouTube Shorts Native Publishing**: Direct OAuth publishing adapters for vertical video formats.
- [ ] **Self-Hosted AI Inference**: On-premise fine-tuned models for offline enterprise environments.
- [ ] **Automated A/B Visual Split Testing**: Multi-variant visual render dispatches with automated winner selection.

---

## 21. Contribution Guidelines

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on code style, safety invariants, and pull request procedures.

---

## 22. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
<b>YUJ STUDIO</b> — Engineered for Precision, Brand Safety, and Autonomous Marketing Excellence.<br />
Copyright © 2026 Aditya Prajapati (aadibytes7). All rights reserved.
</div>
