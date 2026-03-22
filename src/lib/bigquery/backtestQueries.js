/**
 * BigQuery Backtest Query Engine
 *
 * Queries real NSE historical options data stored in BigQuery.
 * Tables:
 *   optionsgyani.options_eod  — daily NSE F&O bhavcopy (all strikes, all expiries)
 *   optionsgyani.spot_prices  — NSE index closing prices (NIFTY, BANKNIFTY, etc.)
 *
 * Schema (options_eod):
 *   trade_date DATE, underlying STRING, expiry_date DATE, strike FLOAT64,
 *   option_type STRING (CE/PE), open FLOAT64, high FLOAT64, low FLOAT64,
 *   close FLOAT64, ltp FLOAT64, settle_pr FLOAT64, volume INT64,
 *   oi INT64, oi_change INT64, iv FLOAT64, lot_size INT64
 *
 * Schema (spot_prices):
 *   trade_date DATE, underlying STRING, open FLOAT64, high FLOAT64,
 *   low FLOAT64, close FLOAT64, volume INT64
 */

import { runQuery, DATASET, PROJECT_ID } from "./client";

// NSE lot sizes (current, as of 2024)
export const LOT_SIZES = {
  NIFTY: 75,
  BANKNIFTY: 30,
  FINNIFTY: 65,
  MIDCPNIFTY: 120,
  SENSEX: 20,
};

// Strike intervals for ATM rounding
export const STRIKE_INTERVALS = {
  NIFTY: 50,
  BANKNIFTY: 100,
  FINNIFTY: 50,
  MIDCPNIFTY: 75,
  SENSEX: 100,
};

/**
 * Returns the data coverage (earliest trade_date) in BigQuery for a given underlying.
 */
export async function getDataCoverage(underlying) {
  const sql = `
    SELECT
      MIN(trade_date) AS earliest_date,
      MAX(trade_date) AS latest_date,
      COUNT(DISTINCT trade_date) AS trading_days
    FROM \`${PROJECT_ID}.${DATASET}.options_eod\`
    WHERE underlying = @underlying
  `;
  const rows = await runQuery(sql, { underlying });
  return rows[0] || null;
}

/**
 * Fetch all weekly or monthly expiry dates for a given underlying in the date range.
 * NSE Thursday weekly expiries: DAYOFWEEK = 5 (Thursday)
 * Monthly: last Thursday of the month
 */
export async function getExpiryDates(underlying, startDate, endDate, expiryType) {
  let expiryFilter = "EXTRACT(DAYOFWEEK FROM expiry_date) = 5"; // All Thursdays for weekly

  if (expiryType === "Monthly") {
    // Last Thursday of each month: no next Thursday in the same month
    expiryFilter = `
      EXTRACT(DAYOFWEEK FROM expiry_date) = 5
      AND NOT EXISTS (
        SELECT 1 FROM UNNEST(GENERATE_DATE_ARRAY(
          DATE_ADD(expiry_date, INTERVAL 1 DAY),
          LAST_DAY(expiry_date, MONTH),
          INTERVAL 1 DAY
        )) AS d
        WHERE EXTRACT(DAYOFWEEK FROM d) = 5
      )
    `;
  }

  const sql = `
    SELECT DISTINCT expiry_date
    FROM \`${PROJECT_ID}.${DATASET}.options_eod\`
    WHERE underlying = @underlying
      AND expiry_date BETWEEN @startDate AND @endDate
      AND ${expiryFilter}
    ORDER BY expiry_date ASC
  `;

  const rows = await runQuery(sql, { underlying, startDate, endDate });
  return rows.map((r) => r.expiry_date.value || r.expiry_date);
}

/**
 * Fetch spot prices for the given underlying on specific dates.
 * Returns a map: { "2023-01-05": 18150.34, ... }
 */
