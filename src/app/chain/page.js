"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const REFRESH_INTERVAL_MS = 15_000; // 15 seconds

function isMarketOpenClient() {
  const now = new Date();
  const ist = new Date(now.getTime() + (5 * 60 + 30) * 60 * 1000);
  const day = ist.getUTCDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return mins >= 9 * 60 + 15 && mins < 15 * 60 + 30;
}

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
  const [lastUpdated, setLastUpdated] = useState(null); // Date object
  const [secondsSince, setSecondsSince] = useState(0);
  const [marketOpen, setMarketOpen] = useState(false);
  const [liveSpot, setLiveSpot] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [underlyingSecId, setUnderlyingSecId] = useState(null);
  const [ivStats, setIvStats] = useState(null);
  // Tracks whether chain REST fetch has completed for current symbol+expiry
  const chainLoadedRef = useRef(false);
  const abortRef = useRef(null);
  const atmRowRef = useRef(null);
  const isAutoRefresh = useRef(false);

  // Update market-open status every minute
  useEffect(() => {
    const tick = () => setMarketOpen(isMarketOpenClient());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Live "X seconds ago" counter
  useEffect(() => {
    if (!lastUpdated) return;
    const id = setInterval(() => {
      setSecondsSince(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  const fetchChain = useCallback(async (sym, exp, showLoader = false, autoRefresh = false) => {
    if (!exp) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    isAutoRefresh.current = autoRefresh;
    if (showLoader) setLoading(true);
    try {
      const data = await fetch(`/api/chain?symbol=${sym}&expiry=${exp}`, { signal: abortRef.current.signal }).then((r) => r.json());
      setChainData(data);
      setDataSource(data.source || "live");
      setLastUpdated(new Date());
      setSecondsSince(0);
      if (showLoader) setLoading(false);
      chainLoadedRef.current = true;
    } catch (err) {
      if (err.name !== "AbortError") {
        if (showLoader) setLoading(false);
        setDataSource("error");
      }
    }
  }, []);

  // Scroll to ATM on initial load / symbol / expiry change (not on auto-refresh)
  useEffect(() => {
    if (!chainData || isAutoRefresh.current) return;
    if (atmRowRef.current) {
      atmRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [chainData]);

  // Fetch expiries when symbol changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const data = await fetch(`/api/expiries?symbol=${symbol}`).then((r) => r.json());
        if (cancelled) return;
        setExpiries(data.expiries || []);
        if (data.expiries?.length > 0) setExpiry(data.expiries[0]);
        else { setExpiries([]); setExpiry(""); }
      } catch {
        if (!cancelled) { setExpiries([]); setExpiry(""); }
      }
    }
    load().catch(() => {});
    return () => { cancelled = true; };
  }, [symbol]);

  // Fetch chain when symbol or expiry changes (initial load)
  useEffect(() => {
    chainLoadedRef.current = false; // reset so EventSource waits for new data
    fetchChain(symbol, expiry, true);
  }, [symbol, expiry, fetchChain]);

  // Fetch IVP/IVR stats from BigQuery
  useEffect(() => {
    setIvStats(null);
    fetch(`/api/chain/iv-stats?underlying=${symbol}`)
      .then(r => r.json())
      .then(d => { if (d.ivp !== undefined) setIvStats(d); })
      .catch(() => {});
  }, [symbol]);

  // REST fallback polling: runs only when WS feed is not connected
  // Keeps chain updating every 15s if WebSocket fails
  useEffect(() => {
    if (!expiry || wsConnected) return;
    const id = setInterval(() => fetchChain(symbol, expiry, false, true), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [symbol, expiry, wsConnected, fetchChain]);

  // Real-time feed via Dhan WebSocket → SSE
  // Delayed 300ms so the initial REST chain fetch populates the shared cache first,
  // preventing /api/feed from double-calling the Dhan API.
  useEffect(() => {
    if (!expiry) return;

    setWsConnected(false);
    let es = null;
    let spotInterval = null; // declared in outer scope so cleanup can reach it

    async function pollSpot() {
      try {
        const res = await fetch(`/api/spot?symbol=${symbol}`);
        const d = await res.json();
        if (d.spot) setLiveSpot(d.spot);
      } catch {}
    }

    const timer = setTimeout(() => {
      es = new EventSource(`/api/feed?symbol=${symbol}&expiry=${expiry}`);

      es.addEventListener("snapshot", (e) => {
        const data = JSON.parse(e.data);
        setChainData(data);
        setLiveSpot(data.spot);
        setUnderlyingSecId(data.underlyingSecId ?? null);
        setLastUpdated(new Date());
        setSecondsSince(0);
        setLoading(false);
        isAutoRefresh.current = false;
      });

      es.addEventListener("tick", (e) => {
        const { secId, ltp, oi, oiChange, volume } = JSON.parse(e.data);
        setLastUpdated(new Date());
        setSecondsSince(0);

        setUnderlyingSecId((uid) => {
          if (uid !== null && secId === uid) setLiveSpot(ltp);
          return uid;
        });

        setChainData((prev) => {
          if (!prev?.chain) return prev;
          let hit = false;
          const newChain = prev.chain.map((row) => {
            if (row.ce.securityId === secId) {
              hit = true;
              return { ...row, ce: { ...row.ce, ltp,
                ...(oi       !== undefined && { oi }),
                ...(oiChange !== undefined && { oiChange }),
                ...(volume   !== undefined && { volume }),
              }};
            }
            if (row.pe.securityId === secId) {
              hit = true;
              return { ...row, pe: { ...row.pe, ltp,
                ...(oi       !== undefined && { oi }),
                ...(oiChange !== undefined && { oiChange }),
                ...(volume   !== undefined && { volume }),
              }};
            }
            return row;
          });
          return hit ? { ...prev, chain: newChain } : prev;
        });
      });

      es.addEventListener("status", (e) => {
        const { connected } = JSON.parse(e.data);
        setWsConnected(connected);
      });

      es.onerror = () => setWsConnected(false);

      // Spot fallback: poll /api/spot every 5s when WS isn't streaming ticks
      spotInterval = setInterval(() => {
        setWsConnected((connected) => {
          if (!connected) pollSpot();
          return connected;
        });
      }, 5000);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (es) es.close();
      if (spotInterval) clearInterval(spotInterval);
    };
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
                <span className="flex flex-wrap items-center gap-2">
                  Option chain for{" "}
                  <span className="text-blue-400 font-semibold">{symbol}</span>
                  {" "}— Spot:{" "}
                  <span className="text-sky-300 font-semibold font-mono">
                    ₹{(liveSpot ?? chainData?.spot)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "—"}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    marketOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {marketOpen ? "● Market Open" : "○ Market Closed"}
                  </span>
                  {wsConnected ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 animate-pulse">
                      ⚡ Live
                    </span>
                  ) : lastUpdated && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      secondsSince < 20 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      Updated {secondsSince}s ago
                    </span>
                  )}
                </span>
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
              onClick={() => fetchChain(symbol, expiry, false)}
              title="Refresh now"
              className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white glass transition-all"
            >
              ↻
            </button>
            {/* IVP / IVR */}
            {ivStats && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                ivStats.ivp >= 75 ? "bg-red-500/10 border-red-500/20 text-red-300" :
                ivStats.ivp <= 25 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                                    "bg-slate-700/40 border-white/10 text-slate-300"
              }`}>
                <span className="text-slate-500 font-normal">IVP</span>
                <span className="font-mono font-bold">{ivStats.ivp}%</span>
                <span className="text-slate-600 mx-1">·</span>
                <span className="text-slate-500 font-normal">IVR</span>
                <span className="font-mono font-bold">{ivStats.ivr}%</span>
                <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                  ivStats.ivp >= 75 ? "bg-red-500/20 text-red-400" :
                  ivStats.ivp <= 25 ? "bg-emerald-500/20 text-emerald-400" :
                                      "bg-slate-600/40 text-slate-400"
                }`}>
                  {ivStats.ivp >= 75 ? "RICH" : ivStats.ivp <= 25 ? "CHEAP" : "NORMAL"}
                </span>
              </div>
            )}
            {(liveSpot ?? chainData?.spot) && (
              <button
                onClick={() => atmRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="px-3 py-2 rounded-lg text-sm font-mono font-semibold bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/20 transition-all"
                title="Jump to ATM"
              >
                ₹{(liveSpot ?? chainData.spot).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                <span className="ml-1.5 text-[10px] text-sky-500 font-normal">↓ ATM</span>
              </button>
            )}
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
            {/* ── Straddle Premium Tracker ─────────────────────────── */}
            {chainData?.chain && (() => {
              const spot = liveSpot ?? chainData.spot;
              if (!spot) return null;
              const interval = symbol === "BANKNIFTY" ? 100 : symbol === "FINNIFTY" ? 50 : symbol === "MIDCPNIFTY" ? 25 : 50;
              const atm = Math.round(spot / interval) * interval;
              const atmRow = chainData.chain.find(r => r.strike === atm);
              if (!atmRow) return null;
              const ceLtp = typeof atmRow.ce?.ltp === "number" ? atmRow.ce.ltp : 0;
              const peLtp = typeof atmRow.pe?.ltp === "number" ? atmRow.pe.ltp : 0;
              const straddle = ceLtp + peLtp;
              const upper = spot + straddle;
              const lower = spot - straddle;
              return (
                <div className="mb-4 flex flex-wrap gap-3 items-center px-1">
                  <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ATM Straddle Premium</p>
                      <p className="text-xl font-bold font-mono text-violet-300">₹{straddle.toFixed(1)}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {atm} CE ₹{ceLtp.toFixed(1)} + PE ₹{peLtp.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Breakeven Range</p>
                      <p className="text-sm font-mono text-white font-semibold">
                        {lower.toFixed(0)} <span className="text-slate-500 mx-1">–</span> {upper.toFixed(0)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">± {straddle.toFixed(0)} pts from spot</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Move Needed</p>
                      <p className="text-sm font-mono text-white font-semibold">
                        {((straddle / spot) * 100).toFixed(2)}%
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">for straddle to break even</p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th colSpan={showGreeks ? 9 : 5} className="text-center py-3 bg-emerald-500/10 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                      CALLS (CE)
                    </th>
                    <th className="py-3 px-4 bg-blue-500/10 text-blue-400 font-semibold text-xs uppercase tracking-wider">
                      STRIKE
                    </th>
                    <th colSpan={showGreeks ? 9 : 5} className="text-center py-3 bg-rose-500/10 text-rose-400 font-semibold text-xs uppercase tracking-wider">
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
                        <th className="py-2 px-3 text-right">Vega</th>
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
                        <th className="py-2 px-3 text-left">Vega</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {chainData.chain.map((row, idx) => {
                    const spot = liveSpot ?? chainData.spot;
                    const isITMCE = row.strike < spot;
                    const isITMPE = row.strike > spot;
                    // Insert live spot line just before the strike that's >= spot
                    const prevRow = chainData.chain[idx - 1];
                    const showSpotMarker = prevRow && spot > prevRow.strike && spot <= row.strike;
                    const totalCols = showGreeks ? 19 : 11;
                    return (
                      <React.Fragment key={row.strike}>
                        {showSpotMarker && (
                          <tr key="spot-marker" style={{ height: 0 }}>
                            <td
                              colSpan={totalCols}
                              style={{ padding: 0, borderTop: "2px solid #38bdf8", position: "relative", height: 0, lineHeight: 0 }}
                            >
                              {/* Dhan-style price badge on the line */}
                              <span style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "#0ea5e9",
                                color: "#fff",
                                fontSize: "11px",
                                fontWeight: 700,
                                fontFamily: "monospace",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                whiteSpace: "nowrap",
                                letterSpacing: "0.02em",
                                boxShadow: "0 0 0 2px #0c4a6e",
                                zIndex: 10,
                                pointerEvents: "none",
                              }}>
                                ₹{spot.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              {/* Left triangle marker */}
                              <span style={{
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 0,
                                height: 0,
                                borderTop: "5px solid transparent",
                                borderBottom: "5px solid transparent",
                                borderLeft: "7px solid #38bdf8",
                              }} />
                              {/* Right triangle marker */}
                              <span style={{
                                position: "absolute",
                                right: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 0,
                                height: 0,
                                borderTop: "5px solid transparent",
                                borderBottom: "5px solid transparent",
                                borderRight: "7px solid #38bdf8",
                              }} />
                            </td>
                          </tr>
                        )}
                      <tr
                        key={row.strike}
                        ref={row.isATM ? atmRowRef : null}
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
                            <td className="py-2.5 px-3 text-right tabular-nums text-violet-400">{row.ce.vega}</td>
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
                            <td className="py-2.5 px-3 text-left tabular-nums text-violet-400">{row.pe.vega}</td>
                          </>
                        )}
                      </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data freshness note */}
        <p className="mt-3 text-xs text-slate-600 text-center">
          {wsConnected
            ? "⚡ LTP updates in real-time via WebSocket · OI & Volume refresh every ~15s (Dhan API limit: 1 req / 3s)"
            : "LTP & Spot poll every 15s · OI & Volume refresh every ~15s (Dhan API limit: 1 req / 3s)"}
        </p>
      </main>
    </div>
  );
}
