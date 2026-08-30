from fastapi import APIRouter, HTTPException

from app.models import CommandRequest, CommandResponse
from app.state import utc_now


router = APIRouter(
    prefix="/api",
    tags=["command"],
)


SAFE_COMMANDS = {
    "ping",
    "health",
    "status",
}


def execute_safe_command(command: str) -> str:
    if command == "ping":
        return "pong"

    if command == "health":
        return "AairaGalaxy backend is healthy."

    if command == "status":
        return "AairaGalaxy backend is online."

    raise ValueError("Unsupported command")


@router.post(
    "/command",
    response_model=CommandResponse,
)
async def command(request: CommandRequest) -> CommandResponse:
    normalized = request.command.strip().lower()

    if normalized not in SAFE_COMMANDS:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "unsupported_command",
                "message": (
                    "Only safe commands are allowed: "
                    "ping, health, status."
                ),
            },
        )

    result = execute_safe_command(normalized)

    return CommandResponse(
        success=True,
        command=normalized,
        response=result,
        timestamp=utc_now(),
    )
