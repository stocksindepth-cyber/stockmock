// GET /api/fii-dii — latest FII/DII cash activity + recent history from BigQuery.
// Cached for 30 min (data updates once a day, post-market).
export const runtime = "nodejs";
export const revalidate = 1800;

import { NextResponse } from "next/server";
import { runQuery, DATASET, PROJECT_ID, isBigQueryConfigured } from "@/lib/bigquery/client";

const T = `\`${PROJECT_ID}.${DATASET}.fii_dii_activity\``;
const d = (v) => (v?.value ? v.value : v);

export async function GET() {
  if (!isBigQueryConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  try {
    // Wide-format history: one row per trade_date with FII + DII net/buy/sell.
    const rows = await runQuery(`
      SELECT
        trade_date,
        MAX(IF(category = 'FII/FPI', net_value,  NULL)) AS fii_net,
        MAX(IF(category = 'FII/FPI', buy_value,  NULL)) AS fii_buy,
        MAX(IF(category = 'FII/FPI', sell_value, NULL)) AS fii_sell,
        MAX(IF(category = 'DII',     net_value,  NULL)) AS dii_net,
        MAX(IF(category = 'DII',     buy_value,  NULL)) AS dii_buy,
        MAX(IF(category = 'DII',     sell_value, NULL)) AS dii_sell
      FROM ${T}
      GROUP BY trade_date
      ORDER BY trade_date DESC
      LIMIT 90
    `);

    const history = rows.map((r) => ({
      date: d(r.trade_date),
      fiiNet: r.fii_net, fiiBuy: r.fii_buy, fiiSell: r.fii_sell,
      diiNet: r.dii_net, diiBuy: r.dii_buy, diiSell: r.dii_sell,
    }));

    return NextResponse.json({
      latest: history[0] || null,
      history,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[api/fii-dii]", err.message);
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }
}
