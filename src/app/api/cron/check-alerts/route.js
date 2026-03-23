/**
 * POST /api/cron/check-alerts
 *
 * Cron job that scans all active IV alerts across all users, checks current
 * IV stats for each relevant symbol, and fires email notifications when a
 * user-defined threshold condition is met.
 *
 * Auth: Authorization: Bearer {CRON_SECRET}   (Vercel cron)
 *   or: x-admin-secret: {ADMIN_SECRET}        (manual testing)
 *
 * Returns: { checked: N, triggered: N, errors: string[] }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/sender";

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Returns true if the alert's cooldown has expired (or it was never triggered). */
function isCooldownExpired(lastTriggeredAt, cooldownHours = 24) {
  if (!lastTriggeredAt) return true;
  const last    = new Date(lastTriggeredAt).getTime();
  const nowMs   = Date.now();
  const elapsed = (nowMs - last) / (1000 * 60 * 60); // hours
  return elapsed >= cooldownHours;
}

/** Evaluate whether the alert condition is met given the current IV stats. */
function isConditionMet(alert, ivStats) {
  const { metric, condition, threshold } = alert;

  let currentValue;
  if (metric === "ivp") {
    currentValue = ivStats.ivp;
  } else if (metric === "ivr") {
    currentValue = ivStats.ivr;
  } else if (metric === "iv") {
    currentValue = ivStats.currentIV;
  } else {
    return { met: false, currentValue: null };
  }

  if (currentValue === undefined || currentValue === null) {
    return { met: false, currentValue: null };
  }

  const met =
    condition === "above"
      ? currentValue > threshold
      : currentValue < threshold;

  return { met, currentValue };
}

/** Fetch IV stats for a given symbol from the internal API. */
async function fetchIVStats(symbol) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://optionsgyani.com";
  const url     = `${baseUrl}/api/chain/iv-stats?underlying=${encodeURIComponent(symbol)}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`iv-stats fetch failed for ${symbol}: HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`iv-stats error for ${symbol}: ${data.error}`);
  }

  return data; // { underlying, currentIV, ivp, ivr, iv52wHigh, iv52wLow, dataPoints }
}

// ── POST handler ───────────────────────────────────────────────────────────────

export async function POST(request) {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const authHeader  = request.headers.get("authorization") || "";
  const adminHeader = request.headers.get("x-admin-secret") || "";

  const cronSecret  = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;

  const validCron  = cronSecret  && authHeader === `Bearer ${cronSecret}`;
  const validAdmin = adminSecret && adminHeader === adminSecret;

  if (!validCron && !validAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db     = getAdminFirestore();
  const errors = [];
  let   checked   = 0;
  let   triggered = 0;

  try {
    // ── 1. Fetch all active alerts via collection group query ───────────────
    const alertsSnap = await db
      .collectionGroup("alerts")
      .where("active", "==", true)
      .get();

    if (alertsSnap.empty) {
      console.log("[check-alerts] No active alerts found.");
      return NextResponse.json({ checked: 0, triggered: 0, errors: [] });
    }

    // ── 2. Gather unique symbols so we only call iv-stats once per symbol ───
    const uniqueSymbols = [
      ...new Set(alertsSnap.docs.map((doc) => doc.data().symbol).filter(Boolean)),
    ];

    console.log(`[check-alerts] ${alertsSnap.size} active alert(s) across symbols: ${uniqueSymbols.join(", ")}`);

    // ── 3. Fetch IV stats for every symbol in parallel ─────────────────────
    const ivStatsBySymbol = {};

    await Promise.all(
      uniqueSymbols.map(async (symbol) => {
        try {
          ivStatsBySymbol[symbol] = await fetchIVStats(symbol);
          console.log(
            `[check-alerts] IV stats for ${symbol}: IVP=${ivStatsBySymbol[symbol].ivp}, IVR=${ivStatsBySymbol[symbol].ivr}, IV=${ivStatsBySymbol[symbol].currentIV}`
          );
        } catch (err) {
          const msg = `Failed to fetch IV stats for ${symbol}: ${err.message}`;
          console.error(`[check-alerts] ${msg}`);
          errors.push(msg);
          ivStatsBySymbol[symbol] = null; // mark as unavailable
        }
      })
    );

    // ── 4. Evaluate each alert ─────────────────────────────────────────────
    await Promise.all(
      alertsSnap.docs.map(async (doc) => {
        checked++;

        const alert  = { id: doc.id, ...doc.data() };
        const { symbol, notifyEmail, lastTriggeredAt, cooldownHours } = alert;

        // Skip if IV stats unavailable for this symbol
        const ivStats = ivStatsBySymbol[symbol];
        if (!ivStats) {
          errors.push(`Alert ${alert.id}: IV stats unavailable for ${symbol}`);
          return;
        }

        try {
          // Evaluate condition
          const { met, currentValue } = isConditionMet(alert, ivStats);

          if (!met) {
            return; // condition not satisfied
          }

          // Check cooldown
          if (!isCooldownExpired(lastTriggeredAt, cooldownHours ?? 24)) {
            console.log(
              `[check-alerts] Alert ${alert.id} triggered but still in cooldown (last: ${lastTriggeredAt})`
            );
            return;
          }

          // ── 5. Condition met + cooldown expired — send email ──────────────
          console.log(
            `[check-alerts] Triggering alert ${alert.id} for ${symbol} ${alert.metric} ${alert.condition} ${alert.threshold} (current: ${currentValue})`
          );

          // Derive a display name from the email if we don't have a stored userName
          const userName = alert.userName || (notifyEmail ? notifyEmail.split("@")[0] : "Trader");

          const emailResult = await sendEmail("alert", notifyEmail, {
            userName,
            symbol,
            metric:       alert.metric,
            condition:    alert.condition,
            threshold:    alert.threshold,
            currentValue,
            alertId:      alert.id,
          });

          if (!emailResult.success) {
            const msg = `Alert ${alert.id}: email send failed — ${emailResult.error}`;
            console.error(`[check-alerts] ${msg}`);
            errors.push(msg);
            // Don't update lastTriggeredAt so it retries next run
            return;
          }

          // ── 6. Update lastTriggeredAt in Firestore ────────────────────────
          const now = new Date().toISOString();
          await doc.ref.update({ lastTriggeredAt: now });

          triggered++;

          console.log(
            `[check-alerts] Alert ${alert.id} triggered successfully. Email sent to ${notifyEmail}.`
          );
        } catch (alertErr) {
          const msg = `Alert ${alert.id}: unexpected error — ${alertErr.message}`;
          console.error(`[check-alerts] ${msg}`);
          errors.push(msg);
        }
      })
    );
  } catch (err) {
    console.error("[check-alerts] Fatal error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal server error", checked, triggered, errors },
      { status: 500 }
    );
  }

  console.log(
    `[check-alerts] Done. checked=${checked}, triggered=${triggered}, errors=${errors.length}`
  );

  return NextResponse.json({ checked, triggered, errors });
}
