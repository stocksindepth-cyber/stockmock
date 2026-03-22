"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { generateStrategyLegs, getAllTemplates } from "@/lib/options/strategies";
import { strategyPayoff, netPremium } from "@/lib/options/payoff";
import { Wallet, TrendingUp, TrendingDown, Clock, Plus, Play } from "lucide-react";

const INITIAL_CAPITAL = 1000000; // ₹10 Lakh

function generateRandomPriceMove(spot, volatility = 0.15) {
  const dailyVol = volatility / Math.sqrt(252);
  const z = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 1.7; // rough normal
  return Math.round(spot * (1 + dailyVol * z));
}

import ProtectedRoute from "@/components/ProtectedRoute";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export default function PaperTradePage() {
  return (
    <ProtectedRoute>
      <PaperTradeContent />
    </ProtectedRoute>
  );
}

function PaperTradeContent() {
  const templates = getAllTemplates();
  const [capital, setCapital] = useState(INITIAL_CAPITAL);
  const [positions, setPositions] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState("iron-condor");
  const [spotPrice, setSpotPrice] = useState(22500);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleOpenPosition = useCallback(() => {
    const atm = Math.round(spotPrice / 50) * 50;
    const legs = generateStrategyLegs(selectedStrategy, atm);
    const template = templates.find((t) => t.key === selectedStrategy);
    const premium = netPremium(legs);
    const margin = Math.abs(premium) + 50000; // Simplified margin

    if (capital < margin) {
      alert("Insufficient capital for this position.");
      return;
    }

    const position = {
      id: Date.now(),
      strategy: template?.name || selectedStrategy,
      legs,
      entrySpot: spotPrice,
      entryTime: new Date().toLocaleString(),
      premium,
      margin,
      status: "OPEN",
    };

    setPositions((prev) => [...prev, position]);
    setCapital((prev) => prev + premium); // premium received/paid
  }, [selectedStrategy, spotPrice, capital, templates]);

  const handleClosePosition = useCallback(
    (posId) => {
      const pos = positions.find((p) => p.id === posId);
      if (!pos) return;

      // Simulate exit price
      const exitSpot = generateRandomPriceMove(spotPrice);
      const pnl = strategyPayoff(exitSpot, pos.legs);

      setClosedTrades((prev) => [
        {
          ...pos,
          exitSpot,
          exitTime: new Date().toLocaleString(),
          pnl,
          status: "CLOSED",
        },
        ...prev,
      ]);
      setCapital((prev) => prev + pnl - pos.premium); // Adjust for actual P&L
      setPositions((prev) => prev.filter((p) => p.id !== posId));
    },
    [positions, spotPrice]
  );

  const totalRealizedPnL = useMemo(
    () => closedTrades.reduce((sum, t) => sum + t.pnl, 0),
    [closedTrades]
  );



  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Paper Trading</h1>
          <p className="text-slate-400">
            Practice with ₹10 Lakh virtual capital. No real money at risk.
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider">Capital</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{capital.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider">Realized P&L</p>
            </div>
            <p className={`text-2xl font-bold ${totalRealizedPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ₹{totalRealizedPnL.toLocaleString()}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider">Open Positions</p>
            </div>
            <p className="text-2xl font-bold text-white">{positions.length}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Trades</p>
            </div>
            <p className="text-2xl font-bold text-white">{closedTrades.length}</p>
          </div>
        </div>

        {/* New Position Controls */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Open New Position</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
              >
                {templates.map((t) => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Spot Price</label>
              <input
                type="number"
                value={spotPrice}
                onChange={(e) => setSpotPrice(Number(e.target.value))}
                className="w-32 bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm"
                step={50}
              />
            </div>
            <button
              onClick={handleOpenPosition}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all"
            >
              <Plus className="w-4 h-4" /> Open Position
            </button>
          </div>
        </div>

        {/* Open Positions */}
        {positions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Open Positions</h3>
            <div className="space-y-3">
              {positions.map((pos) => (
                <div key={pos.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold text-lg">{pos.strategy}</p>
                    <p className="text-slate-400 text-sm">
                      Entry: ₹{pos.entrySpot.toLocaleString()} • {pos.legs.length} legs •{" "}
                      <span className={pos.premium >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        Net: ₹{pos.premium.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{pos.entryTime}</p>
                  </div>
                  <button
                    onClick={() => handleClosePosition(pos.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all"
                  >
                    <Play className="w-4 h-4 rotate-90" /> Close Position
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closed Trades */}
        {closedTrades.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Trade History</h3>
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left text-xs text-slate-500 uppercase tracking-wider">Strategy</th>
                    <th className="py-3 px-4 text-right text-xs text-slate-500 uppercase tracking-wider">Entry</th>
                    <th className="py-3 px-4 text-right text-xs text-slate-500 uppercase tracking-wider">Exit</th>
                    <th className="py-3 px-4 text-right text-xs text-slate-500 uppercase tracking-wider">P&L</th>
                    <th className="py-3 px-4 text-right text-xs text-slate-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {closedTrades.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white font-medium">{t.strategy}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">₹{t.entrySpot.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">₹{t.exitSpot.toLocaleString()}</td>
                      <td className={`py-3 px-4 text-right font-semibold tabular-nums ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ₹{t.pnl.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 text-xs">{t.exitTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dhan referral — contextual prompt to go live */}
        <div className="px-4 pb-8 max-w-5xl mx-auto">
          <DhanReferralBanner variant="card" context="paper-trade" />
        </div>
      </main>
    </div>
  );
}
