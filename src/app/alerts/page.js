"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

// ─── Constants ────────────────────────────────────────────────────────────────

const SYMBOLS = ["NIFTY", "BANKNIFTY", "FINNIFTY"];

const METRICS = [
  { value: "ivp", label: "IVP (IV Percentile)" },
  { value: "ivr", label: "IVR (IV Rank)" },
  { value: "iv",  label: "Current IV%" },
];

const CONDITIONS = [
  { value: "above", label: "goes above" },
  { value: "below", label: "goes below" },
];

const METRIC_HINTS = {
  ivp: "Common: 75 (rich), 25 (cheap)",
  ivr: "Common: 75 (high), 25 (low)",
  iv:  "",
};

const METRIC_LABELS = {
  ivp: "IVP (IV Percentile)",
  ivr: "IVR (IV Rank)",
  iv:  "Current IV%",
};

const SYMBOL_STYLES = {
  NIFTY:     { badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",     dot: "bg-blue-400" },
  BANKNIFTY: { badge: "bg-violet-500/20 text-violet-300 border-violet-500/30", dot: "bg-violet-400" },
  FINNIFTY:  { badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
};

const FREE_LIMIT = 5;
const PRO_LIMIT  = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts) {
  if (!ts) return null;
  const date = new Date(ts);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function AlertSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 rounded-xl bg-white/5 border border-white/[0.06]"
        />
      ))}
    </div>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────

