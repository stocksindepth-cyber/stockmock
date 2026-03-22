"use client";

/**
 * AppModal — standardised modal for the whole app.
 *
 * Usage:
 *   const [modal, setModal] = useState(null);
 *   setModal({ type: "error", title: "...", message: "...", details: [...], actions: [...] });
 *   <AppModal modal={modal} onClose={() => setModal(null)} />
 *
 * modal shape:
 *   type     : "error" | "warning" | "info" | "success"   (default "info")
 *   title    : string
 *   message  : string | ReactNode
 *   details  : [{ label, value, highlight? }]   — optional key-value rows
 *   actions  : [{ label, onClick, variant? }]   — variant: "primary" | "danger" | "ghost"
 *              if omitted, a single "OK" dismiss button is shown
 */

import { useEffect } from "react";
import { X, AlertTriangle, AlertCircle, CheckCircle2, Info } from "lucide-react";

const TYPE_CONFIG = {
  error: {
    icon: AlertCircle,
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    borderTop: "border-t-2 border-rose-500/50",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    borderTop: "border-t-2 border-amber-500/50",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    borderTop: "border-t-2 border-emerald-500/50",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    borderTop: "border-t-2 border-blue-500/50",
  },
};

const VARIANT_STYLES = {
  primary: "bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/30",
  danger:  "bg-rose-600 hover:bg-rose-500 text-white font-bold",
  ghost:   "border border-white/15 text-slate-300 hover:text-white hover:bg-white/5",
};

export default function AppModal({ modal, onClose }) {
  // Close on ESC
  useEffect(() => {
    if (!modal) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, onClose]);

  if (!modal) return null;

  const { type = "info", title, message, details, actions } = modal;
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
  const Icon = cfg.icon;

  const resolvedActions = actions?.length
    ? actions
    : [{ label: "OK", onClick: onClose, variant: "primary" }];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative bg-[#0F1623] border border-white/12 rounded-2xl w-full max-w-md shadow-2xl ${cfg.borderTop} animate-in`}
        style={{ animation: "modalIn 0.15s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${cfg.iconBg}`}>
              <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
            </div>
            <div className="pt-1">
              <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
              {message && (
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{message}</p>
              )}
            </div>
          </div>

          {/* Detail rows */}
          {details?.length > 0 && (
            <div className="bg-white/4 border border-white/8 rounded-xl divide-y divide-white/6 mb-5">
              {details.map(({ label, value, highlight }, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className={`font-bold tabular-nums ${highlight ?? "text-white"}`}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className={`flex gap-2 ${resolvedActions.length > 1 ? "justify-end" : ""}`}>
            {resolvedActions.map(({ label, onClick, variant = "ghost" }, i) => (
              <button
                key={i}
                onClick={() => { onClick?.(); }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm transition-all active:scale-[0.98] ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.ghost}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
