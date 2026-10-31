# Existing service contracts used by the YUJ integrated frontend

This table was extracted against the source of `yuj_social_publisher_v0_6` and `yuj_renderer_adapter_v0_1`. It distinguishes a frontend capability from a backend capability that is still planned.

| User interaction | Existing authoritative endpoint | HTTP | Notes |
|---|---|---|---|
| Load linked social accounts | `/v1/accounts` | GET | Includes `brand`, `platform`, `id`, `ready`, `label` |
| List/create campaigns | `/v1/campaigns` | GET/POST | Brand set and objective validated by Social Studio |
| Activate/pause/resume campaign | `/v1/campaigns/{id}/transition` | POST | Held jobs are never silently resumed |
| Suggest editorial topics | `/v1/planning/objective-preview` | POST | Prompts are NOT verified facts |
| Create weekly plan | `/v1/plans/weekly` | POST | 1–7 topics per line; server persists proposed slots |
| List saved plans | `/v1/plans` | GET | Includes slots and suggested times |
| Request generated image | `/v1/production/slots/{slot_id}` | POST | Verified facts mandatory; renderer remains separate |
| Read production jobs | `/v1/production/jobs` | GET | Supported `status`, `content_id`, `generation_id`, `slot_id` |
| Check rendering capabilities | Renderer `/v1/capabilities` | GET | Current adapter reports `diffusion_enabled:false` |
| List/edit manual/generated drafts | `/v1/content` and `/v1/content/{id}` | GET/PATCH | Draft-only editing |
| Approve a draft | `/v1/content/{id}/approve` | POST | Requires `approver` and human action |
| Upload photo | `/v1/assets` | POST multipart | Server returns media ID; then frontend creates draft |
| Schedule approved content | `/v1/content/{id}/schedule` | POST | List of eligible account IDs and timezone-aware time |
| View calendar | `/v1/calendar?start=&end=` | GET | Start/end ISO 8601 offset-aware; up to 60 days |
| Reschedule scheduled job | `/v1/jobs/{id}/reschedule` | POST | Validates current state and time |
| Operations counters | `/v1/ops/overview` | GET | Operational states only, not analytics claims |
| Read organic insights | `/v1/analytics/overview?days=30` | GET | Null = unavailable; coverage included |

**Not implemented by current sources:** diffusion model lifecycle, prompt/fact-based multi-variant generation, variant-ranking algorithm, significance-tested A/B experimentation, system-wide SSO/RBAC. The UI labels those items as planned or illustrative and does not fabricate API routes.
