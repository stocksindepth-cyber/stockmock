"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Zap, Target, Activity, Database, CheckCircle, Search, History as HistoryIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  // Redirect authenticated users straight to their dashboard
  useEffect(() => {
    if (!loading && currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // While auth is resolving, render nothing to prevent flash of marketing page
  if (loading || currentUser) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "OptionsGyani",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Advanced options analytics, backtesting software, and strategy building tools for Indian derivatives traders.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is OptionsGyani?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "OptionsGyani is an institutional-grade options strategy builder and backtesting software designed specifically for the Indian market (NSE, Nifty, BankNifty)."
            }
          },
          {
            "@type": "Question",
            "name": "Is OptionsGyani SEBI registered?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. OptionsGyani is strictly a software analytics tool for educational and backtesting purposes. We do not provide trading tips or financial advice."
            }
          },
          {
            "@type": "Question",
            "name": "Can I backtest option strategies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, OptionsGyani features a powerful historical options backtesting engine that simulates your short strangles, iron condors, and spreads against years of historical NSE data."
            }
          }
        ]
      }
    ]
  };


  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-[#080C16] overflow-hidden font-sans">

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto z-10 gap-12">
        
        {/* Hero Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 mb-8"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-200">The Advanced Options Analytics Tool for NSE</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Build & Backtest <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Option Strategies</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            OptionsGyani is an institutional-grade options strategy builder and backtesting software. Analyze Nifty and BankNifty open interest, run deep historical backtests, and simulate trades risk-free.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/builder" className="group flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-lg hover:from-emerald-500 hover:to-blue-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Open Strategy Builder
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/backtest" className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full glass hover:bg-white/5 text-white font-semibold text-lg transition-all border border-white/10">
              Try Backtesting
            </Link>
          </motion.div>

          {/* Social Proof Trust Strip */}
          <motion.div
            className="flex flex-wrap items-center gap-5 mt-8 pt-8 border-t border-white/5 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🧑", "👩", "👨", "🧑"].map((e, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-[#080c16] flex items-center justify-center text-xs">{e}</div>
                ))}
              </div>
              <span className="text-slate-300 text-sm font-medium"><strong className="text-white">500+</strong> traders joined</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="text-slate-300 text-sm font-medium"><strong className="text-emerald-400">10,000+</strong> strategies backtested</div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Free to start — No card needed</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Abstract Image */}
        <motion.div 
          className="w-full lg:w-1/2 relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="relative w-[500px] h-[500px] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.2)]">
            <Image 
              src="/hero-dashboard.png" 
              alt="Advanced Options Strategy Builder and Analytics Dashboard Visualization"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

      </main>

      {/* Deep SEO & Features Section */}
      <section className="relative py-24 bg-[#0a0f1c] border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Master the Options Chain with Data</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
              We provide the quantitative tools you need to analyze the market objectively. OptionsGyani does not provide tips or recommendations—we give you the raw analytical power to validate your own trading hypothesis against historical data and real-time Greeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Strategy Builder */}
            <div className="p-8 rounded-3xl glass hover:-translate-y-2 transition-transform duration-300 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <BarChart2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Options Strategy Builder NSE</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Construct complex multi-leg options strategies (Iron Condors, Straddles, Butterflies) in seconds. Our free option payoff calculator instantly visualizes Max Profit, Max Loss, and Breakeven points based on real Black-Scholes pricing.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> Real-time Greeks calculation</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> IV & Volatility crush simulation</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> 10+ Pre-built strategy templates</li>
              </ul>
            </div>

            {/* Backtesting Engine */}
            <div className="p-8 rounded-3xl glass hover:-translate-y-2 transition-transform duration-300 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <HistoryIcon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Historical Options Backtesting India</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Test your trading edge without risking capital. Our options simulator runs your custom strategies against years of historical NSE data, computing exactly how your setups would have performed through market crashes and rallies.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> Adjust for slippage and spread</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> Detailed drawdown analysis</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> Cumulative P&L curves</li>
              </ul>
            </div>

            {/* Live Data & Screener */}
            <div className="p-8 rounded-3xl glass hover:-translate-y-2 transition-transform duration-300 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Live OI & Strategy Screener</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Track institutional money with our live Put Call Ratio (PCR) tracking, Max Pain calculations, and Open Interest buildup charts for Nifty and BankNifty. Use the screener to hunt for High IV rank opportunities across the chain.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> Real-time Option Chain</li>
                <li className="flex items-center gap-3 text-emerald-500"><Zap className="w-5 h-5" /> <strong>Powered by Dhan API</strong></li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-500" /> Heatmaps & Max Pain</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase (Image Left, Text Right) */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden glass-card border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.15)]">
              <Image 
                src="/backtest-nodes.png" 
                alt="Automated Options Backtesting Software and Historical Data Pipeline"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Quantitatively Prove Your Edge</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Why rely on gut feeling when you can rely on math? Our Backtesting Engine is built for traders who demand precision. We process vast amounts of tick-level historical data to simulate your options strategy entry, adjustments, and exits. 
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Database className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Clean Historical Data</h4>
                  <p className="text-slate-400">Eliminate noise with our scrubbed, high-fidelity datasets. Test short strangles, calendar spreads, and more across thousands of trading sessions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Deep Metrics</h4>
                  <p className="text-slate-400">Go beyond win rate. Analyze Sharpe ratio, max drawdown lengths, expectancy, and tail risk to truly understand your system's robustness.</p>
                </div>
              </div>
            </div>
            
            <Link href="/learn/what-are-options" className="inline-flex items-center gap-2 mt-10 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
              Read our educational guides on quantitative trading <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </div>
  );
}
