"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, User, Shield, Zap, Calendar, ArrowRight, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Auto-hide after 8 seconds
      const t = setTimeout(() => setShowSuccess(false), 8000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  if (loading || !currentUser) return null;

  const isPro = userProfile?.plan && userProfile.plan !== "free";
  const usedRuns = userProfile?.simulationsRunToday || 0;
  const totalRuns = userProfile?.simulationsLimit || 5;
  const progressPercent = Math.min((usedRuns / totalRuns) * 100, 100);

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>

        {/* Payment Success Banner */}
        {showSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4 animate-pulse-once">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 font-semibold text-lg">Payment Successful! 🎉</p>
              <p className="text-emerald-400/80 text-sm mt-1">
                Your{" "}
                <span className="font-semibold capitalize">{searchParams.get("plan") || "Pro"}</span>{" "}
                plan is now active. Enjoy unlimited backtesting on 8+ years of NSE data.
              </p>
              <Link href="/backtest" className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium mt-2 transition-colors">
                Start backtesting now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
        
        {/* Account Info Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-500/30 flex items-center justify-center shrink-0 overflow-hidden relative">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-blue-400" />
            )}
            {isPro && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-[#080C16] p-1 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                <Shield className="w-3 h-3 fill-current" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {currentUser.displayName || "OptionsGyani Trader"}
            </h2>
            <p className="text-slate-400 font-mono text-sm mb-3">{currentUser.email}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPro ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
              {isPro ? "Pro Member" : "Free Plan"}
            </div>
          </div>
        </div>

        {/* Freemium Usage Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Simulation Quota
              </h3>
              <span className="text-sm font-medium text-slate-400">
                Resets Midnight
              </span>
            </div>

            {isPro ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="text-white font-bold mb-1">Unlimited Execution</h4>
                <p className="text-sm text-slate-400">Your Pro tier grants you infinite backtesting.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-mono text-white">{usedRuns}</span>
                  <span className="text-slate-400 mb-1">/ {totalRuns} Runs Today</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${progressPercent >= 100 ? 'bg-rose-500' : 'bg-blue-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <Link 
                  href="/pricing"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                >
                  Increase Limits
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                Billing Status
              </h3>
              {isPro ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-emerald-400" />
                    Active Subscription
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-emerald-400" />
                    Renews: {userProfile?.subscriptionExpiry ? new Date(userProfile.subscriptionExpiry).toLocaleDateString() : 'Auto-renewing'}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm leading-relaxed">
                  You are currently on the Free tier. Upgrade to access historical simulation prior to 2021, unlocked API calls, and automated Strategy backtesting.
                </p>
              )}
            </div>
            {!isPro && (
              <Link 
                href="/pricing"
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all"
              >
                View Plans
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
