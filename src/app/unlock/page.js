"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Check, ExternalLink, Loader2, Clock, ShieldCheck, Camera, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DHAN_REFERRAL_URL = "https://join.dhan.co/?invite=XDCAS95683";

const PRO_UNLOCKS = [
  "Unlimited backtests — no daily cap",
  "8+ years of real NSE data (2016 → today)",
  "Full trade log + CSV export",
  "A/B strategy comparison + SL/TP controls",
];

export default function UnlockPage() {
  const { currentUser, loading } = useAuth();
  const [status, setStatus] = useState(null);   // none | pending | approved | already_pro
  const [clientId, setClientId] = useState("");
  const [tradeDone, setTradeDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const token = await currentUser.getIdToken();
        const r = await fetch("/api/unlock/request", { headers: { Authorization: `Bearer ${token}` } });
        const d = await r.json();
        setStatus(d.unlocked ? "already_pro" : d.status);
        if (d.dhanClientId) setClientId(d.dhanClientId);
      } catch { /* silent */ }
    })();
  }, [currentUser]);

  const submit = async () => {
    setErr(null); setBusy(true);
    try {
      const token = await currentUser.getIdToken();
      const r = await fetch("/api/unlock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dhanClientId: clientId.trim(), firstTradeDone: tradeDone }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Something went wrong");
      setStatus(d.status === "already_pro" ? "already_pro" : "pending");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const isPro = status === "already_pro" || status === "approved";

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <section className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3">
          <Gift size={14} /> Free Pro — No Payment, Ever
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Unlock Pro free — trade, don&apos;t pay</h1>
        <p className="text-slate-400 mb-8">
          OptionsGyani has no paid plans. Open a free Dhan account through us, place your{" "}
          <strong className="text-slate-200">first trade</strong>, share the snapshot — and{" "}
          <strong className="text-slate-200">Pro is yours for life</strong>. Keep trading actively and Elite unlocks too.
        </p>

        {isPro ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-1">You&apos;re on Pro 🎉</h2>
            <p className="text-slate-400 text-sm mb-5">
              Unlimited backtests and every Pro feature are live on your account. Keep trading on Dhan and share a recent
              trade snapshot at support@optionsgyani.com any time to step up to Elite.
            </p>
            <Link href="/backtest" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
              Start backtesting →
            </Link>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 mb-6">
              <div className="text-sm font-semibold text-white mb-3">What Pro unlocks — yours free:</div>
              <div className="space-y-2">
                {PRO_UNLOCKS.map((u) => (
                  <div key={u} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200">{u}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 mb-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Step 1 — Open a free Dhan account</div>
              <p className="text-sm text-slate-400 mb-4">
                ₹0 AMC for life, free demat, ₹20/order. The founder trades on it personally. Takes ~5 minutes with Aadhaar + PAN.
              </p>
              <a href={DHAN_REFERRAL_URL} target="_blank" rel="noopener noreferrer sponsored"
                 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm">
                Open free Dhan account <ExternalLink size={15} />
              </a>
              <p className="text-[11px] text-slate-600 mt-2">Referral link — Dhan pays us a commission at no cost to you. That commission is why Pro is free.</p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 mb-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Step 2 — Place your first trade &amp; snapshot it</div>
              <p className="text-sm text-slate-400">
                Any trade counts — one lot, one share, your call. Take a screenshot of the executed order or position
                (from the Dhan app), and email it to{" "}
                <a href="mailto:support@optionsgyani.com?subject=Pro%20unlock%20—%20first%20trade%20snapshot" className="text-emerald-300 underline">
                  support@optionsgyani.com
                </a>{" "}
                <strong className="text-slate-300">from your OptionsGyani login email</strong>, mentioning your Dhan Client ID.
              </p>
              <p className="text-[11px] text-slate-600 mt-2 flex items-center gap-1.5"><Camera size={12} /> The snapshot is how we verify a real, trading account — not just a signup.</p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Step 3 — Submit your Dhan Client ID</div>
              {!currentUser && !loading ? (
                <Link href="/login?redirect=/unlock" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
                  Log in to continue
                </Link>
              ) : status === "pending" ? (
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 py-3 text-sm text-amber-200">
                  <Clock size={16} /> Request received for Client ID <strong>{clientId}</strong>. Once your trade snapshot lands in our inbox, Pro goes live — usually within a few hours.
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="Dhan Client ID — e.g. 1000045599"
                      inputMode="numeric"
                      className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white tabular-nums"
                    />
                    <button
                      onClick={submit}
                      disabled={busy || !clientId.trim() || !tradeDone}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim free Pro"}
                    </button>
                  </div>
                  <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" checked={tradeDone} onChange={(e) => setTradeDone(e.target.checked)} className="mt-0.5 accent-emerald-500" />
                    I&apos;ve placed my first trade on Dhan and emailed the snapshot to support@optionsgyani.com
                  </label>
                  {err && <p className="text-xs text-red-300 mt-2">{err}</p>}
                </>
              )}
            </div>

            {/* Elite */}
            <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-5 mt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-1.5">
                <TrendingUp size={16} className="text-indigo-400" /> And Elite?
              </div>
              <p className="text-sm text-slate-400">
                Elite (unlimited alerts, JSON export, OI heatmaps, priority support) is free for{" "}
                <strong className="text-slate-300">active Dhan traders</strong> — keep trading and share a recent trade
                snapshot from time to time, and we bump you up. Go dormant and you drop back to Pro, never below.
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
