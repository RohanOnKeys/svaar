"""Self-serve demo: Google sign-in tokens are verified server-side before any team exists."""

import time
import uuid
from collections.abc import Iterator
from datetime import UTC, datetime

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient

from svaar.app import create_app
from svaar.config import Settings
from svaar.incidents.service import open_manual_incident
from svaar.trial.firebase import FirebaseVerifier, InvalidSignInError

PROJECT = "svaar-test-project"
KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
OTHER_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)


def token(**overrides: object) -> str:
    now = int(time.time())
    claims: dict[str, object] = {
        "iss": f"https://securetoken.google.com/{PROJECT}",
        "aud": PROJECT,
        "sub": "firebase-uid-123",
        "iat": now,
        "exp": now + 3600,
        "email": "Person@Example.com",
        "email_verified": True,
        "name": "Test Person",
        "firebase": {"sign_in_provider": "google.com"},
    }
    signing_key = overrides.pop("signing_key", KEY)
    for name, value in overrides.items():
        if value is None:
            claims.pop(name, None)
        else:
            claims[name] = value
    return jwt.encode(claims, signing_key, algorithm="RS256")


def verifier() -> FirebaseVerifier:
    return FirebaseVerifier(PROJECT, key_for_token=lambda _token: KEY.public_key())


def test_valid_google_token_yields_identity() -> None:
    identity = verifier().verify(token())
    assert identity.uid == "firebase-uid-123"
    assert identity.email == "person@example.com"
    assert identity.name == "Test Person"


@pytest.mark.parametrize(
    "overrides",
    [
        {"aud": "someone-elses-project"},
        {"iss": "https://securetoken.google.com/someone-elses-project"},
        {"exp": int(time.time()) - 3600},
        {"sub": ""},
        {"sub": None},
        {"email_verified": False},
        {"email": None},
        {"firebase": {"sign_in_provider": "password"}},
        {"signing_key": OTHER_KEY},
    ],
)
def test_rejects_tokens_that_fail_any_check(overrides: dict[str, object]) -> None:
    with pytest.raises(InvalidSignInError):
        verifier().verify(token(**overrides))


@pytest.mark.parametrize("raw", ["", "not-a-jwt", "x" * 5000])
def test_rejects_malformed_tokens(raw: str) -> None:
    with pytest.raises(InvalidSignInError):
        verifier().verify(raw)


def test_routes_unavailable_when_trial_is_off(client: TestClient) -> None:
    response = client.post("/api/v1/try/session", json={}, headers={"Authorization": "Bearer x"})
    assert response.status_code == 503


@pytest.fixture
def trial_settings(settings: Settings) -> Settings:
    return settings.model_copy(
        update={
            "trial_enabled": True,
            "firebase_project_id": PROJECT,
            "trial_allowed_origins": "http://localhost:3000, https://svaar.vercel.app",
        }
    )


@pytest.mark.parametrize("header", [None, "Basic abc", f"Bearer {token(aud='other')}"])
def test_rejects_missing_or_bad_sign_in(trial_settings: Settings, header: str | None) -> None:
    app = create_app(trial_settings)
    app.state.firebase_verifier = verifier()
    headers = {"Authorization": header} if header else {}
    with TestClient(app, raise_server_exceptions=False) as client:
        response = client.post("/api/v1/try/session", json={}, headers=headers)
    assert response.status_code == 401


def test_only_listed_websites_may_call_from_a_browser(trial_settings: Settings) -> None:
    with TestClient(create_app(trial_settings), raise_server_exceptions=False) as client:
        allowed = client.options(
            "/api/v1/try/session",
            headers={
                "Origin": "https://svaar.vercel.app",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "authorization,content-type",
            },
        )
        other = client.options(
            "/api/v1/try/session",
            headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"},
        )
    assert allowed.headers.get("access-control-allow-origin") == "https://svaar.vercel.app"
    assert "access-control-allow-origin" not in other.headers


@pytest.fixture
def trial_client(database_url: str, session_factory: object) -> Iterator[TestClient]:
    settings = Settings(
        _env_file=None, database_url=database_url, trial_enabled=True, firebase_project_id=PROJECT
    )
    app = create_app(settings)
    app.state.firebase_verifier = verifier()
    with TestClient(app) as client:
        yield client


@pytest.mark.postgres
def test_first_sign_in_creates_one_demo_team_then_reuses_it(trial_client: TestClient) -> None:
    headers = {"Authorization": f"Bearer {token()}"}
    first = trial_client.post("/api/v1/try/session", json={"display_name": "Asha"}, headers=headers)
    assert first.status_code == 200
    body = first.json()
    assert body["created"] is True
    assert body["display_name"] == "Asha"
    assert body["email"] == "person@example.com"
    assert body["phone_verified"] is False

    again = trial_client.post(
        "/api/v1/try/session", json={"display_name": "Other"}, headers=headers
    )
    assert again.status_code == 200
    assert again.json()["created"] is False
    assert again.json()["org_id"] == body["org_id"]
    assert again.json()["principal_id"] == body["principal_id"]


@pytest.mark.postgres
def test_different_google_accounts_get_separate_teams(trial_client: TestClient) -> None:
    one = trial_client.post(
        "/api/v1/try/session", json={}, headers={"Authorization": f"Bearer {token()}"}
    )
    two = trial_client.post(
        "/api/v1/try/session",
        json={},
        headers={"Authorization": f"Bearer {token(sub='another-uid', email='b@example.com')}"},
    )
    assert one.status_code == two.status_code == 200
    assert one.json()["org_id"] != two.json()["org_id"]
    assert one.json()["display_name"] == "Test Person"


@pytest.mark.postgres
def test_incident_routes_need_a_team_first(trial_client: TestClient) -> None:
    headers = {"Authorization": f"Bearer {token(sub='no-team-yet')}"}
    assert trial_client.get("/api/v1/try/incident", headers=headers).status_code == 404


@pytest.mark.postgres
def test_member_sees_and_acknowledges_only_their_own_incident(
    trial_client: TestClient, session_factory
) -> None:
    mine = {"Authorization": f"Bearer {token()}"}
    theirs = {"Authorization": f"Bearer {token(sub='someone-else', email='c@example.com')}"}
    me = trial_client.post("/api/v1/try/session", json={}, headers=mine).json()
    trial_client.post("/api/v1/try/session", json={}, headers=theirs)

    empty = trial_client.get("/api/v1/try/incident", headers=mine)
    assert empty.status_code == 200 and empty.json() == {"incident": None, "events": []}

    with session_factory.begin() as session:
        incident = open_manual_incident(
            session,
            org_id=uuid.UUID(me["org_id"]),
            repository_id=4242,
            workflow_id=7,
            workflow_name="demo",
            head_branch="main",
            owner_principal_id=uuid.UUID(me["principal_id"]),
            now=datetime.now(UTC),
        )
        incident_id = str(incident.id)

    latest = trial_client.get("/api/v1/try/incident", headers=mine).json()
    assert latest["incident"]["id"] == incident_id
    assert latest["incident"]["state"] == "open"
    assert trial_client.get("/api/v1/try/incident", headers=theirs).json()["incident"] is None

    forbidden = trial_client.post(f"/api/v1/try/incident/{incident_id}/acknowledge", headers=theirs)
    assert forbidden.status_code == 404
    acked = trial_client.post(f"/api/v1/try/incident/{incident_id}/acknowledge", headers=mine)
    assert acked.status_code == 200
    assert acked.json()["state"] == "acknowledged" and acked.json()["acknowledged_at"]
