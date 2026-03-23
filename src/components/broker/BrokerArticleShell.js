"use client";

import Link from "next/link";
import { Clock, Calendar, ChevronRight, ExternalLink, CheckCircle2, XCircle, Star, TrendingUp, AlertTriangle } from "lucide-react";
import { DHAN_REFERRAL } from "@/data/brokers";

// ── Reusable sub-components ────────────────────────────────────────────────────

export function ArticleBreadcrumb({ crumbs }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
      <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3" />
          {c.href ? <Link href={c.href} className="hover:text-slate-300 transition-colors">{c.label}</Link> : <span className="text-slate-400">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function ArticleMeta({ readTime, lastUpdated, author = "OptionsGyani Research Team" }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-6">
      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readTime} min read</span>
      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last updated: {lastUpdated}</span>
      <span className="text-slate-600">By {author}</span>
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
        Fact-checked
      </span>
    </div>
  );
}

export function AuthorBox() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] mb-8">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">OG</div>
      <div>
        <p className="text-white font-semibold text-sm">OptionsGyani Research Team</p>
        <p className="text-slate-400 text-xs leading-relaxed mt-1">
          Our research team comprises active NSE F&O traders with combined experience of 15+ years. We test every broker we review — opening real accounts, executing real trades, and testing APIs. We have a referral partnership with Dhan; all opinions are our own.{" "}
          <Link href="/about" className="text-indigo-400 hover:text-indigo-300">About us →</Link>
        </p>
      </div>
    </div>
  );
}

export function DhanCTA({ variant = "primary", label = "Open Free Dhan Account" }) {
  const styles = {
    primary: "bg-orange-500 hover:bg-orange-400 text-white",
    secondary: "bg-white/5 hover:bg-white/10 border border-orange-500/30 text-orange-400",
    inline: "text-orange-400 underline hover:text-orange-300",
  };
  if (variant === "inline") {
    return <a href={DHAN_REFERRAL} target="_blank" rel="noopener noreferrer" className={`${styles.inline} transition-colors`}>{label}</a>;
  }
  return (
    <a
      href={DHAN_REFERRAL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${styles[variant]}`}
    >
      {label} <ExternalLink className="w-4 h-4" />
    </a>
  );
}

export function DhanReferralBox({ headline, subtext, variant = "default" }) {
  return (
    <div className={`my-8 p-6 rounded-2xl border ${variant === "highlight" ? "bg-gradient-to-r from-orange-950/40 to-amber-950/30 border-orange-500/25" : "bg-white/[0.03] border-white/[0.08]"}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <p className="font-bold text-white text-sm">{headline || "Ready to open a Dhan account?"}</p>
          </div>
          <p className="text-slate-400 text-xs">{subtext || "₹0 AMC lifetime · Free Demat · ₹20/order F&O · Fast execution"}</p>
          <p className="text-[10px] text-slate-600 mt-1">Referral partnership — we earn a small commission, at no cost to you.</p>
        </div>
        <DhanCTA />
      </div>
    </div>
  );
}

export function RatingStars({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array(max).fill(0).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : i < rating ? "text-amber-400 fill-amber-400/50" : "text-slate-700"}`} />
      ))}
      <span className="text-sm font-bold text-white ml-1">{rating}</span>
      <span className="text-xs text-slate-500">/ {max}</span>
    </div>
  );
}

export function BrokerScorecard({ broker }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/[0.08] mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{broker.name} — Quick Verdict</h3>
          <p className="text-slate-400 text-xs mt-1">{broker.tagline}</p>
        </div>
        <RatingStars rating={broker.rating} />
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">{broker.summary}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {Object.entries(broker.fees).slice(0, 4).map(([k, v]) => (
          <div key={k} className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <p className="text-slate-500 mb-0.5 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-white font-bold">{v}</p>
          </div>
        ))}
      </div>
      {broker.hasDhanReferral && <div className="mt-4"><DhanCTA /></div>}
    </div>
  );
}

export function FeeTable({ brokers }) {
  const rows = [
    { key: "accountOpening", label: "Account Opening" },
    { key: "amc", label: "Annual AMC" },
    { key: "equityDelivery", label: "Equity Delivery" },
    { key: "equityIntraday", label: "Equity Intraday" },
    { key: "fnoOptions", label: "F&O Options" },
    { key: "fnoFutures", label: "F&O Futures" },
    { key: "dpCharges", label: "DP Charges" },
  ];
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08] mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.04] border-b border-white/[0.08]">
            <th className="text-left px-4 py-3 text-slate-400 font-semibold">Charge</th>
            {brokers.map(b => (
              <th key={b.id} className={`text-center px-4 py-3 font-bold ${b.highlight ? "text-orange-400 bg-orange-500/5" : "text-slate-300"}`}>
                {b.name} {b.highlight && "★"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key} className={`border-b border-white/[0.05] ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
              <td className="px-4 py-3 text-slate-400">{row.label}</td>
              {brokers.map(b => (
                <td key={b.id} className={`px-4 py-3 text-center text-xs font-medium ${b.highlight ? "text-white bg-orange-500/5" : "text-slate-300"}`}>
                  {b.fees[row.key] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProsCons({ pros, cons, brokerName }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
        <p className="text-emerald-400 font-bold text-sm mb-3">✓ {brokerName} Pros</p>
        <ul className="space-y-2">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/15">
        <p className="text-rose-400 font-bold text-sm mb-3">✗ {brokerName} Cons</p>
        <ul className="space-y-2">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FAQSection({ faqs }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-5">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <p className="font-semibold text-white text-sm mb-2">{faq.q}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatedArticles({ articles }) {
  if (!articles?.length) return null;
  return (
    <div className="mt-12 pt-8 border-t border-white/[0.08]">
      <h3 className="text-lg font-bold text-white mb-4">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map(a => (
          <Link key={a.slug} href={`/brokers/${a.slug}`} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.15] transition-all group">
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
            <div>
              <p className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors line-clamp-2">{a.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{a.readTime} min read</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DisclaimerBox() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 mb-8">
      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong className="text-amber-400">Disclosure:</strong> OptionsGyani has a referral partnership with Dhan. If you open an account through our links, we earn a small commission at no additional cost to you. This does not influence our reviews — we maintain editorial independence. All brokerage charges listed are as of March 2025 and may change; verify on official broker websites before investing.
      </p>
    </div>
  );
}
