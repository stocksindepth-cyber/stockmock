import { STRATEGY_SLUGS } from "@/data/strategies";
// (FNO_STOCKS / FEATURED_STOCKS intentionally not imported — per-stock chain
//  pages are excluded from the sitemap; see the note at the bottom of this file.)

export default function sitemap() {
  const baseUrl = "https://www.optionsgyani.com";

  const staticPages = [
    { url: baseUrl,                           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    // ── Public SEO landing pages (live data, no login — indexable) ──────────
    { url: `${baseUrl}/nifty-option-chain`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/bank-nifty-option-chain`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/strategy-finder`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/strategy-finder/neutral`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/strategy-finder/bullish`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/strategy-finder/bearish`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/strategy-finder/volatile`,lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/fii-dii-data`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/options-profit-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/margin-calculator`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/ltp-calculator`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/ltp-calculator/nifty`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/ltp-calculator/bank-nifty`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/nifty-expiry-day-2026`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/option-chain`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/strategies`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/learn`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/pricing`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/features`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/signup`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/login`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/refund`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // All strategy pages (keep in sync with src/app/strategies/ directories)
  const strategySlugs = [
    "iron-condor-nifty",
    "short-straddle-banknifty",
    "bull-call-spread-nifty",
    "bear-put-spread-nifty",
    "iron-butterfly-banknifty",
    "calendar-spread-nifty",
    "short-strangle-finnifty",
    "nifty-weekly-expiry-guide",
  ];

  // All learn guide slugs (keep in sync with src/app/learn/[slug]/content/guideContent.js)
  const learnSlugs = [
    "what-are-options",
    "call-vs-put",
    "moneyness",
    "options-pricing",
    "delta-gamma",
    "theta-decay",
    "vega-volatility",
    "india-vix",
    "iron-condor",
    "short-strangle",
    "iron-butterfly",
    "batman-spread",
    "bull-call-spread",
    "bear-put-spread",
    "ratio-spreads",
    "position-sizing",
    "stop-losses-options",
    "backtesting-guide",
  ];

  // Data-driven strategy pages (src/data/strategies) rendered via [slug] route.
  const allStrategySlugs = [...strategySlugs, ...STRATEGY_SLUGS];

  const strategyPages = allStrategySlugs.map((slug) => ({
    url: `${baseUrl}/strategies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const learnPages = learnSlugs.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // All broker guide slugs
  const brokerSlugs = [
    "dhan-review", "zerodha-review", "upstox-review", "angel-one-review",
    "groww-review", "fyers-review",
    "dhan-vs-zerodha", "dhan-vs-upstox", "dhan-vs-angel-one", "zerodha-vs-upstox",
    "best-broker-options-trading-india", "lowest-brokerage-fno-india",
    "best-broker-nifty-weekly-options", "best-free-demat-account-india",
    "how-to-open-dhan-account", "switch-from-zerodha-to-dhan",
    "dhan-vs-groww", "dhan-vs-fyers", "groww-vs-zerodha",
    "best-broker-for-algo-trading-india", "best-trading-app-india",
    "best-broker-for-beginners-india",
  ];

  const brokerHubPage = {
    url: `${baseUrl}/brokers`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  };

  const brokerPages = brokerSlugs.map((slug) => ({
    url: `${baseUrl}/brokers/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ── Per-stock option chain pages are DELIBERATELY EXCLUDED from the sitemap ──
  //
  // GSC (2026-07-19): 21 indexed vs 124 "Discovered – currently not indexed".
  // Measured cause: two stock pages share 519 words and differ by only 59 once
  // the ticker is removed — ~90% duplicate. Their one differentiator (the live
  // option chain) is client-rendered, so a crawler sees near-identical HTML.
  // Asking Google to index 52 clones burned crawl budget that the ~98 genuinely
  // unique pages (strategies, learn, brokers, calculators, FII/DII) needed.
  //
  // The pages stay live and internally linked (hub + footer + contextual), so
  // they remain discoverable — they just stop competing for crawl budget.
  // Re-add them once each carries real per-stock data. That needs stock options
  // (FinInstrmTp "STO") in BigQuery; the bhavcopy ingest currently keeps index
  // options ("IDO") only, so there is nothing unique to render yet.

  return [...staticPages, ...strategyPages, ...learnPages, brokerHubPage, ...brokerPages];
}
