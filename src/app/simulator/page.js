"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Plus, Sparkles, RotateCcw, CalendarDays, Clock } from "lucide-react";
import PayoffChart from "@/components/PayoffChart";
import StrategyLegRow from "@/components/StrategyLegRow";
import GreeksPanel from "@/components/GreeksPanel";
import ReplayControls from "@/components/ReplayControls";
import AdjustmentLedger from "@/components/AdjustmentLedger";
import AIMonitorModal from "@/components/AIMonitorModal";
import UpgradeBanner from "@/components/UpgradeBanner";
import { generatePayoffData, netPremium, calculatePOP } from "@/lib/options/payoff";
import { blackScholesPrice, impliedVolatility } from "@/lib/options/greeks";
import { getAllTemplates, generateStrategyLegs } from "@/lib/options/strategies";
import { generateHistoricalCampaign } from "@/lib/data/historicalStreamer";
import { useAuth } from "@/context/AuthContext";
import { checkAndIncrementSimulationLimit } from "@/lib/firebase/userService";
import { useRouter } from "next/navigation";

const DEFAULT_LEG = {
  type: "CE",
  action: "BUY",
  strike: 22500,
  premium: 150,
  lots: 1,
  lotSize: 50,
};

// Helper: Calculate absolute P&L at Expiry based on intrinsic value
function calcExpiryPnL(legsArray, finalSpot) {
  return legsArray.reduce((pnl, leg) => {
    const mult = leg.action === "BUY" ? 1 : -1;
    let intrinsic = 0;
    if (leg.type === "CE") intrinsic = Math.max(0, finalSpot - leg.strike);
    if (leg.type === "PE") intrinsic = Math.max(0, leg.strike - finalSpot);
    const profitPerContract = (intrinsic - leg.premium) * mult;
    return pnl + (profitPerContract * leg.lots * leg.lotSize);
  }, 0);
}

import ProtectedRoute from "@/components/ProtectedRoute";

export default function SimulatorPage() {
  return (
    <ProtectedRoute>
      <SimulatorContent />
    </ProtectedRoute>
  );
}

