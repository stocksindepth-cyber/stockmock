import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLES, BROKERS, getArticleBySlug, getRelatedArticles } from "@/data/brokers";
import { getArticleContent } from "@/data/broker-articles";
import {
  ArticleBreadcrumb, ArticleMeta, AuthorBox, DhanReferralBox,
  BrokerScorecard, FeeTable, ProsCons, FAQSection,
  RelatedArticles, DisclaimerBox, DhanCTA,
} from "@/components/broker/BrokerArticleShell";

// ── Static generation ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords?.join(", "),
    alternates: { canonical: `https://optionsgyani.com/brokers/${slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://optionsgyani.com/brokers/${slug}`,
      siteName: "OptionsGyani",
      type: "article",
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BrokerArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const content   = getArticleContent(slug);
  const related   = getRelatedArticles(slug, 4);
  const primary   = BROKERS[article.primaryBroker];
  const secondary = article.secondaryBroker ? BROKERS[article.secondaryBroker] : null;

  // ── JSON-LD schema ──────────────────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.metaDescription,
        "datePublished": article.lastUpdated,
        "dateModified": article.lastUpdated,
        "author": {
          "@type": "Organization",
          "name": "OptionsGyani",
          "url": "https://optionsgyani.com",
        },
        "publisher": {
          "@type": "Organization",
          "name": "OptionsGyani",
          "logo": { "@type": "ImageObject", "url": "https://optionsgyani.com/logo.png" },
        },
        "url": `https://optionsgyani.com/brokers/${slug}`,
        "mainEntityOfPage": `https://optionsgyani.com/brokers/${slug}`,
      },
      // Review schema for broker review articles
      ...(article.category === "review" && primary ? [{
        "@type": "Review",
        "name": `${primary.name} Review`,
        "reviewBody": content?.verdict || primary.summary,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": primary.rating,
          "bestRating": 5,
          "worstRating": 1,
        },
        "author": { "@type": "Organization", "name": "OptionsGyani" },
        "itemReviewed": {
          "@type": "FinancialService",
          "name": primary.fullName,
          "url": primary.website,
        },
      }] : []),
      // FAQ schema
      ...(content?.faqs?.length ? [{
        "@type": "FAQPage",
        "mainEntity": content.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a },
        })),
      }] : []),
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://optionsgyani.com" },
          { "@type": "ListItem", "position": 2, "name": "Broker Guides", "item": "https://optionsgyani.com/brokers" },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://optionsgyani.com/brokers/${slug}` },
        ],
      },
    ],
  };

  const categoryLabel = {
    review: "Broker Review",
    comparison: "Broker Comparison",
    "best-for": "Best Broker Guide",
    howto: "How-To Guide",
  }[article.category] || "Guide";

  return (
    <div className="min-h-screen bg-[#080C16]">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-10">

        {/* Breadcrumb */}
        <ArticleBreadcrumb crumbs={[
          { label: "Broker Guides", href: "/brokers" },
          { label: article.title },
        ]} />

        {/* Category badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
            {categoryLabel}
          </span>
          {article.hasDhanReferral && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
              Dhan Referral Available
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <ArticleMeta readTime={article.readTime} lastUpdated={article.lastUpdated} />

        {/* Author box */}
        <AuthorBox />

        {/* Disclosure */}
        {article.hasDhanReferral && <DisclaimerBox />}

        {/* Intro */}
        {content?.intro && (
          <div className="prose prose-invert prose-sm max-w-none mb-8">
            {content.intro.split("\n\n").map((para, i) => (
              <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        )}

        {/* Quick verdict box */}
        {content?.verdict && (
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-8">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">⚡ Quick Verdict</p>
            <p className="text-slate-200 text-sm leading-relaxed">{content.verdict}</p>
          </div>
        )}

        {/* Primary broker scorecard */}
        {primary && <BrokerScorecard broker={{ ...primary, hasDhanReferral: article.hasDhanReferral }} />}

        {/* Fee comparison table */}
        {secondary ? (
          <>
            <h2 className="text-2xl font-bold text-white mt-10 mb-4">
              {primary?.name} vs {secondary.name} — Brokerage Charges Compared
            </h2>
            <FeeTable brokers={[{ ...primary, highlight: true }, secondary]} />
          </>
        ) : primary ? (
          <>
            <h2 className="text-2xl font-bold text-white mt-10 mb-4">
              {primary.name} Brokerage & Charges
            </h2>
            <FeeTable brokers={[{ ...primary, highlight: article.primaryBroker === "dhan" }]} />
          </>
        ) : null}

        {/* Dhan CTA — after fee table (high intent moment) */}
        {article.hasDhanReferral && (
          <DhanReferralBox
            headline={article.category === "howto"
              ? "Open your Dhan account in 10 minutes"
              : article.category === "comparison"
              ? `Switch to Dhan — ₹0 AMC, ₹20/order flat`
              : `${primary?.name === "Dhan" ? "Open your Dhan account today" : "Looking for a better alternative? Try Dhan"}`}
            subtext="₹0 AMC lifetime · Free Demat account · ₹20 flat F&O · Built-in options analytics"
            variant="highlight"
          />
        )}

        {/* Pros & Cons */}
        {primary && (
          <>
            <h2 className="text-2xl font-bold text-white mt-10 mb-4">{primary.name} — Pros & Cons</h2>
            <ProsCons pros={primary.pros} cons={primary.cons} brokerName={primary.name} />
          </>
        )}

        {/* Article body sections */}
        {content?.sections?.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
            {section.content.split("\n\n").map((para, j) => (
              <p key={j} className="text-slate-300 leading-relaxed mb-4">{para}</p>
            ))}
            {/* Insert Dhan CTA midway through sections */}
            {article.hasDhanReferral && i === Math.floor((content.sections.length - 1) / 2) && (
              <DhanReferralBox />
            )}
          </div>
        ))}

        {/* FAQ */}
        {content?.faqs?.length > 0 && <FAQSection faqs={content.faqs} />}

        {/* Final Dhan CTA */}
        {article.hasDhanReferral && (
          <div className="p-8 rounded-2xl bg-gradient-to-r from-orange-950/40 to-amber-950/30 border border-orange-500/25 text-center my-10">
            <p className="text-xl font-bold text-white mb-2">Ready to start trading smarter?</p>
            <p className="text-slate-400 text-sm mb-6">Open your free Dhan account — ₹0 AMC, ₹20/order, built-in analytics. Takes 10 minutes.</p>
            <DhanCTA label="Open Free Dhan Account — ₹0 AMC" />
            <p className="text-[10px] text-slate-600 mt-3">Referral partnership · we earn a small commission · no cost to you</p>
          </div>
        )}

        {/* Use OptionsGyani CTA */}
        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm mb-1">Backtest your options strategy before trading live</p>
            <p className="text-slate-400 text-xs">OptionsGyani gives you 8+ years of real NSE Bhavcopy data to test Iron Condor, Short Straddle, and 12+ strategies. Free.</p>
          </div>
          <Link href="/backtest" className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap">
            Try Free Backtesting →
          </Link>
        </div>

        {/* Related */}
        <RelatedArticles articles={related} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
