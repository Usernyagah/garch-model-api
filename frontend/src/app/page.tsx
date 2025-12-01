/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";

type FitResponse = {
  success: boolean;
  message: string;
  ticker: string;
  use_new_data: boolean;
  n_observations: number;
  p: number;
  q: number;
};

type PredictResponse = {
  success: boolean;
  message: string;
  ticker: string;
  n_days: number;
  forecast: Record<string, number>;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8008";

export default function Home() {
  const [ticker, setTicker] = useState("SHOPERSTOP.BSE");
  const [useNewData, setUseNewData] = useState(false);
  const [nObservations, setNObservations] = useState(2000);
  const [p, setP] = useState(1);
  const [q, setQ] = useState(1);

  const [nDays, setNDays] = useState(5);

  const [fitLoading, setFitLoading] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);

  const [fitResult, setFitResult] = useState<FitResponse | null>(null);
  const [predictResult, setPredictResult] = useState<PredictResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleFit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFitLoading(true);
    setFitResult(null);

    try {
      const res = await fetch(`${API_BASE}/fit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          use_new_data: useNewData,
          n_observations: nObservations,
          p,
          q,
        }),
      });

      if (!res.ok) {
        throw new Error(`Fit failed with status ${res.status}`);
      }

      const data: FitResponse = await res.json();
      setFitResult(data);
      if (!data.success) {
        setError(data.message || "Model training failed");
      }
    } catch (err: any) {
      setError(err.message ?? "Unexpected error while training model");
    } finally {
      setFitLoading(false);
    }
  }

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPredictLoading(true);
    setPredictResult(null);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          n_days: nDays,
        }),
      });

      if (!res.ok) {
        throw new Error(`Predict failed with status ${res.status}`);
      }

      const data: PredictResponse = await res.json();
      setPredictResult(data);
      if (!data.success) {
        setError(data.message || "Forecast request failed");
      }
    } catch (err: any) {
      setError(err.message ?? "Unexpected error while forecasting");
    } finally {
      setPredictLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="relative flex min-h-screen w-full flex-col px-6 py-8 lg:px-12 lg:py-12">
        <header className="mb-12 border-b border-slate-800/50 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                  GARCH Volatility Oracle
          </h1>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
                AI-powered on-chain volatility forecasts for RWA tokenization and DeFi risk management on Mantle Network
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Mantle Hackathon 2025
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  RWA/RealFi Track
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  AI & Oracles
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <WalletConnect />
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-8">
          <section className="w-full">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-xl backdrop-blur-sm transition-all hover:border-slate-700/50 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                    <svg
                      className="h-5 w-5 text-sky-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">Model Configuration</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Configure GARCH(p, q) parameters and training data
                    </p>
                  </div>
                </div>

              <form
                onSubmit={handleFit}
                className="mt-6 grid gap-6 text-base md:grid-cols-4"
              >
                <div className="space-y-2.5 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    Ticker Symbol
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-950/80 px-4 py-3.5 text-base text-slate-100 placeholder:text-slate-500 outline-none ring-2 ring-transparent transition-all focus:border-sky-500/50 focus:bg-slate-950 focus:ring-sky-500/20"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="e.g. SHOPERSTOP.BSE"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-300">
                    Observations
                  </label>
                  <input
                    type="number"
                    min={100}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-950/80 px-4 py-3.5 text-base text-slate-100 outline-none ring-2 ring-transparent transition-all focus:border-sky-500/50 focus:bg-slate-950 focus:ring-sky-500/20"
                    value={nObservations}
                    onChange={(e) =>
                      setNObservations(Number(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-300">
                    GARCH p
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-950/80 px-4 py-3.5 text-base text-slate-100 outline-none ring-2 ring-transparent transition-all focus:border-sky-500/50 focus:bg-slate-950 focus:ring-sky-500/20"
                    value={p}
                    onChange={(e) => setP(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-300">
                    GARCH q
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-950/80 px-4 py-3.5 text-base text-slate-100 outline-none ring-2 ring-transparent transition-all focus:border-sky-500/50 focus:bg-slate-950 focus:ring-sky-500/20"
                    value={q}
                    onChange={(e) => setQ(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="flex items-center gap-4 md:col-span-4 rounded-xl border border-slate-800/50 bg-slate-950/40 p-4">
                  <button
                    type="button"
                    onClick={() => setUseNewData((v) => !v)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 transition-all ${
                      useNewData
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-600 bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        useNewData ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div className="flex-1">
                    <span className="block text-sm font-semibold text-slate-200">
                      Fetch new data from Alpha Vantage
                    </span>
                    <span className="text-xs text-slate-500">
                      Download latest market data for training
                    </span>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <button
                    type="submit"
                    disabled={fitLoading}
                    className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-sky-500 disabled:hover:to-sky-600"
                  >
                    {fitLoading ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Training model...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Train Model
                      </>
                    )}
                  </button>
                </div>
              </form>
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-xl backdrop-blur-sm transition-all hover:border-slate-700/50 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <svg
                      className="h-5 w-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">Volatility Forecast</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Generate multi-day volatility predictions
          </p>
        </div>
                </div>

                <form
                  onSubmit={handlePredict}
                  className="flex flex-col gap-6 md:flex-row md:items-end"
                >
                  <div className="flex-1 space-y-2.5">
                    <label className="block text-sm font-semibold text-slate-300">
                      Forecast Horizon (days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      className="w-full rounded-xl border border-slate-700/50 bg-slate-950/80 px-4 py-3.5 text-base text-slate-100 outline-none ring-2 ring-transparent transition-all focus:border-emerald-500/50 focus:bg-slate-950 focus:ring-emerald-500/20"
                      value={nDays}
                      onChange={(e) => setNDays(Number(e.target.value) || 0)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={predictLoading}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-emerald-500 hover:shadow-xl hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {predictLoading ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        Generate Forecast
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {error && (
            <section className="w-full">
              <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-950/20 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base text-red-100">Error</p>
                    <p className="mt-2 text-sm text-red-200/90">{error}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {fitResult && (
            <section className="w-full">
              <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      fitResult.success ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {fitResult.success ? (
                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-100">
                      Training Results
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      fitResult.success
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      fitResult.success ? "bg-emerald-400" : "bg-red-400"
                    }`} />
                    {fitResult.success ? "Success" : "Failed"}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-300">
                  {fitResult.message}
                </p>
                <dl className="grid gap-4 rounded-xl border border-slate-800/50 bg-slate-950/40 p-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ticker</dt>
                    <dd className="mt-1.5 text-base font-semibold text-slate-100">{fitResult.ticker}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Observations</dt>
                    <dd className="mt-1.5 text-base font-semibold text-slate-100">
                      {fitResult.n_observations.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">GARCH(p, q)</dt>
                    <dd className="mt-1.5 text-base font-semibold text-slate-100">
                      ({fitResult.p}, {fitResult.q})
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          )}

          {predictResult && (
            <section className="w-full">
              <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-8 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      predictResult.success ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}>
                      <svg
                        className={`h-5 w-5 ${predictResult.success ? "text-emerald-400" : "text-red-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-slate-100">
                        {predictResult.ticker}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {predictResult.n_days}-day forecast horizon
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      predictResult.success
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      predictResult.success ? "bg-emerald-400" : "bg-red-400"
                    }`} />
                    {predictResult.success ? "Success" : "Failed"}
                  </span>
                </div>

                {Object.keys(predictResult.forecast || {}).length === 0 ? (
                  <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 p-6 text-center">
                    <p className="text-sm text-slate-400">
                      No forecast values returned.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {Object.entries(predictResult.forecast).map(
                      ([date, value], index) => (
                        <div
                          key={date}
                          className="group flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-950/60 px-5 py-4 transition-all hover:border-slate-700/50 hover:bg-slate-950/80"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-xs font-semibold text-sky-400">
                              {index + 1}
                            </div>
                            <div>
                              <span className="block text-sm font-medium text-slate-200">
                                {new Date(date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="text-xs text-slate-500">
                                {date}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-base font-mono font-semibold text-sky-300">
                              {value.toFixed(6)}
                            </span>
                            <span className="text-xs text-slate-500">
                              volatility
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
        </div>
            </section>
          )}
      </main>

        <footer className="mt-12 border-t border-slate-800/50 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-300">
                GARCH Volatility Oracle
              </p>
              <p className="text-xs text-slate-500">
                Built for Mantle Global Hackathon 2025 &middot; RWA/RealFi Track
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a
                href="#"
                className="transition-colors hover:text-slate-300"
              >
                Documentation
              </a>
              <a
                href="#"
                className="transition-colors hover:text-slate-300"
              >
                GitHub
              </a>
              <a
                href="#"
                className="transition-colors hover:text-slate-300"
              >
                Mantle Network
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
