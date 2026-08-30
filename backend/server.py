from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.command import router as command_router
from app.routes.health import router as health_router
from app.routes.status import router as status_router
from app.routes.telemetry import router as telemetry_router
from app.state import utc_now


APP_NAME = "AairaGalaxy"
APP_VERSION = "0.6.0"


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AairaGalaxy v0.6 modular backend API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(status_router)
app.include_router(telemetry_router)
app.include_router(command_router)


@app.get("/")
async def root() -> dict[str, Any]:
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "status": "online",
        "message": "AairaGalaxy backend is running.",
        "timestamp": utc_now(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
    )
