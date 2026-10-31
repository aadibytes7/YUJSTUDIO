# YUJ Studio — Backend & API Gateway

High-performance, security-hardened FastAPI Gateway and microservices orchestrator for **YUJ Studio — Marketing Intelligence OS**.

---

## Overview

The YUJ Studio backend acts as the secure operational core and protocol translator between the zero-build browser UI, the deterministic **Engine15** creative rendering engine, SQLite persistence, and upstream Meta Graph APIs.

```
+-------------------------------------------------------------+
|                      FastAPI Gateway                         |
|                    (Port 8088 / ASGI)                       |
+------------------------------+------------------------------+
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
+---------------+      +---------------+      +---------------+
| SQLite (WAL)  |      |   Engine15    |      |  Social Studio|
|  Persistence  |      | Neural Render |      |   Publisher   |
+---------------+      +---------------+      +---------------+
```

## Key Capabilities

1. **Authentication & Session Management**:
   - Constant-time secret comparison via `hmac.compare_digest` to prevent timing attacks.
   - HttpOnly, SameSite=Lax session cookies with client-side anti-CSRF token verification (`X-CSRF-Token`).
   - Constant-time token invalidation and logout.

2. **Upstream Microservice Reverse Proxying**:
   - Zero-leak credential injection: upstream API keys, bearer tokens, and internal service URLs remain purely server-side.
   - Resilient circuit-breaker fallback to local SQLite cache when upstream nodes are unreachable.

3. **Deterministic Creative Engine Dispatch**:
   - Dispatches structured render payloads to Engine15's verifiable canvas renderer.
   - Guarantees strict fact checking (certified claims, banned buzzwords, contrast ratios).

4. **Audited Publishing & State Machine**:
   - Enforces human review gating: cannot transition content directly from draft to published without explicit human approval.
   - Tracks transition history in SQLite WAL database.

---

## Directory Structure

```
backend/
├── gateway.py               # Main FastAPI gateway application & router
├── requirements.txt         # Pinned backend dependencies
├── Dockerfile               # Multi-stage production container build
├── .env.example             # Documented environment configuration template
├── README.md                # Backend service documentation
├── assets/                  # Default fallback creative assets
└── tests/                   # Pytest suite
    ├── test_gateway.py              # Gateway unit & routing tests
    ├── test_full_stack_e2e.py       # End-to-end integration workflows
    └── test_real_social_compat.py   # Upstream compatibility validation
```

---

## API Specifications

| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service liveness and dependency status | No |
| `POST` | `/api/login` | Issues authenticated session cookie + CSRF token | No |
| `POST` | `/api/logout` | Revokes session and clears auth cookies | Yes |
| `GET` | `/api/campaigns` | Lists all active marketing campaigns | Yes |
| `POST` | `/api/campaigns` | Creates new strategic campaign record | Yes |
| `GET` | `/api/content-plans` | Fetches weekly editorial content calendar slots | Yes |
| `POST` | `/api/engine15/render`| Initiates verifiable creative generation | Yes |
| `GET` | `/api/review-queue` | Returns drafts pending human sign-off | Yes |
| `POST` | `/api/review/approve` | Records human approval signature | Yes |
| `POST` | `/api/review/reject` | Records rejection reason and returns to draft | Yes |
| `POST` | `/api/publish` | Dispatches scheduled post to target channel | Yes |
| `GET` | `/api/performance` | Returns real-time campaign performance analytics | Yes |

---

## Getting Started

### 1. Requirements
- Python 3.10+
- Virtual environment (`venv`)

### 2. Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

### 3. Run Development Server
```bash
uvicorn gateway:app --host 127.0.0.1 --port 8088 --reload
```

### 4. Run Test Suite
```bash
pytest tests/ -v
```
