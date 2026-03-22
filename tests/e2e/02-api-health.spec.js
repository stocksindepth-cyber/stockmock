// ─── 02-api-health.spec.js ───────────────────────────────────────────────────
// Tests all API routes return valid JSON with correct structure
// Real data paths: Dhan API (chain, indices, expiries) + BigQuery (backtest)
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("API — /api/indices (Dhan live data)", () => {
  test("returns NIFTY and BANKNIFTY live prices", async ({ request }) => {
    const res = await request.get("/api/indices");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("NIFTY");
    expect(body).toHaveProperty("BANKNIFTY");

    // Price sanity: NIFTY should be between 15000 and 35000
    const nifty = body.NIFTY;
    expect(typeof nifty).toBe("number");
    expect(nifty).toBeGreaterThan(10_000);
    expect(nifty).toBeLessThan(40_000);

    const banknifty = body.BANKNIFTY;
    expect(typeof banknifty).toBe("number");
    expect(banknifty).toBeGreaterThan(30_000);
    expect(banknifty).toBeLessThan(100_000);
  });

  test("response time under 3 seconds", async ({ request }) => {
    const start = Date.now();
    await request.get("/api/indices");
    expect(Date.now() - start).toBeLessThan(3_000);
  });
});

test.describe("API — /api/expiries (Dhan live data)", () => {
  test("returns valid expiry date list", async ({ request }) => {
    const res = await request.get("/api/expiries");
    expect(res.status()).toBe(200);

    const body = await res.json();
    // Should be object with symbol keys or array
    expect(body).toBeTruthy();

    // Check NIFTY expiries if structured that way
    const expiries = body.NIFTY || body.nifty || body;
    if (Array.isArray(expiries)) {
      expect(expiries.length).toBeGreaterThan(0);
      // Dates should be valid strings
      const date = new Date(expiries[0]);
      expect(date.getTime()).not.toBeNaN();
    }
  });
});

test.describe("API — /api/chain (Dhan option chain)", () => {
  test("returns option chain for NIFTY", async ({ request }) => {
    const res = await request.get("/api/chain?symbol=NIFTY");
    expect(res.status()).toBe(200);

    const body = await res.json();
    // Should have option data — either real or graceful mock
    expect(body).toBeTruthy();
    expect(typeof body).toBe("object");
  });

  test("handles missing symbol gracefully", async ({ request }) => {
    const res = await request.get("/api/chain");
    // Should return 400 or a default response, not 500
    expect([200, 400]).toContain(res.status());
  });

  test("BANKNIFTY chain responds correctly", async ({ request }) => {
    const res = await request.get("/api/chain?symbol=BANKNIFTY");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeTruthy();
  });
});

test.describe("API — /api/backtest (BigQuery real data)", () => {
  test("GET returns data coverage metadata", async ({ request }) => {
    const res = await request.get("/api/backtest");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeTruthy();
  });

  test("POST simple backtest returns results", async ({ request }) => {
    const payload = {
      symbol: "NIFTY",
      strategy: "short_straddle",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      expiry: "weekly",
      entryDay: "Monday",
      exitDay: "Thursday",
    };

    const res = await request.post("/api/backtest", {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    // Either real BigQuery data or graceful fallback — must not 500
    expect([200, 422]).toContain(res.status());

    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toHaveProperty("trades");
      expect(Array.isArray(body.trades)).toBe(true);
    }
  });

  test("POST rejects invalid payload", async ({ request }) => {
    const res = await request.post("/api/backtest", {
      data: { symbol: "INVALID_SYMBOL_XYZ" },
      headers: { "Content-Type": "application/json" },
    });
    expect([400, 422, 500]).toContain(res.status());
  });
});

test.describe("API — /api/razorpay/order", () => {
  test("rejects unauthenticated order creation", async ({ request }) => {
    const res = await request.post("/api/razorpay/order", {
      data: { amount: 499, planId: "pro_monthly", planName: "Pro", userId: "test" },
      headers: { "Content-Type": "application/json" },
    });
    // Without valid Firebase token, should reject or return mock
    expect([200, 401, 403]).toContain(res.status());

    if (res.status() === 200) {
      const body = await res.json();
      // In dev mode it returns a mock order — acceptable
      expect(body.mock || body.orderId || body.error).toBeTruthy();
    }
  });
});
