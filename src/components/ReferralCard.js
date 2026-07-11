"use client";

import { useEffect, useMemo, useState } from "react";
import { Gift, Copy, Check, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { codeFromUid, referralUrl, whatsappShareUrl, REFERRAL_REWARD_CREDITS } from "@/lib/referral";
import { ensureReferralCode } from "@/lib/referralClient";

// Referral invite card — shown on the dashboard. Gives the user their link,
// a one-tap WhatsApp share, and live counts of who they've brought in.
export default function ReferralCard({ stat }) {
  const { currentUser, userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const code = useMemo(
    () => (currentUser?.uid ? codeFromUid(currentUser.uid) : null),
    [currentUser?.uid]
  );

  // Make sure the code→uid mapping doc exists so the link resolves.
  useEffect(() => {
    if (currentUser?.uid) ensureReferralCode(currentUser).catch(() => {});
  }, [currentUser?.uid]);

  if (!currentUser || !code) return null;

  const link = referralUrl(code);
  const signups = userProfile?.referralSignups || 0;
  const conversions = userProfile?.referralConversions || 0;
  const earned = conversions * REFERRAL_REWARD_CREDITS;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — user can still select the text */ }
  };

  return (
    <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 md:p-7">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Gift className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Invite a trader, both get {REFERRAL_REWARD_CREDITS} free backtests</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            They sign up and run one backtest — {REFERRAL_REWARD_CREDITS} credits land in both accounts. No cap.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 min-w-0">
          <span className="text-slate-300 text-sm truncate font-mono">{link}</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={whatsappShareUrl(code, { stat })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Share on WhatsApp
        </a>
      </div>

      <div className="flex items-center gap-6 mt-4 text-xs text-slate-400">
        <span><strong className="text-white">{signups}</strong> signed up</span>
        <span><strong className="text-white">{conversions}</strong> activated</span>
        <span><strong className="text-emerald-400">{earned}</strong> credits earned</span>
      </div>
    </div>
  );
}
