"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Plus, Sparkles, RotateCcw, CalendarDays, Clock, Play, ChevronDown, Zap, Activity } from "lucide-react";
import PayoffChart from "@/components/PayoffChart";
import StrategyLegRow from "@/components/StrategyLegRow";
import GreeksPanel from "@/components/GreeksPanel";
import TradeMetricsBar from "@/components/TradeMetricsBar";
import ReplayControls from "@/components/ReplayControls";
import AdjustmentLedger from "@/components/AdjustmentLedger";
import AIMonitorModal from "@/components/AIMonitorModal";
import UpgradeBanner from "@/components/UpgradeBanner";
import { generatePayoffData, netPremium, calculatePOP } from "@/lib/options/payoff";
// blackScholesPrice / impliedVolatility no longer used here — livePnl derives from payoffResult directly
import { getAllTemplates, generateStrategyLegs } from "@/lib/options/strategies";
import { generateCampaignFromRealCloses, generateHistoricalCampaign } from "@/lib/data/historicalStreamer";
import { useAuth } from "@/context/AuthContext";
import { checkAndIncrementSimulationLimit } from "@/lib/firebase/userService";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_LEG = {
  type: "CE", action: "BUY", strike: 22500, premium: 150, lots: 1, lotSize: 50,
};

const SENTIMENT_EMOJI = {
  "Bullish": "📈", "Bearish": "📉",
  "Moderately Bullish": "↗️", "Moderately Bearish": "↘️",
  "Volatile (Direction uncertain)": "⚡", "Volatile": "⚡",
  "Neutral / Low Volatility": "🎯", "Neutral / Range-bound": "〰️",
  "Neutral / Decreasing Volatility": "📐", "Neutral / Pinning": "📌",
  "Mildly Bullish": "↗️",
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function calcExpiryPnL(legsArray, finalSpot) {
  return legsArray.reduce((pnl, leg) => {
    const mult = leg.action === "BUY" ? 1 : -1;
    const intrinsic = leg.type === "CE"
      ? Math.max(0, finalSpot - leg.strike)
      : Math.max(0, leg.strike - finalSpot);
    return pnl + (intrinsic - leg.premium) * mult * leg.lots * leg.lotSize;
  }, 0);
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  return (
    <ProtectedRoute>
      <SimulatorContent />
    </ProtectedRoute>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function SimulatorContent() {
  // ── Replay state ──────────────────────────────────────────────────────────
  const [targetDate,   setTargetDate]   = useState("2024-01-15");
  const [expiryDate,   setExpiryDate]   = useState("2024-01-25");
  const [playbackData, setPlaybackData] = useState([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [speed,        setSpeed]        = useState(1);
  const [mounted,      setMounted]      = useState(false);
  const [dataSource,   setDataSource]   = useState("real"); // "real" | "simulation"
  const [isLoading,    setIsLoading]    = useState(false);

  // ── Strategy state ────────────────────────────────────────────────────────
  const [legs,         setLegs]         = useState([]);
  const [initialLegs,  setInitialLegs]  = useState([]);
  const [underlying,   setUnderlying]   = useState("NIFTY");
  const [adjustments,  setAdjustments]  = useState([]);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState("");
  const [showGreeks,   setShowGreeks]   = useState(false);

  const templates   = getAllTemplates();
  const playIntervalRef = useRef(null);

  const { currentUser, userProfile, updateLocalProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    loadHistoricalDay();
  }, []);

  // ── Load simulation ────────────────────────────────────────────────────────
  const loadHistoricalDay = useCallback(async () => {
    if (authLoading) return;
    if (!currentUser) { router.push("/login"); return; }

    const usageCheck = await checkAndIncrementSimulationLimit(currentUser.uid);
    if (!usageCheck.allowed) {
      setPaywallMessage(usageCheck.message);
      setIsPaywallOpen(true);
      return;
    }
    if (userProfile?.simulationsRunToday !== undefined) {
      updateLocalProfile({ simulationsRunToday: userProfile.simulationsRunToday + 1 });
    }

    setIsPlaying(false);
    setCurrentMinute(0);
    setIsLoading(true);

    let diffDays = Math.ceil((new Date(expiryDate) - new Date(targetDate)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) diffDays = 1;
    if (diffDays > 30) diffDays = 30;

    // ── Try BigQuery real data first ──────────────────────────────────────────
    let campaignData = null;
    let resolvedAtm  = 22500;
    let resolvedSource = "simulation";

    try {
      const params = new URLSearchParams({
        underlying,
        startDate:  targetDate,
        endDate:    expiryDate,
        expiryDate: expiryDate,
      });
      const res  = await fetch(`/api/simulator/day?${params}`);
      const json = await res.json();

      if (json.dataSource === "real" && json.days?.length > 0) {
        campaignData   = generateCampaignFromRealCloses(json.days);
        resolvedAtm    = json.atmStrike || Math.round(json.days[0].close / 50) * 50;
        resolvedSource = "real";

        // Seed strategy legs with real NSE premiums if available
        if (json.options?.length > 0) {
          const optMap = {};
          for (const o of json.options) optMap[`${o.strike}_${o.type}`] = o;

          const rawLegs = generateStrategyLegs("iron-condor", resolvedAtm);
          const realLegs = rawLegs.map((leg) => {
            const key  = `${leg.strike}_${leg.type}`;
            const real = optMap[key];
            return {
              ...leg,
              lotSize: underlying === "BANKNIFTY" ? 30 : underlying === "FINNIFTY" ? 65 : 75,
              premium: real ? parseFloat(real.ltp.toFixed(2)) : leg.premium,
              expiry:  expiryDate,
            };
          });
          setLegs(realLegs);
          setInitialLegs(realLegs);
        }
      }
    } catch (_) {
      // Fall through to simulation below
    }

    // ── Fallback: pure GBM simulation ─────────────────────────────────────────
    if (!campaignData) {
      campaignData   = generateHistoricalCampaign(targetDate, diffDays, 22500);
      resolvedAtm    = Math.round(campaignData[0].spot / 50) * 50;
      resolvedSource = "simulation";

      const fallbackLegs = generateStrategyLegs("iron-condor", resolvedAtm)
        .map((leg) => ({ ...leg, expiry: expiryDate }));
      setLegs(fallbackLegs);
      setInitialLegs(fallbackLegs);
    }

    setDataSource(resolvedSource);
    setPlaybackData(campaignData);
    setIsLoading(false);
    setIsModalOpen(false);
    setAdjustments([{
      day: 1, time: "09:15", spot: campaignData[0].spot,
      action: "START",
      message: `${resolvedSource === "real" ? "📊 Real NSE" : "🔬 Simulated"} replay: ${targetDate} → ${expiryDate}`,
    }]);
  }, [targetDate, expiryDate, underlying, currentUser, authLoading, router, userProfile, updateLocalProfile]);

  // ── Playback loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying && playbackData.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentMinute((prev) => {
          if (prev >= playbackData.length - 2) {
            setIsPlaying(false);
            setIsModalOpen(true);
            return playbackData.length - 1;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, speed, playbackData]);

  // ── Derived tick values ────────────────────────────────────────────────────
  const currentTick = playbackData[currentMinute] ?? { spot: 22500, time: "09:15", dayIndex: 1, totalDays: 1 };
  const initialSpot = playbackData[0]?.spot ?? 22500;
  const liveSpot    = currentTick.spot;

  // ── Leg mutations ──────────────────────────────────────────────────────────
  const logAdjustment = useCallback((action, message) => {
    setAdjustments((prev) => [...prev, {
      day: currentTick.dayIndex ?? 1,
      time: currentTick.time ?? "09:15",
      spot: liveSpot, action, message,
    }]);
  }, [currentTick, liveSpot]);

  const addLeg = useCallback(() => {
    const atm = Math.round(liveSpot / 50) * 50;
    setLegs((prev) => [...prev, { ...DEFAULT_LEG, strike: atm, premium: 100 }]);
    logAdjustment("ADD", `Opened new BUY CE at ${atm}`);
  }, [liveSpot, logAdjustment]);

  const removeLeg = useCallback((index) => {
    setLegs((prev) => {
      const t = prev[index];
      if (t) logAdjustment("REMOVE", `Closed ${t.action} ${t.type} at ${t.strike}`);
      return prev.filter((_, i) => i !== index);
    });
  }, [logAdjustment]);

  const updateLeg = useCallback((index, updated) => {
    setLegs((prev) => prev.map((l, i) => (i === index ? updated : l)));
  }, []);

  const loadTemplate = useCallback((key) => {
    const atm  = Math.round(liveSpot / 50) * 50;
    const legs = generateStrategyLegs(key, atm);
    if (legs.length) {
      setLegs(legs);
      logAdjustment("UPDATE", `Deployed ${key.toUpperCase()} template`);
    }
  }, [liveSpot, logAdjustment]);

  const resetAll = useCallback(() => {
    const atm = Math.round(liveSpot / 50) * 50;
    setLegs([{ ...DEFAULT_LEG, strike: atm }]);
    logAdjustment("REMOVE", "Cleared all legs");
  }, [liveSpot, logAdjustment]);

  const jumpToNextDay = useCallback(() => {
    setCurrentMinute((prev) => {
      for (let i = prev + 1; i < playbackData.length; i++) {
        if (playbackData[i].isNewDay) return i;
      }
      setIsModalOpen(true);
      return playbackData.length - 1;
    });
  }, [playbackData]);

  // ── Analytics ──────────────────────────────────────────────────────────────
  const daysToExpiry = useMemo(() => {
    const dte      = (currentTick.totalDays ?? 1) - (currentTick.dayIndex ?? 1);
    const timeVal  = parseFloat((currentTick.time ?? "15:30").replace(":", "."));
    const intraDay = Math.max(0, 15.5 - timeVal) / 24;
    return Math.max(0.01, dte + intraDay);
  }, [currentTick]);

  // Derive live P&L directly from the payoff chart data — single source of truth,
  // guarantees the top-card number is always in sync with the chart.
  const livePnl = useMemo(() => {
    if (!payoffResult.data || payoffResult.data.length === 0) return 0;
    // Find the data point whose price is closest to liveSpot
    let closest = payoffResult.data[0];
    let minDiff = Math.abs(liveSpot - closest.price);
    for (const point of payoffResult.data) {
      const diff = Math.abs(liveSpot - point.price);
      if (diff < minDiff) { minDiff = diff; closest = point; }
    }
    // Use t0Pnl (current mark-to-market with time value) when DTE > 0,
    // fall back to expiry pnl at expiry.
    const val = daysToExpiry > 0.01
      ? (closest.t0Pnl ?? closest.pnl)
      : closest.pnl;
    return isNaN(val) ? 0 : val;
  }, [payoffResult.data, liveSpot, daysToExpiry]);

  const payoffResult = useMemo(
    () => generatePayoffData(legs, initialSpot, 10, 200, daysToExpiry),
    [legs, initialSpot, daysToExpiry]
  );

  const premium = useMemo(() => netPremium(legs), [legs]);

  const pop = useMemo(
    () => calculatePOP(payoffResult.data, initialSpot, daysToExpiry, 0.20),
    [payoffResult.data, initialSpot, daysToExpiry]
  );

  const riskReward = useMemo(() => {
    const p = payoffResult.maxProfit;
    const l = Math.abs(payoffResult.maxLoss);
    if (l === 0 || l === Infinity) return "∞";
    if (p === Infinity) return "1 : ∞";
    return `1 : ${(p / l).toFixed(2)}`;
  }, [payoffResult]);

  const payoffWithPop = useMemo(() => ({ ...payoffResult, pop }), [payoffResult, pop]);

  const initialPnL  = useMemo(() => calcExpiryPnL(initialLegs, liveSpot), [initialLegs, liveSpot]);
  const adjustedPnL = useMemo(() => calcExpiryPnL(legs, liveSpot), [legs, liveSpot]);

  const pnlUp = livePnl >= 0;
  const spotUp = liveSpot >= initialSpot;

  if (!mounted) return null;

  const hasData = playbackData.length > 0;

  return (
    <div className="min-h-screen bg-[#080C16] pb-28">
      <main className="pt-20 pb-4 px-6 lg:px-10 max-w-[1440px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-5 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-blue-500/15 text-blue-400 border border-blue-500/25">
              <CalendarDays className="w-3 h-3" /> Time-Machine Replay
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Options Simulator</h1>
          <p className="text-sm text-slate-400 mt-0.5">Replay historical trading days tick-by-tick and practise strategy adjustments in real time.</p>
          {hasData && (
            <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${
              dataSource === "real"
                ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                : "bg-amber-500/15 border-amber-500/25 text-amber-400"
            }`}>
              {dataSource === "real" ? "📊 Real NSE Bhavcopy Data" : "🔬 GBM Simulation (BigQuery unavailable)"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ══ LEFT: live analytics ══ */}
          <div className="lg:col-span-3 space-y-4">

            {/* Compact live status strip */}
            <div className="bg-white/3 border border-white/10 rounded-2xl px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left cluster: clock + spot + change + day */}
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Market Time</p>
                    <p className="text-lg font-mono font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {currentTick.time}
                      {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{underlying} Spot</p>
                    <p className={`text-lg font-mono font-bold ${spotUp ? "text-emerald-400" : "text-rose-400"}`}>
                      ₹{liveSpot.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Change</p>
                    <p className={`text-lg font-mono font-bold ${spotUp ? "text-emerald-400" : "text-rose-400"}`}>
                      {spotUp ? "+" : ""}{(liveSpot - initialSpot).toFixed(2)} pts
                    </p>
                  </div>
                  {hasData && (
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Campaign</p>
                      <p className="text-sm font-bold text-slate-300">
                        Day {currentTick.dayIndex}/{currentTick.totalDays}
                      </p>
                    </div>
                  )}
                </div>

                {/* P&L badge */}
                <div className={`px-5 py-2.5 rounded-xl border font-mono font-black text-2xl tracking-tight transition-colors ${
                  pnlUp
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                }`}>
                  {pnlUp ? "+" : "−"}₹{Math.abs(livePnl).toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Payoff chart */}
            <PayoffChart
              data={payoffResult.data}
              breakevens={payoffResult.breakevens}
              spotPrice={initialSpot}
              liveSpot={liveSpot}
            />

            {/* Trade metrics */}
            <TradeMetricsBar payoff={payoffWithPop} />

            {/* Net premium pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${
              premium >= 0
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/25 text-rose-400"
            }`}>
              <span>Net {premium >= 0 ? "Credit" : "Debit"}</span>
              <span className="tabular-nums">
                {premium >= 0 ? "+" : "−"}₹{Math.abs(premium).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Greeks (collapsible) */}
            <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowGreeks((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5 uppercase tracking-widest">
                  <Zap className="w-3 h-3" /> Live Position Greeks
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showGreeks ? "rotate-180" : ""}`} />
              </button>
              {showGreeks && (
                <div className="px-5 pb-4">
                  <GreeksPanel legs={legs} spotPrice={liveSpot} />
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT: setup + strategy builder + ledger ══ */}
          <div className="lg:col-span-2 space-y-4">

            {/* ── Simulation setup card ── */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Simulation Setup
              </p>

              {/* Underlying */}
              <div className="mb-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Underlying</p>
                <div className="flex gap-2">
                  {["NIFTY", "BANKNIFTY", "FINNIFTY"].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnderlying(u)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        underlying === u
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                          : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Entry Date</p>
                  <input
                    type="date"
                    value={targetDate}
                    min="2016-01-04"
                    max="2024-06-03"
                    onChange={(e) => setTargetDate(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Expiry Date</p>
                  <input
                    type="date"
                    value={expiryDate}
                    min="2016-01-04"
                    max="2024-06-03"
                    onChange={(e) => setExpiryDate(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="col-span-2 text-[9px] text-slate-600 text-center -mt-1">
                  Real NSE data: Jan 2016 – Jun 2024
                </p>
              </div>

              <button
                onClick={loadHistoricalDay}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-900/30 active:scale-[0.98]"
              >
                {isLoading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading NSE Data…</>
                  : <><Play className="w-4 h-4" /> Start Simulation</>
                }
              </button>

              {hasData && (
                <p className="text-[10px] text-slate-600 text-center mt-2">
                  {playbackData.length} ticks · {currentTick.totalDays} day campaign
                </p>
              )}
            </div>

            {/* ── Strategy builder ── */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Strategy Builder
                <span className="ml-auto px-2 py-0.5 rounded-full bg-white/8 text-slate-400 text-[10px]">
                  {legs.length} leg{legs.length !== 1 ? "s" : ""}
                </span>
              </p>

              {/* Template dropdown */}
              <select
                defaultValue=""
                onChange={(e) => { if (e.target.value) { loadTemplate(e.target.value); e.target.value = ""; } }}
                style={{ colorScheme: "dark" }}
                className="w-full h-8 bg-white/5 border border-white/10 rounded-lg px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-white/20 transition-colors mb-3"
              >
                <option value="" disabled>Load strategy template…</option>
                {templates.map((t) => (
                  <option key={t.key} value={t.key}>
                    {SENTIMENT_EMOJI[t.sentiment] ?? "📊"} {t.name}
                  </option>
                ))}
              </select>

              {/* Leg table */}
              {legs.length === 0 ? (
                <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-white/10 rounded-lg mb-3">
                  No legs — load a template or add manually
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/8 rounded-xl px-3 py-2 space-y-0.5 mb-3">
                  {/* Column headers */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="shrink-0 w-5" />
                    <span className="shrink-0 w-7  text-[9px] font-semibold text-slate-600 uppercase tracking-widest text-center">Act</span>
                    <span className="shrink-0 w-9  text-[9px] font-semibold text-slate-600 uppercase tracking-widest text-center">Type</span>
                    <span className="flex-[2]      text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Strike</span>
                    <span className="flex-[1.5]    text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Prem ₹</span>
                    <span className="shrink-0 w-10 text-[9px] font-semibold text-slate-600 uppercase tracking-widest text-center">Qty</span>
                    <span className="shrink-0      text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Lot</span>
                    <span className="shrink-0 w-6 ml-auto" />
                  </div>
                  {legs.map((leg, i) => (
                    <StrategyLegRow key={i} leg={leg} index={i} onChange={updateLeg} onRemove={removeLeg} />
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={addLeg}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-[0.98]"
                >
                  <Plus className="w-3 h-3" /> Add Leg
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-all"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>

            {/* ── Adjustment ledger ── */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Adjustment Log
              </p>
              <div className="max-h-72 overflow-y-auto">
                <AdjustmentLedger adjustments={adjustments} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed bottom replay controls */}
      <ReplayControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((v) => !v)}
        speed={speed}
        onSpeedChange={setSpeed}
        currentMinute={currentMinute}
        totalMinutes={playbackData.length > 0 ? playbackData.length - 1 : 375}
        dayIndex={currentTick.dayIndex}
        totalDays={currentTick.totalDays}
        onSeek={setCurrentMinute}
        onNextDay={jumpToNextDay}
        timeString={currentTick.time}
      />

      <AIMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPnL={initialPnL}
        adjustedPnL={adjustedPnL}
        adjustmentsCount={adjustments.length > 1 ? adjustments.length - 1 : 0}
      />

      <UpgradeBanner
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        message={paywallMessage}
      />
    </div>
  );
}
