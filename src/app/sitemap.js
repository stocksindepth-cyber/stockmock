export default function sitemap() {
  const baseUrl = "https://optionsgyani.in";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/builder`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/chain`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/oi-analysis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/screener`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/backtest`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/simulator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/paper-trade`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/strategies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // All learn guide slugs
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

  // All strategy pages
  const strategySlugs = [
    "iron-condor-nifty",
    "short-straddle-banknifty",
    "nifty-weekly-expiry-guide",
    "bull-call-spread-nifty",
  ];

  const learnPages = learnSlugs.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const strategyPages = strategySlugs.map((slug) => ({
    url: `${baseUrl}/strategies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...learnPages, ...strategyPages];
}
