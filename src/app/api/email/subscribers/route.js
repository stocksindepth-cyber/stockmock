// ─── GET /api/email/subscribers ───────────────────────────────────────────────
// Returns subscriber stats from Firestore.
//
// Requires x-admin-secret header === process.env.ADMIN_SECRET
//
// Response:
//   {
//     totalUsers,
//     byPlan: { free, pro, elite },
//     recentSignups: { last7Days },
//     emailLogsSummary: { last30Days: { [type]: count } }
//   }
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const secret = process.env.ADMIN_SECRET;
    const authHeader = request.headers.get('x-admin-secret');
    if (!secret || authHeader !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getAdminFirestore();

    // ── Total users & by plan ─────────────────────────────────────────────────
    const usersSnap = await db.collection('users').get();
    const totalUsers = usersSnap.size;

    const byPlan = { free: 0, pro: 0, elite: 0 };
    usersSnap.docs.forEach((doc) => {
      const plan = doc.data().plan || 'free';
      if (plan in byPlan) {
        byPlan[plan]++;
      } else {
        byPlan.free++;
      }
    });

    // ── Recent signups (last 7 days) ──────────────────────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString();

    // createdAt may be stored as ISO string or Firestore Timestamp
    let last7Days = 0;
    usersSnap.docs.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt;
      if (!createdAt) return;

      let createdDate;
      if (typeof createdAt === 'string') {
        createdDate = createdAt;
      } else if (createdAt.toDate) {
        createdDate = createdAt.toDate().toISOString();
      } else {
        return;
      }

      if (createdDate >= sevenDaysAgoIso) {
        last7Days++;
      }
    });

    // ── Email logs summary (last 30 days by type) ─────────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

    const logsSnap = await db
      .collection('email_logs')
      .where('sentAt', '>=', thirtyDaysAgoIso)
      .get();

    const last30Days = {};
    logsSnap.docs.forEach((doc) => {
      const { type, status } = doc.data();
      if (!type) return;
      if (!last30Days[type]) last30Days[type] = { sent: 0, failed: 0 };
      if (status === 'sent') {
        last30Days[type].sent++;
      } else {
        last30Days[type].failed++;
      }
    });

    return NextResponse.json({
      totalUsers,
      byPlan,
      recentSignups: { last7Days },
      emailLogsSummary: { last30Days },
    });
  } catch (err) {
    console.error('[GET /api/email/subscribers] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
