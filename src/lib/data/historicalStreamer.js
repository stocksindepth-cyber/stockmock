/**
 * Historical Data Streamer
 *
 * Two modes:
 *
 * 1. generateCampaignFromRealCloses(realDays)  ← PREFERRED
 *    Takes real NSE closing prices from BigQuery and generates a minute-by-minute
 *    intraday path using a Brownian bridge anchored to the real daily closes.
 *    Each day starts at the previous day's real close (realistic overnight gap)
 *    and ends exactly at the current day's real close.
 *    dataSource: "real"
 *
 * 2. generateHistoricalCampaign(startDateStr, days, baseSpot)  ← FALLBACK
 *    Pure GBM simulation — used only when BigQuery is unavailable.
 *    dataSource: "simulation"
 */

const MINUTES_PER_DAY = 375; // 09:15 to 15:30

// ─── Real-data mode ───────────────────────────────────────────────────────────

/**
 * Generate a tick-by-tick campaign anchored to real NSE daily closes.
 *
 * @param {Array<{date: string, close: number}>} realDays — from BigQuery spot_prices
 * @returns {Array} stream of minute ticks, same shape as generateHistoricalCampaign
 */
export function generateCampaignFromRealCloses(realDays) {
  const stream = [];
  let globalMinute = 0;

  for (let d = 0; d < realDays.length; d++) {
    const { date, close: dayClose } = realDays[d];

    // Day starts at previous day's close (overnight gap realism)
    // First day starts slightly before its own close (±0.1% open gap)
    const prevClose = d === 0
      ? dayClose * (1 + (Math.random() - 0.5) * 0.002)
      : realDays[d - 1].close;

    const dayOpen = parseFloat(prevClose.toFixed(2));

    // Generate Brownian bridge: starts at dayOpen, ends at dayClose
    const path = brownianBridge(dayOpen, dayClose, MINUTES_PER_DAY + 1);

    for (let i = 0; i <= MINUTES_PER_DAY; i++) {
      const timeCode = minuteIndexToTime(i);
      stream.push({
        dayIndex:    d + 1,
        totalDays:   realDays.length,
        minuteIndex: i,
        globalMinute: globalMinute++,
        time:        timeCode,
        spot:        path[i],
        isNewDay:    i === 0,
        timestamp:   `${date}T${timeCode}:00`,
        date,
        dataSource:  "real",
      });
    }
  }

  return stream;
}

/**
 * Brownian bridge from `start` to `end` over `steps` points.
 * The path starts at `start` and ends exactly at `end`, with
 * realistic intraday noise scaled to the magnitude of the move.
 */
function brownianBridge(start, end, steps) {
  const move      = end - start;
  const dailyVol  = Math.abs(move) * 0.6 + Math.abs(start) * 0.004; // vol ~ 0.4% of spot/day
  const stepVol   = dailyVol / Math.sqrt(steps);

  const raw = new Float64Array(steps);
  raw[0] = start;

  for (let i = 1; i < steps - 1; i++) {
    const prev       = raw[i - 1];
    const timeLeft   = steps - i;
    // Pull toward the final value proportionally — Brownian bridge mean reversion
    const pullToEnd  = (end - prev) / timeLeft;
    const noise      = gaussianNoise() * stepVol;
    raw[i]           = prev + pullToEnd + noise;
  }

  raw[steps - 1] = end; // Force exact close
  return Array.from(raw).map((v) => parseFloat(v.toFixed(2)));
}

/** Box-Muller transform for Gaussian random noise */
function gaussianNoise() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/** Convert 0-375 minute index to "HH:MM" string (09:15 → 15:30) */
function minuteIndexToTime(i) {
  const totalMin   = i + 9 * 60 + 15;
  const h          = Math.floor(totalMin / 60);
  const m          = totalMin % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// ─── Simulation fallback (no BigQuery) ───────────────────────────────────────

/**
 * Pure GBM simulation — fallback when BigQuery data is unavailable.
 * Uses `startDateStr` for timestamp labels only; spot prices are synthetic.
 */
export function generateHistoricalCampaign(startDateStr, days = 5, baseSpot = 22500) {
  const stream = [];
  let currentSpot  = baseSpot;
  let globalMinute = 0;

  for (let d = 0; d < days; d++) {
    const trend = Math.random() > 0.5 ? 1 : -1;

    if (d > 0) {
      const gapMagnitude = Math.random() * 0.015 * currentSpot;
      const gapDirection = Math.random() > 0.5 ? 1 : -1;
      currentSpot += gapDirection * gapMagnitude;
      currentSpot  = parseFloat(currentSpot.toFixed(2));
    }

    for (let i = 0; i <= MINUTES_PER_DAY; i++) {
      const timeCode = minuteIndexToTime(i);
      const drift    = trend * (Math.random() * 2);
      const shock    = (Math.random() - 0.5) * 0.0015 * currentSpot;
      currentSpot    = parseFloat((currentSpot + drift + shock).toFixed(2));

      stream.push({
        dayIndex:    d + 1,
        totalDays:   days,
        minuteIndex: i,
        globalMinute: globalMinute++,
        time:        timeCode,
        spot:        currentSpot,
        isNewDay:    i === 0,
        timestamp:   new Date(`${startDateStr}T${timeCode}:00`).toISOString(),
        dataSource:  "simulation",
      });
    }
  }

  return stream;
}
