/**
 * GET /api/chain/iv-stats
 *
 * Returns IV Percentile (IVP) and IV Rank (IVR) for a given underlying
 * using 52 weeks of historical ATM IV data from NSE Bhavcopy.
 *
 * Query params:
 *   underlying — "NIFTY" | "BANKNIFTY" | "FINNIFTY" (default: NIFTY)
 *   lookback   — number of calendar days for history (default: 365)
 *
 * Response:
 *   {
 *     underlying: string,
 *     currentIV:  number,   — today's / latest ATM IV (%)
 *     ivp:        number,   — IV Percentile: % of days in lookback with lower IV (0-100)
 *     ivr:        number,   — IV Rank: 0-100 scale where 100 = at 52wk high
 *     iv52wHigh:  number,
 *     iv52wLow:   number,
 *     dataPoints: number,   — how many days used in calculation
 *   }
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isBigQueryConfigured, runQuery, DATASET, PROJECT_ID } from "@/lib/bigquery/client";

// Strike intervals per underlying for ATM calculation
const STRIKE_INTERVALS = {
  NIFTY: 50, BANKNIFTY: 100, FINNIFTY: 50,
  MIDCPNIFTY: 25, SENSEX: 100,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const underlying = searchParams.get("underlying") || "NIFTY";
  const lookback   = parseInt(searchParams.get("lookback") || "365", 10);

  if (!isBigQueryConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const interval = STRIKE_INTERVALS[underlying] || 50;

    // Fetch daily ATM IV for the last `lookback` days.
    // ATM IV = average of CE IV and PE IV for the strike nearest to that day's spot close.
    // We use the nearest expiry on each day to get consistent near-month data.
    // Anchor to MAX available trade_date so this works even when dataset lags behind today.
    const sql = `
      WITH
      latest AS (
        SELECT MAX(trade_date) AS max_date
        FROM \`${PROJECT_ID}.${DATASET}.spot_prices\`
        WHERE underlying = @underlying
      ),
      spot_daily AS (
        SELECT s.trade_date, s.close AS spot
        FROM \`${PROJECT_ID}.${DATASET}.spot_prices\` s, latest
        WHERE s.underlying = @underlying
          AND s.trade_date >= DATE_SUB(latest.max_date, INTERVAL @lookback DAY)
      ),
      nearest_expiry AS (
        SELECT
          s.trade_date,
          s.spot,
          MIN(o.expiry_date) AS nearest_exp
        FROM spot_daily s
        JOIN \`${PROJECT_ID}.${DATASET}.options_eod\` o
          ON o.underlying   = @underlying
          AND o.trade_date  = s.trade_date
          AND o.expiry_date >= s.trade_date
        GROUP BY s.trade_date, s.spot
      ),
      atm_iv AS (
        SELECT
          ne.trade_date,
          ne.spot,
          ROUND(ne.spot / @interval) * @interval AS atm_strike,
          AVG(o.iv) AS avg_iv
        FROM nearest_expiry ne
        JOIN \`${PROJECT_ID}.${DATASET}.options_eod\` o
          ON o.underlying   = @underlying
          AND o.trade_date  = ne.trade_date
          AND o.expiry_date = ne.nearest_exp
          AND o.strike      = ROUND(ne.spot / @interval) * @interval
          AND o.iv > 0
        GROUP BY ne.trade_date, ne.spot, atm_strike
      )
      SELECT
        trade_date,
        spot,
        atm_strike,
        avg_iv
      FROM atm_iv
      WHERE avg_iv IS NOT NULL AND avg_iv > 0
      ORDER BY trade_date ASC
    `;

    const rows = await runQuery(sql, {
      underlying,
      lookback,
      interval,
    });

    if (!rows || rows.length < 5) {
      return NextResponse.json({
        error: "insufficient_data",
        underlying,
        dataPoints: rows?.length || 0,
      }, { status: 200 });
    }

    // BigQuery stores iv as a decimal fraction (e.g. 0.36 = 36%).
    // Normalise: if the median value is < 2 it's stored as a fraction → multiply by 100.
    const rawValues = rows.map(r => parseFloat(r.avg_iv));
    const median = rawValues.slice().sort((a,b)=>a-b)[Math.floor(rawValues.length/2)];
    const scale  = median < 2 ? 100 : 1;
    const ivValues = rawValues.map(v => v * scale);
    const currentIV = ivValues[ivValues.length - 1];
    const iv52wHigh = Math.max(...ivValues);
    const iv52wLow  = Math.min(...ivValues);

    // IVP: percentage of days where IV was LOWER than current IV
    const daysLower = ivValues.filter(v => v < currentIV).length;
    const ivp = Math.round((daysLower / ivValues.length) * 100);

    // IVR: where current IV sits between 52w low and high (0 = at low, 100 = at high)
    const ivr = iv52wHigh === iv52wLow
      ? 50
      : Math.round(((currentIV - iv52wLow) / (iv52wHigh - iv52wLow)) * 100);

    return NextResponse.json({
      underlying,
      currentIV:  Math.round(currentIV * 100) / 100,
      ivp:        Math.min(100, Math.max(0, ivp)),
      ivr:        Math.min(100, Math.max(0, ivr)),
      iv52wHigh:  Math.round(iv52wHigh * 100) / 100,
      iv52wLow:   Math.round(iv52wLow  * 100) / 100,
      dataPoints: ivValues.length,
    });

  } catch (err) {
    console.error("[/api/chain/iv-stats]", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
