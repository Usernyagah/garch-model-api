from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from data import SQLRepository
from model import GarchModel
from config import settings
import sqlite3
import os

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware to allow Next.js frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class SubmitOnChainIn(BaseModel):
    ticker: str
    forecast: dict
    contract_address: str
    network: str = "testnet"

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
        return {**params.model_dump(), "success": True, "message": "Model trained successfully"}
    except Exception as e:
        return {**params.model_dump(), "success": False, "message": str(e)}

@app.post("/predict", response_model=PredictOut)
def predict_volatility(params: PredictIn):
    try:
        model = build_model(params.ticker, False)
        model.load()
        forecast = model.predict_volatility(params.n_days)
        return {**params.model_dump(), "success": True, "forecast": forecast, "message": "Success"}
    except Exception as e:
        return {**params.model_dump(), "success": False, "forecast": {}, "message": str(e)}

@app.post("/submit-onchain")
def submit_onchain(params: SubmitOnChainIn):
    """
    Submit volatility forecast to Mantle Network on-chain oracle
    Requires PRIVATE_KEY environment variable for authorized account
    """
    try:
        private_key = os.getenv("PRIVATE_KEY")
        if not private_key:
            return {"success": False, "message": "PRIVATE_KEY not configured"}
        
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from onchain import submit_forecast_to_chain
        
        tx_hash = submit_forecast_to_chain(
            ticker=params.ticker,
            forecast=params.forecast,
            contract_address=params.contract_address,
            private_key=private_key,
            network=params.network
        )
        
        return {
            "success": True,
            "message": "Forecast submitted to Mantle Network",
            "transaction_hash": tx_hash,
            "network": params.network
        }
    except Exception as e:
        return {"success": False, "message": str(e)}