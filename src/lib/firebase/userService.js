import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/**
 * Universal Telemetry Logger
 * Automatically generates collections for user actions in Firestore.
 */
export async function logUserActivity(userId, actionType, metadata = {}) {
  if (!userId) return;
  try {
    const activityRef = collection(db, "users", userId, "activity_logs");
    await addDoc(activityRef, {
      action: actionType,
      timestamp: serverTimestamp(),
      ...metadata
    });
  } catch (error) {
    console.warn("Telemetry logging failed silently:", error);
  }
}

/**
 * Checks if the user has reached their daily limit and increments if not.
 * @returns {Promise<{allowed: boolean, message?: string}>}
 */
export async function checkAndIncrementSimulationLimit(userId) {
  if (!userId) return { allowed: false, message: "Please log in to run simulations." };

  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return { allowed: false, message: "User profile not found." };
    }

    const data = snap.data();
    const today = new Date().toISOString().split("T")[0];

    let currentRunCount = data.simulationsRunToday || 0;
    // Free daily cap — the incentive that drives the Dhan referral unlock.
    // Users unlock unlimited (plan !== "free") for FREE by opening a Dhan account
    // through our link (see /unlock), or via a paid plan. Cap stays for the rest.
    const FREE_LIMIT = 2;
    const limit = data.plan === "free" ? FREE_LIMIT : (data.simulationsLimit || FREE_LIMIT);

    if (data.lastSimulationDate !== today) currentRunCount = 0;

    if (currentRunCount >= limit && data.plan === "free") {
      const credits = data.backtestCredits || 0;
      if (credits > 0) {
        await updateDoc(userRef, {
          backtestCredits: credits - 1,
          simulationsRunToday: currentRunCount + 1,
          lastSimulationDate: today,
        });
        await logUserActivity(userId, "SIMULATION_RUN", { dailyRunCount: currentRunCount + 1, planAtExecution: data.plan, usedCredit: true });
        return { allowed: true, count: currentRunCount + 1, limit, creditsLeft: credits - 1 };
      }
      return { allowed: false, count: currentRunCount, limit, message: `You've used your ${limit} free backtests for today.` };
    }

    await logUserActivity(userId, "SIMULATION_RUN", {
      dailyRunCount: currentRunCount + 1,
      planAtExecution: data.plan || "free",
    });

    await updateDoc(userRef, {
      simulationsRunToday: currentRunCount + 1,
      lastSimulationDate: today,
    });

    return { allowed: true, count: currentRunCount + 1, limit };
  } catch (error) {
    // permission-denied here is a SECURITY-RULE BUG, not a transient outage — and
    // because we fail open below, it silently disables the daily limit AND skips
    // activity logging. It was swallowed here for months. Make it loud.
    if (error.code === 'permission-denied') {
      console.error(
        "[limit] Firestore DENIED the usage write — the daily backtest limit is NOT being enforced " +
        "and SIMULATION_RUN telemetry is being dropped. Check firestore.rules (users update).",
        error
      );
    } else {
      console.warn("Firestore limit check failed:", error);
    }
    // Fail open on purpose: a Firestore outage must not block the core product.
    return { allowed: true };
  }
}

/**
 * Validates a mock-purchase and upgrades the user's Firestore plan.
 */
export async function upgradeUserPlan(userId, planId, durationDays) {
  if (!userId) throw new Error("User ID is required");
  
  const userRef = doc(db, "users", userId);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  
  try {
    await updateDoc(userRef, {
      plan: planId,
      simulationsLimit: 99999, // Uncapped/Infinite logic
      subscriptionExpiry: expiryDate.toISOString(),
    });

    // Deep logging: Create a Transaction Document globally
    const transactionsRef = collection(db, "transactions");
    await addDoc(transactionsRef, {
      userId,
      purchasedPlan: planId,
      durationDays,
      status: "PAID_SUCCESS",
      timestamp: serverTimestamp()
    });

    // Log Activity mapped to user
    await logUserActivity(userId, "PLAN_UPGRADED", { newPlan: planId, durationDays });
    return { success: true };
  } catch (error) {
    console.error("Failed to upgrade subscription plan:", error);
    throw error;
  }
}
