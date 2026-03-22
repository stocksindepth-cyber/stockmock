"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, RotateCcw, Sparkles, Target, Zap } from "lucide-react";
import PayoffChart from "@/components/PayoffChart";
import StrategyLegRow from "@/components/StrategyLegRow";
import GreeksPanel from "@/components/GreeksPanel";
import TradeMetricsBar from "@/components/TradeMetricsBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { generatePayoffData, netPremium, calculatePOP } from "@/lib/options/payoff";
import { getAllTemplates, generateStrategyLegs } from "@/lib/options/strategies";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNDERLYINGS = [
  { id: "NIFTY",     name: "NIFTY 50",   defaultSpot: 22500, step: 50,  lotSize: 75,  color: "blue"   },
  { id: "BANKNIFTY", name: "BANK NIFTY", defaultSpot: 48200, step: 100, lotSize: 30,  color: "violet" },
  { id: "FINNIFTY",  name: "FIN NIFTY",  defaultSpot: 21800, step: 50,  lotSize: 65,  color: "emerald"},
];

const COLOR_MAP = {
  blue:    { bg: "bg-blue-500/15",    border: "border-blue-500/30",    text: "text-blue-400"    },
  violet:  { bg: "bg-violet-500/15",  border: "border-violet-500/30",  text: "text-violet-400"  },
  emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400" },
};

const SENTIMENT_EMOJI = {
  "Bullish": "📈", "Bearish": "📉",
  "Moderately Bullish": "↗️", "Moderately Bearish": "↘️",
  "Volatile (Direction uncertain)": "⚡", "Volatile": "⚡",
  "Neutral / Low Volatility": "🎯", "Neutral / Range-bound": "〰️",
  "Neutral / Decreasing Volatility": "📐", "Neutral / Pinning": "📌",
  "Mildly Bullish": "↗️",
};

// ─── Leg table column header ───────────────────────────────────────────────────

