// ─── 03-pricing-page.spec.js ─────────────────────────────────────────────────
// Pricing page — all plans visible, toggle works, Dhan referral present
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("Pricing page — plan display", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("shows all 3 plans: Free, Pro, Elite", async ({ page }) => {
    await expect(page.getByText("Free", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Pro", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Elite", { exact: true }).first()).toBeVisible();
  });

  test("Free plan shows ₹0 price", async ({ page }) => {
    // Target the price span specifically, not the Dhan referral text
    await expect(page.locator("span.text-5xl").filter({ hasText: "₹0" })).toBeVisible();
  });

  test("Pro plan shows ₹499/mo monthly price", async ({ page }) => {
    await expect(page.locator("span.text-5xl").filter({ hasText: "₹499" })).toBeVisible();
  });

  test("Elite plan shows ₹999/mo monthly price", async ({ page }) => {
    await expect(page.locator("span.text-5xl").filter({ hasText: "₹999" })).toBeVisible();
  });

  test("Most Popular badge shown on Pro plan", async ({ page }) => {
    await expect(page.getByText(/most popular/i)).toBeVisible();
  });

  test("Annual toggle switches to discounted prices", async ({ page }) => {
    await page.getByRole("button", { name: /annual/i }).first().click();
    await expect(page.locator("span.text-5xl").filter({ hasText: "₹399" })).toBeVisible();
    await expect(page.locator("span.text-5xl").filter({ hasText: "₹799" })).toBeVisible();
    await expect(page.getByText(/save 20%/i)).toBeVisible();
  });

  test("Monthly toggle restores original prices", async ({ page }) => {
    await page.getByRole("button", { name: /annual/i }).first().click();
    await page.getByRole("button", { name: /monthly/i }).first().click();
    await expect(page.locator("span.text-5xl").filter({ hasText: "₹499" })).toBeVisible();
  });

  test("competitor callout strip visible", async ({ page }) => {
    await expect(page.getByText(/sensibull/i).first()).toBeVisible();
  });

  test("'Start Free' CTA on free plan redirects unauthenticated user to signup", async ({ page }) => {
    await page.getByRole("button", { name: /start free/i }).click();
    // Should redirect to signup or backtest
    await expect(page).toHaveURL(/signup|backtest/);
  });

  test("'Start Pro' CTA on paid plan redirects to login when not authenticated", async ({ page }) => {
    await page.getByRole("button", { name: /start pro/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("Pricing page — Dhan referral", () => {
  test("Dhan referral link present in plan cards", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    // Link with href containing dhan.co
    const dhanLinks = page.locator('a[href*="join.dhan.co"]');
    const count = await dhanLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("Full-width Dhan CTA section visible", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText(/also trading live/i)).toBeVisible();
  });

  test("Dhan link points to correct referral URL", async ({ page }) => {
    await page.goto("/pricing");
    const firstDhanLink = page.getByRole("link", { name: /open free account/i }).first();
    const href = await firstDhanLink.getAttribute("href");
    expect(href).toContain("join.dhan.co");
    expect(href).toContain("XDCAS95683");
  });
});

test.describe("Pricing page — feature comparison table", () => {
  test("comparison table renders with correct headers", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Full Feature Comparison")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /free/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /pro/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /elite/i })).toBeVisible();
  });

  test("key feature rows present in table", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Historical Data").first()).toBeVisible();
    await expect(page.getByText("Daily Backtests").first()).toBeVisible();
    await expect(page.getByText("API Access").first()).toBeVisible();
  });
});

test.describe("Pricing page — FAQ", () => {
  test("FAQ section present", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Frequently Asked Questions")).toBeVisible();
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    await page.goto("/pricing");
    const firstQuestion = page.getByText(/really free forever/i);
    await firstQuestion.click();
    // Answer should become visible
    await expect(page.getByText(/no credit card/i).first()).toBeVisible();
  });
});
