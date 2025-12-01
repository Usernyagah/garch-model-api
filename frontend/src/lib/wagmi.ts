import { createConfig, http } from "wagmi";
import { mantle, mantleTestnet } from "wagmi/chains";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { walletConnect, injected } from "wagmi/connectors";

// Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect features will be disabled. " +
    "Get your project ID from https://cloud.walletconnect.com"
  );
}

const metadata = {
  name: "GARCH Volatility Oracle",
  description: "On-chain volatility forecasts for RWA/DeFi on Mantle",
  url: "https://garch-oracle.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmi config
export const config = createConfig({
  chains: [mantle, mantleTestnet],
  connectors: [
    ...(projectId ? [walletConnect({ projectId, metadata, showQrModal: false })] : []),
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [mantle.id]: http(),
    [mantleTestnet.id]: http(),
  },
});

// Create Web3Modal only if projectId is provided
if (projectId) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: false,
    enableOnramp: false,
  });
}

