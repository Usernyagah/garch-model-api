# GARCH Volatility Oracle - Mantle Global Hackathon 2025 🏆

## 🎯 Project Overview

**GARCH Volatility Oracle** is an on-chain oracle system that provides AI-powered volatility forecasts for Real-World Assets (RWA) and DeFi protocols on Mantle Network. Built for the **Mantle Global Hackathon 2025 - RWA/RealFi Track**.

### Problem Statement

Traditional DeFi and RWA tokenization platforms lack reliable, on-chain volatility data for:
- Risk management and collateralization
- Yield optimization strategies
- Automated trading and rebalancing
- Regulatory compliance and reporting

### Solution

A production-ready oracle that:
1. **Trains GARCH models** using historical price data (Alpha Vantage API)
2. **Generates volatility forecasts** via AI/ML backend (FastAPI + ARCH library)
3. **Publishes forecasts on-chain** via smart contracts on Mantle Network
4. **Provides Web3 interface** for DeFi protocols to consume volatility data

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Next.js UI     │────▶│  FastAPI Backend │────▶│  Mantle Network│
│  (Web3 Wallet)  │     │  (GARCH Models)  │     │  (Smart Oracle) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                          │
         │                       │                          │
         └──────────────────────┴──────────────────────────┘
                    On-chain Volatility Data
```

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, Web3Modal (WalletConnect)
- **Backend**: FastAPI, Python, ARCH library (GARCH models)
- **Blockchain**: Mantle Network (Ethereum L2)
- **Smart Contracts**: Solidity 0.8.20, Hardhat

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- MetaMask or compatible Web3 wallet
- Mantle testnet tokens (for testing)

### 1. Clone & Install

```bash
git clone <repository-url>
cd garch-model-api

# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install

# Smart Contracts
cd ../contracts
npm install
```

### 2. Configure Environment

**Backend** (`.env`):
```bash
ALPHA_API_KEY=your_alpha_vantage_key
DB_NAME=stocks.db
MODEL_DIRECTORY=models
PRIVATE_KEY=your_private_key_for_onchain_submission
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8008
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Deployed oracle address
```

**Contracts** (`contracts/.env`):
```bash
PRIVATE_KEY=your_deployer_private_key
```

### 3. Deploy Smart Contract

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network mantleTestnet
```

Update `NEXT_PUBLIC_CONTRACT_ADDRESS` with the deployed address.

### 4. Run Application

**Terminal 1 - Backend:**
```bash
uvicorn main:app --reload --host localhost --port 8008
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` and connect your wallet!

---

## 📋 Hackathon Submission Requirements

### ✅ Deliverables

1. **GitHub Repository** ✅
   - Complete source code
   - README with deployment instructions
   - Smart contract code and ABI

2. **Demo Video** (3-5 minutes)
   - Showcase: Training model → Generating forecast → Submitting on-chain → Viewing on Mantle explorer
   - Live demo URL: [To be provided]

3. **One-Pager Pitch** (See `PITCH.md`)

4. **Team Information**
   - Team size: 1-2 members
   - Contact: [To be provided]

5. **Compliance Declaration**
   - ✅ **No regulated assets involved**
   - This project provides **volatility data/forecasts only**
   - Does not handle securities, tokens, or financial instruments
   - Pure data oracle service

---

## 🎯 Hackathon Track Alignment

### RWA/RealFi (Primary Track) 🏆

**How we fit:**
- **Tokenization Support**: Volatility forecasts enable better risk assessment for RWA tokenization
- **Compliant Yield Distribution**: On-chain volatility data supports transparent, auditable yield calculations
- **KYC/Custody Models**: Volatility metrics inform custody risk models

**Use Cases:**
- Real estate tokenization platforms can use volatility forecasts for collateralization ratios
- Bond/Invoice tokenization protocols can adjust risk parameters based on volatility
- Cash-flow asset platforms can optimize yield distribution using volatility data

### AI & Oracles (Secondary Track) 🤖

