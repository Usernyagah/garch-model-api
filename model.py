import os
from glob import glob
import joblib
import pandas as pd
from arch import arch_model
from arch.univariate.base import ARCHModelResult
from config import settings
from data import SQLRepository

class GarchModel:
    """Class for GARCH model operations"""
    
    def __init__(self, ticker: str, repo: SQLRepository, use_new_data: bool):
        self.ticker = ticker
        self.repo = repo
        self.use_new_data = use_new_data
        self.model_directory = settings.model_directory
        self.data = None
        self.model = None

    def wrangle_data(self, n_observations: int) -> None:
        if self.use_new_data:
            self.repo.delete_table(self.ticker)
            df = self.repo.get_new_data(self.ticker)
        else:
            df = self.repo.get_data(self.ticker)
        returns = df["close"].pct_change().dropna().abs()
        self.data = returns.tail(n_observations)

    def fit(self, p: int, q: int) -> None:
        self.model = arch_model(self.data, vol="Garch", p=p, q=q).fit(disp="off")

    def _clean_prediction(self, prediction):
        return {str(i): float(prediction.variance.iloc[i-1]) for i in range(1, len(prediction.variance)+1)}

    def predict_volatility(self, horizon: int) -> dict:
        pred = self.model.forecast(horizon=horizon)
        return self._clean_prediction(pred)

    def dump(self) -> str:
        path = os.path.join(self.model_directory, f"{self.ticker}.pkl")
        joblib.dump(self.model, path)
        return path

    def load(self) -> None:
        pattern = os.path.join(self.model_directory, f"{self.ticker}*.pkl")
        model_path = sorted(glob(pattern))[-1]
        self.model = joblib.load(model_path)