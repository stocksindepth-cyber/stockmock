import Link from "next/link";
import { BookOpen, Target, Infinity, ShieldCheck, BarChart2, Zap, ArrowRight, Brain, Scale, Layers, TrendingUp, AlertCircle, Shield, Book, Code, Anchor } from 'lucide-react';

export const metadata = {
  title: "OptionsGyani Academy | Learn Options Trading from Scratch",
  description: "The ultimate free options trading course. Master options trading, Option Greeks, Iron Condors, Straddles, Risk Management, and Volatility—designed for the Indian Stock Market.",
  alternates: { canonical: "https://optionsgyani.com/learn" },
};

const MODULES = [
  {
    moduleId: 1,
    title: "Module 1: Options Foundations",
    description: "Start your journey here. Understand the core mechanics of derivatives, Calls, Puts, Strike Prices, and Expiries before risking any capital.",
    icon: <BookOpen className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500/20 to-blue-600/5",
    lessons: [
      { slug: "what-are-options", title: "What Are Options? For Beginners", time: "8 min", diff: "Beginner", icon: <BookOpen/> },
      { slug: "call-vs-put", title: "Call vs Put Options Explained", time: "10 min", diff: "Beginner", icon: <Scale/> },
      { slug: "moneyness", title: "ITM, ATM, and OTM (Moneyness)", time: "12 min", diff: "Beginner", icon: <Target/> },
      { slug: "options-pricing", title: "Intrinsic Value vs Time Value", time: "15 min", diff: "Intermediate", icon: <Layers/> },
    ]
  },
  {
    moduleId: 2,
    title: "Module 2: The Option Greeks",
    description: "The mathematical heartbeat of an option. Learn how Delta, Gamma, Theta, and Vega govern the pricing of your positions in real-time.",
    icon: <Brain className="w-8 h-8 text-emerald-400" />,
    color: "from-emerald-500/20 to-emerald-600/5",
    lessons: [
      { slug: "delta-gamma", title: "Delta & Gamma: Directional Risk", time: "15 min", diff: "Intermediate", icon: <Activity/> },
      { slug: "theta-decay", title: "Theta: Mastering Time Decay", time: "10 min", diff: "Intermediate", icon: <Zap/> },
      { slug: "vega-volatility", title: "Vega: Trading Implied Volatility", time: "18 min", diff: "Advanced", icon: <BarChart2/> },
      { slug: "india-vix", title: "How India VIX Impacts Option Premiums", time: "12 min", diff: "Intermediate", icon: <TrendingUp/> },
    ]
  },
  {
    moduleId: 3,
    title: "Module 3: Non-Directional Strategies",
    description: "Learn how to profit when the market goes nowhere. Master high probability (PoP) strategies deployed by professional quant traders.",
    icon: <Infinity className="w-8 h-8 text-purple-400" />,
    color: "from-purple-500/20 to-purple-600/5",
    lessons: [
      { slug: "iron-condor", title: "Iron Condor: The Ultimate Range Setup", time: "20 min", diff: "Advanced", icon: <ShieldCheck/> },
      { slug: "short-strangle", title: "Short Strangle: Collecting Premium", time: "15 min", diff: "Advanced", icon: <Layers/> },
      { slug: "iron-butterfly", title: "Iron Butterfly vs Iron Condor", time: "15 min", diff: "Advanced", icon: <Scale/> },
      { slug: "batman-spread", title: "The Batman Strategy (Double Ratio)", time: "22 min", diff: "Expert", icon: <Target/> },
    ]
  },
  {
    moduleId: 4,
    title: "Module 4: Directional Strategies",
    description: "Leverage your capital for massive returns when you correctly predict the market direction, while capping your downside risk mathematically.",
    icon: <TrendingUp className="w-8 h-8 text-rose-400" />,
    color: "from-rose-500/20 to-rose-600/5",
    lessons: [
      { slug: "bull-call-spread", title: "Bull Call Spread (Debit Spread)", time: "12 min", diff: "Intermediate", icon: <TrendingUp/> },
      { slug: "bear-put-spread", title: "Bear Put Spread (Debit Spread)", time: "12 min", diff: "Intermediate", icon: <TrendingDown/> },
      { slug: "ratio-spreads", title: "Front & Back Ratio Spreads", time: "18 min", diff: "Advanced", icon: <BarChart2/> },
    ]
  },
  {
    moduleId: 5,
    title: "Module 5: Risk Management",
    description: "Strategies don't make you successful, risk management does. Learn position sizing, stop-losses, and portfolio hedging.",
    icon: <ShieldCheck className="w-8 h-8 text-amber-400" />,
    color: "from-amber-500/20 to-amber-600/5",
    lessons: [
      { slug: "position-sizing", title: "Position Sizing in Options", time: "10 min", diff: "Intermediate", icon: <Scale/> },
      { slug: "stop-losses-options", title: "Why Stop Losses are Tricky with Options", time: "12 min", diff: "Intermediate", icon: <ShieldCheck/> },
      { slug: "backtesting-guide", title: "How to Backtest Options Systems", time: "15 min", diff: "Advanced", icon: <Zap/> },
    ]
  }
];

