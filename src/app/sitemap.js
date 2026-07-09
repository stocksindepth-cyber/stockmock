import { STRATEGY_SLUGS } from "@/data/strategies";

export default function sitemap() {
  const baseUrl = "https://www.optionsgyani.com";

  const staticPages = [
    { url: baseUrl,                           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    // ── Public SEO landing pages (live data, no login — indexable) ──────────
    { url: `${baseUrl}/nifty-option-chain`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/bank-nifty-option-chain`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/ltp-calculator`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/ltp-calculator/nifty`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/ltp-calculator/bank-nifty`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/nifty-expiry-day-2026`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
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

  return [...staticPages, ...strategyPages, ...learnPages, brokerHubPage, ...brokerPages];
}
