// GET /r/[code] — referral landing. Sets the referral cookie (30 days) and
// redirects to signup. The code is validated lazily at attach time, so we don't
// need a DB read here — keep it fast and edge-friendly.
import { NextResponse } from "next/server";
import { REFERRAL_COOKIE } from "@/lib/referral";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { code: rawCode } = await params;
  const code = (rawCode || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  const url = new URL(request.url);
  const dest = new URL("/signup", url.origin);
  if (code) dest.searchParams.set("ref", code);

  const res = NextResponse.redirect(dest);
  if (code) {
    res.cookies.set(REFERRAL_COOKIE, code, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}
