"use client";

// Founder-only queue for the Dhan refer-to-unlock flow. Paste the admin secret
// once (kept only in memory), review pending Client IDs, and Approve to grant
// Pro free. All writes go through the x-admin-secret API.
import { useState } from "react";

export default function AdminUnlockPage() {
  const [secret, setSecret] = useState("");
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/admin/unlock?status=pending", { headers: { "x-admin-secret": secret } });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setItems(d.items);
    } catch (e) { setMsg(e.message); setItems(null); } finally { setBusy(false); }
  };

  const act = async (uid, action, plan = "pro") => {
    setMsg("");
    try {
      const r = await fetch("/api/admin/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ uid, action, plan }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setMsg(`${action}d ${uid}`);
      setItems((prev) => prev.filter((x) => x.uid !== uid));
    } catch (e) { setMsg(e.message); }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <section className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-4">Unlock requests — approve free Pro</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={load} disabled={busy || !secret} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold disabled:opacity-50">
            {busy ? "Loading…" : "Load pending"}
          </button>
        </div>
        {msg && <p className="text-xs text-amber-300 mb-3">{msg}</p>}

        {items && items.length === 0 && <p className="text-slate-500 text-sm">No pending requests.</p>}
        {items && items.map((x) => (
          <div key={x.uid} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 mb-2">
            <div className="min-w-0">
              <div className="text-sm text-white truncate">{x.email || x.uid}</div>
              <div className="text-xs text-slate-400">Dhan Client ID: <strong className="text-slate-200">{x.dhanClientId}</strong> · {String(x.createdAt).slice(0, 16)}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => act(x.uid, "approve", "pro")} className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold">Pro</button>
              <button onClick={() => act(x.uid, "approve", "elite")} className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold">Elite</button>
              <button onClick={() => act(x.uid, "reject")} className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs">Reject</button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-slate-600 mt-4">
          Verify the Client ID against Dhan&apos;s affiliate report AND the first-trade snapshot in support@ inbox. Pro = first trade done · Elite = actively trading.
        </p>
      </section>
    </main>
  );
}
