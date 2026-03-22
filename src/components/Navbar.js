"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2, Layers, History, TrendingUp, Target, Zap,
  Menu, X, User, CreditCard, LogOut, ChevronDown,
  Sparkles, BookOpen, LineChart, Info, Mail, RefreshCcw,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

// ── Core tool links (logged-in only) ────────────────────────────────────────
const TOOL_LINKS = [
  { href: "/backtest",    label: "Backtest",     icon: History    },
  { href: "/chain",       label: "Option Chain", icon: BarChart2  },
  { href: "/builder",     label: "Builder",      icon: Layers     },
  { href: "/oi-analysis", label: "OI Analysis",  icon: TrendingUp },
  { href: "/screener",    label: "Screener",     icon: Target     },
  { href: "/paper-trade", label: "Paper Trade",  icon: Zap        },
];

// ── "More" dropdown — non-transactional / marketing ─────────────────────────
const MORE_LINKS = [
  { href: "/features",   label: "Features",        icon: Sparkles,   desc: "What OptionsGyani offers" },
  { href: "/pricing",    label: "Pricing",          icon: CreditCard, desc: "Free & Pro plans"          },
  { href: "/learn",      label: "Learn Options",    icon: BookOpen,   desc: "Guides from basics to Greeks" },
  { href: "/strategies", label: "All Strategies",   icon: LineChart,  desc: "Iron Condor, Straddle & more" },
  { href: "/simulator",  label: "Simulator",        icon: RefreshCcw, desc: "Replay market scenarios"   },
  { href: "/about",      label: "About",            icon: Info,       desc: "Our story & mission"       },
  { href: "/contact",    label: "Contact",          icon: Mail,       desc: "Get in touch"              },
];

// ── Logged-out marketing nav ─────────────────────────────────────────────────
const MARKETING_LINKS = [
  { href: "/features",   label: "Features"   },
  { href: "/strategies", label: "Strategies" },
  { href: "/pricing",    label: "Pricing"    },
  { href: "/learn",      label: "Learn"      },
];

// ── Tiny hook: close dropdown on outside click ──────────────────────────────
function useClickOutside(ref, handler) {
  useEffect(() => {
    function onDown(e) { if (ref.current && !ref.current.contains(e.target)) handler(); }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler]);
}

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, userProfile, loading } = useAuth();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [moreOpen,   setMoreOpen]     = useState(false);
  const moreRef = useRef(null);
  useClickOutside(moreRef, () => setMoreOpen(false));

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C16]/90 backdrop-blur-xl border-b border-white/5">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href={currentUser ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 shrink-0 mr-4"
          >
            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-white/10 flex items-center justify-center bg-transparent">
              <Image src="/logo.png" alt="OptionsGyani" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">OptionsGyani</span>
          </Link>

          {/* ── Desktop centre nav ── */}
          {!loading && (
            <div className="hidden lg:flex items-center gap-0.5 flex-1 px-2">
              {currentUser ? (
                // ── LOGGED IN: tool links + "More" dropdown ──
                <>
                  {TOOL_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        isActive(href)
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </Link>
                  ))}

                  {/* More dropdown */}
                  <div ref={moreRef} className="relative">
                    <button
                      onClick={() => setMoreOpen((o) => !o)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        moreOpen ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      More
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                    </button>

                    {moreOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-[#101726]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5">
                        {MORE_LINKS.map(({ href, label, icon: Icon, desc }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMoreOpen(false)}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                              isActive(href) ? "bg-blue-500/15 text-blue-300" : "text-slate-300 hover:text-white hover:bg-white/8"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium leading-none mb-1">{label}</div>
                              <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // ── LOGGED OUT: marketing links ──
                MARKETING_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      isActive(href)
                        ? "text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </Link>
                ))
              )}
            </div>
          )}

          {/* ── Right: auth cluster ── */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {loading ? null : currentUser ? (
              <div className="flex items-center gap-2 md:gap-3">
                {/* Free plan usage badge */}
                {userProfile?.plan === "free" && (
                  <Link
                    href="/pricing"
                    className="hidden sm:flex group items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold transition-all hover:border-amber-500/40 hover:bg-amber-500/15"
                    title="Daily backtests used"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {userProfile.simulationsRunToday || 0} / {userProfile.simulationsLimit || 5}
                  </Link>
                )}

                {/* Profile dropdown */}
                <div className="relative group/profile">
                  <button className="flex items-center gap-2.5 hover:bg-white/5 rounded-full pl-1.5 pr-2 md:pr-4 py-1 transition-colors border border-transparent hover:border-white/10">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 overflow-hidden shrink-0 relative">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-400 font-bold text-sm">
                          {currentUser.email?.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {userProfile?.plan && userProfile.plan !== "free" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border border-[#080C16] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      )}
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none">
                      <span className="text-sm font-medium text-white max-w-[100px] truncate">
                        {currentUser.displayName || currentUser.email?.split("@")[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {userProfile?.plan || "Free"} Plan
                      </span>
                    </div>
                  </button>

                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 translate-y-2 group-hover/profile:translate-y-0">
                    <div className="w-56 bg-[#101726]/98 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden flex flex-col p-1">
                      <div className="px-3 py-3 border-b border-white/5 mb-1 bg-white/5">
                        <p className="text-sm text-white font-medium truncate">{currentUser.displayName || "Trader"}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <User className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/pricing" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <CreditCard className="w-4 h-4" /> Billing & Plans
                      </Link>
                      <div className="h-px bg-white/5 my-1 mx-2" />
                      <button
                        onClick={() => signOut(auth)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login" className="px-3 md:px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="px-3 md:px-4 py-2 text-sm font-semibold bg-white text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white ml-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0B0F19]/98 backdrop-blur-xl px-4 py-3 space-y-0.5 max-h-[80vh] overflow-y-auto">
          {currentUser ? (
            <>
              <p className="px-4 pt-1 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Tools</p>
              {TOOL_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(href) ? "bg-blue-500/20 text-blue-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
              <div className="h-px bg-white/5 mx-2 my-2" />
              <p className="px-4 pt-1 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">More</p>
              {MORE_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(href) ? "bg-blue-500/20 text-blue-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </>
          ) : (
            <>
              {MARKETING_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(href) ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="h-px bg-white/5 mx-2 my-2" />
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                Log In
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center mx-2 py-2.5 rounded-lg text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all">
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
