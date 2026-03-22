"use client";

import { useState, useEffect, useCallback } from "react";

function formatNum(n) {
  if (n === undefined || n === null) return "—";
  if (Math.abs(n) >= 10000000) return (n / 10000000).toFixed(2) + " Cr";
  if (Math.abs(n) >= 100000) return (n / 100000).toFixed(2) + " L";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + " K";
  return n.toLocaleString();
}

const SYMBOLS = [
  { symbol: "NIFTY", lotSize: 75 },
  { symbol: "BANKNIFTY", lotSize: 15 },
  { symbol: "FINNIFTY", lotSize: 25 },
];

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ChainPage() {
  return (
    <ProtectedRoute>
      <ChainContent />
    </ProtectedRoute>
  );
}

function ChainContent() {
  const [symbol, setSymbol] = useState("NIFTY");
  const [expiries, setExpiries] = useState([]);
  const [expiry, setExpiry] = useState("");
  const [chainData, setChainData] = useState(null);
  const [showGreeks, setShowGreeks] = useState(false);
  const [dataSource, setDataSource] = useState("loading");
  const [loading, setLoading] = useState(true);

  // Fetch expiries when symbol changes
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/expiries?symbol=${symbol}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setExpiries(data.expiries || []);
        if (data.expiries?.length > 0) {
          setExpiry(data.expiries[0]);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setExpiries([]);
        setExpiry("");
      });
    return () => controller.abort();
  }, [symbol]);

  // Fetch chain data when symbol or expiry changes
  useEffect(() => {
    if (!expiry) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/chain?symbol=${symbol}&expiry=${expiry}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setChainData(data);
        setDataSource(data.source || "live");
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
        setDataSource("error");
      });
    return () => controller.abort();
  }, [symbol, expiry]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!expiry) return;
    let refreshController = null;
    const interval = setInterval(() => {
      refreshController?.abort();
      refreshController = new AbortController();
      fetch(`/api/chain?symbol=${symbol}&expiry=${expiry}`, { signal: refreshController.signal })
        .then((r) => r.json())
        .then((data) => {
          setChainData(data);
          setDataSource(data.source || "live");
        })
        .catch((err) => { if (err.name !== "AbortError") console.error("[chain refresh]", err); });
    }, 30000);
    return () => { clearInterval(interval); refreshController?.abort(); };
  }, [symbol, expiry]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Option Chain</h1>
            <p className="text-slate-400">
              {loading ? "Loading..." : (
                <>
                  Option chain with OI, IV, Greeks for{" "}
                  <span className="text-blue-400 font-semibold">{symbol}</span> — Spot: ₹
                  {chainData?.spot?.toLocaleString() || "—"}
                  <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                    dataSource === "live" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {dataSource === "live" ? "● LIVE" : "● CACHED (60s)"}
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm"
            >
              {SYMBOLS.map((u) => (
                <option key={u.symbol} value={u.symbol}>
                  {u.symbol} (Lot: {u.lotSize})
                </option>
              ))}
            </select>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm"
            >
              {expiries.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
            <button
              onClick={() => setShowGreeks(!showGreeks)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showGreeks
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "glass text-slate-400 hover:text-white"
              }`}
            >
              {showGreeks ? "Hide Greeks" : "Show Greeks"}
            </button>
          </div>
        </div>

        {/* Loading or Chain Table */}
        {loading || !chainData ? (
          <div className="glass-card rounded-2xl p-16 flex items-center justify-center">
            <div className="animate-pulse text-slate-500 text-lg">Loading option chain...</div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th colSpan={showGreeks ? 8 : 5} className="text-center py-3 bg-emerald-500/10 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                      CALLS (CE)
                    </th>
                    <th className="py-3 px-4 bg-blue-500/10 text-blue-400 font-semibold text-xs uppercase tracking-wider">
                      STRIKE
                    </th>
                    <th colSpan={showGreeks ? 8 : 5} className="text-center py-3 bg-rose-500/10 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                      PUTS (PE)
                    </th>
                  </tr>
                  <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="py-2 px-3 text-right">OI</th>
                    <th className="py-2 px-3 text-right">Chg OI</th>
                    <th className="py-2 px-3 text-right">Volume</th>
                    <th className="py-2 px-3 text-right">IV%</th>
                    <th className="py-2 px-3 text-right font-bold text-emerald-500">LTP</th>
                    {showGreeks && (
                      <>
                        <th className="py-2 px-3 text-right">Delta</th>
                        <th className="py-2 px-3 text-right">Gamma</th>
                        <th className="py-2 px-3 text-right">Theta</th>
                      </>
                    )}
                    <th className="py-2 px-3 text-center font-bold text-blue-400">STRIKE</th>
                    <th className="py-2 px-3 text-left font-bold text-rose-500">LTP</th>
                    <th className="py-2 px-3 text-left">IV%</th>
                    <th className="py-2 px-3 text-left">Volume</th>
                    <th className="py-2 px-3 text-left">Chg OI</th>
                    <th className="py-2 px-3 text-left">OI</th>
                    {showGreeks && (
                      <>
                        <th className="py-2 px-3 text-left">Delta</th>
                        <th className="py-2 px-3 text-left">Gamma</th>
                        <th className="py-2 px-3 text-left">Theta</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {chainData.chain.map((row) => {
                    const isITMCE = row.strike < chainData.spot;
                    const isITMPE = row.strike > chainData.spot;
                    return (
                      <tr
                        key={row.strike}
                        className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                          row.isATM ? "bg-blue-500/10 border-blue-500/20" : ""
                        }`}
                      >
                        <td className={`py-2.5 px-3 text-right tabular-nums ${isITMCE ? "bg-emerald-500/5" : ""}`}>
                          {formatNum(row.ce.oi)}
                        </td>
                        <td className={`py-2.5 px-3 text-right tabular-nums ${row.ce.oiChange > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {row.ce.oiChange > 0 ? "+" : ""}{formatNum(row.ce.oiChange)}
                        </td>
                        <td className={`py-2.5 px-3 text-right tabular-nums text-slate-500 ${isITMCE ? "bg-emerald-500/5" : ""}`}>
                          {formatNum(row.ce.volume)}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                          {row.ce.iv}%
                        </td>
                        <td className={`py-2.5 px-3 text-right tabular-nums font-semibold ${isITMCE ? "text-emerald-400 bg-emerald-500/5" : "text-white"}`}>
                          {typeof row.ce.ltp === "number" ? row.ce.ltp.toFixed(2) : row.ce.ltp}
                        </td>
                        {showGreeks && (
                          <>
                            <td className="py-2.5 px-3 text-right tabular-nums text-blue-400">{row.ce.delta}</td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-blue-400">{row.ce.gamma}</td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-amber-400">{row.ce.theta}</td>
                          </>
                        )}

                        <td className={`py-2.5 px-3 text-center font-bold tabular-nums ${row.isATM ? "text-blue-400 text-base" : "text-slate-300"}`}>
                          {row.strike.toLocaleString()}
                          {row.isATM && <span className="ml-1 text-[10px] text-blue-500 font-normal">ATM</span>}
                        </td>

                        <td className={`py-2.5 px-3 text-left tabular-nums font-semibold ${isITMPE ? "text-rose-400 bg-rose-500/5" : "text-white"}`}>
                          {typeof row.pe.ltp === "number" ? row.pe.ltp.toFixed(2) : row.pe.ltp}
                        </td>
                        <td className="py-2.5 px-3 text-left tabular-nums text-slate-400">
                          {row.pe.iv}%
                        </td>
                        <td className={`py-2.5 px-3 text-left tabular-nums text-slate-500 ${isITMPE ? "bg-rose-500/5" : ""}`}>
                          {formatNum(row.pe.volume)}
                        </td>
                        <td className={`py-2.5 px-3 text-left tabular-nums ${row.pe.oiChange > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {row.pe.oiChange > 0 ? "+" : ""}{formatNum(row.pe.oiChange)}
                        </td>
                        <td className={`py-2.5 px-3 text-left tabular-nums ${isITMPE ? "bg-rose-500/5" : ""}`}>
                          {formatNum(row.pe.oi)}
                        </td>
                        {showGreeks && (
                          <>
                            <td className="py-2.5 px-3 text-left tabular-nums text-blue-400">{row.pe.delta}</td>
                            <td className="py-2.5 px-3 text-left tabular-nums text-blue-400">{row.pe.gamma}</td>
                            <td className="py-2.5 px-3 text-left tabular-nums text-amber-400">{row.pe.theta}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
