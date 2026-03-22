/**
 * GET /api/simulator/day
 *
 * Returns real NSE historical data for the simulator's time-machine replay.
 *
 * Query params:
 *   underlying  — "NIFTY" | "BANKNIFTY" | "FINNIFTY"
 *   startDate   — "YYYY-MM-DD"  (entry / simulation start date)
 *   endDate     — "YYYY-MM-DD"  (last day of campaign)
 *   expiryDate  — "YYYY-MM-DD"  (options expiry — for real premium lookup)
 *
 * Response:
 *   {
 *     dataSource : "real" | "no_data" | "simulation",
 *     days       : [{ date, close }]          — real NSE closing prices
 *     options    : [{ strike, type, ltp, oi }] — real option chain on entry day
 *     coverage   : { earliest, latest }        — what range we have in BQ
 *   }
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isBigQueryConfigured, runQuery, DATASET, PROJECT_ID } from "@/lib/bigquery/client";
import { STRIKE_INTERVALS } from "@/lib/bigquery/backtestQueries";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const underlying  = searchParams.get("underlying")  || "NIFTY";
  const startDate   = searchParams.get("startDate");
  const endDate     = searchParams.get("endDate");
  const expiryDate  = searchParams.get("expiryDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  if (!isBigQueryConfigured()) {
    return NextResponse.json({ dataSource: "simulation", configured: false });
  }

  try {
    // ── 1. Real closing prices for each trading day in range ──────────────────
    const spotSql = `
      SELECT trade_date, close
      FROM \`${PROJECT_ID}.${DATASET}.spot_prices\`
      WHERE underlying = @underlying
        AND trade_date BETWEEN @startDate AND @endDate
      ORDER BY trade_date
    `;
    const spotRows = await runQuery(spotSql, { underlying, startDate, endDate });

    if (!spotRows || spotRows.length === 0) {
      // Return coverage so the UI can tell the user what range is available
      const covSql = `
        SELECT MIN(trade_date) AS earliest, MAX(trade_date) AS latest
        FROM \`${PROJECT_ID}.${DATASET}.spot_prices\`
        WHERE underlying = @underlying
      `;
      const [cov] = await runQuery(covSql, { underlying });
      return NextResponse.json({
        dataSource: "no_data",
        configured: true,
        coverage: {
          earliest: cov?.earliest?.value || cov?.earliest || "2016-01-04",
          latest:   cov?.latest?.value   || cov?.latest   || "2024-06-03",
        },
        error: `No data for ${underlying} between ${startDate} and ${endDate}`,
      });
    }

    const days = spotRows.map((r) => ({
      date:  r.trade_date?.value || r.trade_date,
      close: parseFloat(r.close),
    }));

    // ── 2. Real option chain on entry day ─────────────────────────────────────
    let options = [];
    const entryDate  = days[0].date;
    const entryClose = days[0].close;
    const interval   = STRIKE_INTERVALS[underlying] || 50;
    const atm        = Math.round(entryClose / interval) * interval;

    if (expiryDate) {
      const optSql = `
        SELECT strike, option_type, ltp, oi, iv
        FROM \`${PROJECT_ID}.${DATASET}.options_eod\`
        WHERE underlying   = @underlying
          AND trade_date   = @entryDate
          AND expiry_date  = @expiryDate
          AND strike BETWEEN @atmLow AND @atmHigh
        ORDER BY strike, option_type
      `;
      const optRows = await runQuery(optSql, {
        underlying,
        entryDate,
        expiryDate,
        atmLow:  atm - interval * 10,
        atmHigh: atm + interval * 10,
      });

      options = optRows.map((r) => ({
        strike: Math.round(parseFloat(r.strike)),
        type:   r.option_type,
        ltp:    parseFloat(r.ltp  || 0),
        oi:     parseInt(r.oi    || 0),
        iv:     parseFloat(r.iv  || 0),
      }));
    }

    return NextResponse.json({
      dataSource: "real",
      configured: true,
      underlying,
      days,
      options,
      entryDate,
      atmStrike: atm,
    });
  } catch (err) {
    console.error("[/api/simulator/day]", err.message);
    return NextResponse.json(
      { dataSource: "error", configured: true, error: err.message },
      { status: 500 }
    );
  }
}
