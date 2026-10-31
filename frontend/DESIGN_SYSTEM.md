# YUJ Marketing Command Center — Frontend Design System

**Design intent:** One coherent operational surface for campaign planning, creative production, human approval, publishing and measured insights. Quiet editorial typography, a deep forest navigation shell, warm off-white content area, spring-green action color and restrained status accents.

## Key visual tokens

| Token | Value | Use |
|---|---|---|
| Sidebar | `#162722` | Persistent dark navigation |
| Main background | `#f5f7f4` | Low-noise command center |
| Primary CTA | `#195542` | Primary user-initiated actions |
| Active sidebar item | `#d9f7ad` | Current screen |
| Positive/approved | `#e4f4e5` | Confirmation and safe stages |
| Attention | `#fff3df` | Pending approvals, not an error |
| Failure | `#fff0ec` | Uncertain/failed actions |
| Card stroke | `#e7ede7` | Containment hierarchy |
| Display heading | Georgia/serif | Human, editorial identity |
| Body | System UI/Inter fallback | Scan-friendly dense operations |

The design uses no remote CSS/JavaScript libraries and no downloadable font files.

## Information architecture

1. **Command Center:** actionable summary + full pipeline stages + recent preview + approvals and calendar.
2. **Campaigns:** brand/objective alignment and safe pause/resume controls.
3. **Content Planner:** weekly editorial brief and factual source inputs for the renderer.
4. **Creative Lab:** Engine15 handoff and rendering jobs, with future variant directions clearly labeled.
5. **Review Queue:** explicitly controlled review/edit/approve state and manual image uploads.
6. **Publishing Calendar:** scheduled vs published outcomes; rescheduling an eligible job.
7. **Performance:** observed Meta metrics with measurement coverage and unavailable states.
8. **Pipeline Health:** queue, renderer, publishing and reconciliation awareness.
9. **Connections:** secure upstream and social account readiness without exposing secrets.

**Responsive behaviour:** fixed dark sidebar on desktop, off-canvas sidebar on smaller screens, 4→2 KPI reflow, two-column dashboard→one-column stack, horizontal data table overflow, compact 7-day calendar.

## Controlled release and honestly labeled future capabilities

The current engine15 adapter is a single-image deterministic canvas renderer. Diffusion, automatic multi-variant generation and statistical experiment optimization are **future services**. Variant visual direction cards inside Creative Lab are interface concepts only, and all preview-data modes are labeled as such. No UI button calls a nonexistent diffusion endpoint or invents a final performance score.

**Future visual upgrade:** Once approved brand profiles and governed `creative.variant_generated` events exist, replace direction concepts with actual immutable variant groups. Add per-variant human selection, QA provenance, usage/cost limits and only then performance comparisons with appropriate attribution quality.
