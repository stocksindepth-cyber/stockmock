/**
 * GET /api/chain/pcr-history
 * Returns daily PCR (Put-Call Ratio by OI) for the last N days.
 *
 * Query params:
 *   underlying — "NIFTY" | "BANKNIFTY" | "FINNIFTY"
 *   days       — number of trading days (default: 30)
 */
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { isBigQueryConfigured, runQuery, DATASET, PROJECT_ID } from "@/lib/bigquery/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const underlying = searchParams.get("underlying") || "NIFTY";
  const days       = parseInt(searchParams.get("days") || "30", 10);

  if (!isBigQueryConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const sql = `
      WITH daily_oi AS (
        SELECT
          trade_date,
          SUM(CASE WHEN option_type = 'PE' THEN oi ELSE 0 END) AS put_oi,
          SUM(CASE WHEN option_type = 'CE' THEN oi ELSE 0 END) AS call_oi
        FROM \`${PROJECT_ID}.${DATASET}.options_eod\`
        WHERE underlying = @underlying
          AND trade_date >= DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY)
          AND oi > 0
        GROUP BY trade_date
      )
      SELECT
        trade_date,
        put_oi,
        call_oi,
        ROUND(SAFE_DIVIDE(put_oi, NULLIF(call_oi, 0)), 3) AS pcr
      FROM daily_oi
      WHERE call_oi > 0
      ORDER BY trade_date ASC
    `;

    const rows = await runQuery(sql, { underlying, days });

    const data = rows.map(r => ({
      date:   r.trade_date?.value || r.trade_date,
      pcr:    parseFloat(r.pcr || 0),
      putOI:  parseInt(r.put_oi || 0),
      callOI: parseInt(r.call_oi || 0),
    }));

    return NextResponse.json({ underlying, data });
  } catch (err) {
    console.error("[/api/chain/pcr-history]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
