"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { getAllTemplates } from "@/lib/options/strategies";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell
} from "recharts";
import {
  Play, TrendingUp, TrendingDown, Activity, StopCircle, Calendar,
  Database, Wifi, WifiOff, Info, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { checkAndIncrementSimulationLimit } from "@/lib/firebase/userService";
import UpgradeBanner from "@/components/UpgradeBanner";
import ProtectedRoute from "@/components/ProtectedRoute";
import DhanReferralBanner from "@/components/DhanReferralBanner";

// ─── Tooltips ────────────────────────────────────────────────────────────────

function BacktestTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-lg p-3 border border-white/10 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{d.entryDate || `Trade #${d.cycle}`}</p>
      <p className={d.pnl >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
        P&L: ₹{d.pnl?.toLocaleString()}
      </p>
      {d.entrySpot && (
        <p className="text-slate-400 text-xs mt-1">Entry Spot: {d.entrySpot}</p>
      )}
      {d.cumulativePnl !== undefined && (
        <p className="text-slate-300 mt-1">Cumulative: ₹{d.cumulativePnl?.toLocaleString()}</p>
      )}
    </div>
  );
}

function PatternTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-lg p-3 border border-white/10 text-sm shadow-xl">
      <p className="text-white font-medium mb-1">{d.name}</p>
      <p className={d.pnl >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
        P&L: ₹{d.pnl?.toLocaleString()}
      </p>
      <p className="text-slate-400 text-xs mt-1">Trades: {d.trades}</p>
    </div>
  );
}

// ─── Data Source Badge ────────────────────────────────────────────────────────

