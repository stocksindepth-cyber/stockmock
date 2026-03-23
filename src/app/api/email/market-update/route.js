// ─── /api/email/market-update ──────────────────────────────────────────────────
// POST — Called by a daily cron to send market update emails to all opted-in users.
//        Accepts market data payload + adminSecret.
//        Batches sends (up to 50 per invocation).
//
// GET  — Returns info about the last market update sent.
//        Requires adminSecret query param or x-admin-secret header.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sender';
import { getAdminFirestore } from '@/lib/firebase/admin';
import admin from 'firebase-admin';

export const runtime = 'nodejs';

const BATCH_SIZE = 50;

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      niftySpot,
      niftyChange,
      bankNiftySpot,
      bankNiftyChange,
      ivpNifty,
      straddlePremium,
      aiInsight,
      topTrade,
      adminSecret,
      subject,
    } = body;

    // ── Auth ────────────────────────────────────────────────────────────────
    const secret = process.env.ADMIN_SECRET;
    if (!secret || adminSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getAdminFirestore();
    const today = new Date().toISOString().split('T')[0];
    const emailSubject = subject || `📈 OptionsGyani Market Brief — ${today}`;

    const emailProps = {
      subject: emailSubject,
      niftySpot,
      niftyChange,
      bankNiftySpot,
      bankNiftyChange,
      ivpNifty,
      straddlePremium,
      aiInsight,
      topTrade,
      date: today,
    };

    // ── Query opted-in users ─────────────────────────────────────────────────
    // Users where marketUpdates !== false (include docs without the field too)
    // Firestore doesn't support != queries on missing fields in one shot,
    // so we fetch all users and filter in-memory, capped at BATCH_SIZE.
    const snapshot = await db.collection('users').limit(500).get();

    const eligibleUsers = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.marketUpdates !== false && data.email) {
        eligibleUsers.push({ email: data.email, name: data.displayName || data.email.split('@')[0] });
      }
    });

    const batch = eligibleUsers.slice(0, BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(({ email, name }) =>
        sendEmail('marketUpdate', email, { ...emailProps, name })
      )
    );

    const sent   = results.filter((r) => r.status === 'fulfilled' && r.value?.success).length;
    const failed = results.filter((r) => r.status === 'rejected' || r.value?.success === false).length;

    // ── Record last-sent metadata ─────────────────────────────────────────────
    await db.doc('admin/market_update').set({
      lastSentAt: new Date().toISOString(),
      lastSubject: emailSubject,
      lastSentCount: sent,
      lastFailedCount: failed,
      lastPayload: emailProps,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`[Market Update] Sent=${sent} Failed=${failed} Total eligible=${eligibleUsers.length}`);

    return NextResponse.json({
      success: true,
      sent,
      failed,
      totalEligible: eligibleUsers.length,
      note: eligibleUsers.length > BATCH_SIZE
        ? `Only first ${BATCH_SIZE} users processed this call. Re-invoke for remaining ${eligibleUsers.length - BATCH_SIZE}.`
        : undefined,
    });
  } catch (err) {
    console.error('[POST /api/email/market-update] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = process.env.ADMIN_SECRET;

    // Accept secret as query param OR header
    const adminSecret =
      searchParams.get('adminSecret') ||
      request.headers.get('x-admin-secret');

    if (!secret || adminSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getAdminFirestore();
    const doc = await db.doc('admin/market_update').get();

    if (!doc.exists) {
      return NextResponse.json({ configured: false, message: 'No market update has been sent yet.' });
    }

    const data = doc.data();
    return NextResponse.json({
      configured: true,
      lastSentAt:    data.lastSentAt,
      lastSubject:   data.lastSubject,
      lastSentCount: data.lastSentCount,
      lastFailedCount: data.lastFailedCount,
    });
  } catch (err) {
    console.error('[GET /api/email/market-update] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
