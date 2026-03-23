"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Receipt, ArrowLeft, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <BillingContent />
    </ProtectedRoute>
  );
}

const PLAN_LABELS = { pro: "Pro", elite: "Elite", free: "Free" };
const STATUS_META = {
  PAID_SUCCESS: { label: "Paid",    icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10" },
  PENDING:      { label: "Pending", icon: Clock,       color: "text-amber-400 bg-amber-500/10"    },
  FAILED:       { label: "Failed",  icon: XCircle,     color: "text-rose-400 bg-rose-500/10"      },
};

function formatPaise(paise) {
  return "₹" + (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Printable Invoice ─────────────────────────────────────────────────────────
function Invoice({ txn, user }) {
  const planLabel    = PLAN_LABELS[txn.purchasedPlan] || txn.purchasedPlan;
  const baseAmount   = Math.round(txn.amount / 1.18);
  const gstAmount    = txn.amount - baseAmount;
  const billingPeriod = txn.durationDays === 365 ? "Annual" : "Monthly";

  return (
    <div id="printable-invoice" className="bg-white text-slate-900 p-10 text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OptionsGyani</h1>
          <p className="text-slate-500 text-xs mt-1">optionsgyani.com</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs uppercase tracking-widest">Invoice</p>
          <p className="font-mono text-slate-700 text-sm mt-1">{txn.razorpayPaymentId}</p>
          <p className="text-slate-500 text-xs mt-1">{formatDate(txn.timestamp)}</p>
        </div>
      </div>
      <hr className="border-slate-200 mb-6" />

      {/* Bill to */}
      <div className="mb-8">
        <p className="text-xs uppercase text-slate-400 tracking-widest mb-1">Bill To</p>
        <p className="font-semibold text-slate-800">{user?.displayName || "—"}</p>
        <p className="text-slate-500">{user?.email}</p>
      </div>

      {/* Line items */}
      <table className="w-full mb-6 text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <th className="text-left py-2 font-medium">Description</th>
            <th className="text-right py-2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-3">
              OptionsGyani {planLabel} Plan — {billingPeriod}
              <p className="text-slate-400 text-xs mt-0.5">Order: {txn.razorpayOrderId}</p>
            </td>
            <td className="py-3 text-right font-mono">{formatPaise(baseAmount)}</td>
          </tr>
          <tr className="border-b border-slate-100 text-slate-500">
            <td className="py-3">GST @ 18%</td>
            <td className="py-3 text-right font-mono">{formatPaise(gstAmount)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-4 font-bold text-slate-800">Total Paid</td>
            <td className="pt-4 text-right font-bold font-mono text-slate-900">{formatPaise(txn.amount)}</td>
          </tr>
        </tfoot>
      </table>

      <hr className="border-slate-200 mb-6" />
      <p className="text-slate-400 text-xs text-center">
        OptionsGyani Analytics · Not SEBI registered · Educational use only
      </p>
    </div>
  );
}

// ─── Main billing content ──────────────────────────────────────────────────────
function BillingContent() {
  const { currentUser, userProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`/api/billing/transactions?userId=${currentUser.uid}`)
      .then((r) => r.json())
      .then((d) => { setTransactions(d.transactions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentUser]);

  function printInvoice() {
    const el = document.getElementById("printable-invoice");
    if (!el) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice</title>
      <style>body{font-family:sans-serif;padding:40px;color:#1e293b;}
      table{width:100%;border-collapse:collapse;}
      th,td{padding:8px 4px;text-align:left;}
      th{font-size:11px;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;}
      td{border-bottom:1px solid #f1f5f9;}
      .right{text-align:right;}hr{border:none;border-top:1px solid #e2e8f0;margin:24px 0;}
      </style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  }

  const isPro = userProfile?.plan && userProfile.plan !== "free";

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <Link href="/profile" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-white">Billing & Invoices</h1>
          <p className="text-slate-400 mt-1 text-sm">Your payment history and downloadable receipts.</p>
        </div>

        {/* Current plan card */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Current Plan</p>
            <p className="text-white font-bold text-lg capitalize">{userProfile?.plan || "Free"}</p>
            {isPro && userProfile?.subscriptionExpiry && (
              <p className="text-slate-400 text-sm mt-0.5">
                Active until {formatDate(userProfile.subscriptionExpiry)}
              </p>
            )}
          </div>
          {!isPro && (
            <Link href="/pricing" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold whitespace-nowrap">
              Upgrade
            </Link>
          )}
        </div>

        {/* Transaction list */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            <h2 className="text-white font-semibold">Payment History</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500 animate-pulse">Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">No transactions yet.</p>
              <Link href="/pricing" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block transition-colors">
                View plans →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {transactions.map((txn) => {
                const meta = STATUS_META[txn.status] || STATUS_META.PENDING;
                const StatusIcon = meta.icon;
                return (
                  <li key={txn.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">
                        {PLAN_LABELS[txn.purchasedPlan] || txn.purchasedPlan} Plan
                        <span className="text-slate-500 font-normal">
                          {" "}· {txn.durationDays === 365 ? "Annual" : "Monthly"}
                        </span>
                      </p>
                      <p className="text-slate-500 text-xs font-mono mt-0.5 truncate">{txn.razorpayPaymentId}</p>
                      <p className="text-slate-600 text-xs mt-0.5">{formatDate(txn.timestamp)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-semibold font-mono text-sm">{formatPaise(txn.amount)}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${meta.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </div>
                    {txn.status === "PAID_SUCCESS" && (
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="ml-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="text-slate-600 text-xs text-center">
          All prices include 18% GST · For support: support@optionsgyani.com
        </p>
      </div>

      {/* Invoice modal */}
      {selectedTxn && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedTxn(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <p className="font-semibold text-slate-800 text-sm">Invoice · {selectedTxn.razorpayPaymentId}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={printInvoice}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download / Print
                </button>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg leading-none transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <Invoice txn={selectedTxn} user={currentUser} />
          </div>
        </div>
      )}
    </div>
  );
}
