import Link from "next/link";
import { Check, Gift, TrendingUp, Database, Shield, ArrowRight, Zap } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

// ─── No pricing. The business model is broker referral. ──────────────────────
// Every plan is unlocked free through Dhan: Pro = open an account via our link
// + share your first trade snapshot; Elite = keep trading actively on Dhan.
// The /pricing URL is kept for SEO/backlinks; the content is the unlock path.

export const metadata = {
  title: "Go Pro Free — No Subscription, Ever | OptionsGyani",
  description: "OptionsGyani has no paid plans. Unlock Pro free by opening a Dhan account through us and placing your first trade. Elite unlocks free for active Dhan traders. That's the whole model.",
  keywords: "optionsgyani free pro, optionsgyani pricing, free options backtesting india, dhan referral free pro, sensibull free alternative",
  alternates: { canonical: "https://www.optionsgyani.com/pricing" },
  openGraph: {
    title: "Go Pro Free — No Subscription, Ever | OptionsGyani",
    description: "No paid plans. Unlock Pro free via a Dhan account + your first trade. Elite free for active traders.",
    url: "https://www.optionsgyani.com/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — Free Pro via Dhan" }],
    type: "website",
  },
};

const TIERS = [
  {
    name: "Free",
    badge: "EVERYONE",
    how: "Just sign up — free forever, no card.",
    features: [
      "2 backtests / day",
      "Last 1 year of NSE data",
      "All strategy templates",
      "Live Option Chain + Greeks",
      "Full Options Academy",
      "Paper trading included",
      "5 IV alerts",
    ],
    cta: { label: "Start Free", href: "/signup" },
    highlight: false,
  },
  {
    name: "Pro",
    badge: "FREE VIA DHAN",
    how: "Open a Dhan account through our link + share your first trade snapshot. Pro unlocks for life.",
    features: [
      "Unlimited backtests",
      "8+ years of NSE data (2016–today)",
      "Full trade log — every trade",
      "A/B strategy comparison",
      "SL/TP controls",
      "20 IV alerts",
      "CSV export of backtest results",
    ],
    cta: { label: "Unlock Pro Free", href: "/unlock" },
    highlight: true,
  },
  {
    name: "Elite",
    badge: "FOR ACTIVE DHAN TRADERS",
    how: "Keep trading on Dhan and stay active — Elite unlocks free while you do.",
    features: [
      "Everything in Pro",
      "Unlimited IV alerts",
      "CSV + JSON export",
      "OI heatmap on chains",
      "Paper trading P&L stats",
      "Priority support + early access",
    ],
    cta: { label: "How Elite works", href: "/unlock" },
    highlight: false,
  },
];

const FAQ = [
  { q: "Wait — OptionsGyani has no paid plans at all?", a: "Correct. There is nothing to buy on this site. Every feature is unlocked free. We earn a referral commission when you open a Dhan account through our link — that single commission is what funds the servers, the data pipeline, and development. You never pay us anything." },
  { q: "How do I unlock Pro?", a: "Two steps: open a free Dhan account through our referral link, place your first trade, and share a snapshot of it with your Dhan Client ID on the unlock page. We verify it and switch on Pro for life — unlimited backtests, 8+ years of data, full trade logs, exports." },
  { q: "How does Elite work?", a: "Elite is for traders who actually use their Dhan account. Stay an active trader — keep trading and share a recent trade snapshot when asked — and Elite stays unlocked: unlimited alerts, JSON export, OI heatmaps, priority support. If you go dormant for months, you simply drop back to Pro, never below." },
  { q: "Why Dhan?", a: "We genuinely rate it for options: ₹0 AMC for life, free demat, ₹20 per order, fast execution, and a solid API. The founder trades on it personally. It's a personal referral link, not a formal partnership — and it costs you nothing extra." },
  { q: "I already have a Dhan account — can I still unlock Pro?", a: "The referral only pays if the account is opened through our link, which is what funds your free Pro. If you already trade on Dhan, you can open a fresh account for a family member through the link, or just keep using the free tier — it never expires." },
  { q: "What's the catch?", a: "None hidden: the free tier is capped at 2 backtests a day, and removing that cap requires opening a broker account we earn a commission on. If that trade-off isn't for you, the free tier works forever and the public tools (option chains, calculators, FII/DII data, Strategy Finder) don't even need an account." },
];

export default function GoProFreePage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-5xl mx-auto px-4 pt-28 pb-10 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-4 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10">
          <Gift size={14} /> No paid plans · Nothing to buy
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Everything unlocks <span className="text-emerald-400">free</span>.
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-3">
          OptionsGyani doesn&apos;t sell subscriptions. Open a <strong className="text-slate-200">free Dhan account</strong> through
          us, place your first trade, and <strong className="text-slate-200">Pro is yours for life</strong>. Stay an active trader
          and Elite unlocks too. The broker&apos;s referral commission is our entire business model — you never pay us.
        </p>
        <p className="text-xs text-slate-600 mb-10">
          Built and run by <Link href="/about" className="underline hover:text-slate-400">Rahul Dubey</Link> — engineer &amp; options trader.
        </p>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 text-center">
          {[
            { icon: Database,   t: "11.5M+ real NSE data points" },
            { icon: TrendingUp, t: "Every expiry since 2016" },
            { icon: Shield,     t: "No card. No charges. Ever." },
          ].map((x) => (
            <span key={x.t} className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <x.icon className="w-3.5 h-3.5 text-emerald-400" /> {x.t}
            </span>
          ))}
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {TIERS.map((t) => (
            <div key={t.name} className={`relative rounded-2xl flex flex-col border p-7 ${
              t.highlight
                ? "bg-gradient-to-b from-emerald-950/60 to-[#0C1221] border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
                : "bg-[#0C1221] border-slate-800"
            }`}>
              {t.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                  <Zap className="w-3 h-3 fill-white" /> Most Unlocked
                </div>
              )}
              <div className="flex items-center justify-between mb-2 mt-1">
                <h2 className="text-lg font-bold text-white">{t.name}</h2>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-emerald-300 border border-emerald-500/20">{t.badge}</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">₹0</div>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed min-h-[3rem]">{t.how}</p>
              <div className="space-y-2 mb-6 flex-1">
                {t.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
              <Link href={t.cta.href} className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                t.highlight ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
              }`}>
                {t.cta.label} <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How the model works — radical transparency */}
      <section className="max-w-3xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">How is this sustainable?</h2>
        <p className="text-slate-400 text-sm leading-relaxed text-center max-w-2xl mx-auto">
          Simple and honest: when you open a Dhan account through our link, Dhan pays us a one-time referral commission.
          That commission — not your money — funds everything here. It only works if the tools are good enough that you
          actually want to trade with them, which keeps our incentives pointed the right way: build tools traders love,
          recommend a broker we genuinely use. No ads, no selling your data, no paywall games.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Questions</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}
