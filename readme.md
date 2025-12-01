## GARCH Model API for Volatility Forecasting 📈🚀

A production-ready stack for training GARCH models and forecasting stock volatility, with:

- **FastAPI backend** (Python) for model training and prediction
- **SQLite** storage and data pipeline
- **ARCH-based GARCH models**
- **C++/Qt desktop UI** for a sleek, point-and-click experience

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Backend (FastAPI) ⚙️

- **Install dependencies**
  ```bash
  pip install -r requirements.txt
  ```

- **Environment (optional)**
  ```bash
  # .env
  ALPHA_API_KEY=your_api_key_here   # https://www.alphavantage.io
  DB_NAME=stocks.db                 # SQLite database file
  MODEL_DIRECTORY=models            # Trained model storage
  ```

- **Run the API**
  ```bash
  uvicorn main:app --reload --host localhost --port 8008
  ```

- **Key endpoints**
  - **GET** `/hello` – health check  
  - **POST** `/fit` – train a GARCH model  
  - **POST** `/predict` – get a volatility forecast

---

## Desktop UI (C++ / Qt) 💻

A Qt-based desktop client (`GarchModelUI`) that talks to the API.

- **Prerequisites (Windows)**
  - Qt 6 (including **Qt 6.x MinGW 64-bit** or MSVC kit)
  - CMake 3.16+
  - C++17-capable toolchain (MinGW or MSVC)

- **Build with helper script (Windows)**
  ```powershell
  cd garch-model-api
  .\build_ui.bat
  ```
  This configures CMake with your Qt install and builds the UI into the `build` folder.

- **Build manually (cross‑platform)** – see `UI_README.md` for full Qt instructions.

- **Run the UI (after a successful build)**
  ```bash
  # from the build directory
  ./GarchModelUI.exe      # Windows
  ./GarchModelUI          # Linux/macOS
  ```

The UI lets you:
- Check API health
- Train models (ticker, observations, p, q, use_new_data)
- Request multi‑day volatility forecasts and view formatted results

---

## Quick API Examples

- **Train model**
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

- **Get forecast**
  ```bash
  curl -X POST "http://localhost:8008/predict" \
    -H "Content-Type: application/json" \
    -d '{
      "ticker": "SHOPERSTOP.BSE",
      "n_days": 5
    }'
  ```

---

## Project Structure 🗂️

```bash
garch-model-api/
├── main.py          # FastAPI app
├── data.py          # DB operations
├── model.py         # GARCH implementation
├── config.py        # Settings / env
├── test_api.py      # Simple API test script
├── requirements.txt # Python deps
├── CMakeLists.txt   # C++/Qt build config
├── main.cpp         # C++ UI entry point
├── MainWindow.*     # Qt main window
├── ApiClient.*      # HTTP client for API
├── build_ui.bat     # Windows build helper
└── UI_README.md     # Detailed UI docs
```

---

## License 📄

This project is licensed under the MIT License – see `LICENSE` for details.

**Built with ❤️ by Dennis**  
[GitHub profile](https://github.com/Usernyagah)  

*Data provided by [Alpha Vantage](https://www.alphavantage.io/)*  
*Modeling powered by [ARCH](https://arch.readthedocs.io/)*