"use client";

// LTP "what-if" calculator: estimate an option's Last Traded Price at a target
// spot + date using Black-Scholes. Spot & ATM IV auto-fill live from the public
// chain API, so it works out-of-the-box for NIFTY / BANKNIFTY.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

// ── Black-Scholes (European, no dividend) ───────────────────────────────────
function cnd(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return 0.5 * (1 + sign * y);
}
function bs(type, S, K, T, iv, r = 0.065) {
  if (T <= 0 || iv <= 0 || S <= 0) {
    const intrinsic = type === "CE" ? Math.max(0, S - K) : Math.max(0, K - S);
    return { price: intrinsic, delta: type === "CE" ? (S > K ? 1 : 0) : (S < K ? -1 : 0), theta: 0 };
  }
  const sig = iv / 100;
  const d1 = (Math.log(S / K) + (r + (sig * sig) / 2) * T) / (sig * Math.sqrt(T));
  const d2 = d1 - sig * Math.sqrt(T);
  const nd1 = cnd(d1), nd2 = cnd(d2);
  let price, delta;
  if (type === "CE") { price = S * nd1 - K * Math.exp(-r * T) * nd2; delta = nd1; }
  else { price = K * Math.exp(-r * T) * cnd(-d2) - S * cnd(-d1); delta = nd1 - 1; }
  const pdf = Math.exp(-(d1 * d1) / 2) / Math.sqrt(2 * Math.PI);
  const theta = (-(S * pdf * sig) / (2 * Math.sqrt(T)) - (type === "CE" ? 1 : -1) * r * K * Math.exp(-r * T) * (type === "CE" ? nd2 : cnd(-d2))) / 365;
  return { price: Math.max(0, price), delta, theta };
}

const num = (v) => (v === "" || v === null || isNaN(v) ? "" : Number(v));

export default function LtpCalculator({ symbol = "NIFTY", label = "NIFTY", step = 50 }) {
  const [spot, setSpot] = useState("");
  const [strike, setStrike] = useState("");
  const [target, setTarget] = useState("");
  const [days, setDays] = useState(2);
  const [iv, setIv] = useState(14);
  const [type, setType] = useState("CE");
  const [liveSpot, setLiveSpot] = useState(null);

  // Auto-fill spot + ATM IV from the live chain
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const exp = await fetch(`/api/expiries?symbol=${symbol}`).then((r) => r.json()).catch(() => null);
        const e = exp?.expiries?.[0];
        const data = await fetch(`/api/chain?symbol=${symbol}${e ? `&expiry=${e}` : ""}`).then((r) => r.json()).catch(() => null);
        if (!alive || !data) return;
        const s = data.spot;
        if (s) {
          setLiveSpot(s);
          setSpot((prev) => prev === "" ? Math.round(s) : prev);
          const atmStrike = Math.round(s / step) * step;
          setStrike((prev) => prev === "" ? atmStrike : prev);
          setTarget((prev) => prev === "" ? Math.round(s) : prev);
          const atm = data.chain?.reduce((best, r) => (Math.abs(r.strike - s) < Math.abs((best?.strike ?? Infinity) - s) ? r : best), null);
          const atmIv = atm?.ce?.iv || atm?.pe?.iv;
          if (atmIv) setIv(Math.round(atmIv * 10) / 10);
        }
      } catch { /* silent */ }
    })();
    return () => { alive = false; };
  }, [symbol, step]);

  const result = useMemo(() => {
    const S = num(target), K = num(strike), T = num(days) / 365, v = num(iv);
    if (S === "" || K === "" || v === "" || days === "") return null;
    return bs(type, S, K, Math.max(T, 0), v);
  }, [target, strike, days, iv, type]);

  const nowLtp = useMemo(() => {
    const S = num(spot), K = num(strike), T = num(days) / 365, v = num(iv);
    if (S === "" || K === "") return null;
    return bs(type, S, K, Math.max(T, 0), v);
  }, [spot, strike, days, iv, type]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
        <Calculator size={18} className="text-indigo-400" />
        <h2 className="font-semibold text-white">{label} LTP Calculator — target-price estimator</h2>
        {liveSpot && <span className="ml-auto text-xs text-slate-400">Live spot <b className="text-white">{Number(liveSpot).toLocaleString("en-IN")}</b></span>}
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-5">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setType("CE")} className={`py-2 rounded-lg text-sm font-semibold transition ${type === "CE" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>Call (CE)</button>
            <button onClick={() => setType("PE")} className={`py-2 rounded-lg text-sm font-semibold transition ${type === "PE" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"}`}>Put (PE)</button>
          </div>
          <Field label="Current Spot" value={spot} onChange={setSpot} suffix={label} />
          <Field label="Strike Price" value={strike} onChange={setStrike} step={step} />
          <Field label={`Target Spot (your "what-if")`} value={target} onChange={setTarget} highlight />
          <Field label="Days to Expiry" value={days} onChange={setDays} />
          <Field label="Implied Volatility (%)" value={iv} onChange={setIv} />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex flex-col justify-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated LTP at target</div>
          <div className="text-4xl font-bold text-white mb-4 tabular-nums">
            {result ? `₹${result.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "—"}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Out label="LTP at current spot" value={nowLtp ? `₹${nowLtp.price.toFixed(2)}` : "—"} />
            <Out label="Change" value={result && nowLtp ? `${result.price >= nowLtp.price ? "+" : ""}₹${(result.price - nowLtp.price).toFixed(2)}` : "—"} color={result && nowLtp ? (result.price >= nowLtp.price ? "text-emerald-400" : "text-red-400") : ""} />
            <Out label="Delta" value={result ? result.delta.toFixed(3) : "—"} />
            <Out label="Theta / day" value={result ? `₹${result.theta.toFixed(2)}` : "—"} />
          </div>
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            Black-Scholes theoretical estimate for education. Real LTP varies with live IV, bid-ask spread and liquidity. Not investment advice.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 bg-slate-900/60">
        <p className="text-sm text-slate-400">See live LTP across every strike →</p>
        <Link href={symbol === "BANKNIFTY" ? "/bank-nifty-option-chain" : "/nifty-option-chain"} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition">
          {label} Option Chain <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, suffix, step, highlight }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number" inputMode="decimal" value={value} step={step || "any"}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-white tabular-nums ${highlight ? "border-indigo-500/50" : "border-white/10"}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}
function Out({ label, value, color }) {
  return (
    <div>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className={`font-semibold tabular-nums ${color || "text-slate-200"}`}>{value}</div>
    </div>
  );
}