function AlertCard({ alert, onDelete, onToggle }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const symbolStyle = SYMBOL_STYLES[alert.symbol] || SYMBOL_STYLES.NIFTY;

  async function handleDelete() {
    setDeleting(true);
    await onDelete(alert.id);
    setDeleting(false);
  }

  async function handleToggle() {
    setToggling(true);
    await onToggle(alert.id, !alert.active);
    setToggling(false);
  }

  const lastTriggered = formatTimestamp(alert.lastTriggeredAt);

  return (
    <div className="group relative flex items-center gap-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.06] transition-all duration-200 px-5 py-4">
      {/* Symbol badge */}
      <div className="shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border ${symbolStyle.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${symbolStyle.dot}`} />
          {alert.symbol}
        </span>
      </div>

      {/* Alert description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          <span className="text-slate-300">{METRIC_LABELS[alert.metric] || alert.metric}</span>
          &nbsp;
          <span className="text-slate-400">{alert.condition === "above" ? "goes above" : "goes below"}</span>
          &nbsp;
          <span className="text-indigo-300 font-semibold">{alert.threshold}</span>
        </p>
        {lastTriggered ? (
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
            Last triggered: {lastTriggered}
          </p>
        ) : (
          <p className="text-xs text-slate-600 mt-0.5">Never triggered</p>
        )}
      </div>

      {/* Active toggle */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={alert.active ? "Deactivate alert" : "Activate alert"}
        className="shrink-0 relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
        style={{ backgroundColor: alert.active ? "#4f46e5" : "rgba(255,255,255,0.1)" }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: alert.active ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Delete alert"
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 disabled:opacity-40"
      >
        {deleting ? (
          <span className="w-4 h-4 border-2 border-rose-400/40 border-t-rose-400 rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// ─── Main Page (inner) ────────────────────────────────────────────────────────

function AlertsContent() {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();

  const isPro   = userProfile?.plan && userProfile.plan !== "free";
  const maxAlerts = isPro ? PRO_LIMIT : FREE_LIMIT;

  // Form state
  const [symbol,    setSymbol]    = useState("NIFTY");
  const [metric,    setMetric]    = useState("ivp");
  const [condition, setCondition] = useState("above");
  const [threshold, setThreshold] = useState(75);
  const [creating,  setCreating]  = useState(false);
  const [formError, setFormError] = useState("");

  // Alerts state
  const [alerts,      setAlerts]      = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState("");

  // ── Fetch alerts on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchAlerts() {
      if (!currentUser) return;
      setFetchLoading(true);
      setFetchError("");
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch("/api/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (!cancelled) setAlerts(data.alerts || []);
      } catch (err) {
        if (!cancelled) setFetchError("Failed to load alerts. Please refresh.");
      } finally {
        if (!cancelled) setFetchLoading(false);
      }
    }

    fetchAlerts();
    return () => { cancelled = true; };
  }, [currentUser]);

  // ── Create alert ───────────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");

    if (alerts.length >= maxAlerts) {
      setFormError(
        isPro
          ? `You've reached the Pro limit of ${PRO_LIMIT} alerts.`
          : `Free plan limit of ${FREE_LIMIT} alerts reached. Upgrade to Pro for up to ${PRO_LIMIT} alerts.`
      );
      return;
    }

    if (threshold < 0 || threshold > 100) {
      setFormError("Threshold must be between 0 and 100.");
      return;
    }

    setCreating(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol, metric, condition, threshold: Number(threshold) }),
      });

      const data = await res.json();

      if (res.status === 429 || data.limitReached) {
        setFormError(
          isPro
            ? `Pro plan limit of ${PRO_LIMIT} alerts reached.`
            : `Free plan: up to ${FREE_LIMIT} alerts. Upgrade to Pro for ${PRO_LIMIT} alerts.`
        );
        return;
      }

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);

      setAlerts((prev) => [data.alert, ...prev]);
    } catch (err) {
      setFormError(err.message || "Failed to create alert. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  // ── Delete alert ───────────────────────────────────────────────────────────
  async function handleDelete(alertId) {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/alerts?id=${alertId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      // Silent fail — alert stays in list
    }
  }

  // ── Toggle alert ───────────────────────────────────────────────────────────
  async function handleToggle(alertId, newActive) {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/alerts?id=${alertId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: newActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, active: newActive } : a))
      );
    } catch (err) {
      // Silent fail — toggle reverts visually on next render
    }
  }

  const hint = METRIC_HINTS[metric];
  const atLimit = alerts.length >= maxAlerts;

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-indigo-400" style={{ width: 18, height: 18 }} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">IV Alerts</h1>
            </div>
            <p className="text-slate-400 text-sm pl-12">
              Get notified when volatility hits your target levels.
            </p>
          </div>

          {/* Alert count pill */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-slate-400">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            {fetchLoading ? "—" : alerts.length} / {maxAlerts} alerts
          </div>
        </div>

        {/* ── Info banner ──────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-500/[0.07] border border-blue-500/20 px-4 py-3.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-200/80 leading-relaxed">
            Get email notifications when NIFTY IVP crosses key levels.{" "}
            <span className="text-blue-300 font-medium">
              Checks run twice daily at 7:30 AM and 7:30 PM IST.
            </span>
          </p>
        </div>

        {/* ── Free plan notice ─────────────────────────────────────────────── */}
        {!isPro && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-sm text-amber-200/80">
                Free plan: up to {FREE_LIMIT} alerts.{" "}
                <a href="/pricing" className="text-amber-300 font-medium hover:underline">
                  Upgrade to Pro
                </a>{" "}
                for {PRO_LIMIT} alerts.
              </p>
            </div>
            <div className="shrink-0 text-xs text-amber-400/70 font-medium">
              {alerts.length}/{FREE_LIMIT} used
            </div>
          </div>
        )}

        {/* ── Create alert form ─────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.09] p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Create Alert</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Row 1 — Symbol + Metric */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Symbol */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 block">Symbol</label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full rounded-lg bg-white/[0.06] border border-white/[0.1] text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 appearance-none cursor-pointer transition-colors"
                >
                  {SYMBOLS.map((s) => (
                    <option key={s} value={s} className="bg-[#0f1629]">{s}</option>
                  ))}
                </select>
              </div>

              {/* Metric */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 block">Metric</label>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  className="w-full rounded-lg bg-white/[0.06] border border-white/[0.1] text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 appearance-none cursor-pointer transition-colors"
                >
                  {METRICS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-[#0f1629]">{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 block">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-lg bg-white/[0.06] border border-white/[0.1] text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 appearance-none cursor-pointer transition-colors"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#0f1629]">{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Threshold */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 block">Threshold</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="0–100"
                  className="w-full rounded-lg bg-white/[0.06] border border-white/[0.1] text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-colors placeholder-slate-600"
                />
              </div>
            </div>

            {/* Hint text */}
            {hint && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                {hint}
              </p>
            )}

            {/* Alert preview */}
            <div className="rounded-lg bg-indigo-500/[0.07] border border-indigo-500/20 px-4 py-2.5 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-200/70">
                Notify me when{" "}
                <span className="text-white font-medium">{symbol}</span>{" "}
                <span className="text-indigo-300">{METRIC_LABELS[metric]}</span>{" "}
                {condition === "above" ? "goes above" : "goes below"}{" "}
                <span className="text-white font-medium">{threshold}</span>
              </p>
            </div>

            {/* Error message */}
            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300">{formError}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating || atLimit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
                {creating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Alert
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Alerts list ───────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Your Alerts
            </h2>
            {!fetchLoading && alerts.length > 0 && (
              <span className="text-xs text-slate-500">
                {alerts.filter((a) => a.active).length} active
              </span>
            )}
          </div>

          {fetchLoading ? (
            <AlertSkeleton />
          ) : fetchError ? (
            <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/20 px-5 py-4">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-sm text-rose-300">{fetchError}</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] border-dashed">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-indigo-400/60" />
              </div>
              <p className="text-sm font-medium text-slate-400">No alerts yet.</p>
              <p className="text-xs text-slate-600">Create your first alert above.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Export (protected) ────────────────────────────────────────────────────────

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <AlertsContent />
    </ProtectedRoute>
  );
}
