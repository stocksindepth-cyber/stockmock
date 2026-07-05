// ─── Single source of truth for OptionsGyani pricing ─────────────────────────
// Server routes derive charge amounts from this registry; the client never
// controls the price. Amounts in INR (rupees, not paise).

export const PRODUCT_BRAND = "optionsgyani";

export const PLAN_PRICES = {
  pro:   { monthly: 499,  annual: 3999 },   // annual = total billed upfront
  elite: { monthly: 1499, annual: 9999 },
  credits50: { onetime: 299, credits: 50 }, // one-time backtest credit pack
};

// billing: "monthly" | "annual" | "onetime"
export function getPlanAmount(planId, billing) {
  const plan = PLAN_PRICES[planId];
  if (!plan) return null;
  const amount = plan[billing];
  return typeof amount === "number" ? amount : null;
}

export function getDurationDays(billing) {
  return billing === "annual" ? 365 : 30;
}
