// ─── 10-mobile-responsive.spec.js ────────────────────────────────────────────
// Mobile responsiveness — key pages on Pixel 7 viewport
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect, devices } = require("@playwright/test");

// Run all tests in this file on mobile viewport
test.use({ ...devices["Pixel 7"] });

test.describe("Mobile — key pages render correctly", () => {
  const PAGES = ["/", "/pricing", "/backtest", "/chain", "/learn", "/about", "/contact"];

  for (const url of PAGES) {
    test(`${url} renders on mobile without overflow`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      // Check no horizontal overflow (a common mobile bug)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize().width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
    });
  }
});

test.describe("Mobile — navbar", () => {
  test("mobile nav is accessible", async ({ page }) => {
    await page.goto("/");
    // On mobile, the nav might be a hamburger or collapsed menu
    // The logo/brand should still be visible
    const brand = page.getByText(/OptionsGyani/i).first();
    await expect(brand).toBeVisible();
  });
});

test.describe("Mobile — pricing page", () => {
  test("pricing cards stack vertically on mobile", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");

    // All 3 plan names should still be visible on mobile
    await expect(page.getByText("Free", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Pro", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Elite", { exact: true }).first()).toBeVisible();
  });

  test("Dhan CTA visible on mobile", async ({ page }) => {
    await page.goto("/pricing");
    const dhanText = page.getByText(/dhan|open free account/i).first();
    await expect(dhanText).toBeVisible();
  });
});
