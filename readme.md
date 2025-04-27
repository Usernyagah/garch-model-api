# GARCH Model API for Volatility Forecasting 📈🚀

A production-ready API for training GARCH models and forecasting stock volatility. Built with FastAPI, SQLite, and ARCH.

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features ✨

- **Automated Data Pipeline**: Fetch stock data from Alpha Vantage API
- **SQL Storage**: Persistent data storage with SQLite
- **GARCH Modeling**: Train volatility forecasting models (GARCH 1,1)
- **Production API**: REST endpoints for model training and predictions
- **Error Handling**: Robust validation and error reporting

## Installation ⚙️

1. **Clone Repository**
```bash
git clone https://github.com/Usernyagah/garch-model-api.git
cd garch-model-api
```

2. **Install Dependencies**

```bash
pip install -r requirements.txt
```


3. **Environment Setup**

```bash
cp .env.example .env
# Edit .env with your Alpha Vantage API key
```

4. **Create Directories**

```bash
mkdir -p models
```

## Configuration

.env file requirements:
```bash

ALPHA_API_KEY=your_api_key_here  # Get from https://www.alphavantage.io
DB_NAME=stocks.db                # SQLite database file
MODEL_DIRECTORY=models           # Trained model storage
```

## API Documentation 📚

Endpoints
| Endpoint     | Method        | Description                  |
|--------------|---------------|------------------------------|
| `/hello`     | GET           | Service health check         |
| `/fit`       | POST          | Train new GARCH model        |
| `/predict`   | POST          | Get volatility forecast      |


## Request Examples
Train a Model (/fit)

```bash
curl -X POST "http://localhost:8008/fit" \
-H "Content-Type: application/json" \
-d '{
  "ticker": "SHOPERSTOP.BSE",
  "use_new_data": false,
  "n_observations": 2000,
  "p": 1,
  "q": 1
}'
```

## Get Prediction (/predict)

```bash
curl -X POST "http://localhost:8008/predict" \
-H "Content-Type: application/json" \
-d '{
  "ticker": "SHOPERSTOP.BSE",
  "n_days": 5
}'
```

## Response Format
```bash
json
{
  "ticker": "SHOPERSTOP.BSE",
  "n_days": 5,
  "success": true,
  "forecast": {
    "1": 0.0214,
    "2": 0.0198,
    "3": 0.0183,
    "4": 0.0170,
    "5": 0.0158
  },
  "message": "Success"
}
```


## Usage 🚀
Start Server

```bash
uvicorn main:app --reload --workers 1 --host localhost --port 8008
```

## Test API (in new terminal)

```bash
python test_api.py
```

## Interactive Docs (Swagger UI)
Visit http://localhost:8008/docs in your browser

## Project Structure 🗂️
```bash
garch-model-api/
├── data.py           # Database operations
├── model.py          # GARCH model implementation
├── main.py           # FastAPI application
├── config.py         # Environment configuration
├── test_api.py       # API test script
├── requirements.txt  # Dependencies
└── .env              # Environment variables
```

## Contributing 🤝

We welcome contributions! Here's how to get started:

1. **Fork the Repository** 
   ```bash 
    [Fork](https://github.com/Usernyagah/garch-model-api/fork) this repository
    ```

2. **Create Feature Branch**  
   ```bash
    git checkout -b feature/amazing-feature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open Pull Request**
  Create a Pull Request

## License 📄
This project is licensed under the MIT License - see LICENSE file for details.
---

**Built with ❤️ by Dennis**  
[![GitHub](https://img.shields.io/badge/GitHub-Profile-blue)](https://github.com/Usernyagah) 


*Data provided by [Alpha Vantage](https://www.alphavantage.io/)*  
*Modeling powered by [ARCH](https://arch.readthedocs.io/)*