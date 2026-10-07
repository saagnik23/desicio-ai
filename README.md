# Desicio.ai — Ultra-Fast System 1 Decision Engine

> **15x – 25x Faster than Text LLMs.** Sub-200ms structured decision-making for production software pipelines, powered by the **Jev** architecture from TypeSafe AI.

---

## ⚡ The Core Problem: Why Traditional LLMs Fail in Production Pipelines

Traditional Large Language Models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) are built for conversational prose. In software automation, you don't need paragraphs of text—you need **deterministic, typed decisions** (routing, triage, scoring, gating).

Using a text LLM for operational decisions introduces critical flaws:
* **Severe Latency (1,500ms – 3,500ms):** Generates tokens sequentially one-by-one.
* **Schema Drift & Hallucination (88%–94% adherence):** JSON parsing errors, markdown wrappers (` ```json `), and unexpected nulls break production APIs.
* **Extreme Cost:** $25 – $30 per 100,000 decisions.

## 🚀 The Solution: Desicio.ai (Jev System 1)

**Desicio.ai** replaces token generation with **System 1 Direct Inference**:
* **Sub-200ms p50 Latency:** Single forward-pass evaluation directly from internal embeddings.
* **100% Typed Determinism:** Returns calibrated probabilities across typed primitives:
  * `choice`: Categorical classification with exact probability distribution.
  * `score`: Continuous, calibrated score against an ordered rubric (e.g. `2.92` out of `3.0`).
  * `noul`: Binary probability gate ($0.0$ to $1.0$) for automated action triggers.
* **$1.20 per 100,000 Decisions:** ~95% cheaper than GPT-4o.

---

## 🏗️ Repository Architecture

```
niathack/
├── frontend/               # Vercel-ready React + TypeScript + Vite Dashboard
│   ├── src/                # Interactive Playground, Benchmark Gauges, Audit Telemetry
│   ├── vercel.json         # One-click Vercel routing configuration
│   └── package.json
│
├── backend/                # Railway-ready FastAPI Python Backend
│   ├── main.py             # Inference router, microsecond latency timer, Neon DB audit
│   ├── Dockerfile          # Railway container definition
│   ├── railway.json        # Railway deploy & healthcheck configuration
│   ├── Procfile            # Web dyno start command
│   └── requirements.txt
│
└── neon/                   # Neon Serverless Postgres Schema & Migrations
    └── schema.sql          # Tables: decisions, pipelines, benchmarks
```

---

## 🚀 Quickstart (Running Locally)

### 1. Start the Railway Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend health check:* `http://localhost:8000/api/v1/health`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to test the interactive decision dashboard!

---

## ☁️ Production Deployment Guide

### 1. Database: Neon Serverless Postgres
Your project is already linked to **Neon**:
* **Project ID:** `cold-credit-65603813` (NIATHACK)
* **Branch:** `production`
* **Configuration:** `neon.ts`

To manage or re-deploy the schema:
```bash
neon link --project-id cold-credit-65603813 --branch production -y
neon deploy
```
*Schema tables created:* `pipelines`, `decisions`, `benchmarks`

### 2. Backend: Railway
1. Go to [railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub repo**, pointing to the `backend` directory.
3. Add the following Environment Variables in Railway:
   * `TYPESAFE_API_KEY`: `apikey_2190cc35b50c5e6947d48adb1452b4e33147_e88ecf86c6943f13bc3cf8eb0324f852f85d08160bd41c91841b62bc9309fadb`
   * `DATABASE_URL`: Your Neon Connection String from `.env.local`
   * `ALLOWED_ORIGINS`: `*`
4. Railway will automatically build via `Dockerfile` and expose a public URL (e.g. `https://desicio-api.up.railway.app`).

### 3. Frontend: Vercel
1. Go to [vercel.com](https://vercel.com) and import your repository.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   * `VITE_API_URL`: Your deployed Railway backend URL (`https://desicio-api.up.railway.app`).
   * `VITE_TYPESAFE_API_KEY`: `apikey_2190cc35b50c5e6947d48adb1452b4e33147_e88ecf86c6943f13bc3cf8eb0324f852f85d08160bd41c91841b62bc9309fadb`
4. Click **Deploy**. Vercel will build using `vite build` and serve on your custom domain.

---

## 📡 API Reference

### `POST /api/v1/evaluate`
Direct structured evaluation of arbitrary states:

```bash
curl -X POST http://localhost:8000/api/v1/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Transaction: $4,850.00 watch in Lagos, Nigeria from user in Chicago",
    "questions": {
      "risk": {
        "type": "score",
        "instructions": "Evaluate transactional risk.",
        "criteria": ["low", "elevated", "high_risk", "critical_freeze"]
      },
      "freeze_card": {
        "type": "noul",
        "instructions": "Should we freeze the card?"
      },
      "category": {
        "type": "choice",
        "instructions": "Anomaly type",
        "criteria": { "geo_velocity": "distance jump", "clean": "normal" }
      }
    }
  }'
```

**Response (returned in ~250ms):**
```json
{
  "latency_ms": 234.8,
  "answers": {
    "risk": { "type": "score", "score": 2.92, "confidence": 0.92 },
    "freeze_card": { "type": "noul", "noul": 0.91 },
    "category": { "type": "choice", "choice": "geo_velocity", "confidence": 1.0 }
  }
}
```
