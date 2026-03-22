"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Sparkles, Download, RotateCcw } from "lucide-react";
import PayoffChart from "@/components/PayoffChart";
import StrategyLegRow from "@/components/StrategyLegRow";
import GreeksPanel from "@/components/GreeksPanel";
import { generatePayoffData, netPremium } from "@/lib/options/payoff";
import { getAllTemplates, generateStrategyLegs } from "@/lib/options/strategies";

const DEFAULT_LEG = {
  type: "CE",
  action: "BUY",
  strike: 22500,
  premium: 150,
  lots: 1,
  lotSize: 50,
};

import ProtectedRoute from "@/components/ProtectedRoute";

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderContent />
    </ProtectedRoute>
  );
}

function BuilderContent() {
  const [legs, setLegs] = useState([{ ...DEFAULT_LEG }]);
  const [spotPrice, setSpotPrice] = useState(22500);
  const [underlying, setUnderlying] = useState("NIFTY");
  const templates = getAllTemplates();

  const addLeg = useCallback(() => {
    setLegs((prev) => [
      ...prev,
      { ...DEFAULT_LEG, strike: spotPrice, premium: 100 },
    ]);
  }, [spotPrice]);

  const removeLeg = useCallback((index) => {
    setLegs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLeg = useCallback((index, updated) => {
    setLegs((prev) => prev.map((leg, i) => (i === index ? updated : leg)));
  }, []);

  const loadTemplate = useCallback(
    (key) => {
      const atm = Math.round(spotPrice / 50) * 50;
      const newLegs = generateStrategyLegs(key, atm);
      if (newLegs.length > 0) setLegs(newLegs);
    },
    [spotPrice]
  );

  const resetAll = useCallback(() => {
    setLegs([{ ...DEFAULT_LEG, strike: spotPrice }]);
  }, [spotPrice]);

  const payoffResult = useMemo(
    () => generatePayoffData(legs, spotPrice, 10, 200),
    [legs, spotPrice]
  );

  const premium = useMemo(() => netPremium(legs), [legs]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Strategy Builder</h1>
            <p className="text-slate-400">Build multi-leg option strategies and visualize their payoff in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Underlying</label>
              <select
                value={underlying}
                onChange={(e) => {
                  setUnderlying(e.target.value);
                  const spots = { NIFTY: 22500, BANKNIFTY: 48200, FINNIFTY: 21800 };
                  setSpotPrice(spots[e.target.value]);
                }}
                className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm"
              >
                <option value="NIFTY">NIFTY 50</option>
                <option value="BANKNIFTY">BANK NIFTY</option>
                <option value="FINNIFTY">FIN NIFTY</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Spot Price</label>
              <input
                type="number"
                value={spotPrice}
                onChange={(e) => setSpotPrice(Number(e.target.value))}
                className="w-32 bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                step={50}
              />
            </div>
          </div>
        </div>

        {/* Strategy Templates */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Quick Strategies</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.key}
                onClick={() => loadTemplate(t.key)}
                className="px-4 py-2 text-xs font-medium rounded-full glass hover:bg-blue-500/20 hover:text-blue-300 text-slate-400 transition-all border border-white/5 hover:border-blue-500/30"
                title={t.description}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Legs */}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={addLeg}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" /> Add Leg
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-slate-400 hover:text-white text-sm font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Max Profit</p>
            <p className="text-xl font-bold text-emerald-400">
              {payoffResult.maxProfit === Infinity ? "Unlimited" : `₹${payoffResult.maxProfit?.toLocaleString()}`}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Max Loss</p>
            <p className="text-xl font-bold text-rose-400">
              ₹{payoffResult.maxLoss?.toLocaleString()}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Breakeven(s)</p>
            <p className="text-lg font-bold text-amber-400">
              {payoffResult.breakevens?.length > 0
                ? payoffResult.breakevens.map((b) => b.toLocaleString()).join(", ")
                : "—"}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Net Premium</p>
            <p className={`text-xl font-bold ${premium >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ₹{premium.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payoff Chart */}
        <PayoffChart data={payoffResult.data} breakevens={payoffResult.breakevens} spotPrice={spotPrice} />

        {/* Greeks Panel */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Position Greeks</h3>
          <GreeksPanel legs={legs} spotPrice={spotPrice} />
        </div>
      </main>
    </div>
  );
}