function SimulatorContent() {
  // Replay State
  const [targetDate, setTargetDate] = useState("2024-03-15");
  const [expiryDate, setExpiryDate] = useState("2024-03-21");
  const [playbackData, setPlaybackData] = useState([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Strategy State
  const [legs, setLegs] = useState([]);
  const [initialLegs, setInitialLegs] = useState([]);
  const [underlying, setUnderlying] = useState("NIFTY");
  const [adjustments, setAdjustments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState("");
  const [isBuilderExpanded, setIsBuilderExpanded] = useState(false);
  const templates = getAllTemplates();

  const { currentUser, userProfile, updateLocalProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  const playIntervalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // Auto-load a day on mount to show the UI populated
    loadHistoricalDay();
  }, []);

  const loadHistoricalDay = useCallback(async () => {
    // 1. Paywall & Auth Check
    if (authLoading) return;
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const usageCheck = await checkAndIncrementSimulationLimit(currentUser.uid);
    if (!usageCheck.allowed) {
      setPaywallMessage(usageCheck.message);
      setIsPaywallOpen(true);
      return;
    }

    // 2. Adjust local UI state to reflect new limit
    if (userProfile?.simulationsRunToday !== undefined) {
      updateLocalProfile({ simulationsRunToday: userProfile.simulationsRunToday + 1 });
    }

    // 3. Launch Simulation
    setIsPlaying(false);
    setCurrentMinute(0);
    
    const start = new Date(targetDate);
    const end = new Date(expiryDate);
    let diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Bounds constraints
    if (diffDays <= 0) diffDays = 1;
    if (diffDays > 30) diffDays = 30; // Max 30-day campaign

    const campaignData = generateHistoricalCampaign(targetDate, diffDays, 22500);
    setPlaybackData(campaignData);
    // Auto-load Iron Condor at the opening spot price
    const initialSpot = campaignData[0].spot;
    const atm = Math.round(initialSpot / 50) * 50;
    const initialStrat = generateStrategyLegs("iron-condor", atm);
    // Explicitly add expiry to the legs to model Theta Decay accurately
    const templatedLegs = initialStrat.map(leg => ({ ...leg, expiry: expiryDate }));
    
    setLegs(templatedLegs);
    setInitialLegs(templatedLegs);
    setIsModalOpen(false);
    setAdjustments([{
      day: 1,
      time: "09:15",
      spot: initialSpot,
      action: "START",
      message: `Started Simulation from ${targetDate} to ${expiryDate}`
    }]);
  }, [targetDate, expiryDate, currentUser, authLoading, router, userProfile, updateLocalProfile]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying && playbackData.length > 0) {
      const msPerTick = 1000 / speed; // 1 real second = 1 historical minute @ 1x speed
      playIntervalRef.current = setInterval(() => {
        setCurrentMinute((prev) => {
          if (prev >= playbackData.length - 2) {
            setIsPlaying(false);
            setIsModalOpen(true);
            return playbackData.length - 1;
          }
          return prev + 1;
        });
      }, msPerTick);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, speed, playbackData]);

  // Derivations based on current playback time
  const currentTick = playbackData[currentMinute] || { spot: 22500, time: "09:15", dayIndex: 1, totalDays: 1 };
  const initialSpot = playbackData[0]?.spot || 22500;
  const liveSpot = currentTick.spot;

  const jumpToNextDay = useCallback(() => {
    setCurrentMinute((prev) => {
      for (let i = prev + 1; i < playbackData.length; i++) {
        if (playbackData[i].isNewDay) return i;
      }
      setIsModalOpen(true);
      return playbackData.length - 1; // Reached end of simulation
    });
  }, [playbackData]);

  const logAdjustment = useCallback((action, message) => {
    setAdjustments(prev => [...prev, {
      day: currentTick.dayIndex || 1,
      time: currentTick.time || "09:15",
      spot: liveSpot,
      action,
      message
    }]);
  }, [currentTick, liveSpot]);

  const addLeg = useCallback(() => {
    const atm = Math.round(liveSpot / 50) * 50;
    setLegs((prev) => [
      ...prev,
      { ...DEFAULT_LEG, strike: atm, premium: 100 },
    ]);
    logAdjustment("ADD", `Opened new 1 lot BUY CE at ${atm} strike`);
  }, [liveSpot, logAdjustment]);

  const removeLeg = useCallback((index) => {
    setLegs((prev) => {
      const target = prev[index];
      if (target) {
        logAdjustment("REMOVE", `Closed ${target.action} ${target.type} at ${target.strike} strike`);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, [logAdjustment]);

  const updateLeg = useCallback((index, updated) => {
    setLegs((prev) => prev.map((leg, i) => (i === index ? updated : leg)));
  }, []);

  const loadTemplate = useCallback(
    (key) => {
      const atm = Math.round(liveSpot / 50) * 50;
      const newLegs = generateStrategyLegs(key, atm);
      if (newLegs.length > 0) {
        setLegs(newLegs);
        logAdjustment("UPDATE", `Deployed ${key.toUpperCase()} template`);
      }
    },
    [liveSpot, logAdjustment]
  );

  const resetAll = useCallback(() => {
    const atm = Math.round(liveSpot / 50) * 50;
    setLegs([{ ...DEFAULT_LEG, strike: atm }]);
    logAdjustment("REMOVE", "Cleared all legs from strategy");
  }, [liveSpot, logAdjustment]);

  const daysToExpiry = useMemo(() => {
    const dte = (currentTick.totalDays || 1) - (currentTick.dayIndex || 1);
    const timeVal = parseFloat((currentTick.time || "15:30").replace(':', '.'));
    const intraDayLeft = Math.max(0, 15.5 - timeVal) / 24;
    return Math.max(0.01, dte + intraDayLeft);
  }, [currentTick]);

  const livePnl = useMemo(() => {
    let pnl = 0;
    if (daysToExpiry > 0.01) {
      legs.forEach(leg => {
          const S0 = Number(initialSpot) || 22500;
          const S_live = Number(liveSpot) || S0;
          const K = Number(leg.strike);
          const prem = Number(leg.premium) || 0.1;
          const T = Number(daysToExpiry) / 365;
          const type = leg.type === "PE" ? "PE" : "CE";
          
          let iv = impliedVolatility(prem, S0, T, 0.07, type);
          if (isNaN(iv) || iv <= 0) iv = 0.2; // Fallback IV if divergence occurs
          
          let newPrice = blackScholesPrice(S_live, K, T, 0.07, iv, type);
          if (isNaN(newPrice)) newPrice = prem; // Fallback to 0 PnL for this leg if BS fails
          
          const mult = leg.action === "BUY" ? 1 : -1;
          const qty = (Number(leg.lots) || 1) * (Number(leg.lotSize) || 50);
          pnl += (newPrice - prem) * mult * qty;
      });
    } else {
      pnl = calcExpiryPnL(legs, liveSpot);
    }
    
    const finalRounded = Math.round(pnl);
    return isNaN(finalRounded) ? 0 : finalRounded;
  }, [legs, liveSpot, daysToExpiry, initialSpot]);

  const payoffResult = useMemo(
    () => generatePayoffData(legs, initialSpot, 10, 200, daysToExpiry),
    [legs, initialSpot, daysToExpiry]
  );

  const premium = useMemo(() => netPremium(legs), [legs]);
  
  const pop = useMemo(() => {
    return calculatePOP(payoffResult.data, initialSpot, daysToExpiry, 0.20);
  }, [payoffResult.data, initialSpot, daysToExpiry]);

  const riskReward = useMemo(() => {
     const p = payoffResult.maxProfit;
     const l = Math.abs(payoffResult.maxLoss);
     if (l === 0 || l === Infinity) return "∞";
     if (p === Infinity) return "1 : ∞";
     return `1 : ${(p / l).toFixed(2)}`;
  }, [payoffResult.maxProfit, payoffResult.maxLoss]);

  const initialPnL = useMemo(() => calcExpiryPnL(initialLegs, liveSpot), [initialLegs, liveSpot]);
  const adjustedPnL = useMemo(() => calcExpiryPnL(legs, liveSpot), [legs, liveSpot]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <CalendarDays className="w-3.5 h-3.5" />
              Time-Machine Replay
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Options Simulator</h1>
            <p className="text-slate-400">Replay historical trading days tick-by-tick and watch your strategies perform dynamically.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Underlying</label>
              <select
                value={underlying}
                onChange={(e) => setUnderlying(e.target.value)}
                className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm"
              >
                <option value="NIFTY">NIFTY 50</option>
                <option value="BANKNIFTY">BANK NIFTY</option>
                <option value="FINNIFTY">FIN NIFTY</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Entry Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Expiry Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={loadHistoricalDay}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shrink-0 whitespace-nowrap"
                >
                  Start Simulation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Status Bar */}
        <div className="glass-card rounded-2xl p-4 md:p-6 mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-10">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Market Time</p>
                <p className="text-2xl font-mono text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  {currentTick.time}
                  {isPlaying && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse ml-1" />}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">NIFTY Spot</p>
                <p className={`text-2xl font-bold font-mono ${liveSpot > initialSpot ? "text-emerald-400" : "text-rose-400"}`}>
                  ₹{liveSpot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Intraday Change</p>
                <p className={`text-2xl font-bold font-mono ${liveSpot >= initialSpot ? "text-emerald-400" : "text-rose-400"}`}>
                  {liveSpot >= initialSpot ? "+" : ""}{(liveSpot - initialSpot).toFixed(2)} pts
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Live Strategy P&L</p>
               <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 shadow-2xl transition-colors ${
                 livePnl >= 0 
                   ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                   : "bg-rose-500/10 border-rose-500/30 text-rose-400"
               }`}>
                  <span className="text-3xl font-bold font-mono tracking-tight">
                    {livePnl >= 0 ? "+" : "-"}₹{Math.abs(livePnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Collapsible Strategy Builder */}
        <div className="mb-8 p-4 glass-card rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <button 
            onClick={() => setIsBuilderExpanded(!isBuilderExpanded)}
            className="w-full flex items-center justify-between hover:opacity-80 transition-opacity group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Strategy Builder & Adjustments</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400">
                {legs.length} Legs Active
              </span>
            </div>
            <div className="text-sm font-medium text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              {isBuilderExpanded ? "Collapse ▲" : "Expand to Edit ▼"}
            </div>
          </button>

          {isBuilderExpanded && (
            <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Strategy Templates */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => loadTemplate(t.key)}
                      className="px-4 py-2 text-xs font-medium rounded-full glass hover:bg-blue-500/20 hover:text-blue-300 text-slate-400 transition-all border border-white/5 hover:border-blue-500/30"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Legs + Ledger */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-3 mb-6">
                    {legs.map((leg, i) => (
                      <StrategyLegRow
                        key={i}
                        leg={leg}
                        index={i}
                        onChange={updateLeg}
                        onRemove={removeLeg}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={addLeg} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                      <Plus className="w-4 h-4" /> Add Leg
                    </button>
                    <button onClick={resetAll} className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-slate-400 hover:text-white text-sm font-medium transition-all">
                      <RotateCcw className="w-4 h-4" /> Clear Strategy
                    </button>
                  </div>
                </div>
                
                <div className="lg:col-span-1 h-[400px] lg:h-auto">
                  <AdjustmentLedger adjustments={adjustments} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payoff Chart */}
        <PayoffChart data={payoffResult.data} breakevens={payoffResult.breakevens} spotPrice={initialSpot} liveSpot={liveSpot} />

        {/* Strategy Metrics Panel (Dhan-style) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 p-6 glass-card rounded-2xl border border-white/5 shadow-xl text-center md:text-left">
          <div>
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Max Profit</p>
             <p className="text-xl font-bold font-mono text-emerald-400">
               {payoffResult.maxProfit === Infinity ? "Unlimited" : `₹${payoffResult.maxProfit.toLocaleString()}`}
             </p>
          </div>
          <div>
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Max Loss</p>
             <p className="text-xl font-bold font-mono text-rose-400">
               {payoffResult.maxLoss === -Infinity ? "Unlimited" : `₹${Math.abs(payoffResult.maxLoss).toLocaleString()}`}
             </p>
          </div>
          <div>
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Risk:Reward Ratio</p>
             <p className="text-xl font-bold font-mono text-white">
               {riskReward}
             </p>
          </div>
          <div>
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">POP</p>
             <p className="text-xl font-bold font-mono text-blue-400">
               {pop.toFixed(2)}%
             </p>
          </div>
          <div>
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Net Premium</p>
             <p className={`text-xl font-bold font-mono ${premium >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
               {premium >= 0 ? "+" : "-"}₹{Math.abs(premium).toLocaleString(undefined, { maximumFractionDigits: 2 })}
             </p>
          </div>
        </div>

        {/* Greeks Panel */}
        <div className="mt-8 mb-20">
          <h3 className="text-lg font-semibold text-white mb-4">Live Position Greeks</h3>
          <GreeksPanel legs={legs} spotPrice={liveSpot} />
        </div>

      </main>

      {/* Persistent Replay Controls */}
      <ReplayControls 
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
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
      
      {/* AI Post-Mortem Coach */}
      <AIMonitorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPnL={initialPnL}
        adjustedPnL={adjustedPnL}
        adjustmentsCount={adjustments.length > 1 ? adjustments.length - 1 : 0}
      />

      {/* Freemium Paywall */}
      <UpgradeBanner 
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        message={paywallMessage}
      />
    </div>
  );
}
