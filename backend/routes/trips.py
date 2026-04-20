from fastapi import APIRouter, HTTPException
from models.schemas import TripCreate
from services.supabase_service import supabase
import secrets

router = APIRouter()


def _insert_trip(data: dict):
    """Insert a trip row. Falls back gracefully when optional columns are not yet in the DB."""
    try:
        return supabase.table("trips").insert(data).execute()
    except Exception as exc:
        message = str(exc)
        fallback = dict(data)
        changed = False
        for optional_col in ("mode", "city"):
            if optional_col in message and optional_col in fallback:
                fallback.pop(optional_col, None)
                changed = True
        if not changed:
            raise
        return supabase.table("trips").insert(fallback).execute()


@router.post("/")
def create_trip(trip: TripCreate):
    token = secrets.token_urlsafe(16)
    data = {
        "title": trip.title,
        "organizer_name": trip.organizer_name,
        "organizer_email": trip.organizer_email or "",
        "survey_token": token,
        "status": "active",
        "mode": trip.mode or "trip",
    }
    if trip.city:
        data["city"] = trip.city

    result = _insert_trip(data)
    trip_row = result.data[0]
    trip_row.setdefault("mode", trip.mode or "trip")
    if trip.city:
        trip_row.setdefault("city", trip.city)
    return {"trip": trip_row, "survey_link": f"/survey/{token}"}


@router.get("/{trip_id}")
def get_trip(trip_id: str):
    result = supabase.table("trips").select("*").eq("id", trip_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result.data[0]


@router.get("/token/{token}")
def get_trip_by_token(token: str):
    result = supabase.table("trips").select("*").eq("survey_token", token).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result.data[0]
