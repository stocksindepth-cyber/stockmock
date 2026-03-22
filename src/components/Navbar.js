"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, BarChart2, Layers, History, BookOpen, TrendingUp, Menu, X, UserCircle, LogOut, Zap, User, CreditCard, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

const NAV_ITEMS = [
  { href: "/features", label: "Features", icon: Sparkles },
  { href: "/builder", label: "Strategy Builder", icon: Layers },
  { href: "/chain", label: "Option Chain", icon: BarChart2 },
  { href: "/oi-analysis", label: "OI Analysis", icon: TrendingUp },
  { href: "/screener", label: "Screener", icon: Target },
  { href: "/backtest", label: "Backtesting", icon: History },
  { href: "/simulator", label: "Simulator", icon: Zap },
  { href: "/paper-trade", label: "Paper Trading", icon: TrendingUp },
  { href: "/learn", label: "Learn", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, userProfile, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C16]/80 backdrop-blur-xl border-b border-white/5">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-10 xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Target className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-bold tracking-tight text-white">OptionsGyani</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname?.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            
            {/* Auth Cluster */}
            {loading ? null : currentUser ? (
              <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
                {userProfile?.plan === "free" && (
                  <Link href="/pricing" className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold transition-all hover:border-amber-500/40" title="Daily Free Limit">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{userProfile.simulationsRunToday || 0} / {userProfile.simulationsLimit || 5} Runs</span>
                  </Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative group/profile">
                  <button className="flex items-center gap-3 hover:bg-white/5 rounded-full pl-2 pr-4 py-1.5 transition-colors border border-transparent hover:border-white/10">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 overflow-hidden shrink-0 relative">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-400 font-bold text-sm">{currentUser.email?.charAt(0).toUpperCase()}</span>
                      )}
                      
                      {/* Pro Badge Indicator */}
                      {userProfile?.plan && userProfile.plan !== "free" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border border-[#080C16] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      )}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-none">
                      <span className="text-sm font-medium text-white">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{userProfile?.plan || 'Free'} Plan</span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 translate-y-2 group-hover/profile:translate-y-0">
                    <div className="w-56 glass-card rounded-xl border border-white/10 shadow-xl overflow-hidden flex flex-col p-1">
                      <div className="px-3 py-3 border-b border-white/5 mb-1 bg-white/5">
                        <p className="text-sm text-white font-medium truncate">{currentUser.displayName || "Trader"}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                      
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      
                      <Link href="/pricing" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <CreditCard className="w-4 h-4" />
                        Billing & Plans
                      </Link>
                      
                      <div className="h-px bg-white/5 my-1 mx-2" />
                      
                      <button 
                        onClick={() => signOut(auth)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Log In</Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-semibold bg-white text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0B0F19] px-4 py-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
