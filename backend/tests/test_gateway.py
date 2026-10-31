import sys
from pathlib import Path

# Ensure gateway can be imported whether tests are run from YUJ Backend or frontend
_HERE = Path(__file__).resolve().parent
for candidate in [_HERE.parent, _HERE.parent.parent / "YUJ Backend"]:
    if candidate.exists() and str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

import httpx
from fastapi.testclient import TestClient
from gateway import Config, allowlisted, create_app, ALLOWED_SOCIAL, ALLOWED_RENDERER


def live_app():
    cfg = Config(
        social_base_url="http://social.local", social_api_key="SOCIAL_PRIVATE_TOKEN",
        renderer_base_url="http://renderer.local", renderer_api_key="RENDERER_PRIVATE_TOKEN",
        console_password="right-horse-battery-1234",
        session_secret="very-long-random-test-secret-12345678900000",
        allow_http_upstream=True, cookie_secure=False,
        console_origin="http://testserver",
    )
    app = create_app(cfg)
    def handler(req):
        if req.url.host == "social.local":
            assert req.headers.get("X-YUJ-Social-Key") == "SOCIAL_PRIVATE_TOKEN"
            assert "RENDERER_PRIVATE_TOKEN" not in str(req.headers)
            if req.url.path == "/v1/campaigns" and req.method == "POST":
                return httpx.Response(201, json={"id": "new-campaign", "status": "draft"})
            return httpx.Response(200, json={"accounts": 3} if req.url.path == "/v1/ops/overview" else [])
        assert req.headers.get("X-YUJ-Renderer-Key") == "RENDERER_PRIVATE_TOKEN"
        return httpx.Response(200, json={"engine": "yuj-design", "diffusion_enabled": False})
    app.state.outbound_transport = httpx.MockTransport(handler)
    return app


def test_demo_mode_is_isolated_and_works_without_secrets():
    client = TestClient(create_app(Config()))
    assert client.get('/').status_code == 200
    assert 'YUJ Studio' in client.get('/').text
    assert client.get('/api/config').json()['mode'] == 'demo'
    assert client.get('/styles.css').status_code == 200
    assert client.get('/app.js').status_code == 200
    assert client.get('/assets/engine15-sample.png').status_code == 200
    assert client.get('/api/social/v1/accounts').status_code == 503


def test_auth_and_csrf_mandatory_for_live_reads_and_writes():
    with TestClient(live_app()) as client:
        assert client.get('/api/social/v1/accounts').status_code == 401
        assert client.post('/api/login', json={'password': 'wrong-password'}).status_code == 401
        res = client.post('/api/login', json={'password': 'right-horse-battery-1234'}, headers={'Origin': 'http://testserver'})
        assert res.status_code == 200
        assert 'httponly' in res.headers['set-cookie'].lower()
        assert 'samesite=strict' in res.headers['set-cookie'].lower()
        csrf = res.json()['csrf']
        assert client.get('/api/session').json()['authenticated'] is True
        resp = client.get('/api/social/v1/accounts')
        assert resp.status_code == 200
        assert 'SOCIAL_PRIVATE_TOKEN' not in resp.text
        assert client.post('/api/social/v1/campaigns', json={'name': 'test'}).status_code == 403
        result = client.post('/api/social/v1/campaigns', headers={'X-CSRF-Token': csrf, 'Origin':'http://testserver'}, json={'name': 'test'})
        assert result.status_code == 201
        assert result.json()['status'] == 'draft'
        assert client.get('/api/renderer/v1/capabilities').json()['diffusion_enabled'] is False
        assert client.post('/api/logout', headers={'X-CSRF-Token': csrf}).status_code == 200
        assert client.get('/api/session').json()['authenticated'] is False


def test_origin_and_allowlist_stop_cross_origin_and_unintended_actions():
    with TestClient(live_app()) as client:
        csrf = client.post('/api/login', json={'password':'right-horse-battery-1234'}).json()['csrf']
        assert client.post('/api/social/v1/campaigns', headers={'X-CSRF-Token':csrf,'Origin':'http://evil.invalid'},json={}).status_code == 403
        assert client.get('/api/social/v1/secrets').status_code == 404
        assert client.get('/api/social/v1/creative/import').status_code == 404
        assert client.post('/api/social/v1/creative/import',headers={'X-CSRF-Token':csrf},json={}).status_code == 404
        assert client.get('/api/social/v1/../accounts').status_code in (404, 400)
        assert client.post('/api/renderer/v1/render-jobs',headers={'X-CSRF-Token':csrf},json={}).status_code == 405


def test_allowlists_are_method_specific_and_do_not_contain_approval_bypass():
    assert allowlisted('POST','/v1/production/slots/abcdefgh-12',ALLOWED_SOCIAL)
    assert allowlisted('POST','/v1/content/abcdef-12/approve',ALLOWED_SOCIAL)
    assert allowlisted('GET','/v1/production/jobs',ALLOWED_SOCIAL)
    assert not allowlisted('GET','/v1/content/abcdef-12/approve',ALLOWED_SOCIAL)
    assert not allowlisted('POST','/v1/render-jobs',ALLOWED_RENDERER)
    assert not allowlisted('GET','/v1/../../v1/accounts',ALLOWED_SOCIAL)


def test_live_config_requires_secrets_and_explicit_https_or_local_opt_in():
    try:
        create_app(Config(social_base_url='http://social.local',social_api_key='key'))
        raise AssertionError('Expected invalid setup to fail')
    except ValueError:
        pass
