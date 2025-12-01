# Quick Start Guide - GARCH Volatility Oracle

## 🚀 5-Minute Setup

### 1. Install Dependencies

```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend && npm install

# Contracts
cd ../contracts && npm install
```

### 2. Configure Environment

**Backend** (`.env`):
```bash
ALPHA_API_KEY=your_key_here
PRIVATE_KEY=your_private_key_here
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8008
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

**Contracts** (`contracts/.env`):
```bash
PRIVATE_KEY=your_deployer_key_here
```

### 3. Deploy Contract (Testnet)

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network mantleTestnet
```

Copy the deployed address to `frontend/.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 4. Run Application

**Terminal 1 - Backend:**
```bash
uvicorn main:app --reload --port 8008
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Use the App

1. Visit http://localhost:3000
2. Connect your MetaMask wallet (Mantle Testnet)
3. Train a GARCH model
4. Generate volatility forecast
5. (Optional) Submit forecast on-chain

## 🎯 What You Get

- ✅ AI-powered volatility forecasts (GARCH models)
- ✅ On-chain oracle on Mantle Network
- ✅ Web3 dashboard with wallet integration
- ✅ Ready for DeFi protocol integration

## 📖 Full Documentation

- **[HACKATHON_README.md](./HACKATHON_README.md)** - Complete guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment
- **[PITCH.md](./PITCH.md)** - Project pitch

---

**Built for Mantle Global Hackathon 2025** 🏆