function LegTableHeader() {
  return (
    <div className="flex items-center gap-1.5 px-0 mb-1">
      <span className="shrink-0 w-5" />
      <span className="shrink-0 w-7  text-[9px] font-semibold text-slate-600 uppercase tracking-widest text-center">Act</span>
      <span className="shrink-0 w-9  text-[9px] font-semibold text-slate-600 uppercase tracking-widest text-center">Type</span>
      <span className="flex-[2]      text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Strike</span>
      <span className="flex-[1.5]    text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Prem ₹</span>
      <span className="shrink-0 w-10 text-[9px] font-semibold text-slate-600 uppercase tracking-widest text-center">Qty</span>
      <span className="shrink-0      text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Lot</span>
      <span className="shrink-0 w-6  ml-auto" />
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderContent />
    </ProtectedRoute>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function BuilderContent() {
  const [underlying, setUnderlying] = useState("NIFTY");
  const [spotPrice,  setSpotPrice]  = useState(22500);
  const [legs, setLegs] = useState([{
    type: "CE", action: "BUY", strike: 22500, premium: 150, lots: 1, lotSize: 75,
  }]);

  const templates      = getAllTemplates();
  const underlyingMeta = useMemo(
    () => UNDERLYINGS.find((u) => u.id === underlying) ?? UNDERLYINGS[0],
    [underlying]
  );

  // ── Leg mutations ─────────────────────────────────────────────────────────
  const addLeg = useCallback(() => {
    const atm = Math.round(spotPrice / underlyingMeta.step) * underlyingMeta.step;
    setLegs((prev) => [...prev, {
      type: "CE", action: "BUY", strike: atm, premium: 100,
      lots: 1, lotSize: underlyingMeta.lotSize,
    }]);
  }, [spotPrice, underlyingMeta]);

  const removeLeg   = useCallback((i)        => setLegs((p) => p.filter((_, idx) => idx !== i)), []);
  const updateLeg   = useCallback((i, upd)   => setLegs((p) => p.map((l, idx) => idx === i ? upd : l)), []);

  const loadTemplate = useCallback((key) => {
    const atm  = Math.round(spotPrice / underlyingMeta.step) * underlyingMeta.step;
    const next = generateStrategyLegs(key, atm).map((l) => ({ ...l, lotSize: underlyingMeta.lotSize }));
    if (next.length) setLegs(next);
  }, [spotPrice, underlyingMeta]);

  const resetAll = useCallback(() => {
    const atm = Math.round(spotPrice / underlyingMeta.step) * underlyingMeta.step;
    setLegs([{ type: "CE", action: "BUY", strike: atm, premium: 150, lots: 1, lotSize: underlyingMeta.lotSize }]);
  }, [spotPrice, underlyingMeta]);

  // ── Analytics ─────────────────────────────────────────────────────────────
  const payoffResult  = useMemo(() => generatePayoffData(legs, spotPrice, 10, 200), [legs, spotPrice]);
  const premium       = useMemo(() => netPremium(legs), [legs]);
  const pop           = useMemo(() => calculatePOP(payoffResult.data, spotPrice, 7, 0.2), [payoffResult.data, spotPrice]);
  const payoffWithPop = useMemo(() => ({ ...payoffResult, pop }), [payoffResult, pop]);

  return (
    <div className="min-h-screen bg-[#080C16]">
      <main className="pt-20 pb-16 px-6 lg:px-10 max-w-[1440px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-6 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-blue-500/15 text-blue-400 border border-blue-500/25">
              <Sparkles className="w-3 h-3" /> Strategy Builder
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Build your option strategy</h1>
          <p className="text-sm text-slate-400 mt-0.5">Compose legs, see max profit / loss, T+0 curve and Greeks — live as you type.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ══ LEFT: controls ══ */}
          <div className="lg:col-span-2 space-y-4">

            {/* ── Underlying + Spot price on one row ── */}
            <div className="flex items-end gap-3">
              {/* Underlying pills */}
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Underlying</p>
                <div className="flex gap-1.5">
                  {UNDERLYINGS.map((u) => {
                    const c      = COLOR_MAP[u.color];
                    const active = underlying === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => { setUnderlying(u.id); setSpotPrice(u.defaultSpot); }}
                        className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                          active
                            ? `${c.bg} ${c.border} ${c.text}`
                            : "bg-white/3 border-white/8 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <div>{u.id}</div>
                        <div className="text-[9px] font-normal opacity-50 mt-0.5">×{u.lotSize}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spot price */}
              <div className="shrink-0">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Spot (ATM)</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSpotPrice((p) => Math.max(0, p - underlyingMeta.step))}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-base leading-none"
                  >−</button>
                  <input
                    type="number"
                    value={spotPrice}
                    onChange={(e) => setSpotPrice(Number(e.target.value))}
                    step={underlyingMeta.step}
                    style={{ colorScheme: "dark" }}
                    className="w-24 bg-white/5 border border-white/10 text-white text-center font-bold px-2 py-1.5 rounded-lg text-sm focus:outline-none focus:border-blue-500 tabular-nums"
                  />
                  <button
                    onClick={() => setSpotPrice((p) => p + underlyingMeta.step)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-base leading-none"
                  >+</button>
                </div>
              </div>
            </div>

            {/* ── Strategy templates dropdown ── */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Quick Strategy
              </p>
              <select
                defaultValue=""
                onChange={(e) => { if (e.target.value) { loadTemplate(e.target.value); e.target.value = ""; } }}
                style={{ colorScheme: "dark" }}
                className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-white/20 transition-colors"
              >
                <option value="" disabled>Load a strategy template…</option>
                {templates.map((t) => (
                  <option key={t.key} value={t.key}>
                    {SENTIMENT_EMOJI[t.sentiment] ?? "📊"} {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-white/8" />

            {/* ── Strategy Legs ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Target className="w-3 h-3" /> Strategy Legs
                  <span className="px-1.5 py-0.5 rounded-full bg-white/8 text-slate-400 text-[9px]">{legs.length}</span>
                </p>
              </div>

              {legs.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-600 text-xs">
                  No legs — load a strategy or add manually
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/8 rounded-xl px-3 py-2 space-y-0.5">
                  <LegTableHeader />
                  {legs.map((leg, i) => (
                    <StrategyLegRow key={i} leg={leg} index={i} onChange={updateLeg} onRemove={removeLeg} />
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={addLeg}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Leg
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* ══ RIGHT: analytics ══ */}
          <div className="lg:col-span-3 space-y-4">

            {/* Net premium pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${
              premium >= 0
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/25 text-rose-400"
            }`}>
              <span>{premium >= 0 ? "Net Credit" : "Net Debit"}</span>
              <span className="tabular-nums">₹{Math.abs(premium).toLocaleString("en-IN")}</span>
            </div>

            {/* Trade metrics */}
            <TradeMetricsBar payoff={payoffWithPop} />

            {/* Payoff chart */}
            <PayoffChart
              data={payoffResult.data}
              breakevens={payoffResult.breakevens}
              spotPrice={spotPrice}
            />

            {/* Greeks */}
            {legs.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Position Greeks
                </p>
                <GreeksPanel legs={legs} spotPrice={spotPrice} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
