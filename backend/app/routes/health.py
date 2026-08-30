from fastapi import APIRouter

from app.models import HealthResponse
from app.state import utc_now


router = APIRouter(
    prefix="/api",
    tags=["health"],
)

APP_NAME = "AairaGalaxy"
APP_VERSION = "0.6.0"


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        service=APP_NAME,
        version=APP_VERSION,
        timestamp=utc_now(),
    )
