"""Runs the console proxy against the actual extracted Social Studio v0.6 API.

No Meta or renderer provider calls; verifies existing API contracts without
modifying prior source packages. Requires packaged v0.6 source in the project
workspace to execute (the test skips if that source isn't present).
"""
from __future__ import annotations
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Ensure gateway can be imported whether tests are run from YUJ Backend or frontend
_HERE = Path(__file__).resolve().parent
for candidate in [_HERE.parent, _HERE.parent.parent / "YUJ Backend"]:
    if candidate.exists() and str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

import httpx
import pytest
from fastapi.testclient import TestClient
from gateway import Config, create_app

LOCAL_DOWNLOADS = Path(r"C:\Users\praja\Downloads\YUJ_Engine15_Integrated_v1_6\yuj_social_publisher_v0_6\src")
FALLBACK_SOURCES = Path('/mnt/data/yuj_frontend_work/deps/yuj_social_publisher_v0_6/src')
SOURCES = LOCAL_DOWNLOADS if LOCAL_DOWNLOADS.exists() else FALLBACK_SOURCES
pytestmark = pytest.mark.skipif(not SOURCES.exists(), reason='Existing Social v0.6 sources unavailable')


def test_gateway_against_original_social_api(tmp_path, monkeypatch):
    sys.path.insert(0, str(SOURCES))
    from yuj_social_publisher.config import Settings
    from yuj_social_publisher.api import create_app as social_app
    monkeypatch.setenv('LOCAL_META_TEST', 'dummy_token_nonworking')
    accounts = [{"id":"ig_foundation_test","brand":"yuj-foundation","platform":"instagram",
                 "label":"YUJ Foundation Test","meta_id":"test_ig","token_env":"LOCAL_META_TEST"}]
    upstream = social_app(Settings(
        db_url='sqlite:///'+str(tmp_path/'social.sqlite'),
        media_root=tmp_path/'media',
        admin_key='SOCIAL_PRIVATE_TOKEN_123456789',
        media_signing_key='MEDIA_PRIVATE_SECRET_123456789',
        public_base_url='http://127.0.0.1:8090',
        accounts_json=json.dumps(accounts),
        auto_create_tables=True,
    ))
    app = create_app(Config(
        social_base_url='http://social.local', social_api_key='SOCIAL_PRIVATE_TOKEN_123456789',
        console_password='right-horse-battery-1234',
        session_secret='very-long-random-test-secret-12345678900000',
        allow_http_upstream=True,cookie_secure=False,
    ))
    app.state.outbound_transport = httpx.ASGITransport(app=upstream)
    with TestClient(app) as client:
        csrf=client.post('/api/login',json={'password':'right-horse-battery-1234'}).json()['csrf']
        assert client.get('/api/social/v1/accounts').json()[0]['id']=='ig_foundation_test'
        assert client.get('/api/social/v1/ops/overview').status_code==200
        payload={"id":"life-education-console","name":"Life Education Console Test","objective":"awareness",
                 "brands":["yuj-foundation"],"created_by":"Console Test"}
        saved=client.post('/api/social/v1/campaigns',json=payload,headers={'X-CSRF-Token':csrf})
        assert saved.status_code==201,saved.text
        assert saved.json()['status']=='draft'
        assert len(client.get('/api/social/v1/campaigns').json())==1
        week=(datetime.now(timezone(timedelta(hours=5,minutes=30))).date()+timedelta(days=7)).isoformat()
        plan={"campaign_id":"life-education-console","request_key":"test-console-01","created_by":"Console Test",
              "week_start":week,"timezone":"Asia/Kolkata","lines":[{"brand":"yuj-foundation","platform":"instagram",
              "topics":["Life education explained","Questions families can ask"]}]}
        result=client.post('/api/social/v1/plans/weekly',json=plan,headers={'X-CSRF-Token':csrf})
        assert result.status_code==201,result.text
        assert len(result.json()['slots'])==2
        assert client.get('/api/social/v1/production/status').status_code==200
        assert len(client.get('/api/social/v1/plans').json())==1
