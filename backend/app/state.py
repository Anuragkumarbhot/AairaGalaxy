from datetime import datetime, timezone


STARTED_AT = datetime.now(timezone.utc)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def uptime_seconds() -> float:
    return round(
        (datetime.now(timezone.utc) - STARTED_AT).total_seconds(),
        2,
    )
