import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight, TrendingUp, Database, Activity, Percent, CheckCircle2,
  AlertTriangle, BarChart2, Layers, Target, BookOpen, LineChart,
} from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";
import { STRATEGIES, STRATEGY_SLUGS, INDEX_META, THEMES, getStrategy } from "@/data/strategies";

const SITE = "https://optionsgyani.com";

// Only the data-driven slugs are valid here; anything else is a true 404
// (static sibling routes like /strategies/iron-condor-nifty still take precedence).
export const dynamicParams = false;

export function generateStaticParams() {
  return STRATEGY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getStrategy(slug);
  if (!s) return {};
  const url = `${SITE}/strategies/${slug}`;
  const title = `${s.name} — Strategy, Setup & Backtest | OptionsGyani`;
  const description = `${s.tagline} Learn the setup, payoff, when to use it, risks, and backtest ${s.name} on real ${s.index} data — free.`;
  return {
    title,
    description,
    keywords: s.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

// Generic payoff curves keyed by shape — keeps every page visual without bespoke SVG.
function PayoffSVG({ shape, theme }) {
  const g = theme.glow;
  const zero = <line x1="0" y1="120" x2="1000" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />;
  if (shape === "ramp-up") {
    return (
      <svg className="w-full h-32" viewBox="0 0 1000 200" preserveAspectRatio="none">
        {zero}
        <path d="M 0 160 L 350 160 L 700 40 L 1000 40 Z" fill={g} fillOpacity="0.12" />
        <polyline points="0,160 350,160 700,40 1000,40" fill="none" stroke={g} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  if (shape === "ramp-down") {
    return (
      <svg className="w-full h-32" viewBox="0 0 1000 200" preserveAspectRatio="none">
        {zero}
        <path d="M 0 40 L 300 40 L 650 160 L 1000 160 Z" fill={g} fillOpacity="0.12" />
        <polyline points="0,40 300,40 650,160 1000,160" fill="none" stroke={g} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  if (shape === "valley") {
    return (
      <svg className="w-full h-32" viewBox="0 0 1000 200" preserveAspectRatio="none">
        {zero}
        <path d="M 0 30 L 500 175 L 1000 30" fill={g} fillOpacity="0.12" />
        <polyline points="0,30 500,175 1000,30" fill="none" stroke={g} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  // "tent" — neutral / range-bound credit
  return (
    <svg className="w-full h-32" viewBox="0 0 1000 200" preserveAspectRatio="none">
      {zero}
      <path d="M 0 170 L 300 60 L 700 60 L 1000 170 Z" fill={g} fillOpacity="0.12" />
      <polyline points="0,170 300,60 700,60 1000,170" fill="none" stroke={g} strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const ACTION_STYLE = {
  BUY: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  SELL: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

// Most strategy pages funnel to backtest; volatility/event plays funnel to the chain.
const ctaContext = (category) => (category === "Volatility" ? "general" : "backtest");

export default async function StrategyPage({ params }) {
  const { slug } = await params;
  const s = getStrategy(slug);
  if (!s) notFound();

  const t = THEMES[s.theme] || THEMES.indigo;
  const idx = INDEX_META[s.index];
  const url = `${SITE}/strategies/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${s.name} — Strategy, Setup & Backtest`,
      description: s.tagline,
      author: { "@type": "Organization", name: "OptionsGyani" },
      publisher: { "@type": "Organization", name: "OptionsGyani", url: SITE },
      mainEntityOfPage: url,
      datePublished: "2026-01-01",
      dateModified: new Date().toISOString().split("T")[0],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strategies", item: `${SITE}/strategies` },
        { "@type": "ListItem", position: 2, name: s.name, item: url },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none" style={{ backgroundColor: `${t.glow}1a` }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none" style={{ backgroundColor: `${t.glow}14` }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-20 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link href="/strategies" className={`transition-colors ${t.link}`}>Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">{s.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase mb-6 shadow-inner ${t.badge}`}>
            <Layers className="w-4 h-4" /> {s.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 leading-tight mb-6 tracking-tight">
            {s.name}
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl font-light">{s.tagline}</p>
        </div>

        {/* Index facts strip */}
        <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { k: "Index", v: idx.label },
            { k: "Strike Step", v: `${idx.step} pts` },
            { k: "Lot Size", v: idx.lot },
            { k: "Expiry", v: idx.expiry },
          ].map((f) => (
            <div key={f.k} className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{f.k}</div>
              <div className="text-base font-bold text-slate-100 mt-0.5">{f.v}</div>
            </div>
          ))}
        </div>

        {/* Intro prose */}
        <section className="mb-14 space-y-5">
          {s.intro.map((p, i) => (
            <p key={i} className="text-lg text-slate-300 leading-relaxed">{p}</p>
          ))}
          <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-slate-700 pl-4">
            {idx.label}: {idx.note} Typical India VIX range while trading this: {idx.vix}.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Activity className={`w-6 h-6 ${t.icon}`} />
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Performance Snapshot</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {s.stats.map((st) => (
              <div key={st.label} className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 overflow-hidden hover:bg-slate-800/60 transition-colors">
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] transition-colors ${t.statGlow}`} />
                <div className="relative z-10">
                  <div className="text-3xl font-black text-slate-100 mb-2 font-mono tracking-tight">{st.value}</div>
                  <div className={`text-sm font-bold mb-2 uppercase tracking-wide ${t.accent}`}>{st.label}</div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed">{st.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Payoff */}
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-500 tracking-wider">PAYOFF PROFILE AT EXPIRY</span>
              <span className={`text-xs font-bold flex items-center gap-2 ${t.accent}`}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: t.glow }} /> {s.category.toUpperCase()}
              </span>
            </div>
            <PayoffSVG shape={s.payoff} theme={t} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/backtest" className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r text-white font-bold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-95 ${t.button}`}>
              Backtest {s.name} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/chain" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-lg transition-all hover:scale-[1.01] active:scale-95">
              <LineChart className="w-5 h-5 text-slate-400" /> Open {idx.label} Option Chain
            </Link>
          </div>
        </section>

        {/* Construction + Setup */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">01</span>
              How It's Built
            </h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800/60">
              {s.legs.map((leg, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-md border ${ACTION_STYLE[leg.action]}`}>{leg.action}</span>
                  <span className="text-sm font-bold text-slate-200 w-8">{leg.type}</span>
                  <span className="text-sm text-slate-400 flex-1">
                    <span className="text-slate-200 font-medium">{leg.strike}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{leg.note}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">02</span>
              Trade Parameters
            </h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-1">
              {s.setup.map((row, i) => (
                <div key={i} className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-5 py-4 ${i < s.setup.length - 1 ? "border-b border-slate-800/60" : ""}`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-slate-200 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inline referral CTA */}
        <DhanReferralBanner variant="card" context={ctaContext(s.category)} className="mb-16" />

        {/* Edges */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
            <Percent className={`w-6 h-6 ${t.icon}`} /> Why This Edge Exists
          </h2>
          <div className="space-y-4">
            {s.edges.map((e, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl border transition-colors ${t.edgeBox}`}>
                <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-1 ${t.icon}`} />
                <div>
                  <h4 className="font-bold text-slate-200 mb-1">{e.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{e.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* When to use + Risks */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 mb-5 flex items-center gap-3">
              <Target className="w-5 h-5 text-emerald-400" /> When To Use It
            </h2>
            <ul className="space-y-3">
              {s.whenToUse.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 mb-5 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Risks & Pitfalls
            </h2>
            <ul className="space-y-3">
              {s.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow nudge to live tools */}
        <section className="mb-16 rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
          <h2 className="text-2xl font-extrabold text-white mb-6">Practice {s.name} Risk-Free</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/chain", icon: <LineChart className="w-6 h-6 text-indigo-400" />, title: "Live Option Chain", desc: `See ${idx.label} strikes, premiums & Greeks update in real time.` },
              { href: "/backtest", icon: <BarChart2 className="w-6 h-6 text-blue-400" />, title: "Backtest It", desc: "Run the strategy across years of historical cycles." },
              { href: "/paper-trade", icon: <Activity className="w-6 h-6 text-emerald-400" />, title: "Paper Trade", desc: "Forward-test execution without risking capital." },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="group rounded-2xl border border-slate-800 bg-slate-950/40 p-5 hover:bg-slate-900/60 hover:-translate-y-0.5 transition-all">
                <div className="mb-3 p-3 rounded-xl bg-slate-900/60 inline-block border border-slate-800">{c.icon}</div>
                <h3 className="font-bold text-slate-100 mb-1 group-hover:text-white">{c.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-8 tracking-tight">Frequently Asked Questions</h2>
          <div className="grid gap-5">
            {s.faq.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-7 hover:bg-slate-800/40 transition-colors group">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mt-0.5 group-hover:bg-indigo-500/20 transition-colors">
                    <span className="text-indigo-400 font-bold text-sm select-none">Q</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 mb-3">{f.q}</h3>
                    <p className="text-base text-slate-400 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related strategies — internal linking */}
        <section className="mb-16">
          <h2 className="text-xl font-extrabold text-slate-100 mb-5 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-slate-400" /> Explore More Strategies
          </h2>
          <div className="flex flex-wrap gap-3">
            {STRATEGY_SLUGS.filter((sl) => sl !== slug).map((sl) => (
              <Link key={sl} href={`/strategies/${sl}`} className="text-sm px-4 py-2 rounded-full border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500 hover:text-white transition-colors">
                {STRATEGIES[sl].name}
              </Link>
            ))}
          </div>
        </section>

        {/* Final referral CTA */}
        <DhanReferralBanner variant="banner" context={ctaContext(s.category)} />
      </div>
    </main>
  );
}
