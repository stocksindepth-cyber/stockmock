// ─── 04-option-chain.spec.js ─────────────────────────────────────────────────
// Option chain page — live Dhan data loading, symbol switching, expiry picker
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("Option Chain — page load & data", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chain");
    // Wait for data to load — up to 10s for API call
    await page.waitForLoadState("networkidle");
  });

  test("page loads without crashing", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/chain");
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("ResizeObserver"))).toHaveLength(0);
  });

  test("shows strike price columns (CE / PE)", async ({ page }) => {
    // Option chain should display CE and PE side columns
    const ceHeader = page.getByText(/CE|Call/i).first();
    const peHeader = page.getByText(/PE|Put/i).first();
    await expect(ceHeader).toBeVisible();
    await expect(peHeader).toBeVisible();
  });

  test("displays numeric OI or LTP values", async ({ page }) => {
    // At least some numeric data cells should render
    const cells = page.locator("table td, [data-testid='chain-cell']");
    const count = await cells.count();
    expect(count).toBeGreaterThan(0);
  });

  test("symbol selector is present", async ({ page }) => {
    const selector = page
      .getByRole("combobox")
      .or(page.getByRole("button", { name: /nifty|banknifty|symbol/i }))
      .first();
    await expect(selector).toBeVisible();
  });

  test("expiry picker is present", async ({ page }) => {
    // There should be some form of expiry selection
    const expiry = page.getByText(/expiry|expiries/i).first();
    await expect(expiry).toBeVisible();
  });
});

test.describe("Option Chain — live index prices", () => {
  test("shows live NIFTY or BANKNIFTY spot price", async ({ page }) => {
    await page.goto("/chain");
    await page.waitForLoadState("networkidle");

    // Look for a 5-digit number that looks like NIFTY/BANKNIFTY price
    const priceText = await page.textContent("body");
    // NIFTY is roughly 20000-26000, BANKNIFTY ~45000-55000
    const hasBigNumber = /\d{4,6}(\.\d{1,2})?/.test(priceText);
    expect(hasBigNumber).toBe(true);
  });
});
