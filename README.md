# YUJ Studio — Marketing Intelligence OS (Frontend v2.0)

Enterprise-grade, zero-build, responsive marketing automation command center connecting:
```
Campaign Strategy → Editorial Planning → Engine15 Verified Render → Human Review Gate → Publishing Calendar → Measured Outcomes
```

Built for **Social Studio v0.6** and **YUJ Studio V2.5 / Engine15 Renderer Adapter v0.1**.

---

## 🌟 Visual & Motion Design System

- **Color Language**: Premium Dark Forest-Green (`#091410`, `#10251D`, `#142B22`) & Electric-Lime (`#C9F779`) with Aqua Mint (`#69DDB1`) secondary accents.
- **Light Mode Support**: Full light theme (`#F6F8F3`, `#FFFFFF`, `#276B4C`) toggled seamlessly with instant CSS custom property switching.
- **Glassmorphism & Lighting**: Ambient glow borders, glass backdrop filters (`backdrop-filter: blur(14px)`), and subtle depth layering.
- **Motion Engine**: GPU-accelerated 60 FPS transitions (`fadeInUp`, `pulseDot`, `flowPulse`, `modalPop`, `toastSlideIn`) respecting `prefers-reduced-motion`.

---

## 🧭 The 9 Core Workspace Modules

1. **Command Center (`overview`)**
   - Contextual greeting & system status.
   - 4 interactive KPI metric cards (Active Campaigns, Awaiting Approval, In-Flight Jobs, Scheduled Posts).
   - 5-stage interactive connected marketing pipeline with animated traveling pulse.
   - Feature creative showcase spotlighting authentic Engine15 output.
   - Actionable "Needs Your Decision" approval queue.
   - "System Pulse" service telemetry matrix.
   - 7-day publishing rhythm calendar & recent activity audit feed.

2. **Campaigns (`campaigns`)**
   - Grid / List view toggle.
   - Search by name and multi-brand / status filters.
   - Safe lifecycle transitions: activate, pause (with held job warnings), and resume.
   - Campaign creation dialog supporting 7 business objectives and brand tagging.

3. **Content Planner (`planner`)**
   - Weekly editorial brief composer with timezone context (`Asia/Kolkata`).
   - One-click topic angle suggestions via backend objective preview.
   - 1–7 editorial topic slot inputs with length validation.
   - 1-click handoff from proposed slot directly into Creative Lab.

4. **Creative Lab (`creative`)**
   - Split-screen professional design studio.
   - Human-verified facts builder (1–6 facts, max 280 chars each) with character counters.
   - Tone selection (Educational, Warm, Direct, Playful) and Language selection (English, Hindi, Hinglish).
   - Multi-aspect ratio selection (Portrait 1080×1350, Square 1080×1080, Landscape 1200×1080).
   - Honest capability boundaries: `diffusion_enabled: false` clearly disclosed; variant directions marked as architectural concepts.
   - Deterministic caption suggestions engine.

5. **Review Queue (`reviews`)**
   - Strict human-in-the-loop approval gate: **NO CONTENT PUBLISHES WITHOUT EXPLICIT APPROVAL**.
   - Tabbed filtering (`Waiting for Approval`, `Approved`, `All Creatives`).
   - High-resolution artwork inspection modal.
   - Caption and alt-text editing (locked once approved).
   - Manual draft asset uploader (PNG, JPEG, WEBP up to 8MB).

6. **Publishing Calendar (`calendar`)**
   - 7-day weekly layout with `< Prev`, `Next >`, and `Today` navigation.
   - Brand and platform filters.
   - Scheduled, published, and held post status chips.
   - Publishing job inspector modal with timezone-aware execution times and remote Meta post IDs.
   - In-place rescheduling for eligible jobs.

7. **Performance Analytics (`analytics`)**
   - Observational integrity: missing metrics display as em dash (`—`), never manufactured zeros.
   - Coverage transparency: "Observed on X of Y posts".
   - Comparative interactive chart (Reach vs. Views) with custom legend.
   - Channel breakdown table across 30-day window.

8. **Pipeline Health (`operations`)**
   - Real-time service boundary status: Social Studio, Engine15 Renderer, Event Bus, Meta Publisher.
   - Production job state counters (`queued`, `imported`, `waiting_import`, `dead`, `uncertain`).
   - Operational alerts feed and safe reconciliation instructions (no blind retries).

9. **Connections & Settings (`settings`)**
   - Workspace deployment mode inspector (`LOCAL PREVIEW` vs `LIVE CONNECTED`).
   - Appearance theme toggle (Dark / Light mode).
   - Connected social account readiness table.
   - Reset demo data with confirmation modal.
   - Live session sign-out.

---

## ⚡ Global Productivity

- **Command Palette (`Ctrl+K` / `⌘ K`)**: Fuzzy search across all 9 modules, active campaigns, drafts, and quick system actions with arrow key navigation.
- **Theme Switcher**: Instant transition between Dark Mode and Light Mode with persistence in `localStorage`.
- **Collapsible Sidebar**: Desktop icon-only compact mode and mobile slide-out drawer.
- **Accessible Toast Notifications**: Animated non-blocking alert toasts with auto-expiry.

---

## 🧪 Verification & Test Suite

Run the automated test suites from either `frontend` or `YUJ Backend`:

```bash
# 1. Check syntax and zero-build packaging
node --check app.js

# 2. Run offline headless DOM smoke tests across all 9 screens
node tests/check_ui_runtime.cjs

# 3. Test end-to-end demo workflows (Create Campaign → Approve Draft → Schedule Post)
node tests/check_ui_flows.cjs

# 4. Run FastAPI gateway tests (5 passing tests)
python -m pytest tests/test_gateway.py -q
```
