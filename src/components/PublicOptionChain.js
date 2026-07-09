"use client";

// Public, un-gated live option chain island for SEO landing pages.
// Reuses the same public APIs the app uses (/api/indices, /api/expiries, /api/chain).
// Shows live spot, PCR, computed max pain, and a clean CE|PE chain with ATM highlighted.
// CTA funnels to signup for backtest/save — the data itself is free to view (NiftyTrader model).

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, RefreshCw, Lock, ArrowRight } from "lucide-react";

const REFRESH_MS = 45000;

function fmt(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtInt(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-IN");
}

export default function PublicOptionChain({ symbol = "NIFTY", label = "NIFTY" }) {
  const [spot, setSpot] = useState(null);
  const [change, setChange] = useState(null);
  const [changePct, setChangePct] = useState(null);
  const [expiries, setExpiries] = useState([]);
  const [expiry, setExpiry] = useState(null);
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const abortRef = useRef(null);

  // Load index quote + expiries once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [idx, exp] = await Promise.all([
          fetch("/api/indices").then((r) => r.json()).catch(() => null),
          fetch(`/api/expiries?symbol=${symbol}`).then((r) => r.json()).catch(() => null),
        ]);
        if (!alive) return;
        const me = idx?.indices?.find((i) => i.key === symbol);
        if (me) { setSpot(me.price); setChange(me.change); setChangePct(me.changePercent); }
        if (exp?.expiries?.length) { setExpiries(exp.expiries); setExpiry(exp.expiries[0]); }
      } catch { /* silent */ }
    })();
    return () => { alive = false; };
  }, [symbol]);

  // Load chain for current expiry, refresh on interval
  useEffect(() => {
    if (!expiry) return;
    let alive = true;
    const load = async () => {
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const data = await fetch(`/api/chain?symbol=${symbol}&expiry=${expiry}`, { signal: abortRef.current.signal }).then((r) => r.json());
        if (!alive) return;
        if (data?.spot) setSpot(data.spot);
        setChain(Array.isArray(data?.chain) ? data.chain : []);
        setUpdatedAt(new Date());
        setLoading(false);
      } catch { if (alive) setLoading(false); }
    };
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => { alive = false; clearInterval(t); };
  }, [symbol, expiry]);

  // PCR + max pain from the live chain
  const { pcr, maxPain, totalCeOi, totalPeOi } = useMemo(() => {
    if (!chain.length) return { pcr: null, maxPain: null, totalCeOi: 0, totalPeOi: 0 };
    let ceOi = 0, peOi = 0;
    for (const row of chain) { ceOi += row.ce?.oi || 0; peOi += row.pe?.oi || 0; }
    // Max pain: strike minimizing total writer payout
    let best = null, bestPain = Infinity;
    for (const s of chain) {
      let pain = 0;
      for (const r of chain) {
        if (s.strike > r.strike) pain += (s.strike - r.strike) * (r.ce?.oi || 0);
        if (s.strike < r.strike) pain += (r.strike - s.strike) * (r.pe?.oi || 0);
      }
      if (pain < bestPain) { bestPain = pain; best = s.strike; }
    }
    return { pcr: ceOi ? peOi / ceOi : null, maxPain: best, totalCeOi: ceOi, totalPeOi: peOi };
  }, [chain]);

  // Window the chain around ATM for readability (±12 strikes)
  const atmIdx = useMemo(() => {
    if (!chain.length || !spot) return -1;
    let idx = 0, diff = Infinity;
    chain.forEach((r, i) => { const d = Math.abs(r.strike - spot); if (d < diff) { diff = d; idx = i; } });
    return idx;
  }, [chain, spot]);
  const view = useMemo(() => {
    if (atmIdx < 0) return chain;
    return chain.slice(Math.max(0, atmIdx - 12), atmIdx + 13);
  }, [chain, atmIdx]);

  const up = (change ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur overflow-hidden">
      {/* Header: spot + stats */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 border-b border-white/10">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{label} Spot</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">{fmt(spot)}</span>
            <span className={`flex items-center gap-1 text-sm font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
              {up ? <TrendingUp size={15} /> : <TrendingDown size={15} />}{changePct || "—"}
            </span>
          </div>
        </div>
        <Stat label="PCR (OI)" value={pcr ? fmt(pcr) : "—"} hint={pcr ? (pcr > 1 ? "Put-heavy" : "Call-heavy") : ""} />
        <Stat label="Max Pain" value={maxPain ? fmtInt(maxPain) : "—"} hint={maxPain && spot ? (maxPain > spot ? "Above spot" : "Below spot") : ""} />
        <Stat label="Total CE OI" value={fmtInt(totalCeOi)} />
        <Stat label="Total PE OI" value={fmtInt(totalPeOi)} />
        <div className="ml-auto flex items-center gap-3">
          {expiries.length > 0 && (
            <select
              value={expiry || ""}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-200"
            >
              {expiries.slice(0, 8).map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          )}
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            {updatedAt ? updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "…"}
          </span>
        </div>
      </div>

      {/* Chain table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/10">
              <th className="px-3 py-2 text-right font-semibold text-emerald-400/80">Call OI</th>
              <th className="px-3 py-2 text-right font-semibold text-emerald-400/80">Call LTP</th>
              <th className="px-3 py-2 text-right">IV</th>
              <th className="px-3 py-2 text-center bg-white/5">Strike</th>
              <th className="px-3 py-2 text-right">IV</th>
              <th className="px-3 py-2 text-right font-semibold text-red-400/80">Put LTP</th>
              <th className="px-3 py-2 text-right font-semibold text-red-400/80">Put OI</th>
            </tr>
          </thead>
          <tbody>
            {loading && !view.length ? (
              <tr><td colSpan={7} className="text-center py-10 text-slate-500">Loading live chain…</td></tr>
            ) : view.map((r, i) => {
              const isATM = spot && Math.abs(r.strike - spot) === Math.min(...view.map((x) => Math.abs(x.strike - spot)));
              return (
                <tr key={r.strike} className={`border-b border-white/5 ${isATM ? "bg-indigo-500/10" : "hover:bg-white/5"}`}>
                  <td className="px-3 py-2 text-right tabular-nums text-emerald-300/90 bg-emerald-500/5">{fmtInt(r.ce?.oi)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-200">{fmt(r.ce?.ltp)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">{fmt(r.ce?.iv, 1)}</td>
                  <td className={`px-3 py-2 text-center font-semibold tabular-nums ${isATM ? "text-indigo-300" : "text-white"}`}>{fmtInt(r.strike)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">{fmt(r.pe?.iv, 1)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-200">{fmt(r.pe?.ltp)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-red-300/90 bg-red-500/5">{fmtInt(r.pe?.oi)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 bg-slate-900/60">
        <p className="text-sm text-slate-400 flex items-center gap-2">
          <Lock size={14} className="text-indigo-400" />
          Free to view. Sign up to backtest strategies on this chain across 8+ years of NSE data.
        </p>
        <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition">
          Start free <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div>
      <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold text-white tabular-nums">{value}
        {hint ? <span className="ml-1.5 text-[11px] font-normal text-slate-500">{hint}</span> : null}</div>
    </div>
  );
}
