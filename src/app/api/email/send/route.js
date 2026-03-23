// ─── POST /api/email/send ──────────────────────────────────────────────────────
// Admin endpoint to send transactional emails or broadcast to user segments.
//
// Single send:
//   { type, to, props, adminSecret }
//
// Broadcast send (up to 50 per call):
//   { type: 'broadcast', segment: 'all'|'free'|'pro', props, adminSecret }
//
// Requires adminSecret === process.env.ADMIN_SECRET
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sender';
import { getAdminFirestore } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const BATCH_SIZE = 50;

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, to, props = {}, adminSecret, segment } = body;

    // ── Auth ──────────────────────────────────────────────────────────────────
    const secret = process.env.ADMIN_SECRET;
    if (!secret || adminSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Broadcast mode ────────────────────────────────────────────────────────
    if (type === 'broadcast') {
      if (!segment) {
        return NextResponse.json({ error: 'segment is required for broadcast' }, { status: 400 });
      }

      const db = getAdminFirestore();
      let query = db.collection('users').limit(BATCH_SIZE);

      if (segment !== 'all') {
        query = query.where('plan', '==', segment);
      }

      const snapshot = await query.get();
      if (snapshot.empty) {
        return NextResponse.json({ success: true, sent: 0, message: 'No matching users' });
      }

      const results = await Promise.allSettled(
        snapshot.docs.map((doc) => {
          const userData = doc.data();
          if (!userData.email) return Promise.resolve({ skipped: true });
          return sendEmail(props.emailType || 'marketUpdate', userData.email, {
            name: userData.displayName || userData.email.split('@')[0],
            ...props,
          });
        })
      );

      const sent     = results.filter((r) => r.status === 'fulfilled' && r.value?.success).length;
      const failed   = results.filter((r) => r.status === 'rejected' || r.value?.success === false).length;
      const skipped  = results.filter((r) => r.status === 'fulfilled' && r.value?.skipped).length;

      console.log(`[Email Broadcast] segment=${segment} sent=${sent} failed=${failed} skipped=${skipped}`);
      return NextResponse.json({ success: true, sent, failed, skipped });
    }

    // ── Single send ───────────────────────────────────────────────────────────
    if (!type || !to) {
      return NextResponse.json({ error: 'type and to are required' }, { status: 400 });
    }

    const result = await sendEmail(type, to, props);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    console.error('[POST /api/email/send] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
