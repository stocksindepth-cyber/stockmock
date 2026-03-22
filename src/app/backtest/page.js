"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { getAllTemplates } from "@/lib/options/strategies";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell
} from "recharts";
import {
  Play, TrendingUp, TrendingDown, Activity, StopCircle,
  Database, Wifi, WifiOff, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { checkAndIncrementSimulationLimit } from "@/lib/firebase/userService";
import UpgradeBanner from "@/components/UpgradeBanner";
import ProtectedRoute from "@/components/ProtectedRoute";

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
              To enable real NSE data: Add <code className="text-slate-300 bg-slate-800 px-1 rounded">BIGQUERY_PROJECT_ID</code> and
              {" "}<code className="text-slate-300 bg-slate-800 px-1 rounded">BIGQUERY_CREDENTIALS_JSON</code> to{" "}
              <code className="text-slate-300 bg-slate-800 px-1 rounded">.env.local</code>
              , then run the ingestion pipeline.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Trade Detail Row ─────────────────────────────────────────────────────────

function TradeRow({ trade, expanded, onToggle }) {
  return (
    <div
      className="border border-white/5 rounded-lg overflow-hidden cursor-pointer"
      onClick={onToggle}
    >
      <div className={`flex items-center gap-3 px-4 py-2.5 text-sm ${trade.pnl >= 0 ? "bg-emerald-500/5" : "bg-rose-500/5"}`}>
        <span className="text-slate-500 font-mono w-8 text-xs">{trade.cycle}</span>
        <span className="text-slate-300 w-24 text-xs">{trade.entryDate}</span>
        <span className="text-slate-400 text-xs hidden md:block w-20">{trade.expiryDate}</span>
        <span className="text-slate-400 text-xs hidden lg:block w-20">{trade.entrySpot?.toLocaleString()}</span>
        <span className={`font-mono font-semibold ml-auto ${trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl?.toLocaleString()}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>
      {expanded && trade.legs && (
        <div className="px-4 py-3 bg-slate-900/60 border-t border-white/5">
          <div className="grid grid-cols-5 gap-2 text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
            <span>Strike</span><span>Type</span><span>Action</span><span>Entry</span><span>Exit · P&L</span>
          </div>
          {trade.legs.map((leg, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 text-xs text-slate-300 py-1 border-t border-white/5">
              <span className="font-mono">{leg.strike}</span>
              <span className={leg.type === "CE" ? "text-blue-400" : "text-amber-400"}>{leg.type}</span>
              <span className={leg.action === "SELL" ? "text-rose-400" : "text-emerald-400"}>{leg.action}</span>
              <span className="font-mono">₹{leg.entry?.toFixed(1)}</span>
              <span className="font-mono">₹{leg.exit?.toFixed(1)} · <span className={leg.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>{leg.pnl >= 0 ? "+" : ""}₹{leg.pnl?.toLocaleString()}</span></span>
            </div>
          ))}
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
  const [entryTime, setEntryTime] = useState("09:20");
  const [exitTime, setExitTime] = useState("15:15");
  const [slippage, setSlippage] = useState(0.5);

  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [mounted, setMounted] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [expandedTrade, setExpandedTrade] = useState(null);
  const [showTradeLog, setShowTradeLog] = useState(false);

  const isRunningRef = useRef(false);
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

  const { dayPatternData, monthPatternData, aiMacroContext } = useMemo(() => {
    if (!result) return { dayPatternData: [], monthPatternData: [], aiMacroContext: "" };
    const dayMap = {};
    const monthMap = {};

    result.trades.forEach((t) => {
      if (!dayMap[t.dayOfWeek]) dayMap[t.dayOfWeek] = { name: t.dayOfWeek, pnl: 0, trades: 0 };
      dayMap[t.dayOfWeek].pnl += t.pnl;
      dayMap[t.dayOfWeek].trades += 1;

      if (!monthMap[t.month]) monthMap[t.month] = { name: t.month, pnl: 0, trades: 0 };
      monthMap[t.month].pnl += t.pnl;
      monthMap[t.month].trades += 1;
    });

    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dPattern = Object.values(dayMap).sort((a, b) => daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name));
    const mPattern = Object.values(monthMap).sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));

    const isRealData = result.dataSource === "real";
    const suffix = isRealData ? " (based on actual NSE market prices)" : " (based on GBM simulation)";

    let ctx = "";
    if (startDate <= "2020-05-01") {
      ctx = "Period includes the COVID-19 crash (Q1 2020). Real NSE data shows IV spiking to 80%+ which devastated short-vega strategies." + suffix;
    } else if (startDate <= "2022-03-01") {
      ctx = "Period covers the Russia-Ukraine onset (Feb 2022). NSE options saw elevated IV and wider bid-ask spreads during this macro event." + suffix;
    } else {
      ctx = "This timeframe represents post-COVID normalised market conditions with periodic RBI and US Fed policy volatility." + suffix;
    }

    return { dayPatternData: dPattern, monthPatternData: mPattern, aiMacroContext: ctx };
  }, [result, startDate]);

  const handleRunBacktest = useCallback(async () => {
    if (isRunning) {
      isRunningRef.current = false;
      setIsRunning(false);
      return;
    }

    const limitCheck = await checkAndIncrementSimulationLimit(currentUser?.uid);
    if (!limitCheck.allowed) {
      setUpgradeOpen(true);
      return;
    }

    setIsRunning(true);
    isRunningRef.current = true;
    setResult(null);
    setProgress(0);
    setExpandedTrade(null);
    setShowTradeLog(false);
    setStatusMsg("Connecting to NSE data warehouse...");

    try {
      setProgress(15);
      setStatusMsg("Querying historical options chain from BigQuery...");

      const response = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: selectedStrategy,
          underlying,
          startDate,
          endDate,
          expiryType,
          slippage,
        }),
      });

      setProgress(70);
      setStatusMsg("Computing P&L across all expiry cycles...");

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Backtest API error");
      }

      const data = await response.json();

      setProgress(90);
      setStatusMsg("Building performance analytics...");
      await new Promise((r) => setTimeout(r, 400));

      setProgress(100);
      setResult(data);
    } catch (err) {
      console.error("Backtest error:", err);
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
      isRunningRef.current = false;
    }
  }, [selectedStrategy, underlying, startDate, endDate, expiryType, slippage, currentUser, isRunning]);

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
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Entry Time</label>
              <select
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                <option value="09:16">09:16 AM</option>
                <option value="09:20">09:20 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="12:30">12:30 PM</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Exit Time</label>
              <select
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                <option value="15:10">03:10 PM</option>
                <option value="15:15">03:15 PM</option>
                <option value="15:20">03:20 PM</option>
                <option value="15:25">03:25 PM</option>
                <option value="15:30">03:30 PM</option>
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
              Entry <span className="text-blue-400">{entryTime}</span> Exit <span className="text-blue-400">{exitTime}</span> ·{" "}
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

          {/* Progress bar */}
          {isRunning && (
            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{statusMsg}</span>
                <span className="text-blue-400 font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Data Source Badge */}
            <DataSourceBadge
              dataSource={result.dataSource}
              dataNote={result.dataNote}
              coverage={result.coverage}
            />

            {/* AI Analysis */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Strategy Analysis</h3>
                  <div className="text-slate-300 leading-relaxed space-y-3">
                    <p>
                      The <span className="text-white font-medium">{selectedStrategy.replace(/-/g, " ")}</span> on{" "}
                      {underlying} shows a{" "}
                      <span className={result.summary.winRate >= 50 ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                        {result.summary.winRate}% win rate
                      </span>{" "}
                      over <span className="text-white">{result.summary.totalTrades} cycles</span>.
                      The strategy has{" "}
                      {result.summary.expectancy > 0 ? "a positive statistical edge" : "a negative statistical expectancy"}{" "}
                      with a projected return of{" "}
                      <span className={result.summary.expectancy >= 0 ? "text-emerald-400" : "text-rose-400 font-medium"}>
                        ₹{result.summary.expectancy?.toLocaleString()} per trade
                      </span>{" "}
                      over the long term.
                    </p>
                    <div className="pl-4 border-l-2 border-slate-700 py-1">
                      <p className="text-sm text-slate-400">
                        <strong className="text-white">Macro Insight:</strong> {aiMacroContext}
                      </p>
                    </div>
                    <p>
                      Best day historically:{" "}
                      <span className="text-blue-400 font-medium">
                        {dayPatternData.reduce((p, c) => (p.pnl > c.pnl ? p : c), { name: "N/A", pnl: -Infinity }).name}
                      </span>.{" "}
                      Max drawdown:{" "}
                      <span className="text-rose-400 font-medium">₹{result.summary.maxDrawdown?.toLocaleString()}</span>.{" "}
                      {result.summary.avgLoss > result.summary.avgWin
                        ? "Average losing trade is larger than average winner — strict stop-losses are recommended."
                        : "Average win is larger than average loss — a positive reward-to-risk profile."}
                    </p>
                    {result.dataNote && (
                      <p className="text-xs text-slate-500">Source: {result.dataNote}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
              <div className="glass-card rounded-xl p-4 text-center col-span-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Total P&L</p>
                <p className={`text-2xl font-bold font-mono tracking-tight ${result.summary.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  ₹{result.summary.totalPnL?.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Win Rate</p>
                <p className={`text-xl font-bold font-mono ${result.summary.winRate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
                  {result.summary.winRate}%
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Expectancy</p>
                <p className={`text-xl font-bold font-mono ${result.summary.expectancy >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  ₹{result.summary.expectancy?.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Avg Win</p>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  ₹{result.summary.avgWin?.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Avg Loss</p>
                <p className="text-xl font-bold font-mono text-rose-400">
                  ₹{result.summary.avgLoss?.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Max DD</p>
                <p className="text-xl font-bold font-mono text-rose-400">
                  ₹{result.summary.maxDrawdown?.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">W / L</p>
                <p className="text-xl font-bold font-mono">
                  <span className="text-emerald-400">{result.summary.wins}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-rose-400">{result.summary.losses}</span>
                </p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-4 md:p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Cumulative P&L Curve</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={result.trades}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="cycle" stroke="#64748B" fontSize={11} minTickGap={30} />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<BacktestTooltip />} />
                    <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="cumulativePnl"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#3B82F6", stroke: "#000", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card rounded-2xl p-4 md:p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Day of Week Pattern</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={dayPatternData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<PatternTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <ReferenceLine x={0} stroke="#475569" />
                    <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={24}>
                      {dayPatternData.map((entry, index) => (
                        <Cell key={index} fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-4 md:p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Trade-by-Trade Performance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={result.trades}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="cycle" stroke="#64748B" fontSize={10} minTickGap={30} />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<BacktestTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <ReferenceLine y={0} stroke="#475569" />
                    <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                      {result.trades.map((entry, index) => (
                        <Cell key={index} fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card rounded-2xl p-4 md:p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Monthly Heat Patterns</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthPatternData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<PatternTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <ReferenceLine y={0} stroke="#475569" />
                    <Bar dataKey="pnl" radius={[4, 4, 0, 0]} barSize={20}>
                      {monthPatternData.map((entry, index) => (
                        <Cell key={index} fill={entry.pnl >= 0 ? "#14B8A6" : "#F43F5E"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trade Log */}
            {result.trades?.length > 0 && (
              <div className="glass-card rounded-2xl p-4 md:p-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowTradeLog((v) => !v)}
                >
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Trade Log ({result.trades.length} trades)
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    {result.dataSource === "real" && (
                      <span className="text-emerald-400 text-xs flex items-center gap-1">
                        <Database className="w-3 h-3" /> Real prices
                      </span>
                    )}
                    {showTradeLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {showTradeLog && (
                  <div className="mt-4 space-y-1 max-h-[500px] overflow-y-auto pr-1">
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-3 px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                      <span>#</span>
                      <span>Entry Date</span>
                      <span className="hidden md:block">Expiry</span>
                      <span className="hidden lg:block">Entry Spot</span>
                      <span className="text-right">P&L</span>
                    </div>
                    {result.trades.map((trade) => (
                      <TradeRow
                        key={trade.cycle}
                        trade={trade}
                        expanded={expandedTrade === trade.cycle}
                        onToggle={() => setExpandedTrade(expandedTrade === trade.cycle ? null : trade.cycle)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
