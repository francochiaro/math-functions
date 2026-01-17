# Claude Code Context

## Project Overview
Interactive Curve Fitting Lab - A local-first web app that enables advanced math/data users to draw data points, upload CSV data, fit mathematical functions using multiple model families, and analyze fitted functions (derivatives, extrema, integrals) with a world-class UI.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, D3.js
- **Backend**: Python 3.11+, FastAPI
- **Curve Fitting**: scikit-learn, scipy, numpy, sympy, statsmodels
- **Fonts**: Geist Sans & Geist Mono

## Project Structure
```
math-functions/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Main app (all UI state & logic)
│   │   │   ├── layout.tsx    # Root layout with fonts
│   │   │   └── globals.css   # Design system & animations
│   │   ├── components/
│   │   │   └── CartesianChart.tsx  # D3.js chart component
│   │   ├── hooks/
│   │   │   └── useChartDimensions.ts
│   │   └── types/
│   │       └── chart.ts      # TypeScript interfaces
│   └── package.json
├── backend/                  # Python FastAPI server
│   ├── main.py               # API endpoints & fitting logic
│   └── requirements.txt
├── prd.json                  # Product requirements (Ralph format)
└── progress.txt              # Development progress log
```

## Key Files

### Frontend
- `frontend/src/app/page.tsx` - Main application with all state management, handlers for painting, CSV upload, fitting, analysis
- `frontend/src/components/CartesianChart.tsx` - D3.js chart with zoom/pan, point rendering, curve display, integral shading
- `frontend/src/types/chart.ts` - TypeScript types for Point, FitResult, AnalyticalProperties, etc.

### Backend
- `backend/main.py` - FastAPI server with `/fit`, `/analyze`, `/integrate` endpoints
- Model families: linear, polynomial (degree 2-4), exponential, logarithmic, power, rational, spline, sinusoidal

## Running the App

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Quality Checks

### Frontend
```bash
cd frontend
npm run build          # TypeScript check + build
npm run lint           # ESLint
```

### Backend
```bash
cd backend
python -m mypy main.py  # Type checking (optional)
```

## API Endpoints

### POST /fit
Fit a curve to data points.
```json
{
  "points": [{"x": 1, "y": 2}, {"x": 2, "y": 4}],
  "objective": "accuracy" | "interpretability" | "balanced"
}
```

### POST /analyze
Compute analytical properties of a function.
```json
{
  "expression": "y = 2x + 1"
}
```

### POST /integrate
Compute definite integral.
```json
{
  "expression": "y = x^2",
  "a": 0,
  "b": 1
}
```

## Design System

### Colors
- **Background**: zinc-50 (light), zinc-900 (dark)
- **Accent/Success**: green-500 (#22c55e)
- **Data Points**: indigo-500 (#6366f1)
- **Borders**: zinc-200 (light), zinc-800 (dark)

### Typography
- Geist Sans for UI text
- Geist Mono for numbers and code

### Animations
- `animate-fade-in`: Fade in with slight upward motion
- `animate-slide-in`: Slide in from left
- `animate-pulse-subtle`: Subtle opacity pulse
- `animate-spin`: Rotation for loading states

## Constraints
- **Fully offline**: No cloud APIs or external services
- **Max 50,000 points**: Enforced for performance
- **Max 120s fitting time**: Acceptable model runtime limit
- **~16GB RAM**: Assumed available memory

## Code Style
- TypeScript strict mode
- Functional React components with hooks
- Tailwind CSS for styling (no CSS modules)
- FastAPI with Pydantic models for validation

## Known Quirks
- Frontend includes fallback simulation when backend is unavailable
- D3.js zoom requires manual bounds state tracking for axis updates
- Backend scoring heuristics vary by objective (accuracy favors complex models, interpretability penalizes complexity)
- Spline models return "y = Spline(x)" as expression (not analytically expressible)

## Ralph Integration
This project uses Ralph-style PRD tracking:
- `prd.json` contains user stories with `passes: true/false`
- `progress.txt` logs implementation progress
- `scripts/ralph/` contains automation scripts
