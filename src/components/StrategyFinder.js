import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Activity, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import stats from "@/data/strategyStats.json";

export const VIEWS = {
  neutral:  { label: "Sideways / range-bound", icon: Minus,        blurb: "You expect the index to stay put." },
  bullish:  { label: "Bullish",                icon: TrendingUp,   blurb: "You expect the index to rise." },
  bearish:  { label: "Bearish",                icon: TrendingDown, blurb: "You expect the index to fall." },
  volatile: { label: "Big move, unsure which way", icon: Activity, blurb: "You expect a sharp move in either direction." },
};

export const UNDERLYINGS = ["NIFTY", "BANKNIFTY"];
const inr = (n) => (n < 0 ? "−" : "") + "₹" + Math.abs(Math.round(n)).toLocaleString("en-IN");

export function getRanked(view, underlying) {
  return stats.strategies
    .filter((s) => (view ? s.view === view : true))
    .map((s) => ({ ...s, m: s.stats[underlying] }))
    .filter((s) => s.m)
    .sort((a, b) => b.m.avgPl - a.m.avgPl);
}

export const META = { since: stats.since, entryDays: stats.entryDaysBeforeExpiry, generatedAt: stats.generatedAt };

export default function StrategyFinder({ view }) {
  // Rank on NIFTY (the deeper, more-traded series) but show BANK NIFTY alongside,
  // so every page is fully static — no searchParams, no query-param duplicates.
  const ranked = getRanked(view, "NIFTY");

  return (
    <div>
      <div className="space-y-3">
        {ranked.map((s, i) => {
          const m = s.m;
          const positive = m.avgPl >= 0;
          return (
            <div key={s.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">#{i + 1}</span>
                    <h3 className="text-lg font-bold text-white">{s.name}</h3>
                    {s.risk === "defined" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                        <ShieldCheck size={10} /> Defined risk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300">
                        <AlertTriangle size={10} /> Undefined risk
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 max-w-xl">{s.desc}</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold tabular-nums ${positive ? "text-emerald-400" : "text-red-400"}`}>
                    {inr(m.avgPl)}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">avg / lot / expiry</div>
                </div>
              </div>

              {UNDERLYINGS.map((u) => {
                const x = s.stats[u];
                if (!x) return null;
                return (
                  <div key={u} className="mb-2 last:mb-0">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">{u}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <Stat label="Win rate" value={`${x.winRate}%`} />
                      <Stat label="Avg / lot" value={inr(x.avgPl)} tone={x.avgPl >= 0 ? "up" : "down"} />
                      <Stat label="Expiries" value={x.trades.toLocaleString("en-IN")} />
                      <Stat label="Best" value={inr(x.best)} tone="up" />
                      <Stat label="Worst" value={inr(x.worst)} tone="down" />
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
                <p className="text-[11px] text-slate-500">
                  NIFTY avg premium {m.avgPremium >= 0 ? "collected" : "paid"}: {inr(Math.abs(m.avgPremium))} · lot {m.lot} · {m.from} → {m.to}
                </p>
                <Link href="/backtest" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200">
                  Backtest with your strikes <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodology — state the exact rules so the numbers are falsifiable */}
      <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/40 p-5">
        <h3 className="text-sm font-semibold text-white mb-2">How these numbers were produced</h3>
        <ul className="text-xs text-slate-400 space-y-1.5 leading-relaxed list-disc pl-4">
          <li>Every NIFTY and BANK NIFTY expiry since {META.since} was tested — {ranked[0]?.m.trades.toLocaleString("en-IN")} NIFTY expiries and a comparable number on BANK NIFTY.</li>
          <li>Entry is the last trading day at least {META.entryDays} days before expiry; the position is held to expiry, never adjusted.</li>
          <li>Strikes are set relative to the at-the-money strike on the entry day. Legs are priced at that day&apos;s close from NSE Bhavcopy data.</li>
          <li>P&amp;L is per one lot (NIFTY {ranked[0]?.m.lot}, BANK NIFTY 30 units), settled against the index close on expiry day.</li>
          <li>
            <strong className="text-slate-300">Brokerage, slippage and taxes are not included.</strong> Real results will be lower —
            option selling in particular carries losses larger than the premium collected.
          </li>
          <li>This is historical description, not a recommendation. Past results do not predict future ones.</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === "up" ? "text-emerald-400" : tone === "down" ? "text-red-400" : "text-white";
  return (
    <div className="rounded-lg bg-slate-800/50 border border-white/5 px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-wide text-slate-500 mb-0.5">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