export async function getSpotPrices(underlying, dates) {
  if (!dates || dates.length === 0) return {};

  const dateList = dates.map((d) => `'${d}'`).join(", ");

  const sql = `
    SELECT trade_date, close AS spot
    FROM \`${PROJECT_ID}.${DATASET}.spot_prices\`
    WHERE underlying = @underlying
      AND trade_date IN (${dateList})
    ORDER BY trade_date
  `;

  const rows = await runQuery(sql, { underlying });
  const map = {};
  for (const r of rows) {
    const d = r.trade_date.value || r.trade_date;
    map[d] = parseFloat(r.spot);
  }
  return map;
}

/**
 * Find the last available trading date on or before a target date for a given underlying.
 */
export async function getNearestTradingDate(underlying, targetDate, direction = "before") {
  const op = direction === "before" ? "<=" : ">=";
  const order = direction === "before" ? "DESC" : "ASC";

  const sql = `
    SELECT trade_date
    FROM \`${PROJECT_ID}.${DATASET}.spot_prices\`
    WHERE underlying = @underlying
      AND trade_date ${op} @targetDate
    ORDER BY trade_date ${order}
    LIMIT 1
  `;

  const rows = await runQuery(sql, { underlying, targetDate });
  if (!rows[0]) return null;
  return rows[0].trade_date.value || rows[0].trade_date;
}

/**
 * Core backtest data query.
 *
 * For each expiry in the date range, fetches:
 * - Entry-day option premiums for the strategy's strikes
 * - Exit-day option settlement prices
 * - Entry and exit spot prices
 *
 * Returns one row per (expiry × leg):
 *   expiry_date, entry_date, exit_date, entry_spot, exit_spot,
 *   strike, option_type, entry_ltp, exit_price, iv, oi
 */
export async function fetchBacktestData({
  underlying,
  startDate,
  endDate,
  expiryType,
  daysBeforeExpiry = 1, // Entry N trading days before expiry
}) {
  // For weekly: entry is 1 day before (or same day as open)
  // For monthly: entry can be 1 week or 1 month before
  const entryDaysBack = expiryType === "Monthly" ? 7 : 1;

  const expiryDayOfWeek = 5; // Thursday

  const sql = `
    WITH

    -- Step 1: All valid expiry dates in range (Thursdays only / last-Thursday for monthly)
    expiry_dates AS (
      SELECT DISTINCT expiry_date
      FROM \`${PROJECT_ID}.${DATASET}.options_eod\`
      WHERE underlying = @underlying
        AND expiry_date BETWEEN @startDate AND @endDate
        AND EXTRACT(DAYOFWEEK FROM expiry_date) = ${expiryDayOfWeek}
        ${
          expiryType === "Monthly"
            ? `AND DATE_ADD(expiry_date, INTERVAL 7 DAY) > LAST_DAY(expiry_date, MONTH)`
            : ""
        }
    ),

    -- Step 2: Find the entry date — closest trading day before each expiry
    entry_dates AS (
      SELECT
        e.expiry_date,
        MAX(s.trade_date) AS entry_date
      FROM expiry_dates e
      JOIN \`${PROJECT_ID}.${DATASET}.spot_prices\` s
        ON s.underlying = @underlying
        AND s.trade_date < e.expiry_date
        AND s.trade_date >= DATE_SUB(e.expiry_date, INTERVAL ${entryDaysBack + 4} DAY)
      GROUP BY e.expiry_date
    ),

    -- Step 3: Spot prices on entry and expiry dates
    cycle_spots AS (
      SELECT
        ed.expiry_date,
        ed.entry_date,
        entry_sp.close  AS entry_spot,
        expiry_sp.close AS exit_spot
      FROM entry_dates ed
      JOIN \`${PROJECT_ID}.${DATASET}.spot_prices\` entry_sp
        ON entry_sp.underlying = @underlying
        AND entry_sp.trade_date = ed.entry_date
      JOIN \`${PROJECT_ID}.${DATASET}.spot_prices\` expiry_sp
        ON expiry_sp.underlying = @underlying
        AND expiry_sp.trade_date = ed.expiry_date
    ),

    -- Step 4: ATM strike calculation
    atm_strikes AS (
      SELECT
        cs.*,
        ROUND(cs.entry_spot / @strikeInterval) * @strikeInterval AS atm_strike
      FROM cycle_spots cs
    )

    -- Step 5: Pull option premiums for ATM ± 10 strikes on both entry and expiry day
    SELECT
      a.expiry_date,
      a.entry_date,
      a.expiry_date    AS exit_date,
      a.entry_spot,
      a.exit_spot,
      a.atm_strike,
      e_opt.strike,
      e_opt.option_type,
      e_opt.ltp        AS entry_ltp,
      e_opt.iv         AS entry_iv,
      e_opt.oi         AS entry_oi,
      -- Exit: use close/ltp on expiry day (settle_pr is the *underlying* settlement, not option price)
      COALESCE(x_opt.close, x_opt.ltp, 0) AS exit_price,
      x_opt.oi         AS exit_oi
    FROM atm_strikes a
    -- Entry day options
    JOIN \`${PROJECT_ID}.${DATASET}.options_eod\` e_opt
      ON  e_opt.underlying  = @underlying
      AND e_opt.expiry_date = a.expiry_date
      AND e_opt.trade_date  = a.entry_date
      AND e_opt.strike BETWEEN a.atm_strike - (@strikeInterval * 10)
                            AND a.atm_strike + (@strikeInterval * 10)
    -- Expiry day settlement options
    LEFT JOIN \`${PROJECT_ID}.${DATASET}.options_eod\` x_opt
      ON  x_opt.underlying  = @underlying
      AND x_opt.expiry_date = a.expiry_date
      AND x_opt.trade_date  = a.expiry_date
      AND x_opt.strike      = e_opt.strike
      AND x_opt.option_type = e_opt.option_type
    ORDER BY a.expiry_date, e_opt.strike, e_opt.option_type
  `;

  const strikeInterval = STRIKE_INTERVALS[underlying] || 50;

  const rows = await runQuery(sql, {
    underlying,
    startDate,
    endDate,
    strikeInterval,
  });

  return rows;
}

