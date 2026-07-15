/**
 * GET /api/cron/market-digest
 *
 * Daily post-market retention email. Runs weekday evenings (after the 7 PM IST
 * Bhavcopy → BigQuery ingestion) and sends every opted-in user a market brief
 * computed from the freshest EOD data: NIFTY/BANKNIFTY close + day change,
 * ATM straddle premium, max pain, and the biggest OI build-up.
 *
 * Idempotent per trading day via admin/market_digest.lastTradeDate — safe to
 * re-invoke (batches of 50 continue until all users are covered).
 *
 * Auth: Authorization: Bearer {CRON_SECRET} (Vercel cron) or x-admin-secret.
 */
export const runtime = "nodejs";
export const maxDuration = 300;

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/sender";
import { runQuery, DATASET, PROJECT_ID, isBigQueryConfigured } from "@/lib/bigquery/client";

const CRON_SECRET = process.env.CRON_SECRET || process.env.EMAIL_CRON_SECRET;
const BATCH_SIZE = 50;
const DELAY_MS = 600; // stay under Resend rate limits

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T = `\`${PROJECT_ID}.${DATASET}.options_eod\``;

function fmtDate(d) {
  return d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10);
}

async function computeDigest() {
  // Latest two trading days
  const dates = await runQuery(
    `SELECT DISTINCT trade_date FROM ${T} ORDER BY trade_date DESC LIMIT 2`
  );
  if (!dates.length) return null;
  const latest = fmtDate(dates[0].trade_date?.value || dates[0].trade_date);
  const prev = dates[1] ? fmtDate(dates[1].trade_date?.value || dates[1].trade_date) : null;

  // Spot + change per underlying from the spot_prices table
  const S = `\`${PROJECT_ID}.${DATASET}.spot_prices\``;
  const spots = await runQuery(
    `SELECT trade_date, underlying, close AS spot
     FROM ${S}
     WHERE trade_date IN (@latest, @prev) AND underlying IN ('NIFTY','BANKNIFTY')`,
    { latest, prev: prev || latest }
  );
  const bySpot = {};
  for (const r of spots) {
    const d = fmtDate(r.trade_date?.value || r.trade_date);
    bySpot[`${r.underlying}|${d}`] = Number(r.spot);
  }
  const spot = (u) => bySpot[`${u}|${latest}`];
  const change = (u) => {
    const a = bySpot[`${u}|${latest}`], b = prev && bySpot[`${u}|${prev}`];
    return a && b ? (((a - b) / b) * 100).toFixed(2) + "%" : "";
  };

  // ATM straddle premium (nearest expiry, strike closest to spot) for NIFTY.
  // Only compute when we actually have a spot — otherwise ABS(strike - 0) picks
  // the lowest strike and we'd email a wrong "ATM" premium.
  const niftySpotForStraddle = spot("NIFTY");
  const straddleRows = niftySpotForStraddle ? await runQuery(
    `WITH nearest AS (
       SELECT MIN(expiry_date) AS exp FROM ${T}
       WHERE trade_date = @latest AND underlying = 'NIFTY' AND expiry_date > @latest
     )
     SELECT strike, SUM(close) AS straddle
     FROM ${T}, nearest
     WHERE trade_date = @latest AND underlying = 'NIFTY' AND expiry_date = nearest.exp
     GROUP BY strike HAVING COUNT(DISTINCT option_type) = 2
     ORDER BY ABS(strike - @spot) LIMIT 1`,
    { latest, spot: niftySpotForStraddle }
  ) : [];
  const straddlePremium = straddleRows[0] ? Math.round(straddleRows[0].straddle) : null;

  // Max pain: strike with lowest total option writer payout (nearest expiry)
  const mp = await runQuery(
    `WITH nearest AS (
       SELECT MIN(expiry_date) AS exp FROM ${T}
       WHERE trade_date = @latest AND underlying = 'NIFTY' AND expiry_date > @latest
     ),
     chain AS (
       SELECT strike, option_type, oi FROM ${T}, nearest
       WHERE trade_date = @latest AND underlying = 'NIFTY' AND expiry_date = nearest.exp
     )
     SELECT s.strike AS strike,
       SUM(CASE WHEN c.option_type='CE' AND s.strike > c.strike THEN (s.strike-c.strike)*c.oi ELSE 0 END) +
       SUM(CASE WHEN c.option_type='PE' AND s.strike < c.strike THEN (c.strike-s.strike)*c.oi ELSE 0 END) AS pain
     FROM (SELECT DISTINCT strike FROM chain) s CROSS JOIN chain c
     GROUP BY s.strike ORDER BY pain ASC LIMIT 1`,
    { latest }
  );
  const maxPain = mp[0] ? Number(mp[0].strike) : null;

  // Biggest OI build-up today (NIFTY nearest expiry)
  const oiRows = await runQuery(
    `WITH nearest AS (
       SELECT MIN(expiry_date) AS exp FROM ${T}
       WHERE trade_date = @latest AND underlying = 'NIFTY' AND expiry_date > @latest
     )
     SELECT strike, option_type, oi_change FROM ${T}, nearest
     WHERE trade_date = @latest AND underlying = 'NIFTY' AND expiry_date = nearest.exp
     ORDER BY oi_change DESC LIMIT 1`,
    { latest }
  );
  const topOi = oiRows[0] || null;

  // IV Percentile: where today's NIFTY ATM IV sits vs the trailing ~1 year.
  // ATM IV per day = avg IV of strikes within 100 pts of that day's spot, nearest
  // expiry. Only report when we have enough history to be meaningful.
  let ivpNifty;
  try {
    const ivpRows = await runQuery(
      `WITH spots AS (
         SELECT trade_date, close AS spot FROM ${S}
         WHERE underlying='NIFTY' AND trade_date >= DATE_SUB(@latest, INTERVAL 400 DAY)
       ),
       nearest AS (
         SELECT trade_date, MIN(expiry_date) AS exp FROM ${T}
         WHERE underlying='NIFTY' AND expiry_date > trade_date AND trade_date >= DATE_SUB(@latest, INTERVAL 400 DAY)
         GROUP BY trade_date
       ),
       atm AS (
         SELECT o.trade_date, AVG(o.iv) AS atm_iv
         FROM ${T} o
         JOIN nearest n ON o.trade_date = n.trade_date AND o.expiry_date = n.exp
         JOIN spots s ON o.trade_date = s.trade_date
         WHERE o.underlying='NIFTY' AND o.iv > 0 AND ABS(o.strike - s.spot) <= 100
         GROUP BY o.trade_date
       ),
       latest_iv AS (SELECT atm_iv FROM atm ORDER BY trade_date DESC LIMIT 1)
       SELECT ROUND(100 * COUNTIF(atm_iv <= (SELECT atm_iv FROM latest_iv)) / COUNT(*)) AS ivp,
              COUNT(*) AS days
       FROM atm WHERE trade_date >= DATE_SUB((SELECT MAX(trade_date) FROM atm), INTERVAL 365 DAY)`,
      { latest }
    );
    if (ivpRows[0] && Number(ivpRows[0].days) >= 60 && ivpRows[0].ivp != null) {
      ivpNifty = Number(ivpRows[0].ivp);
    }
  } catch { /* IVP is best-effort — never block the digest */ }

  const niftySpot = spot("NIFTY");
  const insightParts = [];
  if (maxPain) insightParts.push(`Max pain for the nearest NIFTY expiry sits at ${maxPain.toLocaleString("en-IN")}${niftySpot ? ` (spot ${Math.round(niftySpot).toLocaleString("en-IN")})` : ""}.`);
  if (topOi) insightParts.push(`Heaviest fresh OI build-up: ${Number(topOi.strike).toLocaleString("en-IN")} ${topOi.option_type} (+${Number(topOi.oi_change).toLocaleString("en-IN")} contracts) — writers are defending that level.`);
  if (straddlePremium) insightParts.push(`ATM straddle is pricing a ±${straddlePremium.toLocaleString("en-IN")}-point move into expiry.`);

  return {
    tradeDate: latest,
    niftySpot: niftySpot ? Math.round(niftySpot).toLocaleString("en-IN") : "—",
    niftyChange: change("NIFTY"),
    bankNiftySpot: bySpot[`BANKNIFTY|${latest}`] ? Math.round(bySpot[`BANKNIFTY|${latest}`]).toLocaleString("en-IN") : "—",
    bankNiftyChange: change("BANKNIFTY"),
    // Plain number — the email template prepends the ₹ symbol itself.
    straddlePremium: straddlePremium ? straddlePremium.toLocaleString("en-IN") : undefined,
    ivpNifty,
    aiInsight: insightParts.join(" "),
    topTrade: maxPain
      ? `Backtest an iron condor around max pain ${maxPain.toLocaleString("en-IN")} — see how it performed over the last 2 years in one click.`
      : "Run today's backtest on your favourite strategy — the EOD data is live now.",
  };
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization") || "";
  const adminHeader = request.headers.get("x-admin-secret") || "";
  const authorized =
    (CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`) ||
    (process.env.ADMIN_SECRET && adminHeader === process.env.ADMIN_SECRET);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isBigQueryConfigured()) {
    return NextResponse.json({ error: "BigQuery not configured" }, { status: 500 });
  }

  const db = getAdminFirestore();
  const dryRun = new URL(request.url).searchParams.get("dry") === "1";

  try {
    const digest = await computeDigest();
    if (!digest) {
      return NextResponse.json({ success: false, reason: "no EOD data in BigQuery" });
    }
    if (dryRun) {
      return NextResponse.json({ success: true, dryRun: true, digest });
    }

    // Per-trading-day idempotency + resumable batching
    const stateRef = db.doc("admin/market_digest");
    const stateSnap = await stateRef.get();
    const state = stateSnap.exists ? stateSnap.data() : {};
    const alreadySent = state.lastTradeDate === digest.tradeDate ? state.sentEmails || [] : [];
    const sentSet = new Set(alreadySent);

    const snapshot = await db.collection("users").limit(1000).get();
    const eligible = [];
    snapshot.docs.forEach((doc) => {
      const u = doc.data();
      if (u.email && u.marketUpdates !== false && !sentSet.has(u.email)) {
        eligible.push({ email: u.email, name: u.displayName || u.email.split("@")[0] });
      }
    });

    const batch = eligible.slice(0, BATCH_SIZE);

    let sent = 0, failed = 0;
    for (const { email, name } of batch) {
      const result = await sendEmail("marketUpdate", email, {
        ...digest,
        subject: `📈 OptionsGyani evening brief — ${digest.tradeDate}`,
        name,
        date: digest.tradeDate,
      }).catch((e) => ({ success: false, error: e.message }));
      if (result?.success) { sent++; sentSet.add(email); } else { failed++; }
      await sleep(DELAY_MS);
    }

    await stateRef.set({
      lastTradeDate: digest.tradeDate,
      lastSentAt: new Date().toISOString(),
      sentEmails: [...sentSet],
      lastRun: { sent, failed, remaining: eligible.length - batch.length },
      lastDigest: digest,
    }, { merge: true });

    console.log(`[market-digest] ${digest.tradeDate} sent=${sent} failed=${failed} remaining=${eligible.length - batch.length}`);
    return NextResponse.json({
      success: true,
      tradeDate: digest.tradeDate,
      sent,
      failed,
      remaining: eligible.length - batch.length,
      digest,
    });
  } catch (err) {
    console.error("[market-digest] Fatal:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
