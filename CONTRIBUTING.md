# Contributing to YUJ Studio

Thank you for your interest in contributing to **YUJ Studio — Marketing Intelligence OS**!

YUJ Studio is engineered with strict production safety invariants, brand-safe deterministic rendering, verified fact pipelines, and a human-in-the-loop approval architecture.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful and constructive in all discussions, issues, and code reviews.

---

## Development Workflow

### 1. Prerequisites
- **Python 3.10+** (with `pip` and virtual environment support)
- **Node.js 18+** (for executing UI automation test runners)
- A modern evergreen browser (Chrome, Firefox, Safari, Edge)

### 2. Environment Setup
```bash
# Clone the repository
git clone https://github.com/aadibytes7/YUJSTUDIO.git
cd YUJSTUDIO

# Create Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt
```

### 3. Running Locally
Start both backend gateway and frontend server:
```bash
# Terminal 1: Security Gateway (Port 8088)
cd backend
uvicorn gateway:app --host 127.0.0.1 --port 8088 --reload

# Terminal 2: Frontend Static Host (Port 8080)
cd frontend
python -m http.server 8080 --bind 127.0.0.1
```
Access the application at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

---

## Core Architecture Principles

When contributing code, adhere to these mandatory invariants:
1. **Zero Phantom Metrics**: Never synthesize fake impressions, reach, conversions, or ROAS. If telemetry is unobserved, display an em dash (`—`).
2. **Mandatory Human-in-the-Loop Gate**: No draft or creative may be published without explicit operator sign-off.
3. **Deterministic Brand Consistency**: Engine15 rendering adheres strictly to brand layout and color guidelines.
4. **Credential Isolation**: Secrets, private API tokens, and Meta app credentials must never cross the gateway boundary into clientside JavaScript.
5. **Zero Bundler Dependency**: The frontend is built on pure ES2022 vanilla JavaScript, CSS3, and HTML5. Do not introduce bloated Webpack, Babel, or Vite toolchains unless approved by core maintainers.

---

## Running Automated Tests

Before submitting a Pull Request, ensure all tests pass:

```bash
# 1. Frontend Runtime & UI Flows
node frontend/tests/check_ui_runtime.cjs
node frontend/tests/check_ui_flows.cjs

# 2. Backend Gateway & Integration Pytest Suite
cd backend
pytest tests/ -v
```

---

## Submitting Pull Requests

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Keep commits concise and meaningful:
   ```bash
   git commit -m "feat(calendar): add week-view time slot grid"
   ```
3. Ensure no lint or syntax errors exist (`node --check frontend/app.js`).
4. Push to your fork and submit a Pull Request describing your changes, motivation, and verification steps.
