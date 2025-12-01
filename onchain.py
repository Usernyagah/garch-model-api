"""
On-chain integration for submitting GARCH volatility forecasts to Mantle Network
Part of Mantle Global Hackathon 2025 - RWA/RealFi Track
"""
import os
from web3 import Web3
from typing import List, Dict
import json

# Mantle Network RPC endpoints
MANTLE_TESTNET_RPC = os.getenv("MANTLE_TESTNET_RPC", "https://rpc.testnet.mantle.xyz")
MANTLE_MAINNET_RPC = os.getenv("MANTLE_MAINNET_RPC", "https://rpc.mantle.xyz")

# Contract ABI (simplified - full ABI should be loaded from artifacts)
VOLATILITY_ORACLE_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "ticker", "type": "string"},
            {"internalType": "uint256[]", "name": "volatilities", "type": "uint256[]"},
            {"internalType": "uint256", "name": "nDays", "type": "uint256"}
        ],
        "name": "submitForecast",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "ticker", "type": "string"}],
        "name": "getLatestForecastId",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]


class OnChainOracle:
    """Handle on-chain volatility forecast submissions to Mantle Network"""
    
    def __init__(self, contract_address: str, private_key: str, network: str = "testnet"):
        """
        Initialize on-chain oracle client
        
        Args:
            contract_address: Deployed VolatilityOracle contract address
            private_key: Private key of authorized updater account
            network: 'testnet' or 'mainnet'
        """
        rpc_url = MANTLE_TESTNET_RPC if network == "testnet" else MANTLE_MAINNET_RPC
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        if not self.w3.is_connected():
            raise ConnectionError(f"Failed to connect to Mantle {network}")
        
        self.contract_address = Web3.to_checksum_address(contract_address)
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=VOLATILITY_ORACLE_ABI
        )
        
        self.account = self.w3.eth.account.from_key(private_key)
        self.network = network
    
    def submit_forecast(
        self, 
        ticker: str, 
        forecast: Dict[str, float],
        gas_price: int = None
    ) -> str:
        """
        Submit volatility forecast to on-chain oracle
        
        Args:
            ticker: Stock ticker symbol
            forecast: Dictionary mapping dates to volatility values
            gas_price: Optional gas price in wei
            
        Returns:
            Transaction hash
        """
        # Convert volatility values to fixed-point (scaled by 1e6)
        volatilities = [int(v * 1e6) for v in forecast.values()]
        n_days = len(volatilities)
        
        # Build transaction
        transaction = self.contract.functions.submitForecast(
            ticker,
            volatilities,
            n_days
        ).build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 500000,  # Adjust based on forecast size
            "gasPrice": gas_price or self.w3.eth.gas_price,
        })
        
        # Sign and send transaction
        signed_txn = self.w3.eth.account.sign_transaction(
            transaction, 
            self.account.key
        )
        
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        # Wait for receipt
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt.status != 1:
            raise Exception(f"Transaction failed: {tx_hash.hex()}")
        
        return receipt.transactionHash.hex()
    
    def get_latest_forecast_id(self, ticker: str) -> int:
        """Get latest forecast ID for a ticker"""
        return self.contract.functions.getLatestForecastId(ticker).call()


def submit_forecast_to_chain(
    ticker: str,
    forecast: Dict[str, float],
    contract_address: str,
    private_key: str,
    network: str = "testnet"
) -> str:
    """
    Convenience function to submit forecast to Mantle Network
    
    Args:
        ticker: Stock ticker symbol
        forecast: Dictionary mapping dates to volatility values
        contract_address: Deployed VolatilityOracle contract address
        private_key: Private key of authorized account
        network: 'testnet' or 'mainnet'
        
    Returns:
        Transaction hash
    """
    oracle = OnChainOracle(contract_address, private_key, network)
    return oracle.submit_forecast(ticker, forecast)

