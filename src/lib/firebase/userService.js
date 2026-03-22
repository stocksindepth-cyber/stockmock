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
    const limit = data.simulationsLimit || 5;

    // Reset counter if it's a new day
    if (data.lastSimulationDate !== today) {
      currentRunCount = 0;
    }

    if (currentRunCount >= limit && data.plan === "free") {
      return { 
        allowed: false, 
        message: `You have reached your daily limit of ${limit} simulations. Please upgrade to Pro for unlimited backtesting.` 
      };
    }

    // Increment usage
    await updateDoc(userRef, {
      simulationsRunToday: currentRunCount + 1,
      lastSimulationDate: today
    });

    // Deep logging for CRM / Analytics
    await logUserActivity(userId, "SIMULATION_RUN", { 
      dailyRunCount: currentRunCount + 1,
      planAtExecution: data.plan 
    });

    return { allowed: true };
  } catch (error) {
    if (error.code !== 'permission-denied') {
      console.warn("Firestore limit check failed:", error);
    }
    // Graceful degradation: if Firestore is unreachable/unconfigured, allow the simulation to proceed.
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
