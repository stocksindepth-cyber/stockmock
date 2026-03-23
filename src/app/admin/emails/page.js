"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Mail,
  Users,
  Send,
  BarChart2,
  RefreshCw,
  ChevronDown,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Clock,
  Layout,
  Zap,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react";

const ADMIN_EMAIL = "support@optionsgyani.com";
const adminSecret =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_ADMIN_SECRET || ""
    : "";

// ─── Tiny Toast ────────────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all
        ${isErr ? "bg-red-950 border-red-500/40 text-red-300" : "bg-emerald-950 border-emerald-500/40 text-emerald-300"}`}
    >
      {isErr ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
      {toast.message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── 403 Page ──────────────────────────────────────────────────────────────────
function Forbidden() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">403 — Forbidden</h1>
        <p className="text-slate-400">You do not have permission to access this page.</p>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = "cyan" }) {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value ?? "—"}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ id, active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
        ${active ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────────
function Select({ value, onChange, options, className = "" }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/60 pr-10 ${className}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-slate-800">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────
function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>}
      <input
        {...props}
        className="w-full bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
      />
    </div>
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
function Textarea({ label, rows = 4, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>}
      <textarea
        rows={rows}
        {...props}
        className="w-full bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 resize-none"
      />
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ open, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white text-center mb-2">Confirm Send</h3>
        <p className="text-slate-400 text-sm text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ open, onClose, html }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <span className="font-semibold text-white">Email Preview</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-white rounded-b-2xl">
          {html ? (
            <iframe
              srcDoc={html}
              title="Email Preview"
              className="w-full h-full min-h-[480px] rounded-b-2xl"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              No preview available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
function TabDashboard({ showToast }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email/subscribers", {
        headers: { "x-admin-secret": adminSecret },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data.stats || {});
      setActivity((data.recent || []).slice(0, 20));
    } catch {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const quickSend = async (type, to = "all") => {
    setSending(null);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, segment: to, adminSecret }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Send failed");
      showToast(`${type} email sent successfully`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const QUICK_TYPES = [
    { type: "welcome", label: "Welcome", color: "cyan" },
    { type: "nudge", label: "Nudge", color: "purple" },
    { type: "market_update", label: "Market Update", color: "green" },
  ];

  const statusColor = (s) => {
    if (!s) return "text-slate-400";
    const l = s.toLowerCase();
    if (l === "sent" || l === "delivered") return "text-emerald-400";
    if (l === "failed" || l === "bounced") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Subscribers" value={loading ? "…" : stats?.totalSubscribers} color="cyan" />
        <StatCard icon={Zap} label="Pro Users" value={loading ? "…" : stats?.proUsers} color="green" />
        <StatCard icon={Send} label="Emails Sent (30d)" value={loading ? "…" : stats?.emailsSent30d} color="blue" />
        <StatCard icon={BarChart2} label="Open Rate" value={loading ? "…" : stats?.openRate ? `${stats.openRate}%` : "—"} color="purple" />
      </div>

      {/* Quick Send */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Send</h3>
        <div className="flex flex-wrap gap-3">
          {QUICK_TYPES.map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => setConfirm({ type, label })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all
                ${color === "cyan" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                  : color === "green" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"}`}
            >
              <Send className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="font-semibold text-white">Recent Email Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 20 email events</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">To</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/40">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-6 py-3.5">
                        <div className="h-3 bg-slate-700 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : activity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No activity yet
                  </td>
                </tr>
              ) : (
                activity.map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/40 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3.5 text-slate-300 tabular-nums">
                      {row.date ? new Date(row.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "short", timeStyle: "short" }) : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                        {row.type || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-300 font-mono text-xs">{row.to || row.segment || "—"}</td>
                    <td className={`px-6 py-3.5 font-medium ${statusColor(row.status)}`}>
                      {row.status || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!confirm}
        message={`Send a ${confirm?.label} email to all users?`}
        loading={sending === confirm?.type}
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          setSending(confirm.type);
          await quickSend(confirm.type);
          setSending(null);
          setConfirm(null);
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 — Compose & Send Campaign
// ═══════════════════════════════════════════════════════════════════════════════
function TabCompose({ showToast }) {
  const [audience, setAudience] = useState("all");
  const [singleEmail, setSingleEmail] = useState("");
  const [emailType, setEmailType] = useState("welcome");
  const [sending, setSending] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  // Market Update fields
  const [mu, setMu] = useState({
    niftySpot: "", niftyChange: "", bnfSpot: "", bnfChange: "",
    ivp: "", straddlePremium: "", aiInsight: "", topTrade: "",
  });
  // Custom fields
  const [custom, setCustom] = useState({ subject: "", body: "" });

  const audienceOptions = [
    { value: "all", label: "All Users" },
    { value: "free", label: "Free Users" },
    { value: "pro", label: "Pro Users" },
    { value: "single", label: "Single Email" },
  ];
  const typeOptions = [
    { value: "welcome", label: "Welcome" },
    { value: "market_update", label: "Market Update" },
    { value: "nudge", label: "Nudge" },
    { value: "custom", label: "Custom" },
  ];

  const buildPayload = () => {
    const base = { adminSecret, type: emailType };
    if (audience === "single") base.to = singleEmail;
    else base.segment = audience;

    if (emailType === "market_update") {
      base.props = {
        niftySpot: mu.niftySpot, niftyChange: mu.niftyChange,
        bnfSpot: mu.bnfSpot, bnfChange: mu.bnfChange,
        ivp: mu.ivp, straddlePremium: mu.straddlePremium,
        aiInsight: mu.aiInsight, topTrade: mu.topTrade,
      };
    } else if (emailType === "custom") {
      base.props = { subject: custom.subject, body: custom.body };
    }
    return base;
  };

  const handlePreview = async () => {
    try {
      const res = await fetch("/api/email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewHtml(data.html || "");
      } else {
        // Fallback: show generic preview
        setPreviewHtml(`<html><body style="font-family:sans-serif;padding:32px;background:#f8fafc">
          <h2>Preview not available</h2>
          <p>Type: <strong>${emailType}</strong></p>
          <p>Audience: <strong>${audience === "single" ? singleEmail : audience}</strong></p>
        </body></html>`);
      }
    } catch {
      setPreviewHtml(`<html><body style="font-family:sans-serif;padding:32px">
        <h2>Preview unavailable</h2><p>Could not load preview template.</p>
      </body></html>`);
    }
    setPreview(true);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Send failed");
      showToast("Campaign sent successfully!", "success");
      setConfirm(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSending(false);
    }
  };

  const audienceLabel = audience === "single" ? singleEmail || "single recipient"
    : audienceOptions.find(o => o.value === audience)?.label;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-white text-lg">Compose Campaign</h3>

        {/* Audience */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Audience</label>
          <Select value={audience} onChange={setAudience} options={audienceOptions} />
        </div>

        {audience === "single" && (
          <Input
            label="Recipient Email"
            type="email"
            value={singleEmail}
            onChange={(e) => setSingleEmail(e.target.value)}
            placeholder="user@example.com"
          />
        )}

        {/* Email Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Type</label>
          <Select value={emailType} onChange={setEmailType} options={typeOptions} />
        </div>

        {/* Market Update Fields */}
        {emailType === "market_update" && (
          <div className="space-y-4 p-4 bg-slate-700/40 rounded-xl border border-slate-600/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Market Data</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="NIFTY Spot" type="number" placeholder="24500" value={mu.niftySpot}
                onChange={(e) => setMu(p => ({ ...p, niftySpot: e.target.value }))} />
              <Input label="NIFTY Change %" type="number" placeholder="-0.45" value={mu.niftyChange}
                onChange={(e) => setMu(p => ({ ...p, niftyChange: e.target.value }))} />
              <Input label="BANKNIFTY Spot" type="number" placeholder="52000" value={mu.bnfSpot}
                onChange={(e) => setMu(p => ({ ...p, bnfSpot: e.target.value }))} />
              <Input label="BANKNIFTY Change %" type="number" placeholder="0.32" value={mu.bnfChange}
                onChange={(e) => setMu(p => ({ ...p, bnfChange: e.target.value }))} />
              <Input label="IVP" type="number" placeholder="65" value={mu.ivp}
                onChange={(e) => setMu(p => ({ ...p, ivp: e.target.value }))} />
              <Input label="Straddle Premium" type="number" placeholder="320" value={mu.straddlePremium}
                onChange={(e) => setMu(p => ({ ...p, straddlePremium: e.target.value }))} />
            </div>
            <Input label="Top Trade Description" placeholder="Short Iron Fly on NIFTY…" value={mu.topTrade}
              onChange={(e) => setMu(p => ({ ...p, topTrade: e.target.value }))} />
            <Textarea label="AI Insight" rows={3} placeholder="Market narrative…" value={mu.aiInsight}
              onChange={(e) => setMu(p => ({ ...p, aiInsight: e.target.value }))} />
          </div>
        )}

        {/* Custom Fields */}
        {emailType === "custom" && (
          <div className="space-y-4 p-4 bg-slate-700/40 rounded-xl border border-slate-600/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Custom Email</p>
            <Input label="Subject" placeholder="Your email subject…" value={custom.subject}
              onChange={(e) => setCustom(p => ({ ...p, subject: e.target.value }))} />
            <Textarea label="HTML Body" rows={8} placeholder="<p>Your email HTML…</p>" value={custom.body}
              onChange={(e) => setCustom(p => ({ ...p, body: e.target.value }))} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={() => setConfirm(true)}
            disabled={audience === "single" && !singleEmail}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-xl text-sm font-bold transition-colors"
          >
            <Send className="w-4 h-4" /> Send Campaign
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirm}
        message={`Send "${emailType}" email to ${audienceLabel}?`}
        loading={sending}
        onCancel={() => setConfirm(false)}
        onConfirm={handleSend}
      />
      <PreviewModal open={preview} onClose={() => setPreview(false)} html={previewHtml} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 — Market Update (AI-Assisted)
// ═══════════════════════════════════════════════════════════════════════════════
function TabMarketUpdate({ showToast }) {
  const [form, setForm] = useState({
    niftySpot: "", niftyChange: "", bnfSpot: "", bnfChange: "",
    ivp: "", straddlePremium: "", aiInsight: "", topTrade: "",
  });
  const [schedule, setSchedule] = useState("now");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingIndices, setLoadingIndices] = useState(false);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);

  // Pre-fill from /api/indices
  useEffect(() => {
    const fetchIndices = async () => {
      setLoadingIndices(true);
      try {
        const res = await fetch("/api/indices");
        if (!res.ok) return;
        const d = await res.json();
        setForm(p => ({
          ...p,
          niftySpot: d.nifty?.spot ?? d.NIFTY?.ltp ?? "",
          niftyChange: d.nifty?.change ?? d.NIFTY?.change ?? "",
          bnfSpot: d.banknifty?.spot ?? d.BANKNIFTY?.ltp ?? "",
          bnfChange: d.banknifty?.change ?? d.BANKNIFTY?.change ?? "",
        }));
      } catch {
        // silent
      } finally {
        setLoadingIndices(false);
      }
    };
    fetchIndices();
  }, []);

  const generateAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/email/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify({
          niftySpot: form.niftySpot, niftyChange: form.niftyChange,
          bnfSpot: form.bnfSpot, bnfChange: form.bnfChange,
          ivp: form.ivp, straddlePremium: form.straddlePremium,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "AI generation failed");
      setForm(p => ({
        ...p,
        aiInsight: d.insight || d.summary || d.text || "",
        topTrade: d.topTrade || p.topTrade,
      }));
      showToast("AI insight generated!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/email/market-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, schedule, adminSecret }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to send");
      showToast(schedule === "now" ? "Market update sent!" : "Scheduled for tomorrow 8am!", "success");
      setHistory(prev => [
        { date: new Date().toISOString(), subject: `Market Update ${new Date().toLocaleDateString("en-IN")}`, recipients: d.sent || "—" },
        ...prev.slice(0, 4),
      ]);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-lg">Market Update</h3>
          <button
            onClick={generateAI}
            disabled={loadingAI}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            {loadingAI
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Sparkles className="w-4 h-4" />}
            {loadingAI ? "Generating…" : "Generate with AI"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input label={`NIFTY Spot${loadingIndices ? " (loading…)" : ""}`}
              type="number" placeholder="24500" value={form.niftySpot}
              onChange={(e) => setForm(p => ({ ...p, niftySpot: e.target.value }))} />
          </div>
          <Input label="NIFTY Change %" type="number" placeholder="-0.45" value={form.niftyChange}
            onChange={(e) => setForm(p => ({ ...p, niftyChange: e.target.value }))} />
          <Input label="BANKNIFTY Spot" type="number" placeholder="52000" value={form.bnfSpot}
            onChange={(e) => setForm(p => ({ ...p, bnfSpot: e.target.value }))} />
          <Input label="BANKNIFTY Change %" type="number" placeholder="0.32" value={form.bnfChange}
            onChange={(e) => setForm(p => ({ ...p, bnfChange: e.target.value }))} />
          <Input label="IVP" type="number" placeholder="65" value={form.ivp}
            onChange={(e) => setForm(p => ({ ...p, ivp: e.target.value }))} />
          <Input label="Straddle Premium" type="number" placeholder="320" value={form.straddlePremium}
            onChange={(e) => setForm(p => ({ ...p, straddlePremium: e.target.value }))} />
        </div>

        <Input label="Top Trade Description" placeholder="Short Iron Fly on NIFTY 24500 CE/PE…" value={form.topTrade}
          onChange={(e) => setForm(p => ({ ...p, topTrade: e.target.value }))} />

        <Textarea label="AI Insight (editable)" rows={5}
          placeholder="Click 'Generate with AI' or write your own market insight here…"
          value={form.aiInsight}
          onChange={(e) => setForm(p => ({ ...p, aiInsight: e.target.value }))} />

        {/* Schedule */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Schedule</label>
          <div className="flex gap-3">
            {[
              { val: "now", label: "Send Now", icon: Zap },
              { val: "tomorrow_8am", label: "Tomorrow 8am", icon: Clock },
            ].map(({ val, label, icon: Icon }) => (
              <button
                key={val}
                onClick={() => setSchedule(val)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex-1 justify-center
                  ${schedule === val
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                    : "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"}`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 rounded-xl text-sm font-bold transition-colors"
        >
          {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? "Sending…" : schedule === "now" ? "Send Market Update" : "Schedule Market Update"}
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Recent Sends (this session)</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-slate-700/40 rounded-xl">
                <div>
                  <p className="text-sm text-white font-medium">{h.subject}</p>
                  <p className="text-xs text-slate-400">{new Date(h.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                </div>
                <span className="text-xs text-emerald-400 font-medium">{h.recipients} sent</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4 — Templates Preview
// ═══════════════════════════════════════════════════════════════════════════════
const TEMPLATES = [
  { id: "welcome", name: "Welcome", description: "Sent on first sign-up. Introduces the platform.", icon: Mail, lastSent: null },
  { id: "login", name: "Login OTP", description: "Magic link / OTP email for passwordless login.", icon: Zap, lastSent: null },
  { id: "premium_welcome", name: "Premium Welcome", description: "Sent when a user upgrades to Pro.", icon: TrendingUp, lastSent: null },
  { id: "invoice", name: "Invoice / Receipt", description: "Payment confirmation with invoice details.", icon: FileText, lastSent: null },
  { id: "market_update", name: "Market Update", description: "Daily market summary with NIFTY/BNF data.", icon: BarChart2, lastSent: null },
  { id: "nudge", name: "Re-Engagement Nudge", description: "Sent to inactive free users to drive return.", icon: Calendar, lastSent: null },
];

function TabTemplates({ showToast }) {
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [loading, setLoading] = useState(null);

  const openPreview = async (tmpl) => {
    setLoading(tmpl.id);
    try {
      const res = await fetch("/api/email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tmpl.id, adminSecret }),
      });
      if (res.ok) {
        const d = await res.json();
        setPreviewHtml(d.html || "");
      } else {
        setPreviewHtml(`<html><body style="font-family:sans-serif;padding:32px;background:#f8fafc;color:#1e293b">
          <h2 style="color:#0891b2">${tmpl.name}</h2>
          <p>${tmpl.description}</p>
          <p style="color:#94a3b8;font-size:12px">Full preview requires the /api/email/preview endpoint.</p>
        </body></html>`);
      }
    } catch {
      setPreviewHtml(`<html><body style="font-family:sans-serif;padding:32px"><h2>${tmpl.name}</h2><p>Preview unavailable.</p></body></html>`);
    }
    setPreviewName(tmpl.name);
    setLoading(null);
    setPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <div
              key={tmpl.id}
              className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex flex-col hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <h4 className="font-semibold text-white mb-1">{tmpl.name}</h4>
              <p className="text-xs text-slate-400 flex-1 mb-4">{tmpl.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {tmpl.lastSent ? `Last sent ${tmpl.lastSent}` : "Never sent"}
                </span>
                <button
                  onClick={() => openPreview(tmpl)}
                  disabled={loading === tmpl.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                >
                  {loading === tmpl.id
                    ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    : <Eye className="w-3.5 h-3.5" />}
                  Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <PreviewModal open={preview} onClose={() => setPreview(false)} html={previewHtml} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminEmailsPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/login");
  }, [currentUser, loading, router]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  if (loading || !currentUser) return null;
  if (currentUser.email !== ADMIN_EMAIL) return <Forbidden />;

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "compose", label: "Compose & Send", icon: Send },
    { id: "market", label: "Market Update", icon: TrendingUp },
    { id: "templates", label: "Templates", icon: Layout },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Email Management</h1>
              <p className="text-xs text-slate-500">OptionsGyani Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              active={activeTab === tab.id}
              onClick={setActiveTab}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && <TabDashboard showToast={showToast} />}
        {activeTab === "compose" && <TabCompose showToast={showToast} />}
        {activeTab === "market" && <TabMarketUpdate showToast={showToast} />}
        {activeTab === "templates" && <TabTemplates showToast={showToast} />}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
