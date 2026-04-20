from fastapi import APIRouter, HTTPException
from services.supabase_service import supabase
from services.groq_service import get_recommendation, MODEL_NAME

router = APIRouter()

@router.post("/{trip_id}/recommend")
def recommend(trip_id: str):
    trip = supabase.table("trips").select("*").eq("id", trip_id).execute()
    if not trip.data:
        raise HTTPException(status_code=404, detail="Trip not found")

    responses = supabase.table("responses").select("*").eq("trip_id", trip_id).execute()
    if not responses.data:
        raise HTTPException(status_code=400, detail="No responses yet")

    recommendation = get_recommendation(trip.data[0], responses.data)

    supabase.table("ai_recommendations").insert({
        "trip_id": trip_id,
        "recommendation_text": recommendation,
        "model_used": MODEL_NAME
    }).execute()

    return {"recommendation": recommendation}