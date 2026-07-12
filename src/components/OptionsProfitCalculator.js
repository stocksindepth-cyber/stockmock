"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { generatePayoffData, netPremium } from "@/lib/options/payoff";
import { LOT_SIZES, STRIKE_INTERVALS } from "@/lib/nse/constants";
import PayoffChart from "@/components/PayoffChart";

const UNDERLYINGS = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "SENSEX"];
const fmt = (n) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-IN") : "—");

let legId = 0;
const newLeg = (strike = 0) => ({
  id: ++legId, type: "CE", action: "BUY", strike, premium: "", lots: 1,
});

// Public, login-free options payoff / profit calculator. Exact P&L at expiry
// via the shared payoff engine — no data dependency, always accurate.
export default function OptionsProfitCalculator({ defaultSymbol = "NIFTY" }) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [liveSpot, setLiveSpot] = useState(null);
  const [spot, setSpot] = useState("");
  const [legs, setLegs] = useState([newLeg()]);

  const lotSize = LOT_SIZES[symbol] ?? 50;
  const step = STRIKE_INTERVALS[symbol] ?? 50;

  // Pull live spot + seed an ATM leg from the live chain.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const exp = await fetch(`/api/expiries?symbol=${symbol}`).then((r) => r.json()).catch(() => null);
        const e = exp?.expiries?.[0];
        const data = await fetch(`/api/chain?symbol=${symbol}${e ? `&expiry=${e}` : ""}`).then((r) => r.json()).catch(() => null);
        if (!alive || !data?.spot) return;
        const s = data.spot;
        setLiveSpot(s);
        setSpot((prev) => (prev === "" ? Math.round(s) : prev));
        const atm = Math.round(s / step) * step;
        setLegs((prev) => (prev.length === 1 && !prev[0].strike ? [{ ...prev[0], strike: atm }] : prev));
      } catch { /* silent */ }
    })();
    return () => { alive = false; };
  }, [symbol, step]);

  const parsedLegs = useMemo(
    () => legs
      .filter((l) => l.strike && l.premium !== "")
      .map((l) => ({
        type: l.type, action: l.action,
        strike: Number(l.strike), premium: Number(l.premium),
        lots: Number(l.lots) || 1, lotSize,
      })),
    [legs, lotSize]
  );

  const spotNum = Number(spot) || liveSpot || 0;
  const result = useMemo(
    () => (parsedLegs.length && spotNum ? generatePayoffData(parsedLegs, spotNum, 10, 200) : null),
    [parsedLegs, spotNum]
  );
  const net = useMemo(() => netPremium(parsedLegs), [parsedLegs]);

  const update = (id, patch) => setLegs((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addLeg = () => setLegs((ls) => [...ls, newLeg(Math.round(spotNum / step) * step)]);
  const removeLeg = (id) => setLegs((ls) => (ls.length > 1 ? ls.filter((l) => l.id !== id) : ls));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
      {/* Controls */}
      <div className="p-5 border-b border-white/10">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-slate-400">
            Underlying
            <select
              value={symbol} onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 block bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              {UNDERLYINGS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>
          <label className="text-xs text-slate-400">
            Spot price
            <input
              type="number" value={spot} onChange={(e) => setSpot(e.target.value)}
              placeholder={liveSpot ? String(Math.round(liveSpot)) : "spot"}
              className="mt-1 block w-32 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white tabular-nums"
            />
          </label>
          <span className="text-xs text-slate-500 pb-2">
            Lot size <strong className="text-slate-300">{lotSize}</strong>
            {liveSpot && <> · Live spot <strong className="text-emerald-400">{fmt(liveSpot)}</strong></>}
          </span>
        </div>
      </div>

      {/* Legs */}
      <div className="p-5 space-y-2">
        {legs.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center gap-2">
            <select value={l.action} onChange={(e) => update(l.id, { action: e.target.value })}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold border ${l.action === "BUY" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
            <select value={l.type} onChange={(e) => update(l.id, { type: e.target.value })}
              className="rounded-lg px-2.5 py-1.5 text-xs bg-slate-800 border border-white/10 text-white">
              <option value="CE">CE (Call)</option>
              <option value="PE">PE (Put)</option>
            </select>
            <input type="number" value={l.strike} onChange={(e) => update(l.id, { strike: e.target.value })}
              placeholder="Strike" className="w-24 rounded-lg px-2.5 py-1.5 text-xs bg-slate-800 border border-white/10 text-white tabular-nums" />
            <input type="number" value={l.premium} onChange={(e) => update(l.id, { premium: e.target.value })}
              placeholder="Premium" className="w-24 rounded-lg px-2.5 py-1.5 text-xs bg-slate-800 border border-white/10 text-white tabular-nums" />
            <input type="number" min="1" value={l.lots} onChange={(e) => update(l.id, { lots: e.target.value })}
              placeholder="Lots" className="w-16 rounded-lg px-2.5 py-1.5 text-xs bg-slate-800 border border-white/10 text-white tabular-nums" />
            <button onClick={() => removeLeg(l.id)} className="p-1.5 text-slate-500 hover:text-red-400" aria-label="Remove leg">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={addLeg} className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 mt-1">
          <Plus size={14} /> Add leg
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Stat label="Max Profit" value={result.maxProfit === Infinity ? "Unlimited" : `₹${fmt(result.maxProfit)}`} tone="up" />
            <Stat label="Max Loss" value={result.maxLoss === -Infinity ? "Unlimited" : `₹${fmt(Math.abs(result.maxLoss))}`} tone="down" />
            <Stat label="Breakeven" value={result.breakevens.length ? result.breakevens.map((b) => fmt(b)).join(" / ") : "—"} />
            <Stat label={net >= 0 ? "Net Credit" : "Net Debit"} value={`₹${fmt(Math.abs(net))}`} />
          </div>
          <PayoffChart data={result.data} breakevens={result.breakevens} spotPrice={spotNum} liveSpot={liveSpot} />
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 bg-slate-900/60">
        <p className="text-xs text-slate-400">Want to see how this strategy performed over 8+ years of real NSE data?</p>
        <Link href="/backtest" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 transition-colors">
          Backtest it free <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === "up" ? "text-emerald-400" : tone === "down" ? "text-red-400" : "text-white";
  const Icon = tone === "up" ? TrendingUp : tone === "down" ? TrendingDown : null;
  return (
    <div className="rounded-xl bg-slate-800/60 border border-white/5 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5 flex items-center gap-1">
        {Icon && <Icon size={11} />} {label}
      </div>
      <div className={`text-sm font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
