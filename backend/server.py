from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ============================================================
# AairaGalaxy v0.5
# Minimal FastAPI backend
# ============================================================

APP_NAME = "AairaGalaxy"
APP_VERSION = "0.5.0"


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AairaGalaxy v0.5 backend API",
)


# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------
# Runtime state
# ------------------------------------------------------------

STARTED_AT = datetime.now(timezone.utc)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def uptime_seconds() -> float:
    return (datetime.now(timezone.utc) - STARTED_AT).total_seconds()


# ------------------------------------------------------------
# Models
# ------------------------------------------------------------

class CommandRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=1000)


class CommandResponse(BaseModel):
    success: bool
    command: str
    response: str
    timestamp: str


# ------------------------------------------------------------
# Root
# ------------------------------------------------------------

@app.get("/")
async def root() -> dict[str, Any]:
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "status": "online",
        "message": "AairaGalaxy backend is running.",
        "timestamp": utc_now(),
    }


# ------------------------------------------------------------
# Health
# ------------------------------------------------------------

@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {
        "status": "healthy",
        "service": APP_NAME,
        "version": APP_VERSION,
        "timestamp": utc_now(),
    }


# ------------------------------------------------------------
# Status
# ------------------------------------------------------------

@app.get("/api/status")
async def status() -> dict[str, Any]:
    return {
        "status": "online",
        "service": APP_NAME,
        "version": APP_VERSION,
        "uptime_seconds": round(uptime_seconds(), 2),
        "timestamp": utc_now(),
    }


# ------------------------------------------------------------
# Telemetry
# ------------------------------------------------------------

@app.get("/api/telemetry")
async def telemetry() -> dict[str, Any]:
    """
    v0.5 intentionally provides basic server telemetry only.

    Android-specific telemetry will be added in v1.5.
    We do NOT use psutil here.
    """

    return {
        "available": True,
        "platform": "server",
        "telemetry": {
            "uptime_seconds": round(uptime_seconds(), 2),
        },
        "timestamp": utc_now(),
    }


# ------------------------------------------------------------
# Command API
# ------------------------------------------------------------

SAFE_COMMANDS = {
    "status",
    "health",
    "ping",
}


def execute_safe_command(command: str) -> str:
    normalized = command.strip().lower()

    if normalized == "ping":
        return "pong"

    if normalized == "health":
        return "AairaGalaxy backend is healthy."

    if normalized == "status":
        return "AairaGalaxy backend is online."

    return "Unknown command."


@app.post("/api/command", response_model=CommandResponse)
async def command(request: CommandRequest) -> CommandResponse:
    normalized = request.command.strip().lower()

    if normalized not in SAFE_COMMANDS:
        return CommandResponse(
            success=False,
            command=request.command,
            response=(
                "Command rejected. "
                "Only safe v0.5 commands are allowed: "
                "status, health, ping."
            ),
            timestamp=utc_now(),
        )

    result = execute_safe_command(normalized)

    return CommandResponse(
        success=True,
        command=normalized,
        response=result,
        timestamp=utc_now(),
    )


# ------------------------------------------------------------
# Development server
# ------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
    )
