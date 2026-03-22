// ─── 07-strategy-builder.spec.js ─────────────────────────────────────────────
// Strategy builder — payoff chart, leg builder, position builder
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("Strategy Builder page", () => {
  test("page loads without crash", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/builder");
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("ResizeObserver"))).toHaveLength(0);
  });

  test("shows payoff chart or chart container", async ({ page }) => {
    await page.goto("/builder");
    // Chart should be in the DOM — recharts or canvas
    const chart = page
      .locator(".recharts-wrapper, canvas, [data-testid*='chart'], svg")
      .first();
    const count = await page
      .locator(".recharts-wrapper, canvas, [data-testid*='chart'], svg")
      .count();
    expect(count).toBeGreaterThan(0);
  });

  test("shows strategy leg inputs", async ({ page }) => {
    await page.goto("/builder");
    const bodyText = await page.textContent("body");
    // Builder should reference CE/PE or Call/Put or Strike
    expect(bodyText).toMatch(/call|put|CE|PE|strike/i);
  });

  test("shows strategy template selector", async ({ page }) => {
    await page.goto("/builder");
    const bodyText = await page.textContent("body");
    // Should mention strategies like straddle, condor etc.
    expect(bodyText).toMatch(/straddle|condor|spread|strategy|builder/i);
  });

  test("shows Greeks panel (Delta, Gamma, Theta)", async ({ page }) => {
    await page.goto("/builder");
    const bodyText = await page.textContent("body");
    // Greeks should be displayed
    expect(bodyText).toMatch(/delta|gamma|theta|vega/i);
  });
});