**How we fit:**
- **AI/ML Models**: GARCH models powered by ARCH library (advanced econometric models)
- **Oracle Infrastructure**: On-chain data feeds for DeFi protocols
- **Smart Automation**: Automated forecast generation and on-chain submission

**Use Cases:**
- DeFi lending protocols can query volatility for dynamic interest rates
- Automated trading bots can use on-chain volatility for risk management
- Yield optimizers can adjust strategies based on volatility forecasts

---

## 🔧 Smart Contract Details

### VolatilityOracle.sol

**Key Features:**
- Store volatility forecasts on-chain (gas-efficient fixed-point arithmetic)
- Authorized updater model (only AI backend can submit)
- Query latest forecasts by ticker
- Support for multiple forecast horizons (1-365 days)

**Functions:**
- `submitForecast(ticker, volatilities[], nDays)` - Submit forecast (authorized only)
- `getVolatility(ticker, forecastId, dayIndex)` - Query specific day forecast
- `getLatestForecastId(ticker)` - Get latest forecast ID
- `authorizeUpdater(address)` - Add authorized updater (owner only)

**Gas Optimization:**
- Fixed-point arithmetic (1e6 scale) to avoid floating-point
- Efficient storage mapping structure
- Minimal on-chain computation

---

## 📊 API Endpoints

### Backend (FastAPI)

- `GET /hello` - Health check
- `POST /fit` - Train GARCH model
  ```json
  {
    "ticker": "SHOPERSTOP.BSE",
    "use_new_data": false,
    "n_observations": 2000,
    "p": 1,
    "q": 1
  }
  ```
- `POST /predict` - Generate volatility forecast
  ```json
  {
    "ticker": "SHOPERSTOP.BSE",
    "n_days": 5
  }
  ```
- `POST /submit-onchain` - Submit forecast to Mantle Network
  ```json
  {
    "ticker": "SHOPERSTOP.BSE",
    "forecast": {"2025-01-01": 0.0234, "2025-01-02": 0.0256, ...},
    "contract_address": "0x...",
    "network": "testnet"
  }
  ```

---

## 🧪 Testing

### Test Smart Contract

```bash
cd contracts
npx hardhat test
```

### Test Backend API

```bash
python test_api.py
```

### Test Frontend

```bash
cd frontend
npm run lint
npm run build
```

---

## 🚢 Deployment

### Mantle Testnet

1. Deploy contract:
   ```bash
   npx hardhat run scripts/deploy.js --network mantleTestnet
   ```

2. Authorize backend address:
   ```bash
   npx hardhat run scripts/authorize.js --network mantleTestnet
   ```

3. Update frontend env with contract address

### Mantle Mainnet

Same process, use `--network mantleMainnet`

---

## 📈 Roadmap

### Phase 1 (Current - Hackathon MVP) ✅
- [x] GARCH model training backend
- [x] On-chain oracle smart contract
- [x] Web3 frontend with wallet connection
- [x] On-chain forecast submission

### Phase 2 (Post-Hackathon)
- [ ] Multi-ticker batch forecasts
- [ ] Historical forecast accuracy tracking
- [ ] DeFi protocol integrations (Aave, Compound)
- [ ] Governance token for oracle updates
- [ ] ZK-proofs for forecast verification

### Phase 3 (Long-term)
- [ ] Cross-chain oracle (multiple L2s)
- [ ] Real-time volatility streaming
- [ ] Advanced ML models (LSTM, Transformer)
- [ ] RWA platform partnerships

---

## 🤝 Contributing

This is a hackathon submission. For post-hackathon contributions, please open an issue or PR.

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- **Mantle Network** for the hackathon platform and infrastructure
- **ARCH Library** for GARCH model implementation
- **Alpha Vantage** for market data API
- **Wagmi/Viem** for Web3 integration

---

## 📞 Contact

- **GitHub**: [Repository URL]
- **Demo**: [Live Demo URL]
- **Team**: [Team Name/Contact]

---

**Built for Mantle Global Hackathon 2025** 🏆  
**Track: RWA/RealFi + AI & Oracles**  
**Prize Pool: $150,000 USDT**

