# ScamShield AI — Frontend

AI-powered scam detection interface built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure your backend URL
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL to your Django backend URL
# Default: http://localhost:8000

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the onboarding flow will appear on first visit.

---

## Backend Integration

The frontend connects to your Django backend at the endpoints below. All go through the single `/api/analyze/` endpoint with different payload fields.

| Feature | Method | Path | Payload |
|---------|--------|------|---------|
| Text / SMS / Email | POST | `/api/analyze/` | `{ content: string }` |
| URL analysis | POST | `/api/analyze/` | `{ url: string }` |
| Image / screenshot | POST | `/api/analyze/` | `FormData { image: File }` |
| Platform stats | GET | `/api/stats/` | — |
| Report to authority | POST | `/api/report/` | `{ scam_fingerprint, agency, reporter_note? }` |

### CORS
Your Django `settings.py` already has `CORS_ALLOW_ALL_ORIGINS = True` for development. For production, lock this down to your frontend domain.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Your Django backend base URL |

---

## Features

- **Onboarding flow** — 3-step intro, shown once, dismissible
- **Text / SMS / Email analysis** — large textarea with helpful placeholder examples
- **URL analysis** — fetches page content server-side via your Django backend
- **Image / screenshot upload** — drag-and-drop with preview, sends as multipart form
- **Animated shield logo** — radar sweep + pulse rings
- **Risk meter** — animated arc gauge showing `scam_probability` (0–100)
- **Result card** — verdict, flagged phrases, recommended action, threat actors, known actor, social proof
- **Report to authority** — one-tap reporting to EFCC, CBN, NITDA, NPF
- **Live stats banner** — total scans, top threat type, most reported actor
- **Dark / light mode** — toggle in navbar, persisted to localStorage
- **Particle field** — ambient animated background
- **Fully responsive** — mobile-first, works from 320px up
- **Accessible** — ARIA labels, visible focus rings, reduced motion respected

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout, ThemeProvider, fonts
│   └── page.tsx          # Main page (hero + analyser + footer)
├── components/
│   ├── features/
│   │   ├── AnalyserPanel.tsx   # Tab panel (text/URL/image)
│   │   ├── Onboarding.tsx      # 3-step intro flow
│   │   ├── ResultCard.tsx      # Full result display
│   │   └── StatsBanner.tsx     # Live platform stats
│   ├── layout/
│   │   └── Navbar.tsx          # Top nav with theme toggle
│   └── ui/
│       ├── Shield.tsx          # Animated shield SVG + LogoMark
│       ├── RiskMeter.tsx       # Arc gauge for risk score
│       ├── ScanningOverlay.tsx # Loading state with scan animation
│       ├── ImageDropzone.tsx   # Drag-and-drop image upload
│       └── ParticleField.tsx   # Canvas particle background
├── lib/
│   ├── api.ts            # All API calls (wired to Django endpoints)
│   └── utils.ts          # cn(), threatMeta(), categoryLabel(), etc.
├── styles/
│   └── globals.css       # Tailwind + custom animations + glass
└── types/
    └── index.ts          # TypeScript types matching Django models
```
