/**
 * Pre-built Options Strategy Templates
 * Each template generates legs based on a given ATM strike price.
 */

const TEMPLATES = {
  "long-call": {
    name: "Long Call",
    description: "Bullish bet with limited risk. Buy a call option.",
    sentiment: "Bullish",
    risk: "Limited (Premium paid)",
    reward: "Unlimited",
    generate: (atm, premium = 150) => [
      { type: "CE", action: "BUY", strike: atm, premium, lots: 1, lotSize: 50 },
    ],
  },
  "long-put": {
    name: "Long Put",
    description: "Bearish bet with limited risk. Buy a put option.",
    sentiment: "Bearish",
    risk: "Limited (Premium paid)",
    reward: "Substantial (to zero)",
    generate: (atm, premium = 150) => [
      { type: "PE", action: "BUY", strike: atm, premium, lots: 1, lotSize: 50 },
    ],
  },
  "bull-call-spread": {
    name: "Bull Call Spread",
    description: "Moderately bullish. Buy lower strike call, sell higher strike call.",
    sentiment: "Moderately Bullish",
    risk: "Limited",
    reward: "Limited",
    generate: (atm) => [
      { type: "CE", action: "BUY", strike: atm, premium: 180, lots: 1, lotSize: 50 },
      { type: "CE", action: "SELL", strike: atm + 200, premium: 80, lots: 1, lotSize: 50 },
    ],
  },
  "bear-put-spread": {
    name: "Bear Put Spread",
    description: "Moderately bearish. Buy higher strike put, sell lower strike put.",
    sentiment: "Moderately Bearish",
    risk: "Limited",
    reward: "Limited",
    generate: (atm) => [
      { type: "PE", action: "BUY", strike: atm, premium: 170, lots: 1, lotSize: 50 },
      { type: "PE", action: "SELL", strike: atm - 200, premium: 70, lots: 1, lotSize: 50 },
    ],
  },
  "long-straddle": {
    name: "Long Straddle",
    description: "Expect big move in either direction. Buy ATM call & put.",
    sentiment: "Volatile (Direction uncertain)",
    risk: "Limited (Total premiums)",
    reward: "Unlimited",
    generate: (atm) => [
      { type: "CE", action: "BUY", strike: atm, premium: 160, lots: 1, lotSize: 50 },
      { type: "PE", action: "BUY", strike: atm, premium: 155, lots: 1, lotSize: 50 },
    ],
  },
  "short-straddle": {
    name: "Short Straddle",
    description: "Expect low volatility. Sell ATM call & put. Collect premium.",
    sentiment: "Neutral / Low Volatility",
    risk: "Unlimited",
    reward: "Limited (Total premiums)",
    generate: (atm) => [
      { type: "CE", action: "SELL", strike: atm, premium: 160, lots: 1, lotSize: 50 },
      { type: "PE", action: "SELL", strike: atm, premium: 155, lots: 1, lotSize: 50 },
    ],
  },
  "long-strangle": {
    name: "Long Strangle",
    description: "Expect big move. Buy OTM call & OTM put. Cheaper than straddle.",
    sentiment: "Volatile",
    risk: "Limited",
    reward: "Unlimited",
    generate: (atm) => [
      { type: "CE", action: "BUY", strike: atm + 200, premium: 80, lots: 1, lotSize: 50 },
      { type: "PE", action: "BUY", strike: atm - 200, premium: 75, lots: 1, lotSize: 50 },
    ],
  },
  "short-strangle": {
    name: "Short Strangle",
    description: "Expect range-bound movement. Sell OTM call & OTM put to collect premium.",
    sentiment: "Neutral / Range-bound",
    risk: "Unlimited",
    reward: "Limited (Total premiums)",
    generate: (atm) => [
      { type: "CE", action: "SELL", strike: atm + 200, premium: 80, lots: 1, lotSize: 50 },
      { type: "PE", action: "SELL", strike: atm - 200, premium: 75, lots: 1, lotSize: 50 },
    ],
  },
  "batman": {
    name: "Double Batman",
    description: "Range-bound strategy. Buy OTM options, sell 2x further OTM options. Creates a double-peak payoff resembling Batman.",
    sentiment: "Neutral / Decreasing Volatility",
    risk: "Unlimited (on large breakouts)",
    reward: "High at peaks",
    generate: (atm) => [
      // Call Ratio Spread side
      { type: "CE", action: "BUY", strike: atm + 100, premium: 120, lots: 1, lotSize: 50 },
      { type: "CE", action: "SELL", strike: atm + 300, premium: 45, lots: 2, lotSize: 50 },
      // Put Ratio Spread side
      { type: "PE", action: "BUY", strike: atm - 100, premium: 115, lots: 1, lotSize: 50 },
      { type: "PE", action: "SELL", strike: atm - 300, premium: 40, lots: 2, lotSize: 50 },
    ],
  },
  "iron-condor": {
    name: "Iron Condor",
    description: "Range-bound strategy. Sell OTM strangle, buy further OTM options for protection.",
    sentiment: "Neutral / Range-bound",
    risk: "Limited",
    reward: "Limited (Net premium)",
    generate: (atm) => [
      { type: "CE", action: "SELL", strike: atm + 200, premium: 80, lots: 1, lotSize: 50 },
      { type: "CE", action: "BUY", strike: atm + 400, premium: 30, lots: 1, lotSize: 50 },
      { type: "PE", action: "SELL", strike: atm - 200, premium: 75, lots: 1, lotSize: 50 },
      { type: "PE", action: "BUY", strike: atm - 400, premium: 25, lots: 1, lotSize: 50 },
    ],
  },
  "iron-butterfly": {
    name: "Iron Butterfly",
    description: "Sell ATM straddle, buy OTM protection. Max profit at ATM.",
    sentiment: "Neutral / Pinning",
    risk: "Limited",
    reward: "Limited",
    generate: (atm) => [
      { type: "CE", action: "SELL", strike: atm, premium: 160, lots: 1, lotSize: 50 },
      { type: "PE", action: "SELL", strike: atm, premium: 155, lots: 1, lotSize: 50 },
      { type: "CE", action: "BUY", strike: atm + 300, premium: 40, lots: 1, lotSize: 50 },
      { type: "PE", action: "BUY", strike: atm - 300, premium: 35, lots: 1, lotSize: 50 },
    ],
  },
  "covered-call": {
    name: "Covered Call (Synthetic)",
    description: "Hold underlying (synthetic via deep ITM call) + sell OTM call.",
    sentiment: "Mildly Bullish",
    risk: "Substantial",
    reward: "Limited",
    generate: (atm) => [
      { type: "CE", action: "BUY", strike: atm - 500, premium: 520, lots: 1, lotSize: 50 },
      { type: "CE", action: "SELL", strike: atm + 100, premium: 110, lots: 1, lotSize: 50 },
    ],
  },
};

export function getStrategyTemplate(key) {
  return TEMPLATES[key] || null;
}

export function getAllTemplates() {
  return Object.entries(TEMPLATES).map(([key, val]) => ({
    key,
    name: val.name,
    description: val.description,
    sentiment: val.sentiment,
    risk: val.risk,
    reward: val.reward,
  }));
}

export function generateStrategyLegs(key, atm) {
  const template = TEMPLATES[key];
  if (!template) return [];
  return template.generate(atm);
}
