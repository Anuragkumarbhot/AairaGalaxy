from fastapi import APIRouter

from app.models import TelemetryData, TelemetryResponse
from app.state import uptime_seconds, utc_now


router = APIRouter(
    prefix="/api",
    tags=["telemetry"],
)


@router.get("/telemetry", response_model=TelemetryResponse)
async def telemetry() -> TelemetryResponse:
    return TelemetryResponse(
        available=True,
        platform="server",
        telemetry=TelemetryData(
            uptime_seconds=uptime_seconds(),
        ),
        timestamp=utc_now(),
    )
