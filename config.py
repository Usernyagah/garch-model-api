from pydantic import BaseSettings

class Settings(BaseSettings):
    alpha_api_key: str = "YOUR_API_KEY"
    db_name: str = "stocks.db"
    model_directory: str = "models"
    test_ticker: str = "SHOPERSTOP.BSE"

    class Config:
        env_file = ".env"

settings = Settings()