/**
 * Run the full backtest computation on real data rows returned from BigQuery.
 *
 * @param {Array}  rows         — rows from fetchBacktestData
 * @param {Array}  strategyLegs — [{ strike_offset, type, action, lots }]
 * @param {Object} opts
 * @param {string} opts.underlying
 * @param {number} opts.slippage  — fraction e.g. 0.005 for 0.5%
 * @param {number} opts.lotSize
 * @returns {{ trades: Array, summary: Object, dataSource: "real" }}
 */
export function computeBacktest(rows, strategyLegs, opts) {
  const { underlying, slippage = 0.005, lotSize } = opts;
  const lot = lotSize || LOT_SIZES[underlying] || 50;
  const strikeInterval = STRIKE_INTERVALS[underlying] || 50;

  // Group rows by expiry_date
  const byExpiry = {};
  for (const row of rows) {
    const expiry = row.expiry_date?.value || row.expiry_date;
    if (!byExpiry[expiry]) {
      byExpiry[expiry] = {
        expiry_date: expiry,
        entry_date: row.entry_date?.value || row.entry_date,
        exit_date: row.exit_date?.value || row.exit_date,
        entry_spot: parseFloat(row.entry_spot),
        exit_spot: parseFloat(row.exit_spot),
        atm_strike: parseFloat(row.atm_strike),
        options: {},
      };
    }

    // Key: "17500_CE" — normalize float strike from BigQuery to integer
    const key = `${Math.round(parseFloat(row.strike))}_${row.option_type}`;
    byExpiry[expiry].options[key] = {
      strike: parseFloat(row.strike),
      option_type: row.option_type,
      entry_ltp: parseFloat(row.entry_ltp || 0),
      entry_iv: parseFloat(row.entry_iv || 0),
      exit_price: parseFloat(row.exit_price || 0),
    };
  }

  const expiries = Object.values(byExpiry).sort((a, b) =>
    a.expiry_date.localeCompare(b.expiry_date)
  );

  const trades = [];
  let cumulativePnL = 0;
  let wins = 0;
  let grossWins = 0;
  let grossLosses = 0;
  let peak = 0;
  let maxDrawdown = 0;

  for (let i = 0; i < expiries.length; i++) {
    const cycle = expiries[i];
    const atm = cycle.atm_strike;

    let tradePnL = 0;
    let legsDetail = [];
    let hasAllLegs = true;

    for (const leg of strategyLegs) {
      const strike = atm + (leg.strike_offset || 0) * strikeInterval;
      const roundedStrike = Math.round(strike / strikeInterval) * strikeInterval;
      const key = `${roundedStrike}_${leg.type}`;

      const optData = cycle.options[key];
      if (!optData) {
        hasAllLegs = false;
        break;
      }

      const direction = leg.action === "BUY" ? 1 : -1;
      const qty = (leg.lots || 1) * lot;

      // Apply slippage: buying costs more, selling gets less
      const entryWithSlip =
        leg.action === "BUY"
          ? optData.entry_ltp * (1 + slippage)
          : optData.entry_ltp * (1 - slippage);

      const exitWithSlip =
        leg.action === "SELL" // Closing a sell = buying back
          ? optData.exit_price * (1 + slippage)
          : optData.exit_price * (1 - slippage);

      // P&L: for SELL legs, profit = entry_premium - exit_price (sold high, bought back low)
      //      for BUY legs,  profit = exit_price - entry_premium
      const legPnl = direction * (exitWithSlip - entryWithSlip) * qty * -1;
      // Correct sign: SELL = short. P&L = (sold_at - bought_at) * qty
      // direction=-1 means we sold: pnl = (entry - exit) * qty
      const correctedLegPnl = direction === -1
        ? (entryWithSlip - exitWithSlip) * qty
        : (exitWithSlip - entryWithSlip) * qty;

      tradePnL += correctedLegPnl;
      legsDetail.push({
        strike: roundedStrike,
        type: leg.type,
        action: leg.action,
        entry: Math.round(entryWithSlip * 100) / 100,
        exit: Math.round(exitWithSlip * 100) / 100,
        pnl: Math.round(correctedLegPnl),
      });
    }

    // Skip cycles where data is missing for required legs
    if (!hasAllLegs) continue;

    tradePnL = Math.round(tradePnL);
    cumulativePnL += tradePnL;

    if (tradePnL > 0) {
      wins++;
      grossWins += tradePnL;
    } else {
      grossLosses += Math.abs(tradePnL);
    }

    peak = Math.max(peak, cumulativePnL);
    maxDrawdown = Math.max(maxDrawdown, peak - cumulativePnL);

    const entryDateObj = new Date(cycle.entry_date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    trades.push({
      cycle: i + 1,
      entryDate: cycle.entry_date,
      exitDate: cycle.exit_date,
      expiryDate: cycle.expiry_date,
      dayOfWeek: days[entryDateObj.getDay()],
      month: months[entryDateObj.getMonth()],
      entrySpot: Math.round(cycle.entry_spot),
      exitSpot: Math.round(cycle.exit_spot),
      atmStrike: atm,
      legs: legsDetail,
      pnl: tradePnL,
      cumulativePnl: Math.round(cumulativePnL),
    });
  }

  const totalTrades = trades.length;
  const losses = totalTrades - wins;
  const avgPnL = totalTrades > 0 ? Math.round(cumulativePnL / totalTrades) : 0;
  const winRate = totalTrades > 0 ? wins / totalTrades : 0;
  const avgWin = wins > 0 ? Math.round(grossWins / wins) : 0;
  const avgLoss = losses > 0 ? Math.round(grossLosses / losses) : 0;
  const expectancy = Math.round(winRate * avgWin - (1 - winRate) * avgLoss);

  return {
    trades,
    summary: {
      totalTrades,
      totalPnL: Math.round(cumulativePnL),
      avgPnL,
      winRate: Math.round(winRate * 100),
      maxDrawdown: Math.round(maxDrawdown),
      wins,
      losses,
      avgWin,
      avgLoss,
      expectancy,
    },
    dataSource: "real",
    dataNote: `${totalTrades} cycles on real NSE Bhavcopy data`,
  };
}
