"""Tests pédagogiques pour l'app accounts.

Ces tests servent d'exemples : signup, login, logout, accès protégé.
Lancez : pytest accounts/
"""

import hashlib
import re

import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import DataRequest

pytestmark = pytest.mark.django_db


@pytest.fixture
def client() -> APIClient:
    return APIClient()


@pytest.fixture
def user(db) -> User:
    return User.objects.create_user(
        username="alice", email="alice@test.com", password="motdepasse123"
    )


def test_signup_creates_user(client):
    # Lot 3 : inscription par EMAIL (username = email en interne).
    response = client.post(
        "/api/accounts/signup/",
        {
            "email": "bob@test.com",
            "password": "motdepasse123",
        },
        format="json",
    )
    assert response.status_code == 201, response.data
    assert User.objects.filter(email="bob@test.com").exists()


def test_signup_requires_email(client):
    response = client.post(
        "/api/accounts/signup/",
        {"password": "motdepasse123"},
        format="json",
    )
    assert response.status_code == 400


def test_login_returns_token(client, user):
    response = client.post(
        "/api/accounts/login/",
        {"email": "alice@test.com", "password": "motdepasse123"},
        format="json",
    )
    assert response.status_code == 200, response.data
    assert "token" in response.data
    assert response.data["user"]["email"] == "alice@test.com"


def test_login_with_wrong_password(client, user):
    response = client.post(
        "/api/accounts/login/",
        {"email": "alice@test.com", "password": "wrong"},
        format="json",
    )
    assert response.status_code == 400


def test_me_requires_auth(client):
    response = client.get("/api/accounts/me/")
    assert response.status_code in (401, 403)


def test_me_with_token(client, user):
    from rest_framework.authtoken.models import Token

    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    response = client.get("/api/accounts/me/")
    assert response.status_code == 200
    assert response.data["username"] == "alice"


def test_logout_invalidates_token(client, user):
    from rest_framework.authtoken.models import Token

    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    response = client.post("/api/accounts/logout/")
    assert response.status_code == 204
    # Le token n'existe plus
    assert not Token.objects.filter(key=token.key).exists()


# ---------------------------------------------------------------------------
# Tests export RGPD (Art. 15) — J3-bis
# ---------------------------------------------------------------------------


@pytest.fixture
def auth_client(user) -> APIClient:
    """Client authentifié pour l'utilisateur alice."""
    from rest_framework.authtoken.models import Token

    c = APIClient()
    token = Token.objects.create(user=user)
    c.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return c


def test_export_requires_auth(client):
    response = client.get("/api/accounts/me/export/")
    assert response.status_code in (401, 403)


def test_export_json_returns_200(auth_client):
    response = auth_client.get("/api/accounts/me/export/")
    assert response.status_code == 200
    assert "application/json" in response["Content-Type"]
    assert "attachment" in response.get("Content-Disposition", "")


def test_export_json_contains_required_keys(auth_client):
    response = auth_client.get("/api/accounts/me/export/")
    data = response.json()
    for key in ("account", "profile", "quizzes", "signalements", "audit_logs", "export_date"):
        assert key in data, f"Clé manquante dans l'export : {key}"


def test_export_json_account_fields(auth_client, user):
    response = auth_client.get("/api/accounts/me/export/")
    data = response.json()
    assert data["account"]["email"] == user.email
    assert data["account"]["id"] == user.id


def test_export_csv_format(auth_client):
    response = auth_client.get("/api/accounts/me/export/?export_format=csv")
    assert response.status_code == 200
    assert "text/csv" in response["Content-Type"]
    assert "attachment" in response.get("Content-Disposition", "")
    # La première ligne est l'en-tête
    lines = response.content.decode("utf-8").splitlines()
    assert lines[0] == "section,key,value"


def test_export_no_data_leak_between_users(auth_client, db):
    """Un utilisateur A ne doit pas voir les données de l'utilisateur B."""
    from django.contrib.auth.models import User

    from quizzes.models import Quiz

    user_b = User.objects.create_user(
        username="bob@test.com", email="bob@test.com", password="motdepasse123"
    )
    Quiz.objects.create(user=user_b, title="Quiz de Bob", source_text="Texte de Bob")

    response = auth_client.get("/api/accounts/me/export/")
    data = response.json()
    quiz_titles = [q["title"] for q in data["quizzes"]]
    assert "Quiz de Bob" not in quiz_titles


# ---------------------------------------------------------------------------
# Tests suivi des demandes d'export — registre RGPD (J3-bis / J4)
# ---------------------------------------------------------------------------

_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def test_export_json_creates_datarequest(auth_client, user):
    """Un export JSON crée UNE ligne d'audit, complétée avec l'empreinte."""
    assert DataRequest.objects.count() == 0

    response = auth_client.get("/api/accounts/me/export/")
    assert response.status_code == 200

    assert DataRequest.objects.count() == 1
    dr = DataRequest.objects.get()
    assert dr.user == user
    assert dr.request_type == DataRequest.RequestType.EXPORT
    assert dr.status == DataRequest.Status.COMPLETED
    assert dr.export_format == "json"
    assert dr.responded_at is not None
    assert _SHA256_RE.match(dr.file_hash), f"hash invalide : {dr.file_hash!r}"


def test_export_hash_matches_file_content(auth_client):
    """L'empreinte stockée correspond bien au fichier réellement remis."""
    response = auth_client.get("/api/accounts/me/export/")
    expected = hashlib.sha256(response.content).hexdigest()

    dr = DataRequest.objects.latest("created_at")
    assert dr.file_hash == expected


def test_export_csv_records_format(auth_client):
    """Un export CSV est tracé avec le bon format."""
    response = auth_client.get("/api/accounts/me/export/?export_format=csv")
    assert response.status_code == 200

    dr = DataRequest.objects.latest("created_at")
    assert dr.export_format == "csv"
    assert dr.file_name.endswith(".csv")


def test_export_requires_auth_creates_no_datarequest(client):
    """Un appel non authentifié ne doit rien enregistrer dans le registre."""
    client.get("/api/accounts/me/export/")
    assert DataRequest.objects.count() == 0


def test_export_audit_logs_included_in_payload(auth_client):
    """Le second export contient l'historique du premier dans « audit_logs »."""
    auth_client.get("/api/accounts/me/export/")
    response = auth_client.get("/api/accounts/me/export/")
    data = response.json()

    assert len(data["audit_logs"]) >= 1
    assert data["audit_logs"][0]["type"] == "Export des données (Art. 15 & 20)"


def test_datarequest_str_without_user():
    """Le __str__ reste lisible même si le compte a été supprimé (user null)."""
    dr = DataRequest.objects.create(status=DataRequest.Status.RECEIVED)
    assert "compte supprimé" in str(dr)
