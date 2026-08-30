from pydantic import BaseModel, Field


class CommandRequest(BaseModel):
    command: str = Field(
        ...,
        min_length=1,
        max_length=1000,
    )


class CommandResponse(BaseModel):
    success: bool
    command: str
    response: str
    timestamp: str


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str


class StatusResponse(BaseModel):
    status: str
    service: str
    version: str
    uptime_seconds: float
    timestamp: str


class TelemetryData(BaseModel):
    uptime_seconds: float


class TelemetryResponse(BaseModel):
    available: bool
    platform: str
    telemetry: TelemetryData
    timestamp: str
