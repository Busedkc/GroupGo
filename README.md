# GroupGo

A web app that makes group decision-making effortless. An organizer creates a **trip** (international travel) or a **city** (in-city plan), shares a survey link with friends, and everyone marks their preferences (dates, budget, interests, preferred countries/neighborhoods). The AI then analyzes the group's preferences and suggests a shared plan.

**Live app:** [https://group-go-tawny.vercel.app/](https://group-go-tawny.vercel.app/)

If you don't want to deal with setup, just click the link above and use it directly.

## Features

- **Two modes**: Trip (international travel) and City (in-city plan)
- **Calendar-based** date range selection
- **Preset checkboxes** for picking interests (Cafe, Restaurant, Museum, Nature, etc.)
- **Chip-style country / neighborhood** preference collection
- **Groq LLM**-powered, realistic Turkish AI recommendations aligned with 2026 prices
- **Shareable survey link** — just copy & share, no emails needed
- **The organizer can fill out their own survey** too
- Responsive custom design system with a coral/cream theme

## Tech stack

| Layer | Used |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Router, axios |
| Backend | FastAPI, Pydantic, Uvicorn |
| Database | Supabase (Postgres) |
| AI | Groq API (Llama 3.x) |
| Deploy | Vercel (frontend) + Render (backend) |

## Project structure

```
GroupGo/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── pages/            # Home, CreateTrip, Survey, Dashboard
│   │   ├── components/       # Navbar, Footer, AIResponse
│   │   └── index.css         # Design system
│   ├── .env.example
│   └── vercel.json           # SPA routing
└── backend/                  # FastAPI
    ├── main.py               # App entry point + CORS
    ├── routes/               # /trips, /responses, /ai
    ├── services/             # supabase_service, groq_service
    ├── models/schemas.py     # Pydantic models
    ├── requirements.txt
    ├── Procfile              # For Render/Railway
    └── .env.example
```

## Local setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- A Supabase project (free)
- Groq API key (free: [console.groq.com](https://console.groq.com))

### 1. Supabase schema

You need to create the `trips`, `responses`, and `recommendations` tables on Supabase. You can set up the table schema however fits your project; check `backend/models/schemas.py` to see which fields the code expects.

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Fill in the .env file with your Supabase & Groq credentials

uvicorn main:app --reload
# → http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# VITE_API_URL=http://localhost:8000

npm run dev
# → http://localhost:5173
```

## Environment variables

### `backend/.env`
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGciOi...
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=http://localhost:5173
```

### `frontend/.env.local`
```
VITE_API_URL=http://localhost:8000
```

## Deploy

### Backend → Render

1. [render.com](https://render.com) → **New Web Service** → connect your repo
2. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add `SUPABASE_URL`, `SUPABASE_KEY`, `GROQ_API_KEY`, `ALLOWED_ORIGINS` under the Environment tab

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import your repo
2. Root Directory: `frontend`
3. Environment Variables: `VITE_API_URL=https://your-api.onrender.com`
4. Deploy

`frontend/vercel.json` already includes a SPA rewrite for React Router, so URLs like `/survey/:token` won't 404 when opened directly.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/trips/` | Create a new trip, returns a shareable token |
| GET | `/trips/{trip_id}` | Trip details (dashboard) |
| GET | `/trips/token/{token}` | Fetch trip info by token (survey page) |
| POST | `/responses/{token}` | Submit a survey response |
| GET | `/responses/{trip_id}` | All responses for a trip |
| POST | `/ai/{trip_id}/recommend` | Generate an AI recommendation for the group |

## Flow

1. The organizer opens a trip via `/create` → receives a token
2. They share the `https://.../survey/{token}` link
3. Participants fill in their preferences
4. The organizer views the responses and the AI recommendation on `/dashboard/{trip_id}`

## Copyright

This project and all code within it belong to **Buse Dikici**. It was built for personal / educational purposes; commercial use without permission is not allowed.
