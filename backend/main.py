import os
import joblib
import psycopg2
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from astar import A_star, graph, Heuristic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="."), name="static")

MODEL  = joblib.load("water_knn_model.pkl")
SCALER = joblib.load("water_scaler.pkl")

FEATURE_COLS = [
    "ph", "hardness", "solids", "chloramines", "sulfate",
    "conductivity", "organic_carbon", "trihalomethanes", "turbidity"
]

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def prob_to_rating(prob_safe: float) -> dict:
    rating = float(round(prob_safe * 100, 1))
    if rating >= 90:
        return {"cleanliness_rating": rating, "status": "Safe to Drink"}
    elif rating >= 70:
        return {"cleanliness_rating": rating, "status": "Safe but Needs Filtering"}
    else:
        return {"cleanliness_rating": rating, "status": "Unsafe"}


@app.get("/api/tanks")
def get_tanks():
    conn = get_db()
    cur  = conn.cursor()
    cur.execute("SELECT * FROM tanks ORDER BY id")
    cols = [desc[0] for desc in cur.description]
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return rows


@app.post("/api/tanks/{tank_id}/evaluate")
def evaluate_tank(tank_id: int):
    conn = get_db()
    cur  = conn.cursor()

    cur.execute("SELECT * FROM tanks WHERE id = %s", (tank_id,))
    cols = [desc[0] for desc in cur.description]
    row  = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Tank not found")

    tank   = dict(zip(cols, row))
    values = [[tank[col] for col in FEATURE_COLS]]
    scaled = SCALER.transform(values)
    prob   = MODEL.predict_proba(scaled)[0][1]
    result = prob_to_rating(prob)

    cur.execute(
        "UPDATE tanks SET cleanliness_rating = %s, status = %s WHERE id = %s",
        (result["cleanliness_rating"], result["status"], tank_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"tank_id": tank_id, **result}


@app.get("/api/route")
def get_route(from_tank: str, to_tank: str):
    result = A_star(from_tank, to_tank, graph)
    if not result:
        raise HTTPException(status_code=404, detail="No route found")
    return {
        "route":          result[:-1],
        "total_distance": result[-1]
    }
