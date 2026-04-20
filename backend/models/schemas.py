from pydantic import BaseModel
from typing import Optional, List

class TripCreate(BaseModel):
    title: str
    organizer_name: str
    organizer_email: Optional[str] = None
    mode: Optional[str] = "trip"
    city: Optional[str] = None

class ResponseCreate(BaseModel):
    participant_name: str
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    preferred_dates: Optional[List[str]] = None
    preferred_countries: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    notes: Optional[str] = None
