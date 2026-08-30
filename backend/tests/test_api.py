from fastapi.testclient import TestClient

from server import app


client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "AairaGalaxy"
    assert data["version"] == "0.6.0"
    assert data["status"] == "online"


def test_health():
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == "AairaGalaxy"
    assert data["version"] == "0.6.0"


def test_status():
    response = client.get("/api/status")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "online"
    assert data["service"] == "AairaGalaxy"
    assert data["version"] == "0.6.0"
    assert data["uptime_seconds"] >= 0


def test_telemetry():
    response = client.get("/api/telemetry")

    assert response.status_code == 200

    data = response.json()

    assert data["available"] is True
    assert data["platform"] == "server"
    assert data["telemetry"]["uptime_seconds"] >= 0


def test_ping_command():
    response = client.post(
        "/api/command",
        json={"command": "ping"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["command"] == "ping"
    assert data["response"] == "pong"


def test_health_command():
    response = client.post(
        "/api/command",
        json={"command": "health"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["command"] == "health"


def test_status_command():
    response = client.post(
        "/api/command",
        json={"command": "status"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["command"] == "status"


def test_command_is_case_insensitive():
    response = client.post(
        "/api/command",
        json={"command": "PING"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["command"] == "ping"
    assert data["response"] == "pong"


def test_command_trims_whitespace():
    response = client.post(
        "/api/command",
        json={"command": "  ping  "},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["command"] == "ping"


def test_unsupported_command():
    response = client.post(
        "/api/command",
        json={"command": "shutdown"},
    )

    assert response.status_code == 400

    data = response.json()

    assert data["detail"]["error"] == "unsupported_command"


def test_empty_command():
    response = client.post(
        "/api/command",
        json={"command": ""},
    )

    assert response.status_code == 422


def test_missing_command():
    response = client.post(
        "/api/command",
        json={},
    )

    assert response.status_code == 422


def test_unknown_route():
    response = client.get("/api/does-not-exist")

    assert response.status_code == 404
