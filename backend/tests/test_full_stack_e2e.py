"""End-to-End full-stack integration and workflow test suite.

Tests every major workflow against the live extracted Social Studio v0.6 service
and Renderer Adapter through the FastAPI Security Gateway:
- Authentication, CSRF protection, and session security
- Campaign lifecycle (create, transition to active, pause, resume)
- Editorial planning (objective preview, weekly plan creation, slot queries)
- Asset upload and media signing
- Content draft creation, editing, and human approval gate
- Post scheduling, calendar queries, and job rescheduling
- Renderer capabilities and route allowlisting
- Logout and session invalidation
"""
from __future__ import annotations

import io
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Add search paths for backend and social publisher sources
_HERE = Path(__file__).resolve().parent
for candidate in [_HERE.parent, _HERE.parent.parent / "YUJ Backend"]:
    if candidate.exists() and str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

LOCAL_DOWNLOADS = Path(r"C:\Users\praja\Downloads\YUJ_Engine15_Integrated_v1_6\yuj_social_publisher_v0_6\src")
FALLBACK_SOURCES = Path("/mnt/data/yuj_frontend_work/deps/yuj_social_publisher_v0_6/src")
SOURCES = LOCAL_DOWNLOADS if LOCAL_DOWNLOADS.exists() else FALLBACK_SOURCES

import httpx
import pytest
from fastapi.testclient import TestClient
from gateway import Config, create_app

pytestmark = pytest.mark.skipif(not SOURCES.exists(), reason="Existing Social v0.6 sources unavailable")


@pytest.fixture
def test_environment(tmp_path, monkeypatch):
    """Sets up a complete isolated Social Studio and Gateway test harness."""
    sys.path.insert(0, str(SOURCES))
    from yuj_social_publisher.config import Settings
    from yuj_social_publisher.api import create_app as social_app

    monkeypatch.setenv("LOCAL_META_TEST", "dummy_token_nonworking")
    accounts = [
        {
            "id": "ig_foundation_test",
            "brand": "yuj-foundation",
            "platform": "instagram",
            "label": "YUJ Foundation · Instagram",
            "meta_id": "test_ig_meta_001",
            "token_env": "LOCAL_META_TEST"
        },
        {
            "id": "fb_foundation_test",
            "brand": "yuj-foundation",
            "platform": "facebook",
            "label": "YUJ Foundation · Facebook",
            "meta_id": "test_fb_meta_001",
            "token_env": "LOCAL_META_TEST"
        }
    ]

    media_dir = tmp_path / "media"
    media_dir.mkdir(parents=True, exist_ok=True)

    upstream = social_app(Settings(
        db_url="sqlite:///" + str(tmp_path / "social.sqlite"),
        media_root=media_dir,
        admin_key="SOCIAL_PRIVATE_TOKEN_123456789",
        media_signing_key="MEDIA_PRIVATE_SECRET_123456789",
        public_base_url="http://127.0.0.1:8090",
        accounts_json=json.dumps(accounts),
        auto_create_tables=True,
    ))

    gateway_cfg = Config(
        social_base_url="http://social.local",
        social_api_key="SOCIAL_PRIVATE_TOKEN_123456789",
        renderer_base_url="http://renderer.local",
        renderer_api_key="RENDERER_PRIVATE_TOKEN_123456789",
        console_password="operator-secure-password-1234",
        session_secret="super-secure-random-session-secret-9876543210",
        allow_http_upstream=True,
        cookie_secure=False,
        console_origin="http://testserver",
    )

    app = create_app(gateway_cfg)

    class CombinedAsyncTransport(httpx.AsyncBaseTransport):
        def __init__(self, asgi_app):
            self.asgi = httpx.ASGITransport(app=asgi_app)

        async def handle_async_request(self, req: httpx.Request) -> httpx.Response:
            if req.url.host == "social.local":
                return await self.asgi.handle_async_request(req)
            elif req.url.host == "renderer.local":
                assert req.headers.get("X-YUJ-Renderer-Key") == "RENDERER_PRIVATE_TOKEN_123456789"
                if req.url.path == "/v1/capabilities":
                    return httpx.Response(200, json={
                        "engine": "yuj-design",
                        "engine_version": "2.5",
                        "brands": ["yuj-foundation"],
                        "human_approval_required": True,
                        "diffusion_enabled": False
                    })
                return httpx.Response(404, json={"detail": "not found"})
            return httpx.Response(502, json={"detail": "unknown host"})

    app.state.outbound_transport = CombinedAsyncTransport(upstream)
    return app


