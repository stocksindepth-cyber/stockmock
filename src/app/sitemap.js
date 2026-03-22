export default function sitemap() {
  const baseUrl = "https://optionsgyani.com";

  const staticPages = [
    { url: baseUrl,                           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${baseUrl}/backtest`,             lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/chain`,                lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/builder`,              lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/oi-analysis`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/strategies`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/learn`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/screener`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/simulator`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/paper-trade`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
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

  const strategyPages = strategySlugs.map((slug) => ({
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

  return [...staticPages, ...strategyPages, ...learnPages];
}
