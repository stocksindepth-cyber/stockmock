"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Key, CheckCircle2, AlertTriangle, RefreshCw, Clock, Zap } from "lucide-react";

function fmt(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

export default function DhanTokenAdmin() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  const [token,       setToken]       = useState("");
  const [secret,      setSecret]      = useState("");
  const [status,      setStatus]      = useState(null); // null|"saving"|"ok"|"error"
  const [errMsg,      setErrMsg]      = useState("");
  const [tokenInfo,   setTokenInfo]   = useState(null); // { updatedAt, renewedAt, lastRenewStatus, lastRenewError }
  const [renewStatus, setRenewStatus] = useState(null); // null|"renewing"|"ok"|"error"
  const [renewErr,    setRenewErr]    = useState("");

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/login");
  }, [currentUser, loading, router]);

  // Fetch current token metadata
  const fetchInfo = useCallback(async () => {
    if (!secret) return;
    try {
      const r = await fetch("/api/admin/dhan-token", {
        headers: { "x-admin-secret": secret },
      });
      const d = await r.json();
      if (d && !d.error) setTokenInfo(d);
    } catch { /* ignore */ }
  }, [secret]);

  useEffect(() => { fetchInfo(); }, [fetchInfo]);

  // ── Save new token ──────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setErrMsg("");
    try {
      const res  = await fetch("/api/admin/dhan-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body:    JSON.stringify({ accessToken: token.trim() }),
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      setStatus("ok");
      setToken("");
      await fetchInfo();
    } catch (err) {
      setStatus("error");
      setErrMsg(err.message);
    }
  }

  // ── Manual renew ────────────────────────────────────────────────────────────
  async function handleRenew() {
    setRenewStatus("renewing");
    setRenewErr("");
    try {
      const res  = await fetch("/api/cron/dhan-renew", {
        method:  "POST",
        headers: { "x-admin-secret": secret },
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      setRenewStatus("ok");
      await fetchInfo();
    } catch (err) {
      setRenewStatus("error");
      setRenewErr(err.message);
    }
  }

  if (loading || !currentUser) return null;

  const renewBadge = tokenInfo?.lastRenewStatus === "success"
    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    : tokenInfo?.lastRenewStatus === "error"
    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
    : "bg-slate-500/10 border-slate-500/20 text-slate-400";

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dhan Token Manager</h1>
            <p className="text-sm text-slate-400">Auto-renews twice daily · No manual rotation needed</p>
          </div>
        </div>

        {/* Status card */}
        {tokenInfo?.configured && (
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Status</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Token saved</p>
                <p className="text-white font-medium">{fmt(tokenInfo.updatedAt)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Last auto-renew</p>
                <p className="text-white font-medium">{fmt(tokenInfo.renewedAt)}</p>
              </div>
            </div>

            {/* Last renew status */}
            {tokenInfo.lastRenewStatus && (
              <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs ${renewBadge}`}>
                {tokenInfo.lastRenewStatus === "success"
                  ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                <div>
                  <span className="font-semibold">
                    {tokenInfo.lastRenewStatus === "success" ? "Last renewal succeeded" : "Last renewal failed"}
                  </span>
                  {tokenInfo.lastRenewError && (
                    <p className="mt-0.5 opacity-80">{tokenInfo.lastRenewError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Schedule info */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Auto-renews at 7:30 AM IST and 7:30 PM IST daily
            </div>
          </div>
        )}

        {/* Admin secret input (needed for all actions) */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Your ADMIN_SECRET env var value"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Manual Renew Now button */}
          <div className="pt-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Manual Renewal
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Extend the current token's validity by 24 hours right now. Use this if the cron hasn't run yet or you want to force a refresh.
            </p>
            <button
              onClick={handleRenew}
              disabled={!secret || renewStatus === "renewing"}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {renewStatus === "renewing"
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Renewing...</>
                : <><Zap className="w-4 h-4" /> Renew Token Now</>}
            </button>
            {renewStatus === "ok" && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm mt-2">
                <CheckCircle2 className="w-4 h-4" /> Token renewed successfully — valid for another 24 hours.
              </div>
            )}
            {renewStatus === "error" && (
              <div className="flex items-center gap-2 text-rose-400 text-sm mt-2">
                <AlertTriangle className="w-4 h-4" /> {renewErr || "Renewal failed."}
              </div>
            )}
          </div>
        </div>

        {/* Set new token (when token has expired and renew won't work) */}
        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Replace Token (expired / first-time setup)
          </p>

          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
            <p className="font-semibold mb-1">Only needed if token has already expired:</p>
            <ol className="list-decimal list-inside space-y-1 text-amber-400/80">
              <li>Go to <a href="https://access.dhan.co" target="_blank" rel="noopener noreferrer" className="underline">access.dhan.co</a></li>
              <li>Log in → API → Generate / Copy Access Token</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                New Dhan Access Token
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your new Dhan access token here..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none font-mono"
                required
              />
            </div>

            {status === "ok" && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Token saved. Auto-renew will keep it alive from here.
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-rose-400 text-sm">
                <AlertTriangle className="w-4 h-4" /> {errMsg || "Update failed. Check your admin secret."}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "saving" || !token || !secret}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {status === "saving"
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                : "Save New Token"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600">
          Token stored in Firestore <code className="text-slate-500">admin/dhan</code> · Auto-renewed via Vercel Cron
        </p>
      </div>
    </div>
  );
}
