"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, History, TrendingUp, Target, Zap, Activity, CheckCircle, Database } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturesPage() {
  const features = [
    {
      id: "builder",
      title: "Options Strategy Builder",
      description: "Build, simulate, and analyze multi-leg options strategies with real-time Greeks and interactive payoff visualizations.",
      icon: Layers,
      color: "from-blue-500 to-indigo-600",
      bgClass: "bg-blue-500/10 border-blue-500/20",
      bullets: [
        "Real-time Greek calculations (Delta, Gamma, Theta, Vega)",
        "Instant Interactive Payoff Diagrams",
        "10+ Pre-built Strategy Templates",
        "Adjustable IV Slider for Vol Crush simulation"
      ],
      link: "/builder"
    },
    {
      id: "backtest",
      title: "Historical Backtesting Engine",
      description: "Quantitatively prove your edge using years of 1-minute historical tick data for Nifty and BankNifty.",
      icon: History,
      color: "from-emerald-500 to-teal-600",
      bgClass: "bg-emerald-500/10 border-emerald-500/20",
      bullets: [
        "Minute-level Option Premium Historical Data",
        "Max Drawdown & Sharpe Ratio tracking",
        "Slippage & STT Tax penalties built-in",
        "Automated Forward-Walk Testing logic"
      ],
      link: "/backtest"
    },
    {
      id: "screener",
      title: "Live OI & Volatility Screener",
      description: "Track institutional money flow in real-time. Identify High-IV percentile setups before the breakout happens.",
      icon: Target,
      color: "from-amber-500 to-orange-600",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      bullets: [
        "Live Nifty & BankNifty Put/Call Ratios",
        "Interactive Max-Pain line charting",
        "Implied Volatility (IV) Rank Heatmaps",
        "Direct Dhan Broker API Integration"
      ],
      link: "/screener"
    },
    {
      id: "simulator",
      title: "Time-Machine Simulator",
      description: "Re-live historical trading sessions exactly as they happened. Click 'Next Day' to watch your Greeks change dynamically.",
      icon: Zap,
      color: "from-rose-500 to-pink-600",
      bgClass: "bg-rose-500/10 border-rose-500/20",
      bullets: [
        "Day-by-Day Forward Simulation",
        "Realistic EOD Settlement Mechanics",
        "Historical Volatility Re-calculations",
        "Pause, Adjust Wings, and Resume Trading"
      ],
      link: "/simulator"
    },
    {
      id: "paper",
      title: "Live Paper Trading",
      margin: "lg:col-span-2 mx-auto max-w-2xl",
      description: "Execute trades in the live market without risking actual capital. Perfect your execution psychology before sizing up.",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      bgClass: "bg-cyan-500/10 border-cyan-500/20",
      bullets: [
        "Live NSE feed execution",
        "Virtual Capital P&L Tracking",
        "Margin Requirement Calculator",
        "Trade Journaling Export"
      ],
      link: "/paper-trade"
    }
  ];

  return (
    <div className="min-h-screen bg-[#080C16] overflow-hidden font-sans">

      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 mb-8"
          >
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">The Ultimate Quant Arsenal</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Built for traders who <br className="hidden md:block"/> rely on <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Math, not Luck.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed"
          >
            OptionsGyani is an integrated ecosystem. You formulate an idea in the Builder, mathematically prove it in the Backtester, simulate its extremes in the Time-Machine, and deploy it via Live OI.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`flex flex-col h-full glass-card rounded-3xl p-8 lg:p-10 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden ${feature.margin || ""}`}
              >
                {/* Decorative glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} opacity-10 blur-[50px] group-hover:opacity-20 transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-2xl ${feature.bgClass} flex items-center justify-center mb-6 border`}>
                  <Icon className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-8 flex-1">{feature.description}</p>
                
                <ul className="space-y-4 mb-10 mt-auto">
                  {feature.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={feature.link}
                  className="inline-flex items-center justify-center w-full py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group-hover:border-white/20 gap-2"
                >
                  Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Global CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-900/40 to-[#0B1120] border border-indigo-500/30 rounded-3xl p-10 lg:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Stop Guessing. Start Quantifying.</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Ready to stop trading on instinct and start validating your options systems historically? OptionsGyani is free to analyze.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] w-full sm:w-auto">
                Create Free Account
              </Link>
              <Link href="/builder" className="px-8 py-4 rounded-full glass border border-white/10 text-white font-bold hover:bg-white/5 transition-colors w-full sm:w-auto">
                Try Builder Sandbox
              </Link>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
