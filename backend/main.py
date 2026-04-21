import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import trips, responses, ai

load_dotenv()

app = FastAPI(title="GroupGo API")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "*").strip()
if _raw_origins in ("", "*"):
    allowed_origins = ["*"]
else:
    allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trips.router, prefix="/trips", tags=["trips"])
app.include_router(responses.router, prefix="/responses", tags=["responses"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])

@app.get("/")
def root():
    return {"status": "GroupGo API running 🚀"}