# Clean Water Index

A full-stack AI/ML system that simulates a public water tank monitoring network for Lahore. Sensor readings from each tank are passed through a trained Neural Network to produce a real-time Cleanliness Rating (0–100). An A* search algorithm finds the optimal route from an unsafe tank to the nearest safe water source.

## Architecture

```
React Frontend (Vite)
        │  HTTP / JSON
FastAPI Backend
    ├── Neural Network model (.pkl) — classifies water safety
    ├── StandardScaler (.pkl)       — normalises sensor inputs
    ├── A* Search                   — finds shortest route to safe tank
    └── psycopg2
        │
NeonDB (PostgreSQL) — stores tank nodes and sensor readings
```

## Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | Python, scikit-learn (MLPClassifier), pandas |
| Backend API | Python, FastAPI, uvicorn |
| Database | PostgreSQL (NeonDB) |
| Frontend | React, Vite, axios |

## ML Model

- **Algorithm:** Multi-Layer Perceptron (Neural Network)
- **Dataset:** Water Potability dataset — 3,276 samples, 9 chemical/physical features
- **Training split:** 80% train / 20% test
- **Test accuracy:** 62.65%
- **Output:** `predict_proba()` probability converted to a 0–100 Cleanliness Rating

| Rating | Status |
|---|---|
| 90–100 | Safe to Drink |
| 70–89 | Safe but Needs Filtering |
| 0–69 | Unsafe |

## A* Search

The tank network is modelled as a weighted directed graph. A* finds the shortest physical path (km) from any tank to the nearest safe tank using distance as both edge cost `g(n)` and heuristic `h(n)`.

## Project Structure

```
clean_water/
├── model_training.ipynb   # ML training pipeline
├── water_knn_model.pkl    # Trained model artifact
├── water_scaler.pkl       # Feature scaler artifact
├── confusion_matrix.png   # Model evaluation plot
├── astar.py               # A* algorithm + tank network graph
├── schema.sql             # PostgreSQL schema + seed data
├── water_potability.csv   # Training dataset
├── backend/
│   ├── main.py            # FastAPI application
│   └── .env               # DATABASE_URL (not committed)
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── Dashboard.jsx   # Tank network view
            └── Analytics.jsx   # Model metrics view
```

## Running Locally

**1. Backend**
```bash
cd clean_water
DATABASE_URL='your_neondb_connection_string' venv/bin/uvicorn backend.main:app --reload --port 8000
```

**2. Frontend**
```bash
cd clean_water/frontend
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tanks` | Returns all tanks with current sensor data and ratings |
| POST | `/api/tanks/:id/evaluate` | Runs ML model on tank's sensors, updates rating |
| GET | `/api/route?from_tank=X&to_tank=Y` | Returns A* shortest path between two tanks |
