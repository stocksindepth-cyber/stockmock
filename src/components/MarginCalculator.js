"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";
import { LOT_SIZES } from "@/lib/nse/constants";

const UNDERLYINGS = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "SENSEX"];
const fmt = (n) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-IN") : "—");

// Honest F&O margin ESTIMATOR. True SPAN margin is set by NSE's proprietary
// daily risk-parameter files and finalised by your broker; this gives a
// transparent, editable-assumption estimate — never presented as exact.
// Defaults are typical index-option ranges, exposed as inputs so the user
// controls them.
export default function MarginCalculator({ defaultSymbol = "NIFTY" }) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [liveSpot, setLiveSpot] = useState(null);
  const [spot, setSpot] = useState("");
  const [action, setAction] = useState("SELL");
  const [premium, setPremium] = useState("");
  const [lots, setLots] = useState(1);
  const [spanPct, setSpanPct] = useState(11); // typical index-option SPAN band
  const [exposurePct, setExposurePct] = useState(3);

  const lotSize = LOT_SIZES[symbol] ?? 50;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetch(`/api/chain?symbol=${symbol}`).then((r) => r.json()).catch(() => null);
        if (!alive || !data?.spot) return;
        setLiveSpot(data.spot);
        setSpot((prev) => (prev === "" ? Math.round(data.spot) : prev));
      } catch { /* silent */ }
    })();
    return () => { alive = false; };
  }, [symbol]);

  const r = useMemo(() => {
    const S = Number(spot) || liveSpot || 0;
    const L = Number(lots) || 1;
    const qty = lotSize * L;
    const notional = S * qty;
    const prem = Number(premium) || 0;
    if (action === "BUY") {
      // Option buyers pay only the premium — no SPAN/exposure margin.
      return { blocked: prem * qty, notional, isBuy: true };
    }
    const span = notional * (Number(spanPct) || 0) / 100;
    const exposure = notional * (Number(exposurePct) || 0) / 100;
    const blocked = span + exposure;
    const premReceived = prem * qty;
    return { span, exposure, blocked, notional, premReceived, net: blocked - premReceived, isBuy: false };
  }, [spot, liveSpot, lots, lotSize, action, premium, spanPct, exposurePct]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
      <div className="p-5 border-b border-white/10 flex flex-wrap items-end gap-3">
        <label className="text-xs text-slate-400">
          Underlying
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}
            className="mt-1 block bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            {UNDERLYINGS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-400">
          Position
          <select value={action} onChange={(e) => setAction(e.target.value)}
            className="mt-1 block bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option value="SELL">Sell / Write (short)</option>
            <option value="BUY">Buy (long)</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">
          Spot
          <input type="number" value={spot} onChange={(e) => setSpot(e.target.value)}
            placeholder={liveSpot ? String(Math.round(liveSpot)) : "spot"}
            className="mt-1 block w-28 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white tabular-nums" />
        </label>
        <label className="text-xs text-slate-400">
          Premium
          <input type="number" value={premium} onChange={(e) => setPremium(e.target.value)}
            placeholder="per share" className="mt-1 block w-24 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white tabular-nums" />
        </label>
        <label className="text-xs text-slate-400">
          Lots
          <input type="number" min="1" value={lots} onChange={(e) => setLots(e.target.value)}
            className="mt-1 block w-16 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white tabular-nums" />
        </label>
      </div>

      {/* Editable assumptions (sellers) */}
      {action === "SELL" && (
        <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-end gap-4 bg-slate-900/60">
          <label className="text-xs text-slate-400">
            SPAN %
            <input type="number" value={spanPct} onChange={(e) => setSpanPct(e.target.value)}
              className="mt-1 block w-20 bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white tabular-nums" />
          </label>
          <label className="text-xs text-slate-400">
            Exposure %
            <input type="number" value={exposurePct} onChange={(e) => setExposurePct(e.target.value)}
              className="mt-1 block w-20 bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white tabular-nums" />
          </label>
          <p className="text-[11px] text-slate-500 pb-1 max-w-xs">
            Defaults are typical index-option ranges. Adjust to match your broker's published rates for an exact figure.
          </p>
        </div>
      )}

      {/* Result */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Contract value" value={`₹${fmt(r.notional)}`} />
          {r.isBuy ? (
            <Stat label="Premium payable" value={`₹${fmt(r.blocked)}`} tone="key" />
          ) : (
            <>
              <Stat label="SPAN (est.)" value={`₹${fmt(r.span)}`} />
              <Stat label="Exposure (est.)" value={`₹${fmt(r.exposure)}`} />
              <Stat label="Margin blocked (est.)" value={`₹${fmt(r.blocked)}`} tone="key" />
            </>
          )}
        </div>
        {!r.isBuy && r.premReceived > 0 && (
          <p className="text-xs text-slate-400 mt-3">
            Premium received: <strong className="text-emerald-400">₹{fmt(r.premReceived)}</strong> ·
            Net cash outlay (est.): <strong className="text-white">₹{fmt(r.net)}</strong>
          </p>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
          <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            <strong>Estimate only.</strong> Exact SPAN + Exposure margin is set by NSE's daily risk-parameter files and
            finalised by your broker (and varies with volatility, calendar spreads, and hedged positions). Always confirm
            in your broker's official margin calculator before placing a trade.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 bg-slate-900/60">
        <p className="text-xs text-slate-400">Selling options? Test the strategy on 8+ years of real NSE data first.</p>
        <Link href="/backtest" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 transition-colors">
          Backtest it free <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${tone === "key" ? "bg-indigo-500/10 border-indigo-500/30" : "bg-slate-800/60 border-white/5"}`}>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${tone === "key" ? "text-indigo-200" : "text-white"}`}>{value}</div>
    </div>
  );
}
