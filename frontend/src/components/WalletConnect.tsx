"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing wallet state after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show consistent UI during SSR and initial client render
  if (!mounted) {
    return (
      <button
        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
        disabled
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          Connect Wallet
        </span>
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-emerald-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="rounded-xl border border-slate-700/50 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:border-slate-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
    >
      <span className="relative z-10 flex items-center gap-2">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        Connect Wallet
      </span>
    </button>
  );
}

