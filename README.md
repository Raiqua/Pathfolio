# Pathfolio — real stack scaffold

React/Next.js frontend, FastAPI backend, Postgres, OpenAI, O*NET skills taxonomy.
This is a working skeleton, not a finished product — auth, styling polish, and
most of the cinematic UI from the earlier HTML prototype still need to be
ported over. See "What's not here yet" below.

## Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Backend:** FastAPI, SQLAlchemy
- **Database:** PostgreSQL
- **AI layer:** OpenAI (`openai` SDK), strict grounding prompt in `backend/app/ai/parser.py`
- **Skills reference:** O*NET Content Model skills, seeded in `backend/app/skills_taxonomy.py`

## Run it locally

### 1. Database

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

On startup it creates tables and seeds the O*NET skill rows automatically.

Create a demo user:

```bash
curl -X POST "http://localhost:8000/users?email=you@example.com&name=You"
```

Copy the returned `id`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # paste the user id from above into NEXT_PUBLIC_DEMO_USER_ID
npm run dev
```

Visit `http://localhost:3000`.

## How the "don't fabricate" rule is enforced

`backend/app/ai/parser.py` holds the only OpenAI call in the app. The system
prompt requires the model to:
- only use facts from the interview transcript it's given,
- only choose skills from a pre-filtered O*NET candidate list for that
  activity category (`CATEGORY_SKILL_HINTS` in `skills_taxonomy.py`),
- report anything vague or unverifiable in `confidence_notes` instead of
  smoothing over it.

The API stores `ai_confidence_notes` alongside every experience and the
frontend surfaces it — so if the model does hedge, the user sees that instead
of a silently confident, possibly wrong resume line.

## What's not here yet

- **Auth.** `NEXT_PUBLIC_DEMO_USER_ID` is a placeholder. Swap in real sessions
  (NextAuth, Clerk, or your own) before this goes anywhere near real users.
- **Migrations.** `Base.metadata.create_all` is fine for local dev; wire up
  Alembic (already in `requirements.txt`) before you touch a shared database.
- **Full O*NET/Lightcast data.** `skills_taxonomy.py` seeds ~25 representative
  skills. Load the full O*NET `skills.csv` (or switch to a Lightcast Open
  Skills API client) for production coverage.
- **The cinematic UI.** The custom cursor, particle field, scroll
  choreography, and template gallery from the original HTML prototype aren't
  ported into React yet — this scaffold is functional but visually plain.
- **PDF export, job matching, skill graph, portfolio builder** — not built.
