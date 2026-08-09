"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Check, ExternalLink, Loader2, Clock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DHAN_REFERRAL_URL = "https://join.dhan.co/?invite=XDCAS95683";

const PRO_UNLOCKS = [
  "Unlimited backtests — no daily cap",
  "8+ years of real NSE data (2016 → today)",
  "Full trade log + CSV/JSON export",
  "A/B strategy comparison + SL/TP controls",
];

export default function UnlockPage() {
  const { currentUser, loading } = useAuth();
  const [status, setStatus] = useState(null);   // none | pending | approved | already_pro
  const [clientId, setClientId] = useState("");
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
        body: JSON.stringify({ dhanClientId: clientId.trim() }),
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
          <Gift size={14} /> Free Pro — No Payment
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Unlock OptionsGyani Pro — free for life</h1>
        <p className="text-slate-400 mb-8">
          No subscription needed. Open a free Dhan trading account through our link and we&apos;ll unlock{" "}
          <strong className="text-slate-200">Pro for life</strong> on your account — unlimited backtests, 8 years of data, the works.
        </p>

        {isPro ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-1">You&apos;re on Pro 🎉</h2>
            <p className="text-slate-400 text-sm mb-5">Unlimited backtests and every Pro feature are unlocked on your account.</p>
            <Link href="/backtest" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
              Start backtesting →
            </Link>
          </div>
        ) : (
          <>
            {/* What you get */}
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
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Step 1 — Open a free Dhan account</div>
              <p className="text-sm text-slate-400 mb-4">
                Dhan is genuinely one of the best brokers for options — ₹0 AMC for life, free demat, ₹20/order. Opening takes ~5 minutes.
              </p>
              <a
                href={DHAN_REFERRAL_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm"
              >
                Open free Dhan account <ExternalLink size={15} />
              </a>
              <p className="text-[11px] text-slate-600 mt-2">Referral link — we may earn a commission at no cost to you. That&apos;s how we keep Pro free.</p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Step 2 — Enter your Dhan Client ID</div>
              <p className="text-sm text-slate-400 mb-4">
                After your account is active, find your <strong className="text-slate-300">Dhan Client ID</strong> in the Dhan app (Profile → account details) and paste it here. We verify it opened through our link, then flip on Pro — usually within a few hours.
              </p>

              {!currentUser && !loading ? (
                <Link href="/login?redirect=/unlock" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
                  Log in to continue
                </Link>
              ) : status === "pending" ? (
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 py-3 text-sm text-amber-200">
                  <Clock size={16} /> Request received for Client ID <strong>{clientId}</strong> — we&apos;re verifying it. You&apos;ll get Pro shortly.
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="e.g. 1000045599"
                      inputMode="numeric"
                      className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white tabular-nums"
                    />
                    <button
                      onClick={submit}
                      disabled={busy || !clientId.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim free Pro"}
                    </button>
                  </div>
                  {err && <p className="text-xs text-red-300 mt-2">{err}</p>}
                </>
              )}
            </div>

            <p className="text-center text-xs text-slate-600 mt-6">
              Prefer to just pay? <Link href="/pricing" className="underline hover:text-slate-400">See plans</Link> · Already have Dhan? Use the same link — a fresh account opened via it still counts.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
