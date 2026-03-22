/**
 * Historical Price Data Generator for Backtesting
 * Generates realistic OHLC data with configurable volatility.
 */

/**
 * Generate historical daily OHLC data using Geometric Brownian Motion
 * @param {number} startPrice - Starting price
 * @param {number} days - Number of trading days
 * @param {number} annualVol - Annual volatility (e.g. 0.15 for 15%)
 * @param {number} annualDrift - Annual drift/return (e.g. 0.10 for 10%)
 * @returns {Array<{date: string, open: number, high: number, low: number, close: number, volume: number}>}
 */
export function generateHistoricalOHLC(startPrice = 22500, days = 252, annualVol = 0.15, annualDrift = 0.10) {
  const data = [];
  let price = startPrice;
  const dt = 1 / 252; // One trading day
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // GBM step
    const z = normalRandom();
    const dailyReturn = (annualDrift - 0.5 * annualVol * annualVol) * dt + annualVol * Math.sqrt(dt) * z;
    const open = price;
    price = price * Math.exp(dailyReturn);
    const close = price;

    // Intraday high/low (simulated)
    const intradayVol = annualVol * Math.sqrt(dt) * price;
    const high = Math.max(open, close) + Math.abs(normalRandom()) * intradayVol * 0.5;
    const low = Math.min(open, close) - Math.abs(normalRandom()) * intradayVol * 0.5;
    const volume = Math.round(5000000 + Math.random() * 10000000);

    data.push({
      date: date.toISOString().split("T")[0],
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume,
    });
  }

  return data;
}

/**
 * Generate intraday price path (for option price simulation during a day)
 */
export function generateIntradayPath(startPrice, hours = 6.25, steps = 375, annualVol = 0.15) {
  const data = [];
  let price = startPrice;
  const dt = 1 / (252 * steps); // fraction of trading day per step

  for (let i = 0; i <= steps; i++) {
    const z = normalRandom();
    price = price * Math.exp(annualVol * Math.sqrt(dt) * z);
    const minuteOffset = Math.round((i / steps) * hours * 60);
    const hourPart = Math.floor(minuteOffset / 60) + 9;
    const minPart = (minuteOffset % 60) + 15;

    data.push({
      time: `${String(hourPart).padStart(2, "0")}:${String(minPart % 60).padStart(2, "0")}`,
      price: round2(price),
    });
  }

  return data;
}

// Box-Muller transform for normal random
function normalRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
