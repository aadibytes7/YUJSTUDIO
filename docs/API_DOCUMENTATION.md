# YUJ Studio — API Documentation

This specification covers the REST endpoints exposed by the **FastAPI Security Gateway** and proxied through to upstream microservices (**Social Studio v0.6** and **Engine15 Renderer Adapter v0.1**).

---

## 1. Authentication & Security Headers

All state-mutating requests (`POST`, `PATCH`, `DELETE`) require:
1. `session_id` cookie issued via `POST /api/login`.
2. `X-CSRF-Token` header containing the valid HMAC token returned from `/api/session` or `/api/login`.
3. Origin validation: `Origin` header must match the configured `YUJ_CONSOLE_ORIGIN`.

### Error Responses
- `401 Unauthorized`: Missing or expired `session_id` cookie.
- `403 Forbidden`: Cross-origin request refused, or invalid/missing `X-CSRF-Token`.
- `404 Not Found`: Route not allowlisted or resource missing.
- `413 Payload Too Large`: Request body exceeds 10MB limit.
- `429 Too Many Requests`: Rate limiter triggered (e.g. >10 login attempts in 5 minutes).
- `502 Bad Gateway`: Upstream microservice unreachable or returned invalid response.
- `503 Service Unavailable`: Upstream service unconfigured or demo mode restriction.

---

## 2. Gateway Core Endpoints

### `GET /health/live`
Returns live health status of the security gateway.
```json
{
  "status": "ok",
  "service": "yuj-marketing-console",
  "mode": "live"
}
```

### `GET /api/config`
Provides configuration state to the frontend client.
```json
{
  "mode": "live",
  "social_configured": true,
  "renderer_configured": true
}
```

### `GET /api/session`
Returns current operator authentication status and active CSRF token.
```json
{
  "authenticated": true,
  "user": "Workspace Admin",
  "csrf": "a4f89d3c8e..."
}
```

### `POST /api/login`
Authenticates the console operator.
- **Request Body**:
  ```json
  {
    "password": "your_secure_password"
  }
  ```
- **Response**: Sets `session_id` HttpOnly cookie and returns:
  ```json
  {
    "authenticated": true,
    "csrf": "a4f89d3c8e..."
  }
  ```

### `POST /api/logout`
Terminates the operator session and clears the `session_id` cookie.

---

## 3. Social Studio Proxied Endpoints (`/api/social/*`)

### Campaigns
- **`GET /api/social/v1/campaigns`**: Lists all marketing campaigns with status, brands, and target objectives.
- **`POST /api/social/v1/campaigns`**: Creates a new campaign record.
  ```json
  {
    "name": "Life Education 2026",
    "objective": "awareness",
    "brands": ["yuj-foundation"]
  }
  ```
- **`POST /api/social/v1/campaigns/{id}/transition`**: Transitions campaign status (`draft` → `active` → `paused` → `archived`).

### Editorial Planning
- **`GET /api/social/v1/plans`**: Retrieves weekly editorial schedules and slot configurations.
- **`POST /api/social/v1/plans/weekly`**: Generates or updates a weekly editorial plan.
- **`POST /api/social/v1/planning/objective-preview`**: Returns platform recommendations based on campaign objective.

### Content & Review
- **`GET /api/social/v1/content`**: Lists all generated creatives and drafts with review status.
- **`POST /api/social/v1/content`**: Submits a newly composed creative for human review.
- **`PATCH /api/social/v1/content/{id}`**: Updates copy, hashtags, or target platform.
- **`POST /api/social/v1/content/{id}/approve`**: Explicit operator sign-off moving draft to `approved`.
- **`POST /api/social/v1/content/{id}/schedule`**: Enqueues an approved draft into the dispatch pipeline.

### Publishing & Jobs
- **`GET /api/social/v1/jobs`**: Lists all scheduled and historical post dispatches.
- **`POST /api/social/v1/jobs/{id}/reschedule`**: Adjusts run time for a queued dispatch.
  ```json
  {
    "scheduled_at": "2026-11-04T15:30:00+05:30"
  }
  ```
- **`GET /api/social/v1/calendar`**: Aggregated calendar view mapping jobs across day cells.

### Operations & Telemetry
- **`GET /api/social/v1/ops/overview`**: Service health status, database metrics, and alert counts.
- **`GET /api/social/v1/analytics/overview`**: Aggregated reach, views, engagement, and post counts.
- **`GET /api/social/v1/analytics/campaigns`**: Campaign-level performance breakdowns.

---

## 4. Engine15 Renderer Proxied Endpoints (`/api/renderer/*`)

- **`GET /api/renderer/v1/capabilities`**: Discovers available Engine15 layout engines and brand font assets.
- **`GET /api/renderer/v1/metrics`**: In-flight render times and queue depths.
- **`GET /api/renderer/v1/render-jobs/{id}`**: Polling status for asynchronous graphic rendering jobs.
