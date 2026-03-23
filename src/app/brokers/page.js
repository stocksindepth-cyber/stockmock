import Link from "next/link";
import { ChevronRight, Star, Clock, TrendingUp, BarChart2, BookOpen, Wrench } from "lucide-react";
import { ARTICLES, BROKERS, DHAN_REFERRAL } from "@/data/brokers";

export const metadata = {
  title: "Broker Guides for Indian Options Traders 2025 — OptionsGyani",
  description: "In-depth broker reviews, comparisons and guides for Indian F&O traders. Compare Dhan, Zerodha, Upstox, Angel One on brokerage, platform, and options analytics.",
  alternates: { canonical: "https://optionsgyani.com/brokers" },
  openGraph: {
    title: "Broker Guides for Indian F&O Traders 2025",
    description: "Honest broker reviews and comparisons for NIFTY and BANKNIFTY options traders in India.",
    url: "https://optionsgyani.com/brokers",
    siteName: "OptionsGyani",
  },
};

const CATEGORIES = [
  { id: "review",    label: "Broker Reviews",    icon: <Star className="w-4 h-4" />,      color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  { id: "comparison",label: "Comparisons",       icon: <BarChart2 className="w-4 h-4" />, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  { id: "best-for",  label: "Best Broker Guides", icon: <TrendingUp className="w-4 h-4" />,color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20" },
  { id: "howto",     label: "How-To Guides",      icon: <Wrench className="w-4 h-4" />,    color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
];

const TOP_BROKERS_SUMMARY = [
  { id: "dhan",     score: "9.2/10", badge: "Best for F&O",        badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  { id: "zerodha",  score: "8.8/10", badge: "Most Trusted",        badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  { id: "upstox",   score: "7.9/10", badge: "Good for Beginners",  badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" },
  { id: "fyers",    score: "8.1/10", badge: "Best Charts",         badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
];

export default function BrokersHubPage() {
  const featured = ARTICLES.filter(a => a.featured);
  const byCategory = (cat) => ARTICLES.filter(a => a.category === cat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Broker Guides for Indian Options Traders",
    "description": "In-depth broker reviews and comparisons for Indian F&O and options traders.",
    "url": "https://optionsgyani.com/brokers",
    "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://optionsgyani.com" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://optionsgyani.com" },
        { "@type": "ListItem", "position": 2, "name": "Broker Guides", "item": "https://optionsgyani.com/brokers" },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#080C16]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <BookOpen className="w-3 h-3" /> {ARTICLES.length} In-Depth Guides · Updated March 2025
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Best Broker for Options Trading<br className="hidden md:block" /> in India — 2025 Guide
          </h1>
          <p className="text-slate-400 text-lg">
            Honest, data-driven reviews and comparisons from active F&O traders. We open real accounts, execute real trades, and compare every cost.
          </p>
        </div>

        {/* Quick broker scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {TOP_BROKERS_SUMMARY.map(({ id, score, badge, badgeColor }) => {
            const b = BROKERS[id];
            const reviewSlug = `${id === "angelone" ? "angel-one" : id}-review`;
            return (
              <Link key={id} href={`/brokers/${reviewSlug}`} className="p-4 rounded-2xl glass-card border border-white/[0.07] hover:border-white/[0.15] transition-all group text-center">
                <p className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">{b.name}</p>
                <p className="text-2xl font-extrabold text-white my-1">{score}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
                <p className="text-slate-500 text-xs mt-2">{b.activeClients} clients</p>
              </Link>
            );
          })}
        </div>

        {/* Featured articles */}
        {featured.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Most Important Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map(a => (
                <Link key={a.slug} href={`/brokers/${a.slug}`} className="p-6 rounded-2xl glass-card border border-indigo-500/20 hover:border-indigo-500/40 transition-all group">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 mb-3 inline-block">Featured Guide</span>
                  <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-indigo-300 transition-colors">{a.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{a.metaDescription}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {a.readTime} min read
                    <span>·</span><span>Updated {a.lastUpdated}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles by category */}
        {CATEGORIES.map(cat => {
          const articles = byCategory(cat.id);
          if (!articles.length) return null;
          return (
            <div key={cat.id} className="mb-14">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span className={cat.color}>{cat.icon}</span> {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map(a => (
                  <Link key={a.slug} href={`/brokers/${a.slug}`} className="p-5 rounded-2xl glass-card border border-white/[0.07] hover:border-white/[0.14] transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>{cat.label}</span>
                      {a.hasDhanReferral && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Referral</span>}
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-indigo-300 transition-colors line-clamp-3">{a.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                      <Clock className="w-3 h-3" /> {a.readTime} min
                      <ChevronRight className="w-3.5 h-3.5 ml-auto group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Dhan referral CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-950/40 to-amber-950/30 border border-orange-500/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <p className="font-bold text-white mb-1">Our recommended broker for F&O traders: Dhan</p>
            <p className="text-slate-400 text-sm">₹0 AMC lifetime · Free Demat · ₹20/order · Built-in options analytics · TradingView charts</p>
            <p className="text-[10px] text-slate-600 mt-1">Referral partnership — we earn a commission at no cost to you</p>
          </div>
          <a href={DHAN_REFERRAL} target="_blank" rel="noopener noreferrer sponsored"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors whitespace-nowrap">
            Open Free Dhan Account →
          </a>
        </div>

        {/* OptionsGyani plug */}
        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm mb-1">Once you have your broker — backtest your strategy first</p>
            <p className="text-slate-400 text-xs">OptionsGyani: 8+ years of real NSE data · Iron Condor, Straddle, 12+ strategies · Free</p>
          </div>
          <Link href="/backtest" className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap">
            Try Free Backtesting →
          </Link>
        </div>

      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
