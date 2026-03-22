"use client";

/**
 * TradeMetricsBar — reusable trade metrics summary.
 *
 * Props:
 *   payoff  : { maxProfit, maxLoss, pop }   — from computePayoff / generatePayoffData + calculatePOP
 *   compact : bool  — compact pill style (used inside position cards)
 */
export default function TradeMetricsBar({ payoff, compact = false }) {
  if (!payoff) return null;

  const { maxProfit, maxLoss, pop } = payoff;
  const isUnlimited = (v) => !isFinite(v) || Math.abs(v) > 500_000;
  const rr = !isUnlimited(maxLoss) && maxLoss !== 0
    ? Math.abs(maxProfit / maxLoss).toFixed(2)
    : "∞";

  const items = [
    {
      label: "Max Profit",
      value: isUnlimited(maxProfit) ? "Unlimited" : `₹${Math.abs(maxProfit).toLocaleString("en-IN")}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Max Loss",
      value: isUnlimited(maxLoss) ? "Unlimited" : `₹${Math.abs(maxLoss).toLocaleString("en-IN")}`,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      label: "Risk : Reward",
      value: `1 : ${rr}`,
      color: "text-slate-300",
      bg: "bg-white/5 border-white/10",
    },
    {
      label: "POP",
      value: pop != null ? `${Number(pop).toFixed(1)}%` : "—",
      color: (pop ?? 0) >= 50 ? "text-emerald-400" : "text-amber-400",
      bg: "bg-white/5 border-white/10",
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2 mt-3">
        {items.map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-lg px-2 py-2 border text-center ${bg}`}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
            <p className={`text-xs font-black tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map(({ label, value, color, bg }) => (
        <div key={label} className={`rounded-xl p-3 border text-center ${bg}`}>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-lg font-black tabular-nums ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