def test_complete_end_to_end_user_journey(test_environment):
    """Executes the complete marketing OS lifecycle from campaign brief to calendar post."""
    with TestClient(test_environment) as client:
        # 1. Verify Unauthenticated State
        session_resp = client.get("/api/session")
        assert session_resp.status_code == 200
        assert session_resp.json()["authenticated"] is False

        # Attempting to query social API without auth must fail with 401
        assert client.get("/api/social/v1/accounts").status_code == 401

        # 2. Operator Sign-In
        login_res = client.post(
            "/api/login",
            json={"password": "operator-secure-password-1234"},
            headers={"Origin": "http://testserver"}
        )
        assert login_res.status_code == 200
        csrf_token = login_res.json()["csrf"]
        assert csrf_token is not None
        assert "yuj_console_session" in client.cookies

        # Verify Authenticated Session
        session_resp = client.get("/api/session")
        assert session_resp.json()["authenticated"] is True
        assert session_resp.json()["user"] == "Workspace Admin"

        # 3. Read Linked Accounts & Operations Overview
        accounts = client.get("/api/social/v1/accounts").json()
        assert len(accounts) == 2
        assert accounts[0]["brand"] == "yuj-foundation"
        assert accounts[0]["ready"] is True

        ops = client.get("/api/social/v1/ops/overview")
        assert ops.status_code == 200

        # 4. Campaign Lifecycle: Create -> Activate -> Pause -> Resume
        campaign_payload = {
            "id": "e2e-life-education-drive",
            "name": "Life Education E2E Awareness Campaign",
            "objective": "awareness",
            "brands": ["yuj-foundation"],
            "created_by": "Test Operator"
        }
        create_camp_res = client.post(
            "/api/social/v1/campaigns",
            json=campaign_payload,
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert create_camp_res.status_code == 201
        campaign_data = create_camp_res.json()
        assert campaign_data["id"] == "e2e-life-education-drive"
        assert campaign_data["status"] == "draft"

        # Verify Campaign In List
        campaigns_list = client.get("/api/social/v1/campaigns").json()
        assert any(c["id"] == "e2e-life-education-drive" for c in campaigns_list)

        # Transition: Draft -> Active
        act_res = client.post(
            "/api/social/v1/campaigns/e2e-life-education-drive/transition",
            json={"status": "active", "actor": "Test Operator"},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert act_res.status_code == 200
        assert act_res.json()["status"] == "active"

        # Transition: Active -> Paused
        pause_res = client.post(
            "/api/social/v1/campaigns/e2e-life-education-drive/transition",
            json={"status": "paused", "actor": "Test Operator"},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert pause_res.status_code == 200
        assert pause_res.json()["status"] == "paused"

        # Transition: Paused -> Active (Resumed)
        resume_res = client.post(
            "/api/social/v1/campaigns/e2e-life-education-drive/transition",
            json={"status": "active", "actor": "Test Operator"},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert resume_res.status_code == 200
        assert resume_res.json()["status"] == "active"

        # 5. Editorial Planning: Suggest Angles -> Create Weekly Plan
        suggest_res = client.post(
            "/api/social/v1/planning/objective-preview",
            json={
                "campaign_id": "e2e-life-education-drive",
                "brand": "yuj-foundation",
                "platform": "instagram",
                "seed_topic": "Life Education Skills",
                "count": 3
            },
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert suggest_res.status_code == 200
        suggestions = suggest_res.json()["suggested_topics"]
        assert len(suggestions) == 3

        # Create Weekly Plan with 2 editorial slots
        next_week = (datetime.now(timezone(timedelta(hours=5, minutes=30))).date() + timedelta(days=7)).isoformat()
        weekly_plan_payload = {
            "campaign_id": "e2e-life-education-drive",
            "request_key": "e2e-plan-req-001",
            "created_by": "Test Operator",
            "week_start": next_week,
            "timezone": "Asia/Kolkata",
            "lines": [
                {
                    "brand": "yuj-foundation",
                    "platform": "instagram",
                    "topics": [
                        "What is life education?",
                        "Practical learning for family curiosity"
                    ]
                }
            ]
        }
        plan_res = client.post(
            "/api/social/v1/plans/weekly",
            json=weekly_plan_payload,
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert plan_res.status_code == 201
        plan_data = plan_res.json()
        assert len(plan_data["slots"]) == 2
        slot_id = plan_data["slots"][0]["id"]
        assert slot_id is not None

        # 6. Asset Ingestion: Upload Image Asset
        # Generate a valid JPEG image satisfying minimum dimensions (>= 320px)
        from PIL import Image
        img_buffer = io.BytesIO()
        Image.new("RGB", (640, 640), color=(30, 80, 60)).save(img_buffer, format="JPEG")
        jpeg_bytes = img_buffer.getvalue()

        upload_res = client.post(
            "/api/social/v1/assets",
            data={"brand": "yuj-foundation"},
            files={"file": ("test_poster.jpg", jpeg_bytes, "image/jpeg")},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert upload_res.status_code == 200
        asset_info = upload_res.json()
        media_id = asset_info["id"]
        assert media_id is not None
        assert "preview_url" in asset_info

        # 7. Create Draft Content -> Edit -> Approve Gate
        draft_payload = {
            "brand": "yuj-foundation",
            "caption": "Initial draft caption: Understanding Life Education.",
            "media_id": media_id,
            "content_type": "image",
            "campaign_id": "e2e-life-education-drive",
            "language": "en"
        }
        draft_res = client.post(
            "/api/social/v1/content",
            json=draft_payload,
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert draft_res.status_code == 201
        content_id = draft_res.json()["id"]
        assert draft_res.json()["status"] == "draft"

        # Edit Draft (Caption & Alt-Text)
        patch_res = client.patch(
            f"/api/social/v1/content/{content_id}",
            json={
                "caption": "Updated verified caption: Real-world problem solving for everyday growth.",
                "alt_text": "Children learning in collaborative community workshop."
            },
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert patch_res.status_code == 200
        assert "Updated verified caption" in patch_res.json()["caption"]

        # Approve Content (Human Verification Gate)
        approve_res = client.post(
            f"/api/social/v1/content/{content_id}/approve",
            json={"approver": "Workspace Admin"},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert approve_res.status_code == 200
        assert approve_res.json()["status"] == "approved"
        assert approve_res.json()["approved_by"] == "Workspace Admin"

        # Verify Invariant: Approved content is locked against draft-only editing!
        attempt_edit_after_approval = client.patch(
            f"/api/social/v1/content/{content_id}",
            json={"caption": "Illegal post-approval change attempt"},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        # Should be rejected with 409 or 422
        assert attempt_edit_after_approval.status_code in (409, 422)

        # 8. Schedule Approved Content
        future_run = datetime.now(timezone.utc) + timedelta(days=2)
        schedule_payload = {
            "account_ids": ["ig_foundation_test"],
            "scheduled_at": future_run.isoformat()
        }
        schedule_res = client.post(
            f"/api/social/v1/content/{content_id}/schedule",
            json=schedule_payload,
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert schedule_res.status_code == 200
        scheduled_jobs = schedule_res.json()
        assert len(scheduled_jobs) == 1
        job_id = scheduled_jobs[0]["id"]
        assert scheduled_jobs[0]["status"] == "scheduled"

        # 9. Query Calendar & Reschedule Job
        cal_start = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat().replace("+00:00", "Z")
        cal_end = (datetime.now(timezone.utc) + timedelta(days=10)).isoformat().replace("+00:00", "Z")
        calendar_res = client.get("/api/social/v1/calendar", params={"start": cal_start, "end": cal_end})
        assert calendar_res.status_code == 200
        assert any(j["id"] == job_id for j in calendar_res.json())

        # Reschedule Job to +3 days
        reschedule_time = datetime.now(timezone.utc) + timedelta(days=3)
        reschedule_res = client.post(
            f"/api/social/v1/jobs/{job_id}/reschedule",
            json={"scheduled_at": reschedule_time.isoformat()},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert reschedule_res.status_code == 200
        assert reschedule_res.json()["status"] == "scheduled"

        # 10. Renderer Capabilities Integration
        renderer_cap = client.get("/api/renderer/v1/capabilities")
        assert renderer_cap.status_code == 200
        cap_data = renderer_cap.json()
        assert cap_data["engine"] == "yuj-design"
        assert cap_data["diffusion_enabled"] is False

        # 11. Security Constraints & Route Protection
        # Missing CSRF Header on POST must return 403
        no_csrf = client.post("/api/social/v1/campaigns", json={"name": "No CSRF"})
        assert no_csrf.status_code == 403

        # Cross-Origin request must return 403
        cross_origin = client.post(
            "/api/social/v1/campaigns",
            json={"name": "Evil Origin"},
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://malicious.evil"}
        )
        assert cross_origin.status_code == 403

        # Disallowed route must return 404
        assert client.get("/api/social/v1/unauthorized_private_route").status_code == 404

        # 12. Operator Sign-Out
        logout_res = client.post(
            "/api/logout",
            headers={"X-CSRF-Token": csrf_token, "Origin": "http://testserver"}
        )
        assert logout_res.status_code == 200
        assert client.get("/api/session").json()["authenticated"] is False

        # Calls after logout must return 401
        assert client.get("/api/social/v1/accounts").status_code == 401
