// ─── Referral client actions (browser only) ──────────────────────────────────
// Uses the client Firestore SDK + authenticated fetch to the referral APIs.
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { codeFromUid } from "@/lib/referral";

// Ensure the user has a referral code + a resolvable mapping doc. Safe to call
// repeatedly; only writes when something is missing.
export async function ensureReferralCode(user) {
  if (!user?.uid) return null;
  const code = codeFromUid(user.uid);
  try {
    const mapRef = doc(db, "referralCodes", code);
    const mapSnap = await getDoc(mapRef);
    if (!mapSnap.exists()) {
      await setDoc(mapRef, { uid: user.uid, createdAt: new Date().toISOString() });
    }
    // Mirror the code onto the user doc for convenience (non-critical).
    await setDoc(doc(db, "users", user.uid), { referralCode: code }, { merge: true });
  } catch {
    /* non-fatal — the code is deterministic and can be regenerated */
  }
  return code;
}

// Bind a freshly-created user to their referrer (reads the og_ref cookie server-side).
export async function attachReferral(user) {
  if (!user?.getIdToken) return;
  try {
    const token = await user.getIdToken();
    await fetch("/api/referral/attach", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: "{}",
    });
  } catch {
    /* silent — referral is a bonus, never blocks signup */
  }
}

// Grant the one-time reward once a referred user has actually run a backtest.
// No-op unless the profile is referred and not yet rewarded.
export async function maybeRewardReferral(user, profile) {
  if (!user?.getIdToken || !profile?.referredBy || profile?.referralRewarded) return;
  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/referral/reward", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: "{}",
    });
    return await res.json().catch(() => null);
  } catch {
    return null;
  }
}
