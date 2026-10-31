# YUJ Studio — Deployment Guide

## 1. Local Development Setup

YUJ Studio supports two local execution modes:

### Mode A: Offline Seeded Demo Mode (Default)
In Demo mode, the entire platform runs without external upstream dependencies or database setup.
```bash
# 1. Clone repository
git clone https://github.com/aadibytes7/YUJSTUDIO.git
cd YUJSTUDIO

# 2. Set up virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 3. Start Gateway Server (Port 8088)
cd backend
uvicorn gateway:app --host 127.0.0.1 --port 8088

# 4. In a separate terminal, serve frontend (Port 8080)
cd frontend
python -m http.server 8080 --bind 127.0.0.1
```
Visit [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your browser.

---

### Mode B: Connected Live Mode
Connects to upstream **Social Studio v0.6** and **Engine15 Renderer Adapter v0.1**.
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Configure environment variables in .env
SOCIAL_BASE_URL=https://social.internal.yuj.example
SOCIAL_ADMIN_KEY=your_social_studio_admin_key
RENDERER_BASE_URL=https://renderer.internal.yuj.example
RENDERER_API_KEY=your_renderer_api_key
YUJ_CONSOLE_PASSWORD=your_strong_operator_password
YUJ_SESSION_SECRET=your_32_char_hex_session_secret
YUJ_CONSOLE_ORIGIN=https://studio.yuj.example
YUJ_COOKIE_SECURE=true

# 3. Launch Gateway
uvicorn gateway:app --host 0.0.0.0 --port 8088
```

---

## 2. Containerized Deployment (Docker)

The repository provides a production-grade multi-stage Dockerfile running as a non-privileged user (`uid: 10001`).

```bash
# Build the Docker container
docker build -t yuj-studio:latest -f backend/Dockerfile backend/

# Run container in Demo mode
docker run -d --name yuj-studio -p 8088:8088 yuj-studio:latest

# Run container in Connected mode with environment file
docker run -d --name yuj-studio -p 8088:8088 --env-file .env yuj-studio:latest
```

---

## 3. Production Hardening Checklist

- [x] Run as non-root user inside container (`yuj:10001`).
- [x] Enforce TLS / HTTPS at the reverse proxy (Nginx, Caddy, or Cloudflare).
- [x] Set `YUJ_COOKIE_SECURE=true` so session cookies require HTTPS.
- [x] Configure explicit `YUJ_CONSOLE_ORIGIN` to prevent cross-origin forgery.
- [x] Isolate upstream microservices within an internal VPC or localhost loopback.
- [x] Enable rate limiting and monitoring on the `/api/login` route.
- [x] Mount media storage on persistent persistent volumes or S3-compatible object stores.
