/**
 * POST /api/email/welcome
 * Called from AuthContext when a brand-new user account is created.
 * Sends the welcome email via Resend.
 *
 * Body: { userId, email, name }
 * No auth secret required — Firebase UID is enough trust here
 * (worst case a duplicate welcome email; no sensitive action taken).
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sender";

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    const displayName = name || email.split("@")[0];

    const result = await sendEmail("welcome", email, {
      name: displayName,
      email,
    });

    return NextResponse.json({ success: result.success, id: result.id });
  } catch (err) {
    console.error("[/api/email/welcome]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
