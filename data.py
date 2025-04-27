import sqlite3
from typing import Union
import pandas as pd
import requests
from config import settings

class SQLRepository:
    """Class for database operations"""
    
    def __init__(self, connection: sqlite3.Connection):
        self.connection = connection

    def check_table_exists(self, table_name: str) -> bool:
        query = f"""
        SELECT count(name) FROM sqlite_master 
        WHERE type='table' AND name='{table_name}'
        """
        return self.connection.execute(query).fetchone()[0] == 1

    def delete_table(self, table_name: str) -> None:
        self.connection.execute(f"DROP TABLE IF EXISTS '{table_name}'")
        self.connection.commit()

    def insert_data(self, table_name: str, data: pd.DataFrame) -> None:
        data.to_sql(table_name, self.connection, if_exists='replace', index=False)
        self.connection.commit()

    def get_data(self, table_name: str) -> Union[pd.DataFrame, None]:
        if not self.check_table_exists(table_name):
            return None
        return pd.read_sql(f"SELECT * FROM '{table_name}'", self.connection)

    def get_new_data(self, ticker: str) -> pd.DataFrame:
        url = (
            f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&"
            f"symbol={ticker}&outputsize=full&apikey={settings.alpha_api_key}&datatype=csv"
        )
        response = requests.get(url)
        response.raise_for_status()
        df = pd.read_csv(url)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df = df.sort_values("timestamp", ascending=True)
        self.insert_data(ticker, df)
        return df