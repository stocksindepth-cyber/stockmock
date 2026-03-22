/**
 * POST /api/backtest
 *
 * Runs a real-data backtest using NSE historical options data from BigQuery.
 * Falls back to simulation if BigQuery is not configured.
 *
 * Request body:
 * {
 *   strategy:     string   — strategy key (e.g. "iron-condor")
 *   underlying:   string   — "NIFTY" | "BANKNIFTY" | "FINNIFTY" | ...
 *   startDate:    string   — "YYYY-MM-DD"
 *   endDate:      string   — "YYYY-MM-DD"
 *   expiryType:   string   — "Weekly" | "Monthly"
 *   slippage:     number   — percentage e.g. 0.5 for 0.5%
 * }
 *
 * Response:
 * {
 *   trades:     Array
 *   summary:    Object
 *   dataSource: "real" | "simulation"
 *   dataNote:   string
 *   coverage?:  { earliest_date, latest_date, trading_days }
 * }
 */

export const runtime = "nodejs"; // BigQuery SDK requires Node.js runtime

import { NextResponse } from "next/server";
import { isBigQueryConfigured, PROJECT_ID } from "@/lib/bigquery/client";
import {
  fetchBacktestData,
  computeBacktest,
  getDataCoverage,
  LOT_SIZES,
  STRIKE_INTERVALS,
} from "@/lib/bigquery/backtestQueries";
import { runBacktest } from "@/lib/options/backtester";
import { generateStrategyLegs } from "@/lib/options/strategies";

// Spot price approximations for simulation fallback
const SPOT_APPROX = {
  NIFTY: 22500,
  BANKNIFTY: 48000,
  FINNIFTY: 21000,
  MIDCPNIFTY: 12000,
  SENSEX: 74000,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      strategy = "iron-condor",
      underlying = "NIFTY",
      startDate,
      endDate,
      expiryType = "Weekly",
      slippage = 0.5,
    } = body;

    // ── Real Data Path (BigQuery) ──────────────────────────────────────────
    if (isBigQueryConfigured()) {
      try {
        const slippageFraction = slippage / 100;
        const lotSize = LOT_SIZES[underlying] || 50;

        // 1. Fetch coverage metadata
        const coverage = await getDataCoverage(underlying);

        // 2. Clamp date range to available data
        const dataStart = coverage?.earliest_date?.value || coverage?.earliest_date || startDate;
        const dataEnd = coverage?.latest_date?.value || coverage?.latest_date || endDate;
        const effectiveStart = startDate > dataStart ? startDate : dataStart;
        const effectiveEnd = endDate < dataEnd ? endDate : dataEnd;

        // 3. Fetch raw options data from BigQuery
        const rows = await fetchBacktestData({
          underlying,
          startDate: effectiveStart,
          endDate: effectiveEnd,
          expiryType,
        });

        if (!rows || rows.length === 0) {
          return NextResponse.json(
            {
              error: "no_data",
              message: `No NSE data found for ${underlying} between ${effectiveStart} and ${effectiveEnd}. Run the ingestion pipeline first.`,
              dataSource: "no_data",
            },
            { status: 404 }
          );
        }

        // 4. Convert existing strategy legs to strike offsets for BigQuery engine
        const spotApprox = SPOT_APPROX[underlying] || 22500;
        const interval = STRIKE_INTERVALS[underlying] || 50;
        const atmApprox = Math.round(spotApprox / interval) * interval;
        const rawLegs = generateStrategyLegs(strategy, atmApprox);

        const strategyLegs = rawLegs.map((leg) => ({
          // Convert absolute strike → offset in "number of intervals"
          strike_offset: Math.round((leg.strike - atmApprox) / interval),
          type: leg.type,
          action: leg.action,
          lots: leg.lots || 1,
        }));

        // 5. Run backtest computation on real data
        const result = computeBacktest(rows, strategyLegs, {
          underlying,
          slippage: slippageFraction,
          lotSize,
        });

        return NextResponse.json({
          ...result,
          coverage,
          effectiveDateRange: { start: effectiveStart, end: effectiveEnd },
        });
      } catch (bqError) {
        console.error("[API /backtest] BigQuery error:", bqError.message);
        // Fall through to simulation with error note
        return NextResponse.json(
          simulationFallback(strategy, underlying, startDate, endDate, expiryType, slippage, bqError.message),
        );
      }
    }

    // ── Simulation Fallback (no BigQuery configured) ───────────────────────
    return NextResponse.json(
      simulationFallback(strategy, underlying, startDate, endDate, expiryType, slippage)
    );
  } catch (err) {
    console.error("[API /backtest] Unexpected error:", err);
    return NextResponse.json(
      { error: "server_error", message: err.message },
      { status: 500 }
    );
  }
}

/**
 * Builds a simulation-based result using the existing GBM backtester.
 * Used when BigQuery is not configured or unreachable.
 */
function simulationFallback(strategy, underlying, startDate, endDate, expiryType, slippage, bqErrorMsg) {
  const spotPrice = SPOT_APPROX[underlying] || 22500;
  const daysToExpiry = expiryType === "Weekly" ? 7 : 30;

  // Compute number of cycles from date range
  let cycles = 52;
  if (startDate && endDate) {
    const diffDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    cycles = expiryType === "Weekly"
      ? Math.max(1, Math.floor(diffDays / 7))
      : Math.max(1, Math.floor(diffDays / 30));
  }

  const atm = Math.round(spotPrice / (STRIKE_INTERVALS[underlying] || 50)) * (STRIKE_INTERVALS[underlying] || 50);
  const legs = generateStrategyLegs(strategy, atm);

  const result = runBacktest({
    legs,
    entrySpot: spotPrice,
    daysToExpiry,
    cycles,
    annualVol: 0.15,
  });

  return {
    ...result,
    dataSource: "simulation",
    dataNote: bqErrorMsg
      ? `BigQuery unavailable (${bqErrorMsg}). Showing GBM simulation.`
      : "BigQuery not configured. Showing GBM simulation. Add credentials to .env.local to enable real NSE data.",
  };
}

/**
 * GET /api/backtest/coverage — Check data availability
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const underlying = searchParams.get("underlying") || "NIFTY";

  if (!isBigQueryConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "BigQuery not configured. Set BIGQUERY_PROJECT_ID and credentials in .env.local",
    });
  }

  try {
    const coverage = await getDataCoverage(underlying);
    return NextResponse.json({
      configured: true,
      underlying,
      coverage,
      projectId: PROJECT_ID,
    });
  } catch (err) {
    return NextResponse.json({ configured: true, error: err.message }, { status: 500 });
  }
}
