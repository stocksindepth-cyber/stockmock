"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Key, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export default function DhanTokenAdmin() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [token,    setToken]    = useState("");
  const [secret,   setSecret]   = useState("");
  const [status,   setStatus]   = useState(null); // null | "saving" | "ok" | "error"
  const [errMsg,   setErrMsg]   = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/login");
  }, [currentUser, loading, router]);

  useEffect(() => {
    // Check current token status
    if (!secret) return;
    fetch("/api/admin/dhan-token", { headers: { "x-admin-secret": secret } })
      .then((r) => r.json())
      .then((d) => { if (d.updatedAt) setLastUpdated(d.updatedAt); })
      .catch(() => {});
  }, [secret]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setErrMsg("");
    try {
      const res = await fetch("/api/admin/dhan-token", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setLastUpdated(data.updatedAt);
      setToken("");
    } catch (err) {
      setStatus("error");
      setErrMsg(err.message);
    }
  }

  if (loading || !currentUser) return null;

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dhan Token Manager</h1>
            <p className="text-sm text-slate-400">Update the access token without redeploying</p>
          </div>
        </div>

        {lastUpdated && (
          <div className="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
            Last updated: {new Date(lastUpdated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
            <p className="font-semibold mb-1">How to get a new token:</p>
            <ol className="list-decimal list-inside space-y-1 text-amber-400/80">
              <li>Go to <a href="https://access.dhan.co" target="_blank" rel="noopener noreferrer" className="underline">access.dhan.co</a></li>
              <li>Log in → API → Generate / Copy Access Token</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                required
              />
            </div>
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
                <CheckCircle2 className="w-4 h-4" /> Token updated successfully! All API routes will use the new token immediately.
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
              {status === "saving" ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : "Update Token"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Token is stored in Firestore <code className="text-slate-500">admin/dhan</code> — no redeploy needed.
        </p>
      </div>
    </div>
  );
}
