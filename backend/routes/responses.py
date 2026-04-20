from fastapi import APIRouter, HTTPException
from models.schemas import ResponseCreate
from services.supabase_service import supabase

router = APIRouter()

@router.post("/{token}")
def submit_response(token: str, response: ResponseCreate):
    trip = supabase.table("trips").select("id").eq("survey_token", token).execute()
    if not trip.data:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    trip_id = trip.data[0]["id"]
    data = {
        "trip_id": trip_id,
        "participant_name": response.participant_name,
        "budget_min": response.budget_min,
        "budget_max": response.budget_max,
        "preferred_dates": response.preferred_dates,
        "preferred_countries": response.preferred_countries,
        "interests": response.interests,
        "notes": response.notes
    }
    result = supabase.table("responses").insert(data).execute()
    return {"message": "Response submitted!", "data": result.data[0]}

@router.get("/{trip_id}")
def get_responses(trip_id: str):
    result = supabase.table("responses").select("*").eq("trip_id", trip_id).execute()
    return {"responses": result.data}