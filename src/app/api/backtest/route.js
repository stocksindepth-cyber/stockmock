/**
 * POST /api/backtest  — Server-Sent Events streaming backtest
 *
 * Streams real-time progress events as BigQuery runs each stage,
 * then streams trade results in batches of 20 for progressive rendering.
 *
 * SSE event shapes:
 *   { type: "status",   message, progress }
 *   { type: "trades",   trades: [...], cycle, total, progress, message }
 *   { type: "complete", summary, coverage, effectiveDateRange, dataSource, totalRows, uniqueExpiries }
 *   { type: "error",    code, message }
 *
 * GET /api/backtest?underlying=NIFTY  — coverage check
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isBigQueryConfigured } from "@/lib/bigquery/client";
import {
  fetchBacktestData,
  computeBacktest,
  getDataCoverage,
  LOT_SIZES,
  STRIKE_INTERVALS,
} from "@/lib/bigquery/backtestQueries";
import { generateStrategyLegs } from "@/lib/options/strategies";

const SPOT_APPROX = {
  NIFTY: 22500,
  BANKNIFTY: 48000,
  FINNIFTY: 21000,
  MIDCPNIFTY: 12000,
  SENSEX: 74000,
};

const enc = new TextEncoder();
const sse = (data) => enc.encode(`data: ${JSON.stringify(data)}\n\n`);

export async function POST(request) {
  const body = await request.json();
  const {
    strategy   = "iron-condor",
    underlying = "NIFTY",
    startDate,
    endDate,
    expiryType = "Weekly",
    slippage   = 0.5,
  } = body;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (d) => {
        try { controller.enqueue(sse(d)); } catch {}
      };

      try {
        // ── Guard: BigQuery must be configured ──────────────────────
        if (!isBigQueryConfigured()) {
          send({
            type: "error",
            code: "not_configured",
            message:
              "BigQuery is not configured. Add BIGQUERY_PROJECT_ID and BIGQUERY_CREDENTIALS_JSON to your environment to run real backtests.",
          });
          controller.close();
          return;
        }

        // ── Stage 1: Coverage ────────────────────────────────────────
        send({ type: "status", message: `Connecting to BigQuery · Checking ${underlying} data coverage…`, progress: 8 });

        const coverage = await getDataCoverage(underlying);

        if (!coverage || !coverage.earliest_date) {
          send({
            type: "error",
            code: "no_coverage",
            message: `No NSE data found in BigQuery for ${underlying}. Run the data ingestion pipeline first.`,
          });
          controller.close();
          return;
        }

        const dataStart = coverage.earliest_date?.value || coverage.earliest_date;
        const dataEnd   = coverage.latest_date?.value   || coverage.latest_date;
        const effStart  = !startDate || startDate < dataStart ? dataStart : startDate;
        const effEnd    = !endDate   || endDate   > dataEnd   ? dataEnd   : endDate;

        // Guard: requested range entirely outside available data
        if (effStart > effEnd) {
          send({
            type:    "error",
            code:    "out_of_range",
            message: `Requested range (${startDate} → ${endDate}) is outside available data. Our ${underlying} data covers ${dataStart} → ${dataEnd}. Please select an earlier date range.`,
          });
          controller.close();
          return;
        }

        send({
          type:    "status",
          message: `Coverage confirmed · ${Number(coverage.trading_days).toLocaleString("en-IN")} trading days available (${dataStart} → ${dataEnd})`,
          progress: 18,
        });

        // ── Stage 2: Build strategy leg offsets ─────────────────────
        const interval   = STRIKE_INTERVALS[underlying] || 50;
        const spotApprox = SPOT_APPROX[underlying] || 22500;
        const atmApprox  = Math.round(spotApprox / interval) * interval;
        const rawLegs    = generateStrategyLegs(strategy, atmApprox);
        const stratLegs  = rawLegs.map((leg) => ({
          strike_offset: Math.round((leg.strike - atmApprox) / interval),
          type:   leg.type,
          action: leg.action,
          lots:   leg.lots || 1,
        }));

        // ── Stage 3: Fetch options rows from BigQuery ────────────────
        send({
          type:    "status",
          message: `Querying ${expiryType.toLowerCase()} options chain for ${underlying} · ${effStart} → ${effEnd}…`,
          progress: 25,
        });

        const rows = await fetchBacktestData({
          underlying,
          startDate: effStart,
          endDate:   effEnd,
          expiryType,
        });

        if (!rows || rows.length === 0) {
          send({
            type:    "error",
            code:    "no_data",
            message: `No options data found for ${underlying} between ${effStart} and ${effEnd}. Try widening the date range or checking the ingestion pipeline.`,
          });
          controller.close();
          return;
        }

        const uniqueExpiries = new Set(
          rows.map((r) => r.expiry_date?.value || r.expiry_date)
        ).size;

        send({
          type:    "status",
          message: `Loaded ${rows.length.toLocaleString("en-IN")} option records across ${uniqueExpiries} ${expiryType.toLowerCase()} expiries`,
          progress: 58,
        });

        // ── Stage 4: Compute P&L cycle by cycle ─────────────────────
        send({
          type:    "status",
          message: `Computing P&L across ${uniqueExpiries} expiry cycles…`,
          progress: 62,
        });

        const lotSize          = LOT_SIZES[underlying] || 50;
        const slippageFraction = slippage / 100;

        let batchBuffer = [];
        const BATCH = 20;

        const result = computeBacktest(
          rows,
          stratLegs,
          { underlying, slippage: slippageFraction, lotSize },
          (partial) => {
            batchBuffer.push(partial.latestTrade);
            const pct = 62 + Math.round((partial.cycle / partial.total) * 33);

            if (batchBuffer.length >= BATCH || partial.cycle === partial.total) {
              send({
                type:    "trades",
                trades:  batchBuffer,
                cycle:   partial.cycle,
                total:   partial.total,
                progress: pct,
                message: `Cycle ${partial.cycle} / ${partial.total} · cumulative P&L ₹${partial.cumulativePnL.toLocaleString("en-IN")}`,
              });
              batchBuffer = [];
            }
          }
        );

        // ── Stage 5: Done ────────────────────────────────────────────
        send({
          type:        "complete",
          summary:     result.summary,
          dataSource:  "real",
          dataNote:    result.dataNote,
          coverage,
          effectiveDateRange: { start: effStart, end: effEnd },
          totalRows:          rows.length,
          uniqueExpiries,
        });

      } catch (err) {
        console.error("[POST /api/backtest]", err);
        send({
          type:    "error",
          code:    "server_error",
          message: err.message || "Unexpected error during backtest",
        });
      } finally {
        try { controller.close(); } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const underlying = searchParams.get("underlying") || "NIFTY";

  if (!isBigQueryConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "BigQuery not configured. Set BIGQUERY_PROJECT_ID and BIGQUERY_CREDENTIALS_JSON.",
    });
  }

  try {
    const coverage = await getDataCoverage(underlying);
    return NextResponse.json({ configured: true, underlying, coverage });
  } catch (err) {
    return NextResponse.json({ configured: true, error: err.message }, { status: 500 });
  }
}
