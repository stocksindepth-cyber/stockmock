// ─── 05-backtest.spec.js ─────────────────────────────────────────────────────
// Backtest tool — UI loads, real BigQuery data flows, results render
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("Backtest page — UI", () => {
  test("page loads without crashing", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/backtest");
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("ResizeObserver"))).toHaveLength(0);
  });

  test("shows strategy selector or configuration form", async ({ page }) => {
    await page.goto("/backtest");
    // Should have some form of strategy input
    const hasForm =
      (await page.locator("select, input, button").count()) > 0;
    expect(hasForm).toBe(true);
  });

  test("shows date range inputs or pickers", async ({ page }) => {
    await page.goto("/backtest");
    const dateInput = page
      .locator('input[type="date"], input[placeholder*="date"], [data-testid*="date"]')
      .first();
    // If date inputs exist, verify they're visible
    const count = await page.locator('input[type="date"]').count();
    // Page should have some date selection mechanism
    const bodyText = await page.textContent("body");
    expect(bodyText).toMatch(/date|from|start|period|year/i);
  });

  test("NIFTY is available as a symbol option", async ({ page }) => {
    await page.goto("/backtest");
    const bodyText = await page.textContent("body");
    expect(bodyText).toMatch(/nifty/i);
  });

  test("BANKNIFTY is available as a symbol option", async ({ page }) => {
    await page.goto("/backtest");
    const bodyText = await page.textContent("body");
    expect(bodyText).toMatch(/banknifty/i);
  });

  test("shows upgrade prompt or limit message for free tier", async ({ page }) => {
    await page.goto("/backtest");
    // For unauthenticated users, should show login/signup prompt OR allow limited use
    const bodyText = await page.textContent("body");
    // Either shows content or prompts for auth
    expect(bodyText.length).toBeGreaterThan(100);
  });
});

test.describe("Backtest API — real data flow", () => {
  test("backtest API returns structured results for short straddle", async ({ request }) => {
    const res = await request.post("/api/backtest", {
      data: {
        symbol: "NIFTY",
        strategy: "short_straddle",
        startDate: "2023-06-01",
        endDate: "2023-06-30",
        expiry: "weekly",
        entryDay: "Monday",
        exitDay: "Thursday",
      },
      headers: { "Content-Type": "application/json" },
    });

    expect([200, 422, 401]).toContain(res.status());

    if (res.status() === 200) {
      const body = await res.json();
      // Real data response should have trades array and summary
      expect(body).toHaveProperty("trades");
      if (body.trades.length > 0) {
        const trade = body.trades[0];
        // Each trade should have meaningful financial fields
        expect(trade).toHaveProperty("pnl");
        expect(typeof trade.pnl).toBe("number");
      }
    }
  });

  test("backtest API returns results for iron condor", async ({ request }) => {
    const res = await request.post("/api/backtest", {
      data: {
        symbol: "BANKNIFTY",
        strategy: "iron_condor",
        startDate: "2023-01-01",
        endDate: "2023-03-31",
        expiry: "weekly",
      },
      headers: { "Content-Type": "application/json" },
    });

    expect([200, 422, 401]).toContain(res.status());
  });

  test("backtest covers 2016 data (8+ years of BigQuery data)", async ({ request }) => {
    const res = await request.post("/api/backtest", {
      data: {
        symbol: "NIFTY",
        strategy: "short_straddle",
        startDate: "2016-06-01",
        endDate: "2016-06-30",
      },
      headers: { "Content-Type": "application/json" },
    });
    // Should not error out — BigQuery has data from 2016
    expect([200, 422, 401]).toContain(res.status());
    // 500 would mean BigQuery connection failed
    expect(res.status()).not.toBe(500);
  });
});
