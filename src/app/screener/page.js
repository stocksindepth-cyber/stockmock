"use client";

import { useState, useEffect, useMemo } from "react";
const UNDERLYINGS = [{symbol: "NIFTY"}, {symbol: "BANKNIFTY"}, {symbol: "FINNIFTY"}];
import { Search, Filter, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const SCAN_TYPES = [
  { key: "high-iv-calls", label: "High IV Calls", desc: "Calls with IV > 20% — good for selling" },
  { key: "high-iv-puts", label: "High IV Puts", desc: "Puts with IV > 20% — good for selling" },
  { key: "high-oi-buildup", label: "OI Build-up", desc: "Strikes with largest OI increase" },
  { key: "oi-unwinding", label: "OI Unwinding", desc: "Strikes with largest OI decrease" },
  { key: "itm-high-volume", label: "High Volume ITM", desc: "In-the-money options with high volume" },
  { key: "iron-condor-setup", label: "Iron Condor Setups", desc: "Strikes suited for iron condor (high OI at support/resistance)" },
];

function scanResults(chain, spot, scanType) {
  switch (scanType) {
    case "high-iv-calls":
      return chain
        .filter((r) => r.ce.iv > 20)
        .sort((a, b) => b.ce.iv - a.ce.iv)
        .slice(0, 15)
        .map((r) => ({
          strike: r.strike, side: "CE", iv: r.ce.iv, ltp: r.ce.ltp, oi: r.ce.oi,
          signal: "SELL", signalColor: "text-rose-400",
          reason: `IV ${r.ce.iv}% is elevated — premium selling opportunity`,
        }));
    case "high-iv-puts":
      return chain
        .filter((r) => r.pe.iv > 20)
        .sort((a, b) => b.pe.iv - a.pe.iv)
        .slice(0, 15)
        .map((r) => ({
          strike: r.strike, side: "PE", iv: r.pe.iv, ltp: r.pe.ltp, oi: r.pe.oi,
          signal: "SELL", signalColor: "text-rose-400",
          reason: `IV ${r.pe.iv}% is elevated — premium selling opportunity`,
        }));
    case "high-oi-buildup":
      return [...chain]
        .sort((a, b) => (b.ce.oiChange + b.pe.oiChange) - (a.ce.oiChange + a.pe.oiChange))
        .slice(0, 15)
        .map((r) => ({
          strike: r.strike, side: "CE+PE",
          iv: `${r.ce.iv}/${r.pe.iv}`,
          ltp: `${r.ce.ltp}/${r.pe.ltp}`,
          oi: r.ce.oi + r.pe.oi,
          oiChange: r.ce.oiChange + r.pe.oiChange,
          signal: "BUILDUP", signalColor: "text-emerald-400",
          reason: `Strong OI buildup — confirms trend continuation`,
        }));
    case "oi-unwinding":
      return [...chain]
        .sort((a, b) => (a.ce.oiChange + a.pe.oiChange) - (b.ce.oiChange + b.pe.oiChange))
        .slice(0, 15)
        .map((r) => ({
          strike: r.strike, side: "CE+PE",
          iv: `${r.ce.iv}/${r.pe.iv}`,
          ltp: `${r.ce.ltp}/${r.pe.ltp}`,
          oi: r.ce.oi + r.pe.oi,
          oiChange: r.ce.oiChange + r.pe.oiChange,
          signal: "UNWINDING", signalColor: "text-amber-400",
          reason: `OI dropping — possible trend reversal or profit booking`,
        }));
    case "itm-high-volume":
      return chain
        .filter((r) => r.strike < spot)
        .sort((a, b) => b.ce.volume - a.ce.volume)
        .slice(0, 10)
        .map((r) => ({
          strike: r.strike, side: "CE (ITM)", iv: r.ce.iv, ltp: r.ce.ltp, oi: r.ce.oi,
          volume: r.ce.volume,
          signal: "ACTIVE", signalColor: "text-blue-400",
          reason: `High volume ITM call — institutional activity likely`,
        }));
    case "iron-condor-setup":
      const sortedByOI = [...chain].sort((a, b) => b.ce.oi - a.ce.oi);
      const topCEOI = sortedByOI.filter((r) => r.strike > spot).slice(0, 3);
      const sortedPutOI = [...chain].sort((a, b) => b.pe.oi - a.pe.oi);
      const topPEOI = sortedPutOI.filter((r) => r.strike < spot).slice(0, 3);
      return [
        ...topCEOI.map((r) => ({
          strike: r.strike, side: "CE (Sell)", iv: r.ce.iv, ltp: r.ce.ltp, oi: r.ce.oi,
          signal: "RESISTANCE", signalColor: "text-rose-400",
          reason: `High CE OI = resistance — sell call here for iron condor`,
        })),
        ...topPEOI.map((r) => ({
          strike: r.strike, side: "PE (Sell)", iv: r.pe.iv, ltp: r.pe.ltp, oi: r.pe.oi,
          signal: "SUPPORT", signalColor: "text-emerald-400",
          reason: `High PE OI = support — sell put here for iron condor`,
        })),
      ];
    default:
      return [];
  }
}

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ScreenerPage() {
  return (
    <ProtectedRoute>
      <ScreenerContent />
    </ProtectedRoute>
  );
}

function ScreenerContent() {
  const [symbol, setSymbol] = useState("NIFTY");
  const [activeScan, setActiveScan] = useState("high-iv-calls");
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    fetch(`/api/expiries?symbol=${symbol}`, { signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.expiries?.length > 0) {
          return fetch(`/api/chain?symbol=${symbol}&expiry=${data.expiries[0]}`, { signal });
        }
        throw new Error("No expiries found");
      })
      .then((r) => r.json())
      .then((data) => {
        setChainData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Failed to load live screening data:", err);
        setChainData(null);
        setLoading(false);
      });
    return () => controller.abort();
  }, [symbol]);

  const results = useMemo(() => {
    if (!chainData || !chainData.chain) return [];
    return scanResults(chainData.chain, chainData.spot, activeScan);
  }, [chainData, activeScan]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Strategy Screener</h1>
            <p className="text-slate-400">Scan for trading setups — high IV, OI buildup, Iron Condor setups, and more.</p>
          </div>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm w-fit"
          >
            {UNDERLYINGS.map((u) => (
              <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
            ))}
          </select>
        </div>

        {/* Scan Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {SCAN_TYPES.map((scan) => (
            <button
              key={scan.key}
              onClick={() => setActiveScan(scan.key)}
              className={`p-4 rounded-xl text-left transition-all ${
                activeScan === scan.key
                  ? "glass-card border-blue-500/40 bg-blue-500/10"
                  : "glass hover:bg-white/5"
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${activeScan === scan.key ? "text-blue-300" : "text-white"}`}>
                {scan.label}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">{scan.desc}</p>
            </button>
          ))}
        </div>

        {/* Results Table */}
        {chainData && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-slate-300">
                Found <span className="text-white font-bold">{results.length}</span> results for{" "}
                <span className="text-blue-400">{SCAN_TYPES.find((s) => s.key === activeScan)?.label}</span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 text-left">Strike</th>
                    <th className="py-3 px-4 text-left">Side</th>
                    <th className="py-3 px-4 text-right">IV%</th>
                    <th className="py-3 px-4 text-right">LTP</th>
                    <th className="py-3 px-4 text-right">OI</th>
                    <th className="py-3 px-4 text-center">Signal</th>
                    <th className="py-3 px-4 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white font-semibold tabular-nums">{r.strike}</td>
                      <td className="py-3 px-4 text-slate-300">{r.side}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">{r.iv}%</td>
                      <td className="py-3 px-4 text-right text-white tabular-nums">₹{typeof r.ltp === "number" ? r.ltp.toFixed(2) : r.ltp}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">{(r.oi / 100000).toFixed(1)}L</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.signalColor} bg-white/5`}>
                          {r.signal}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs max-w-[300px]">{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