// Helper icon component for inline imports
function Activity(props) {
  return <BarChart2 {...props} />;
}
function TrendingDown(props) {
  return <TrendingUp className="rotate-180" {...props} />;
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <main className="px-4 md:px-8 max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6">
            OptionsGyani Academy
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            The most comprehensive, free educational hub for Indian Options Traders. 
            Master the Greeks, build robust setups like Iron Condors, and learn quantitative risk mitigation.
          </p>
        </main>
      </div>

      {/* Modules Container */}
      <div className="px-4 md:px-8 max-w-5xl mx-auto py-16 space-y-12">
        {MODULES.map((mod) => (
          <div key={mod.moduleId} className="relative">
            {/* Module Anchor line for desktop visually tying them together */}
            <div className="hidden lg:block absolute left-[27px] top-24 bottom-[-48px] w-0.5 bg-slate-800 z-0 last:hidden" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-8">
              {/* Module Header Block */}
              <div className={`lg:w-1/3 flex-shrink-0 p-8 rounded-3xl bg-gradient-to-br ${mod.color} border border-white/5 backdrop-blur-sm self-start shadow-2xl`}>
                <div className="mb-6">{mod.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-3">{mod.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{mod.description}</p>
              </div>

              {/* Lessons List */}
              <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
                {mod.lessons.map((lesson, idx) => (
                  <Link 
                    href={`/learn/${lesson.slug}`} 
                    key={idx}
                    className="group glass-card p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 block bg-[#0B1120]/80"
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                          {lesson.icon}
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                          lesson.diff === "Beginner" ? "bg-emerald-500/10 text-emerald-400" :
                          lesson.diff === "Intermediate" ? "bg-blue-500/10 text-blue-400" :
                          lesson.diff === "Advanced" ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        }`}>
                          {lesson.diff}
                        </span>
                     </div>
                     <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                       {lesson.title}
                     </h3>
                     <div className="flex items-center justify-between mt-4">
                       <span className="text-xs text-slate-500 font-medium">{lesson.time} read</span>
                       <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                     </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* SEO Footer Text Block */}
      <div className="bg-[#050B14] py-16 mt-8 border-t border-white/5">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-slate-300 mb-4">Why OptionsGyani Academy?</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Unlike generic financial blogs, OptionsGyani Academy is built by derivative system developers specifically for the Indian market (NSE: NIFTY, BANKNIFTY). Options trading is inherently structural; success comes from mathematical edge, not guesswork. Our deep-dive tutorials on Option Greeks, Volatility Skews, and High-Probability selling strategies (like Short Strangles and Iron Butterflies) act as a comprehensive quantitative curriculum for both absolute beginners and advanced algo-traders.
            </p>
         </div>
      </div>
    </div>
  );
}
