import Link from "next/link";
import { ArrowRight, Zap, Calendar, TrendingUp, AlertCircle, BarChart2 } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "NIFTY Weekly Expiry Options Strategy Guide 2025 — Thursday Trading Playbook | OptionsGyani",
  description: "The definitive guide to trading NIFTY weekly expiry options. Best entry days, Monday vs Thursday strategies, Theta decay by day, and top-performing setups backed by 8 years of NSE data.",
  keywords: "nifty weekly expiry strategy, nifty thursday expiry options, weekly options india guide, best day to sell nifty options, nifty expiry day strategy, 0dte nifty options",
  openGraph: {
    title: "NIFTY Weekly Expiry Strategy Playbook 2025 | OptionsGyani",
    description: "Monday to Thursday — day-by-day guide for trading NIFTY weekly options. Real data, real strategies.",
    url: "https://optionsgyani.in/strategies/nifty-weekly-expiry-guide",
    type: "article",
  },
};

const WEEKLY_CALENDAR = [
  {
    day: "Monday",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/20 text-blue-300",
    activity: "Best Entry Day",
    desc: "4 full days of Theta remaining. Ideal for selling Iron Condors, Straddles, and Strangles. Premium is still fat at the start of the week.",
    tips: ["Enter non-directional strategies (IC, Straddle, Strangle)", "Sell strikes 150–200 pts OTM", "Set alerts at your stop-loss levels immediately"],
  },
  {
    day: "Tuesday",
    color: "border-indigo-500/30 bg-indigo-500/5",
    badge: "bg-indigo-500/20 text-indigo-300",
    activity: "Good Entry, Monitor",
    desc: "3 days left. Still good for premium selling but lower credit. Focus on tighter ICs if selling, or debit spreads if directional.",
    tips: ["Adjust if Monday trade is at 50% profit (close early)", "Good day for Bull/Bear spreads with a directional view", "Check India VIX — if > 18, reduce size"],
  },
  {
    day: "Wednesday",
    color: "border-amber-500/30 bg-amber-500/5",
    badge: "bg-amber-500/20 text-amber-300",
    activity: "Theta Accelerates",
    desc: "Theta decay accelerates sharply after Wednesday noon. Existing short positions gain rapidly. New entries only if premium still attractive.",
    tips: ["Close winning positions at 70–80% profit", "Avoid entering new short positions (reward/risk degrades)", "Watch for gap risk overnight"],
  },
  {
    day: "Thursday (Expiry)",
    color: "border-rose-500/30 bg-rose-500/5",
    badge: "bg-rose-500/20 text-rose-300",
    activity: "Expiry Day — Careful",
    desc: "Maximum Gamma risk. Small moves in NIFTY cause large P&L swings. Most retail traders lose on expiry day by being greedy. Professional move: most positions should already be closed.",
    tips: ["Close remaining positions before 1:00 PM", "Never hold short options into last 30 minutes", "If short straddle: adjust to iron fly to cap risk"],
  },
];

const STRATEGIES_BY_SCENARIO = [
  {
    scenario: "Sideways market (VIX < 15)",
    strategies: ["Short Iron Condor — widest profitable range", "Short Strangle — maximum premium, manage actively"],
    edge: "High",
  },
  {
    scenario: "Mild trend (VIX 15–20)",
    strategies: ["Iron Condor — shift strikes in trend direction", "Bull/Bear Call/Put Spread — directional with limited risk"],
    edge: "Medium",
  },
  {
    scenario: "High volatility (VIX > 20)",
    strategies: ["Buy Straddle/Strangle — expect big move", "Long Iron Butterfly — profit from volatility crush post-event"],
    edge: "Event-dependent",
  },
  {
    scenario: "Pre-event week (Budget, RBI, Fed)",
    strategies: ["Wait — reduce or avoid short premium positions", "Buy ATM Straddle Monday, sell before event day"],
    edge: "Situational",
  },
];

