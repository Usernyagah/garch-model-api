# Deployment Guide - GARCH Volatility Oracle

## Prerequisites

1. **Node.js 18+** and **npm**
2. **Python 3.8+** and **pip**
3. **MetaMask** or compatible Web3 wallet
4. **Mantle Testnet tokens** (get from [faucet](https://faucet.testnet.mantle.xyz))

## Step 1: Environment Setup

### Backend Configuration

Create `.env` in project root:

```bash
ALPHA_API_KEY=your_alpha_vantage_key_here
DB_NAME=stocks.db
MODEL_DIRECTORY=models
PRIVATE_KEY=your_private_key_for_onchain_submission
```

Get Alpha Vantage API key: https://www.alphavantage.io/support/#api-key

### Frontend Configuration

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8008
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Will be set after deployment
```

Get WalletConnect Project ID: https://cloud.walletconnect.com

### Smart Contracts Configuration

Create `contracts/.env`:

```bash
PRIVATE_KEY=your_deployer_private_key_here
```

⚠️ **Security Note**: Never commit `.env` files with real private keys!

## Step 2: Install Dependencies

### Backend

```bash
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

### Smart Contracts

```bash
cd contracts
npm install
```

## Step 3: Deploy Smart Contract

### Compile Contracts

```bash
cd contracts
npx hardhat compile
```

### Deploy to Mantle Testnet

```bash
npx hardhat run scripts/deploy.js --network mantleTestnet
```

Expected output:
```
Deploying VolatilityOracle to Mantle Network...
VolatilityOracle deployed to: 0x...
Network: mantleTestnet
```

### Update Frontend Environment

Copy the deployed contract address and update `frontend/.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed address
```

### Authorize Backend Address

Create `contracts/scripts/authorize.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const backendAddress = process.env.BACKEND_ADDRESS; // Your backend wallet address
  
  const VolatilityOracle = await hre.ethers.getContractAt(
    "VolatilityOracle",
    contractAddress
  );
  
  const tx = await VolatilityOracle.authorizeUpdater(backendAddress);
  await tx.wait();
  
  console.log("Backend address authorized:", backendAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run:
```bash
CONTRACT_ADDRESS=0x... BACKEND_ADDRESS=0x... npx hardhat run scripts/authorize.js --network mantleTestnet
```

## Step 4: Run Application

### Terminal 1 - Backend API

```bash
uvicorn main:app --reload --host localhost --port 8008
```

Verify: http://localhost:8008/hello

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

## Step 5: Verify Deployment

### 1. Connect Wallet

- Open http://localhost:3000
- Click "Connect Wallet"
- Select Mantle Testnet in MetaMask
- Approve connection

### 2. Train Model

- Enter ticker (e.g., "SHOPERSTOP.BSE")
- Configure GARCH parameters
- Click "Train model"
- Wait for training to complete

### 3. Generate Forecast

- Enter forecast horizon (days)
- Click "Forecast"
- View volatility predictions

### 4. Submit On-Chain (Optional)

Use the backend API to submit forecasts:

```bash
curl -X POST "http://localhost:8008/submit-onchain" \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "SHOPERSTOP.BSE",
    "forecast": {"2025-01-01": 0.0234, "2025-01-02": 0.0256},
    "contract_address": "0x...",
    "network": "testnet"
  }'
```

### 5. Verify on Mantle Explorer

- Visit: https://explorer.testnet.mantle.xyz
- Search for your contract address
- View transaction history

## Production Deployment (Mainnet)

### 1. Update Network Configuration

Update `contracts/hardhat.config.js` to use mainnet RPC.

### 2. Deploy to Mantle Mainnet

```bash
npx hardhat run scripts/deploy.js --network mantleMainnet
```

### 3. Update Frontend

Update `frontend/.env.local` with mainnet contract address.

### 4. Deploy Frontend

Deploy to Vercel, Netlify, or your preferred hosting:

```bash
cd frontend
npm run build
npm run start
```

Or use Vercel:

```bash
npm i -g vercel
vercel
```

## Troubleshooting

### Contract Deployment Fails

- Check you have Mantle testnet tokens
- Verify RPC endpoint is accessible
- Check private key is correct

### Frontend Can't Connect to Backend

- Verify backend is running on port 8008
- Check CORS settings in `main.py`
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct

### Wallet Connection Issues

- Ensure MetaMask is installed
- Add Mantle Testnet network to MetaMask:
  - Network Name: Mantle Testnet
  - RPC URL: https://rpc.testnet.mantle.xyz
  - Chain ID: 5001
  - Currency Symbol: MNT

### On-Chain Submission Fails

- Verify backend address is authorized
- Check you have sufficient MNT for gas
- Verify contract address is correct
- Check forecast format (must be dict with date strings)

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use separate wallets for deployment and operations
- [ ] Verify contract code before mainnet deployment
- [ ] Test thoroughly on testnet first
- [ ] Use hardware wallet for mainnet deployment
- [ ] Review authorized updater addresses regularly

## Support

For issues or questions:
- Open an issue on GitHub
- Check Mantle documentation: https://docs.mantle.xyz
- Join Mantle Discord: [Mantle Community]

---

**Happy Deploying! 🚀**

