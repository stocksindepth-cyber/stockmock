"use client";

export default function GreeksPanel({ legs, spotPrice }) {
  if (!legs || legs.length === 0) {
    return null;
  }

  // We import dynamically to avoid SSR issues with math
  // Calculate aggregated greeks for the entire strategy
  const { allGreeks } = require("@/lib/options/greeks");
  const T = 7 / 365; // 1 week to expiry
  const r = 0.07;

  let netDelta = 0, netGamma = 0, netTheta = 0, netVega = 0;

  for (const leg of legs) {
    const qty = (leg.lots || 1) * (leg.lotSize || 50);
    const multiplier = leg.action === "BUY" ? 1 : -1;
    const sigma = 0.15; // Use base IV
    const greeks = allGreeks(spotPrice, leg.strike, T, r, sigma, leg.type);

    netDelta += multiplier * greeks.delta * qty;
    netGamma += multiplier * greeks.gamma * qty;
    netTheta += multiplier * greeks.theta * qty;
    netVega += multiplier * greeks.vega * qty;
  }

  const cards = [
    { label: "Net Delta", value: netDelta.toFixed(2), color: "text-blue-400", desc: "Directional exposure" },
    { label: "Net Gamma", value: netGamma.toFixed(4), color: "text-blue-400", desc: "Delta acceleration" },
    { label: "Net Theta", value: `₹${netTheta.toFixed(0)}/day`, color: netTheta >= 0 ? "text-emerald-400" : "text-rose-400", desc: "Time decay" },
    { label: "Net Vega", value: netVega.toFixed(2), color: "text-amber-400", desc: "Volatility sensitivity" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <div key={i} className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
          <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
          <p className="text-[10px] text-slate-600 mt-1">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
