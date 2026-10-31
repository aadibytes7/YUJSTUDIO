# YUJ Studio — Database Schema Specification

## 1. Relational Entity Overview

YUJ Studio stores operational state in SQLite datastores configured with Write-Ahead Logging (`WAL`) for high-concurrency read operations. The primary database is divided into **Social Studio Storage (`social.db`)** and **Renderer Cache (`renderer.db`)**.

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
        int version
        datetime created_at
    }

    PLAN {
        string id PK
        string campaign_id FK
        string brand
        string week_start
        datetime created_at
    }

    PLAN_SLOT {
        string id PK
        string plan_id FK
        string platform
        string format
        string topic_angle
        string status
    }

    CONTENT {
        string id PK
        string campaign_id FK
        string brand
        string caption
        string media_id
        string status
        string content_type
        json channels
        datetime created_at
    }

    ACCOUNT {
        string id PK
        string brand
        string platform
        string label
        boolean ready
        datetime linked_at
    }

    JOB {
        string id PK
        string content_id FK
        string account_id FK
        string platform
        string status
        datetime run_at
        string remote_post_id
        datetime published_at
    }
```

---

## 2. Table Definitions & Fields

### `campaigns`
Stores strategic marketing initiatives.
- `id` (VARCHAR PK): Unique identifier (e.g. `life-education-oct`).
- `name` (VARCHAR): Campaign title.
- `objective` (VARCHAR): Strategic target (`awareness`, `sales`, `trust`, `leads`).
- `status` (VARCHAR): State machine (`draft`, `active`, `paused`, `archived`).
- `brands` (JSON TEXT): Array of associated brand keys.
- `created_at` (DATETIME): Inception timestamp.

### `plans` & `plan_slots`
Organizes editorial weekly schedules.
- `id` (VARCHAR PK): Weekly plan ID.
- `campaign_id` (VARCHAR FK): Associated campaign.
- `week_start` (DATE): Monday start date of editorial cycle.
- `topic_angle` (TEXT): High-level thematic brief for the slot.
- `platform` (VARCHAR): Channel target (`instagram`, `facebook`, `linkedin`).
- `format` (VARCHAR): Content type (`image`, `carousel`, `reel`, `story`).

### `content` (Drafts & Creatives)
Core entity subject to the mandatory human approval gate.
- `id` (VARCHAR PK): Content ID.
- `caption` (TEXT): Social post body text and copy.
- `media_id` (VARCHAR): Key referencing rendered visual composition.
- `status` (VARCHAR): Content lifecycle (`draft`, `review_ready`, `approved`, `rejected`, `published`).
- `brand` (VARCHAR): Brand identity key.
- `language` (VARCHAR): Copy language code (e.g. `en`, `hi`).

### `jobs` (Publishing Dispatches)
Represents queued and completed social dispatches.
- `id` (VARCHAR PK): Job identifier.
- `content_id` (VARCHAR FK): Link to approved content.
- `account_id` (VARCHAR FK): Social account target.
- `status` (VARCHAR): Queue status (`scheduled`, `held`, `published`, `failed`).
- `run_at` (DATETIME): Scheduled execution timestamp in ISO-8601 UTC.
- `remote_post_id` (VARCHAR): Platform receipt returned by Meta Graph or LinkedIn API.
- `published_at` (DATETIME): Verified timestamp of successful publication.

---

## 3. Data Integrity & Invariants

1. **Foreign Key Constraints**: All jobs must link to approved content records.
2. **Approval Verification**: A job cannot transition to `scheduled` unless `content.status == 'approved'`.
3. **Receipt Immutability**: Once `remote_post_id` is populated, the job record is finalized and cannot be overwritten.
