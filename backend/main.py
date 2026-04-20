from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import trips, responses, ai

app = FastAPI(title="GroupGo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trips.router, prefix="/trips", tags=["trips"])
app.include_router(responses.router, prefix="/responses", tags=["responses"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])

@app.get("/")
def root():
    return {"status": "GroupGo API running 🚀"}