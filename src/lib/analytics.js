/**
 * OptionsGyani — Google Analytics 4 event helpers
 *
 * All events flow through `track()` which safely calls window.gtag.
 * Import individual helpers in components — never call gtag() directly.
 *
 * GA4 event naming convention: snake_case, verb_noun
 */

// ─── Core ─────────────────────────────────────────────────────────────────────

export function track(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function trackSignupSuccess(method) {
  track("sign_up", { method }); // GA4 recommended event
}

export function trackSignupError(method, errorCode) {
  track("signup_error", { method, error_code: errorCode });
}

export function trackLoginSuccess(method) {
  track("login", { method }); // GA4 recommended event
}

export function trackLoginError(method) {
  track("login_error", { method });
}

export function trackForgotPassword() {
  track("forgot_password_request");
}

export function trackLogout() {
  track("logout");
}

// ─── CTA clicks ───────────────────────────────────────────────────────────────

/**
 * @param {string} label  - human-readable button label, e.g. "Start Backtesting Free"
 * @param {string} location - page/section, e.g. "homepage_hero", "pricing_plans"
 */
export function trackCTAClick(label, location) {
  track("cta_click", { cta_label: label, cta_location: location });
}

// ─── Pricing & payments ───────────────────────────────────────────────────────

/**
 * User clicks a plan CTA (Start Free / Start Pro / Go Elite).
 * @param {string} planName   - "free" | "pro" | "elite"
 * @param {string} billing    - "monthly" | "annual"
 */
export function trackPlanClick(planName, billing) {
  track("plan_upgrade_click", { plan_name: planName, billing_period: billing });
}

export function trackBillingToggle(period) {
  track("billing_toggle", { billing_period: period }); // "monthly" | "annual"
}

/**
 * Razorpay modal opened (payment about to happen).
 */
export function trackPaymentInitiated(planName, amount, billing) {
  track("begin_checkout", { // GA4 ecommerce recommended event
    currency: "INR",
    value: amount,
    items: [{ item_id: planName, item_name: `OptionsGyani ${planName}`, price: amount }],
    billing_period: billing,
  });
}

/**
 * Payment verified & plan activated.
 */
export function trackPaymentSuccess(planName, amount, billing, paymentId) {
  track("purchase", { // GA4 ecommerce recommended event
    currency: "INR",
    transaction_id: paymentId,
    value: amount,
    items: [{ item_id: planName, item_name: `OptionsGyani ${planName}`, price: amount }],
    billing_period: billing,
  });
}

export function trackPaymentFailed(planName) {
  track("payment_failed", { plan_name: planName });
}

export function trackPaymentCancelled(planName) {
  track("payment_cancelled", { plan_name: planName });
}

export function trackPricingFAQOpen(question) {
  track("faq_open", { question, page: "pricing" });
}

// ─── Dhan referral ────────────────────────────────────────────────────────────

/**
 * Any click on a Dhan referral/affiliate link.
 * @param {string} location - "footer" | "pricing" | "broker_article" | "homepage" | "dashboard"
 */
export function trackDhanReferralClick(location) {
  track("dhan_referral_click", { referral_location: location });
}

// ─── Tool navigation ──────────────────────────────────────────────────────────

/**
 * User navigates to a tool from navbar, dashboard, or homepage feature grid.
 * @param {string} tool     - "backtest" | "chain" | "builder" | "oi_analysis" | "screener" | "paper_trade" | "alerts"
 * @param {string} source   - "navbar" | "dashboard" | "homepage" | "feature_grid"
 */
export function trackToolNavigate(tool, source) {
  track("tool_navigate", { tool_name: tool, nav_source: source });
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export function trackAlertCreate(metric, condition) {
  track("alert_create", { alert_metric: metric, alert_condition: condition });
}

export function trackAlertDelete() {
  track("alert_delete");
}

export function trackAlertToggle(active) {
  track("alert_toggle", { alert_active: active });
}

// ─── Broker articles ──────────────────────────────────────────────────────────

export function trackBrokerArticleView(slug) {
  track("broker_article_view", { article_slug: slug });
}

export function trackBrokerArticleDhanCTA(slug, ctaVariant) {
  track("broker_article_dhan_cta", { article_slug: slug, cta_variant: ctaVariant });
  trackDhanReferralClick(`broker_article_${slug}`);
}

// ─── Backtest ─────────────────────────────────────────────────────────────────

export function trackBacktestRun(strategy, underlying) {
  track("backtest_run", { strategy_name: strategy, underlying });
}

// ─── Search / screener ────────────────────────────────────────────────────────

export function trackScreenerScan(scanType, underlying) {
  track("screener_scan", { scan_type: scanType, underlying });
}

// ─── Paper trade ──────────────────────────────────────────────────────────────

export function trackPaperTradePlaced(underlying) {
  track("paper_trade_placed", { underlying });
}