const FAQ = [
  {
    q: "Which is the best day to sell NIFTY weekly options?",
    a: "Monday is historically the best day to initiate short premium strategies on NIFTY weekly options. With 4 trading days left until Thursday expiry, Theta decay works maximally in your favor. Premium is still substantial, and you have time to adjust if the trade goes against you."
  },
  {
    q: "What time should I enter NIFTY weekly options trades?",
    a: "Most professional options sellers enter between 9:30–10:30 AM after the initial gap and spike in implied volatility has settled. Entering right at open risks paying inflated IV. Waiting until 10–10:30 AM gives you a more accurate picture of where NIFTY wants to trend for the day."
  },
  {
    q: "How much margin do I need to trade NIFTY weekly options?",
    a: "For a single lot Iron Condor on NIFTY (75 units): approximately ₹40,000–₹70,000 margin depending on your broker and OTM distance. Short Straddle requires higher margin — approximately ₹1.2–1.8 lakh per lot due to naked short legs before buying the spreads."
  },
  {
    q: "Should I hold NIFTY options to expiry?",
    a: "No — it's generally not advisable to hold short options (sold premium) to the last 30 minutes of expiry. Gamma risk explodes near expiry: a 50-point NIFTY move in the last hour can wipe out an entire week's premium. Professional practice: close at 50–80% of maximum profit, never the last 30 minutes."
  },
];

export default function NiftyWeeklyExpiryGuidePage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "NIFTY Weekly Expiry Options Strategy — Complete Thursday Trading Playbook",
            "description": "Day-by-day guide for trading NIFTY weekly options — best entry days, Theta schedule, and strategy selection.",
            "author": { "@type": "Organization", "name": "OptionsGyani" },
            "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://optionsgyani.in" },
            "datePublished": "2025-01-01",
            "dateModified": new Date().toISOString().split("T")[0],
            "mainEntityOfPage": "https://optionsgyani.in/strategies/nifty-weekly-expiry-guide",
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/strategies" className="hover:text-slate-300 transition-colors">Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">NIFTY Weekly Expiry Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5">
            <Calendar className="w-3.5 h-3.5" /> Weekly Expiry · Every Thursday · All Levels
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-4">
            NIFTY Weekly Expiry<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Strategy Playbook</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            52 opportunities every year. Most traders lose money on weekly expiry because they treat every Thursday
            the same. Here's the data-driven, day-by-day framework the pros use.
          </p>
        </div>

        {/* Why Weekly */}
        <section className="mb-12 rounded-2xl border border-indigo-500/20 bg-indigo-900/10 p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-3">Why NIFTY Weekly Expiry is Special</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { val: "52", label: "Expiries / year", note: "vs 12 monthly" },
              { val: "₹20", label: "Cost per trade", note: "on Dhan" },
              { val: "3–5×", label: "Faster Theta", note: "Monday–Thursday" },
              { val: "75", label: "Lot size", note: "NIFTY units" },
            ].map((item) => (
              <div key={item.val} className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{item.val}</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">{item.label}</div>
                <div className="text-xs text-slate-500">{item.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Calendar */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-6">The Weekly Theta Calendar</h2>
          <div className="space-y-4">
            {WEEKLY_CALENDAR.map((day) => (
              <div key={day.day} className={`rounded-2xl border p-5 ${day.color}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${day.badge}`}>
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-slate-100">{day.activity}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{day.desc}</p>
                    <ul className="space-y-1">
                      {day.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategy selection by market scenario */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Strategy Selection by Market Condition</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Market Scenario</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Recommended Strategies</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Edge</th>
                </tr>
              </thead>
              <tbody>
                {STRATEGIES_BY_SCENARIO.map((row, i) => (
                  <tr key={i} className={`${i < STRATEGIES_BY_SCENARIO.length - 1 ? "border-b border-slate-800/50" : ""} hover:bg-slate-800/20`}>
                    <td className="py-4 px-4 text-slate-300 font-medium">{row.scenario}</td>
                    <td className="py-4 px-4">
                      {row.strategies.map((s, j) => (
                        <div key={j} className="text-slate-400 text-xs leading-relaxed">{s}</div>
                      ))}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.edge === "High" ? "bg-emerald-500/20 text-emerald-400" : row.edge === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"}`}>
                        {row.edge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA to backtest */}
        <section className="mb-12 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 to-blue-900/20 p-7 text-center">
          <BarChart2 className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Backtest Any of These Setups</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-lg mx-auto">
            OptionsGyani has 8+ years of real NSE Bhavcopy data. Test your NIFTY weekly expiry strategy
            before you risk a single rupee.
          </p>
          <Link
            href="/backtest"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Run Free Backtest <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                <h3 className="text-base font-semibold text-slate-100 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <DhanReferralBanner variant="card" context="backtest" className="mb-10" />

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Related Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/strategies/iron-condor-nifty", label: "Iron Condor NIFTY — Full Backtest" },
              { href: "/strategies/short-straddle-banknifty", label: "Short Straddle BANKNIFTY" },
              { href: "/learn/theta-decay", label: "Learn: How Theta Decay Works" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/30 text-sm text-slate-300 hover:text-slate-100 transition-all group"
              >
                {link.label}
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
