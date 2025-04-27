from fastapi import FastAPI
from pydantic import BaseModel
from data import SQLRepository
from model import GarchModel
from config import settings
import sqlite3

# Initialize FastAPI
app = FastAPI()

# Database connection
conn = sqlite3.connect(settings.db_name, check_same_thread=False)
repo = SQLRepository(conn)

# Pydantic models
class FitIn(BaseModel):
    ticker: str
    use_new_data: bool
    n_observations: int
    p: int
    q: int

class FitOut(FitIn):
    success: bool
    message: str

class PredictIn(BaseModel):
    ticker: str
    n_days: int

class PredictOut(PredictIn):
    success: bool
    forecast: dict
    message: str

# Helper function
def build_model(ticker: str, use_new_data: bool) -> GarchModel:
    return GarchModel(ticker=ticker, repo=repo, use_new_data=use_new_data)

# API endpoints
@app.get("/hello")
def hello():
    return {"message": "Hello from GARCH API!"}

@app.post("/fit", response_model=FitOut)
def fit_model(params: FitIn):
    try:
        model = build_model(params.ticker, params.use_new_data)
        model.wrangle_data(params.n_observations)
        model.fit(params.p, params.q)
        model.dump()
        return {**params.dict(), "success": True, "message": "Model trained successfully"}
    except Exception as e:
        return {**params.dict(), "success": False, "message": str(e)}

@app.post("/predict", response_model=PredictOut)
def predict_volatility(params: PredictIn):
    try:
        model = build_model(params.ticker, False)
        model.load()
        forecast = model.predict_volatility(params.n_days)
        return {**params.dict(), "success": True, "forecast": forecast, "message": "Success"}
    except Exception as e:
        return {**params.dict(), "success": False, "forecast": {}, "message": str(e)}