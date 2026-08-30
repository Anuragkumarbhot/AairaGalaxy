from fastapi import APIRouter

from app.models import StatusResponse
from app.state import uptime_seconds, utc_now


router = APIRouter(
    prefix="/api",
    tags=["status"],
)

APP_NAME = "AairaGalaxy"
APP_VERSION = "0.6.0"


@router.get("/status", response_model=StatusResponse)
async def status() -> StatusResponse:
    return StatusResponse(
        status="online",
        service=APP_NAME,
        version=APP_VERSION,
        uptime_seconds=uptime_seconds(),
        timestamp=utc_now(),
    )