function DataSourceBadge({ dataSource, dataNote, coverage }) {
  const [showDetail, setShowDetail] = useState(false);
  const isReal = dataSource === "real";
  const isNoData = dataSource === "no_data";

  if (!dataSource) return null;

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm mb-6 ${
      isReal
        ? "bg-emerald-500/10 border-emerald-500/30"
        : isNoData
        ? "bg-amber-500/10 border-amber-500/30"
        : "bg-slate-700/40 border-slate-600/30"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isReal ? (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <WifiOff className="w-4 h-4 text-slate-400" />
          )}
          <span className={`font-semibold ${isReal ? "text-emerald-300" : isNoData ? "text-amber-300" : "text-slate-300"}`}>
            {isReal ? "📡 Live NSE Data" : isNoData ? "⚠ No Data Found" : "🔬 Simulation Mode"}
          </span>
          {isReal && coverage && (
            <span className="text-slate-400 text-xs hidden md:inline">
              · {coverage.trading_days?.toLocaleString()} trading days available
            </span>
          )}
        </div>
        <button
          onClick={() => setShowDetail((v) => !v)}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          {showDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {showDetail && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-xs text-slate-400">
          <p>{dataNote}</p>
          {coverage && (
            <p>
              Coverage: <span className="text-white">{coverage.earliest_date?.value || coverage.earliest_date}</span>
              {" "}→{" "}
              <span className="text-white">{coverage.latest_date?.value || coverage.latest_date}</span>
            </p>
          )}
          {!isReal && (
            <p className="text-slate-500 mt-1">
              Historical NSE data not available. Contact support to enable full backtest access.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Expiry Payoff Chart ───────────────────────────────────────────────────────

function computeExpiryPayoff(legs, centerSpot, steps = 60) {
  const strikes = legs.map((l) => l.strike);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);
  const spread = Math.max(maxStrike - minStrike, centerSpot * 0.06);
  const spotMin = Math.round(centerSpot - spread * 1.2);
  const spotMax = Math.round(centerSpot + spread * 1.2);
  const step = (spotMax - spotMin) / steps;
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const spot = spotMin + i * step;
    let pnl = 0;
    for (const leg of legs) {
      const intrinsic = leg.type === "CE"
        ? Math.max(spot - leg.strike, 0)
        : Math.max(leg.strike - spot, 0);
      pnl += leg.action === "BUY"
        ? (intrinsic - leg.entry) * leg.qty
        : (leg.entry - intrinsic) * leg.qty;
    }
    data.push({ spot: Math.round(spot), pnl: Math.round(pnl) });
  }
  return data;
}

function TradePayoffChart({ trade }) {
  if (!trade.legs?.length || !trade.legs[0].qty) return null;
  const payoff = computeExpiryPayoff(trade.legs, trade.exitSpot || trade.atmStrike);
  const maxAbs = Math.max(...payoff.map((d) => Math.abs(d.pnl)), 1);
  return (
    <div className="mt-3 pt-3 border-t border-white/5">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">
        Payoff at Expiry · Actual exit spot: {trade.exitSpot?.toLocaleString()}
      </p>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={payoff} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis dataKey="spot" hide />
          <YAxis domain={[-maxAbs * 1.1, maxAbs * 1.1]} hide />
          <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
          <ReferenceLine
            x={trade.exitSpot}
            stroke={trade.pnl >= 0 ? "#34d399" : "#f87171"}
            strokeWidth={1.5}
            strokeDasharray="4 2"
            label={{ value: "Exit", position: "top", fill: "#94a3b8", fontSize: 9 }}
          />
          <Line
            type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={1.5}
            dot={false} isAnimationActive={false}
          />
          <Tooltip
            formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "P&L at expiry"]}
            labelFormatter={(s) => `Spot: ${Number(s).toLocaleString("en-IN")}`}
            contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Month Group ──────────────────────────────────────────────────────────────

function MonthGroup({ group, underlying, expandedTrade, setExpandedTrade }) {
  const [open, setOpen] = useState(true);
  const winPct = group.winRate;

  return (
    <div>
      {/* Month header */}
      <div
        className="flex items-center justify-between px-5 py-3 bg-slate-900/50 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
          <div>
            <span className="text-sm font-semibold text-white">{group.label}</span>
            <span className="text-xs text-slate-500 ml-2">
              {group.trades.length} trade{group.trades.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500">
            <span className="text-emerald-400 font-mono">{group.wins}W</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-rose-400 font-mono">{group.losses}L</span>
            <span className="text-slate-500 ml-1">({winPct}%)</span>
          </span>
          <span className={`font-mono font-semibold ${group.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {group.totalPnL >= 0 ? "+" : ""}₹{group.totalPnL.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Trades within month */}
      {open && (
        <div className="divide-y divide-white/3 pl-4">
          <div className="grid grid-cols-5 md:grid-cols-6 gap-3 px-4 py-1.5 text-[10px] text-slate-700 uppercase tracking-widest font-semibold">
            <span>#</span><span>Entry Date</span>
            <span className="hidden md:block">Expiry</span>
            <span className="hidden lg:block">Entry Spot</span>
            <span>P&L</span><span>Cumulative</span>
          </div>
          {group.trades.map((trade) => (
            <TradeRow
              key={trade.cycle}
              trade={trade}
              underlying={underlying}
              expanded={expandedTrade === trade.cycle}
              onToggle={() => setExpandedTrade(expandedTrade === trade.cycle ? null : trade.cycle)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Trade Detail Row ─────────────────────────────────────────────────────────

function TradeRow({ trade, expanded, onToggle, underlying }) {
  const router = useRouter();
  const [weekDays, setWeekDays] = useState(null);
  const [loadingDays, setLoadingDays] = useState(false);

  // Lazy-load real daily spot path when trade is expanded
  useEffect(() => {
    if (!expanded || weekDays !== null || loadingDays) return;
    setLoadingDays(true);
    (async () => {
      try {
        const p = new URLSearchParams({
          underlying,
          startDate:  trade.entryDate,
          endDate:    trade.expiryDate,
          expiryDate: trade.expiryDate,
        });
        const res  = await fetch(`/api/simulator/day?${p}`);
        const json = await res.json();
        setWeekDays(json.dataSource === "real" && json.days?.length > 0 ? json.days : []);
      } catch { setWeekDays([]); }
      setLoadingDays(false);
    })();
  }, [expanded, underlying, trade.entryDate, trade.expiryDate, weekDays, loadingDays]);

  function openInSimulator(e) {
    e.stopPropagation();
    const payload = {
      underlying,
      entryDate:  trade.entryDate,
      expiryDate: trade.expiryDate,
      entrySpot:  trade.entrySpot,
      atmStrike:  trade.atmStrike,
      legs: trade.legs.map((l) => ({
        type:    l.type,
        action:  l.action,
        strike:  l.strike,
        premium: l.entry,
        lots:    l.lots || 1,
        lotSize: l.qty ? Math.round(l.qty / (l.lots || 1)) : 75,
      })),
    };
    try { sessionStorage.setItem("backtestReplay", JSON.stringify(payload)); } catch {}
    router.push("/simulator?from=backtest");
  }

  return (
    <div
      className="border border-white/5 rounded-lg overflow-hidden cursor-pointer"
      onClick={onToggle}
    >
      <div className={`grid grid-cols-5 md:grid-cols-6 gap-3 items-center px-4 py-2.5 text-sm ${trade.pnl >= 0 ? "bg-emerald-500/5" : "bg-rose-500/5"}`}>
        <span className="text-slate-500 font-mono text-xs">{trade.cycle}</span>
        <span className="text-slate-300 text-xs">{trade.entryDate}</span>
        <span className="text-slate-400 text-xs hidden md:block">{trade.expiryDate}</span>
        <span className="text-slate-400 text-xs hidden lg:block">{trade.entrySpot?.toLocaleString()}</span>
        <span className={`font-mono font-semibold text-xs ${trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl?.toLocaleString()}
        </span>
        <span className="flex items-center justify-between gap-1">
          <span className={`font-mono text-xs ${trade.cumulativePnl >= 0 ? "text-emerald-500/70" : "text-rose-500/70"}`}>
            {trade.cumulativePnl >= 0 ? "+" : ""}₹{trade.cumulativePnl?.toLocaleString()}
          </span>
          <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} />
        </span>
      </div>

      {expanded && trade.legs && (
        <div className="px-4 py-3 bg-slate-900/60 border-t border-white/5 space-y-3">

          {/* Leg detail table */}
          <div>
            <div className="grid grid-cols-5 gap-2 text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
              <span>Strike</span><span>Type</span><span>Action</span><span>Entry</span><span>Exit · P&L</span>
            </div>
            {trade.legs.map((leg, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 text-xs text-slate-300 py-1 border-t border-white/5">
                <span className="font-mono">{leg.strike}</span>
                <span className={leg.type === "CE" ? "text-blue-400" : "text-amber-400"}>{leg.type}</span>
                <span className={leg.action === "SELL" ? "text-rose-400" : "text-emerald-400"}>{leg.action}</span>
                <span className="font-mono">₹{leg.entry?.toFixed(1)}</span>
                <span className="font-mono">
                  ₹{leg.exit?.toFixed(1)} ·{" "}
                  <span className={leg.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {leg.pnl >= 0 ? "+" : ""}₹{leg.pnl?.toLocaleString()}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Day-by-day spot path */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Week Spot Path
              {loadingDays && <span className="text-slate-600 normal-case tracking-normal ml-1">fetching…</span>}
            </p>
            {weekDays && weekDays.length > 0 ? (
              <div className="grid gap-0.5">
                {weekDays.map((day, i) => {
                  const isEntry  = day.date === trade.entryDate;
                  const isExpiry = day.date === trade.expiryDate;
                  const delta    = day.close - weekDays[0].close;
                  const pct      = ((delta / weekDays[0].close) * 100).toFixed(2);
                  return (
                    <div
                      key={day.date}
                      className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                        isEntry  ? "bg-blue-500/10 text-blue-300" :
                        isExpiry ? "bg-emerald-500/10 text-emerald-300" :
                                   "text-slate-400"
                      }`}
                    >
                      <span className="font-mono w-32">
                        {new Date(day.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                        {isEntry  && <span className="ml-1.5 text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded">Entry</span>}
                        {isExpiry && <span className="ml-1.5 text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded">Expiry</span>}
                      </span>
                      <span className="font-mono">{day.close.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      <span className={`font-mono text-right w-20 ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {delta >= 0 ? "+" : ""}{delta.toFixed(0)} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : weekDays !== null && !loadingDays ? (
              <p className="text-xs text-slate-600">Spot data not available for this date range.</p>
            ) : null}
          </div>

          {/* Payoff chart */}
          <TradePayoffChart trade={trade} />

          {/* Replay button */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-3">
            <button
              onClick={openInSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Replay in Simulator
            </button>
            <span className="text-[10px] text-slate-600">
              Practice this exact setup · {trade.entryDate} → {trade.expiryDate} · ATM {trade.atmStrike?.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export default function BacktestPage() {
  return (
    <ProtectedRoute>
      <BacktestContent />
    </ProtectedRoute>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function BacktestContent() {
  const templates = getAllTemplates();
  const [selectedStrategy, setSelectedStrategy] = useState("iron-condor");
  const [underlying, setUnderlying] = useState("NIFTY");
  const [timeframe, setTimeframe] = useState("3Y");
  const [customStartDate, setCustomStartDate] = useState("2022-01-01");
  const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryType, setExpiryType] = useState("Weekly");
  const [slippage, setSlippage] = useState(0.5);

  // Streaming state — populated progressively as SSE events arrive
  const [trades,      setTrades]      = useState([]);   // accumulates on "trades" events
  const [summary,     setSummary]     = useState(null); // set on "complete"
  const [meta,        setMeta]        = useState(null); // coverage + date range
  const [isRunning,   setIsRunning]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [statusMsg,   setStatusMsg]   = useState("");
  const [streamError, setStreamError] = useState(null);
  const [mounted,     setMounted]     = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [expandedTrade, setExpandedTrade] = useState(null);
  const [showTradeLog,  setShowTradeLog]  = useState(false);
  const [tradeLogView,  setTradeLogView]  = useState("list"); // "list" | "month"

  const abortRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => setMounted(true), []);

  // Compute date range from timeframe selector
  const { startDate, endDate } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    if (timeframe === "Custom") {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    const years = timeframe === "1Y" ? 1 : timeframe === "3Y" ? 3 : 5;
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return { startDate: d.toISOString().split("T")[0], endDate: today };
  }, [timeframe, customStartDate, customEndDate]);

  // Pattern analytics derived from streamed trades
  const { dayPatternData, monthPatternData, aiMacroContext } = useMemo(() => {
    if (!trades.length) return { dayPatternData: [], monthPatternData: [], aiMacroContext: "" };
    const dayMap = {}, monthMap = {};
    trades.forEach((t) => {
      if (!dayMap[t.dayOfWeek])  dayMap[t.dayOfWeek]  = { name: t.dayOfWeek,  pnl: 0, trades: 0 };
      if (!monthMap[t.month])    monthMap[t.month]     = { name: t.month,      pnl: 0, trades: 0 };
      dayMap[t.dayOfWeek].pnl  += t.pnl; dayMap[t.dayOfWeek].trades  += 1;
      monthMap[t.month].pnl    += t.pnl; monthMap[t.month].trades    += 1;
    });
    const daysOrder   = ["Mon","Tue","Wed","Thu","Fri"];
    const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const dPattern = Object.values(dayMap).sort((a,b) => daysOrder.indexOf(a.name)   - daysOrder.indexOf(b.name));
    const mPattern = Object.values(monthMap).sort((a,b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));

    let ctx = "";
    if (startDate <= "2020-05-01") {
      ctx = "Period includes the COVID-19 crash (Q1 2020). NSE data shows IV spiking to 80%+ which devastated short-vega strategies.";
    } else if (startDate <= "2022-03-01") {
      ctx = "Period covers the Russia-Ukraine onset (Feb 2022). NSE options saw elevated IV and wider bid-ask spreads during this macro event.";
    } else {
      ctx = "This timeframe represents post-COVID normalised market conditions with periodic RBI and US Fed policy volatility.";
    }
    return { dayPatternData: dPattern, monthPatternData: mPattern, aiMacroContext: ctx };
  }, [trades, startDate]);

  // Group trades by expiry month for the "By Month" view
  const tradesByMonth = useMemo(() => {
    if (!trades.length) return [];
    const groups = {};
    trades.forEach((t) => {
      const key = (t.expiryDate || t.entryDate || "").slice(0, 7); // "YYYY-MM"
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, ts]) => ({
        key,
        label: (() => {
          try {
            return new Date(key + "-15").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
          } catch { return key; }
        })(),
        trades: ts,
        totalPnL: ts.reduce((s, t) => s + (t.pnl || 0), 0),
        wins:     ts.filter((t) => t.pnl >= 0).length,
        losses:   ts.filter((t) => t.pnl < 0).length,
        winRate:  Math.round(ts.filter((t) => t.pnl >= 0).length / ts.length * 100),
      }));
  }, [trades]);

  const handleRunBacktest = useCallback(async () => {
    if (isRunning) {
      abortRef.current?.abort();
      setIsRunning(false);
      return;
    }

    const limitCheck = await checkAndIncrementSimulationLimit(currentUser?.uid);
    if (!limitCheck.allowed) { setUpgradeOpen(true); return; }

    // Reset all streaming state
    setTrades([]);
    setSummary(null);
    setMeta(null);
    setStreamError(null);
    setProgress(0);
    setExpandedTrade(null);
    setShowTradeLog(false);
    setIsRunning(true);
    setStatusMsg("Initiating backtest…");

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const response = await fetch("/api/backtest", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy: selectedStrategy, underlying, startDate, endDate, expiryType, slippage }),
        signal: abort.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop(); // keep incomplete last chunk

        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data: ")) continue;
          let event;
          try { event = JSON.parse(line.slice(6)); } catch { continue; }

          if (event.type === "status") {
            setStatusMsg(event.message);
            setProgress(event.progress ?? 0);

          } else if (event.type === "trades") {
            setTrades((prev) => [...prev, ...event.trades]);
            setStatusMsg(event.message || `Processed ${event.cycle} / ${event.total} cycles`);
            setProgress(event.progress ?? 0);

          } else if (event.type === "complete") {
            setSummary(event.summary);
            setMeta({
              coverage:           event.coverage,
              effectiveDateRange: event.effectiveDateRange,
              dataSource:         event.dataSource || "real",
              dataNote:           event.dataNote,
              totalRows:          event.totalRows,
              uniqueExpiries:     event.uniqueExpiries,
            });
            setProgress(100);
            setStatusMsg(`Done · ${event.summary?.totalTrades} trades on real NSE data`);

          } else if (event.type === "error") {
            setStreamError({ code: event.code, message: event.message });
            setStatusMsg(`Error: ${event.message}`);
            setIsRunning(false);
            return;
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Backtest stream error:", err);
        setStreamError({ code: "client_error", message: err.message });
        setStatusMsg(`Error: ${err.message}`);
      }
    } finally {
      setIsRunning(false);
    }
  }, [selectedStrategy, underlying, startDate, endDate, expiryType, slippage, currentUser, isRunning]);

  const isComplete = !!summary;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <UpgradeBanner isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Backtesting Engine</h1>
            <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
              <Database className="w-3 h-3" />
              Real NSE Data
            </span>
          </div>
          <p className="text-slate-400">
            Test strategies against real NSE Bhavcopy data — actual market prices, actual OI, actual settlements.
            No simulations, no synthetic curves.
          </p>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

            <div className="col-span-2 md:col-span-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                {templates.map((t) => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Underlying</label>
              <select
                value={underlying}
                onChange={(e) => setUnderlying(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                <option value="NIFTY">NIFTY 50</option>
                <option value="BANKNIFTY">BANK NIFTY</option>
                <option value="FINNIFTY">FIN NIFTY</option>
                <option value="MIDCPNIFTY">MIDCP NIFTY</option>
                <option value="SENSEX">SENSEX</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                <option value="1Y">Last 1 Year</option>
                <option value="3Y">Last 3 Years</option>
                <option value="5Y">Last 5 Years</option>
                <option value="Custom">Custom Dates</option>
              </select>
            </div>

            {timeframe === "Custom" && (
              <>
                <div className="col-span-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 text-blue-400">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-200 px-3 py-2.5 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 text-blue-400">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-200 px-3 py-2.5 rounded-lg text-sm"
                  />
                </div>
              </>
            )}

            <div className={`col-span-1 ${timeframe === "Custom" ? "hidden lg:block" : ""}`}>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Expiry Frame</label>
              <select
                value={expiryType}
                onChange={(e) => setExpiryType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                <option value="Weekly">Weekly (Thu)</option>
                <option value="Monthly">Monthly (Last Thu)</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Slippage (%)</label>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
                step="0.1"
                min="0"
                max="5"
              />
            </div>
          </div>

          {/* Footer row */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between border-t border-white/5 pt-6 gap-4">
            <div className="text-xs text-slate-400">
              <span className="text-white font-medium">{underlying}</span> ·{" "}
              <span className="text-white font-medium">{selectedStrategy.replace(/-/g, " ")}</span> ·{" "}
              {startDate} → {endDate} ·{" "}
              <span className="text-blue-400">{expiryType} expiry</span> ·{" "}
              {slippage}% slippage
            </div>
            <button
              onClick={handleRunBacktest}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] ${
                isRunning
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isRunning ? (
                <><StopCircle className="w-4 h-4" /> Cancel</>
              ) : (
                <><Play className="w-4 h-4" /> Run on Real NSE Data</>
              )}
            </button>
          </div>

          {/* Live streaming progress panel */}
          {(isRunning || isComplete || streamError) && (
            <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs min-w-0">
                  {isRunning && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                  )}
                  {isComplete && !isRunning && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  <span className={`truncate ${streamError ? "text-rose-400 font-medium" : "text-slate-300"}`}>
                    {statusMsg}
                  </span>
                </div>
                <span className={`font-mono text-xs shrink-0 ${isComplete ? "text-emerald-400" : "text-blue-400"}`}>
                  {progress}%
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    streamError ? "bg-rose-500" : isComplete ? "bg-emerald-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Data pipeline not configured */}
              {streamError?.code === "not_configured" && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm">
                  <p className="text-amber-300 font-semibold mb-2">Historical Data Unavailable</p>
                  <p className="text-amber-400/80 text-xs">
                    NSE Bhavcopy data is not configured for this environment. Please contact support.
                  </p>
                </div>
              )}

              {/* Other errors */}
              {streamError && streamError.code !== "not_configured" && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm">
                  <p className="text-rose-300 font-semibold mb-1">Backtest Failed</p>
                  <p className="text-rose-400/80 text-xs">{streamError.message}</p>
                </div>
              )}

              {/* Live trade ticker — visible while streaming */}
              {isRunning && trades.length > 0 && (
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
                    Live Feed · Last 5 Cycles
                  </p>
                  <div className="space-y-1.5">
                    {trades.slice(-5).map((t) => (
                      <div key={t.cycle} className="flex items-center justify-between text-xs text-slate-400 gap-2">
                        <span className="font-mono text-slate-600 w-8">#{t.cycle}</span>
                        <span className="text-slate-500 w-24 hidden sm:block">{t.entryDate?.slice(0, 10)}</span>
                        <span className="font-mono text-slate-500 w-20 hidden md:block">
                          ATM {t.atmStrike?.toLocaleString("en-IN")}
                        </span>
                        <span className={`font-mono font-semibold ml-auto ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {t.pnl >= 0 ? "+" : ""}₹{t.pnl?.toLocaleString("en-IN")}
                        </span>
                        <span className={`font-mono text-[10px] w-28 text-right hidden sm:block ${t.cumulativePnl >= 0 ? "text-emerald-500/60" : "text-rose-500/60"}`}>
                          cum ₹{t.cumulativePnl?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Results — render incrementally as trades stream in ────────── */}
        {(trades.length > 0 || isComplete) && !streamError && (
          <>
            {/* Data source badge */}
            {meta && (
              <DataSourceBadge
                dataSource={meta.dataSource || "real"}
                dataNote={meta.dataNote || `${trades.length} trades on real NSE Bhavcopy data`}
                coverage={meta.coverage}
              />
            )}

            {/* Summary cards — only after complete */}
            {isComplete && summary && (
              <>
                {/* Strategy insight */}
                <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Strategy Analysis</h3>
                      <div className="text-slate-300 leading-relaxed space-y-3">
                        <p>
                          The <span className="text-white font-medium">{selectedStrategy.replace(/-/g, " ")}</span> on{" "}
                          {underlying} shows a{" "}
                          <span className={summary.winRate >= 50 ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                            {summary.winRate}% win rate
                          </span>{" "}
                          over <span className="text-white">{summary.totalTrades} real NSE cycles</span>.{" "}
                          {summary.expectancy > 0 ? "Positive statistical edge" : "Negative statistical expectancy"} —{" "}
                          ₹{summary.expectancy?.toLocaleString("en-IN")} expectancy per trade.
                        </p>
                        <div className="pl-4 border-l-2 border-slate-700 py-1">
                          <p className="text-sm text-slate-400">
                            <strong className="text-white">Macro Context:</strong> {aiMacroContext}
                          </p>
                        </div>
                        <p>
                          {(() => {
                            const positiveExpectancy = summary.expectancy > 0;
                            const goodRR = summary.avgWin > summary.avgLoss;
                            if (positiveExpectancy && goodRR)
                              return "Both win rate and reward-to-risk work in your favour — edge is confirmed.";
                            if (positiveExpectancy && !goodRR)
                              return `High ${summary.winRate}% win rate compensates for smaller average wins — frequency-driven edge. Watch slippage costs.`;
                            if (!positiveExpectancy && goodRR)
                              return `Despite avg win (₹${summary.avgWin?.toLocaleString("en-IN")}) exceeding avg loss (₹${summary.avgLoss?.toLocaleString("en-IN")}), the ${summary.winRate}% win rate is too low — you lose more often than you win, erasing the R:R advantage. This strategy lost money in this period.`;
                            return `Both win rate (${summary.winRate}%) and reward-to-risk work against you — average loss exceeds average win and wins are rare. Strict position sizing required.`;
                          })()}
                          {" "}Max drawdown:{" "}
                          <span className="text-rose-400 font-medium">₹{summary.maxDrawdown?.toLocaleString("en-IN")}</span>.
                        </p>
                        {meta?.dataNote && (
                          <p className="text-xs text-slate-500">Source: {meta.dataNote}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary metric cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
                  <div className="glass-card rounded-xl p-4 text-center col-span-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Total P&amp;L</p>
                    <p className={`text-2xl font-bold font-mono tracking-tight ${summary.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      ₹{summary.totalPnL?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Win Rate</p>
                    <p className={`text-xl font-bold font-mono ${summary.winRate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
                      {summary.winRate}%
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Expectancy</p>
                    <p className={`text-xl font-bold font-mono ${summary.expectancy >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      ₹{summary.expectancy?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Avg Win</p>
                    <p className="text-xl font-bold font-mono text-emerald-400">₹{summary.avgWin?.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Avg Loss</p>
                    <p className="text-xl font-bold font-mono text-rose-400">₹{summary.avgLoss?.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Max DD</p>
                    <p className="text-xl font-bold font-mono text-rose-400">₹{summary.maxDrawdown?.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">W / L</p>
                    <p className="text-xl font-bold font-mono">
                      <span className="text-emerald-400">{summary.wins}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-rose-400">{summary.losses}</span>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Equity curve — draws live as trades stream in */}
            {trades.length > 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-4 md:p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Cumulative P&amp;L Curve
                    </h3>
                    {isRunning && (
                      <span className="text-[10px] text-blue-400 animate-pulse font-medium">● streaming</span>
                    )}
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={trades}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="cycle" stroke="#64748B" fontSize={11} minTickGap={30} />
                      <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip content={<BacktestTooltip />} />
                      <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="cumulativePnl" stroke="#3B82F6" strokeWidth={2}
                        dot={false} isAnimationActive={false}
                        activeDot={{ r: 6, fill: "#3B82F6", stroke: "#000", strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {isComplete && dayPatternData.length > 0 && (
                  <div className="glass-card rounded-2xl p-4 md:p-6">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Day of Week Pattern</h3>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={dayPatternData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal vertical={false} />
                        <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                        <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip content={<PatternTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                        <ReferenceLine x={0} stroke="#475569" />
                        <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={24} isAnimationActive={false}>
                          {dayPatternData.map((entry, index) => (
                            <Cell key={index} fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* Trade-by-trade bars + monthly heatmap — after complete */}
            {isComplete && trades.length > 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-4 md:p-6">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Trade-by-Trade Performance</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={trades}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="cycle" stroke="#64748B" fontSize={10} minTickGap={30} />
                      <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip content={<BacktestTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                      <ReferenceLine y={0} stroke="#475569" />
                      <Bar dataKey="pnl" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                        {trades.map((entry, index) => (
                          <Cell key={index} fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {monthPatternData.length > 0 && (
                  <div className="glass-card rounded-2xl p-4 md:p-6">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Monthly Heat Patterns</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthPatternData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                        <Tooltip content={<PatternTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                        <ReferenceLine y={0} stroke="#475569" />
                        <Bar dataKey="pnl" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={false}>
                          {monthPatternData.map((entry, index) => (
                            <Cell key={index} fill={entry.pnl >= 0 ? "#14B8A6" : "#F43F5E"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* Trade log */}
            {trades.length > 0 && (
              <div className="glass-card rounded-2xl overflow-hidden mb-8">
                {/* Header with view toggle */}
                <div
                  className="flex items-center justify-between px-6 py-4 border-b border-white/5 cursor-pointer hover:bg-white/2 transition-colors"
                  onClick={() => setShowTradeLog((v) => !v)}
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Trade Log</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {trades.length} trades{" "}
                      {isRunning
                        ? <span className="text-blue-400 animate-pulse">· streaming…</span>
                        : <span className="text-emerald-400">· real NSE data</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs hidden sm:flex items-center gap-1">
                      <Database className="w-3 h-3" /> Real prices
                    </span>
                    {showTradeLog ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {showTradeLog && (
                  <>
                    {/* View toggle */}
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-slate-900/30">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-2">View:</span>
                      {["list", "month"].map((v) => (
                        <button
                          key={v}
                          onClick={(e) => { e.stopPropagation(); setTradeLogView(v); setExpandedTrade(null); }}
                          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                            tradeLogView === v
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {v === "list" ? "All Trades" : "By Month"}
                        </button>
                      ))}
                    </div>

                    {/* ── All Trades (flat list) ── */}
                    {tradeLogView === "list" && (
                      <div className="divide-y divide-white/3 max-h-[600px] overflow-y-auto">
                        <div className="grid grid-cols-5 md:grid-cols-6 gap-3 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-widest font-semibold sticky top-0 bg-slate-950/95">
                          <span>#</span>
                          <span>Entry Date</span>
                          <span className="hidden md:block">Expiry</span>
                          <span className="hidden lg:block">Entry Spot</span>
                          <span>P&L</span>
                          <span>Cumulative</span>
                        </div>
                        {trades.map((trade) => (
                          <TradeRow
                            key={trade.cycle}
                            trade={trade}
                            underlying={underlying}
                            expanded={expandedTrade === trade.cycle}
                            onToggle={() => setExpandedTrade(expandedTrade === trade.cycle ? null : trade.cycle)}
                          />
                        ))}
                      </div>
                    )}

                    {/* ── By Month (grouped) ── */}
                    {tradeLogView === "month" && (
                      <div className="max-h-[700px] overflow-y-auto divide-y divide-white/5">
                        {tradesByMonth.map((group) => (
                          <MonthGroup
                            key={group.key}
                            group={group}
                            underlying={underlying}
                            expandedTrade={expandedTrade}
                            setExpandedTrade={setExpandedTrade}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <DhanReferralBanner variant="banner" context="backtest" className="mt-6 rounded-xl" />
          </>
        )}
      </main>
    </div>
  );
}
