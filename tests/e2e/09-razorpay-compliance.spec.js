// ─── 09-razorpay-compliance.spec.js ──────────────────────────────────────────
// Razorpay merchant verification checklist — all required pages & content live
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("Razorpay compliance — required pages live", () => {
  const REQUIRED_PAGES = [
    { url: "/", name: "Homepage" },
    { url: "/pricing", name: "Pricing page" },
    { url: "/terms", name: "Terms of Service" },
    { url: "/privacy", name: "Privacy Policy" },
    { url: "/refund", name: "Refund & Cancellation Policy" },
    { url: "/contact", name: "Contact Us" },
    { url: "/about", name: "About Us" },
  ];

  for (const pg of REQUIRED_PAGES) {
    test(`${pg.name} (${pg.url}) returns 200`, async ({ request }) => {
      const res = await request.get(pg.url);
      expect(res.status()).toBe(200);
    });
  }
});

test.describe("Razorpay compliance — contact page content", () => {
  test("has a valid support email address", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(/support@optionsgyani\.in/i)).toBeVisible();
  });

  test("has business hours information", async ({ page }) => {
    await page.goto("/contact");
    const text = await page.textContent("body");
    expect(text).toMatch(/monday|hours|am|pm|IST/i);
  });
});

test.describe("Razorpay compliance — refund page content", () => {
  test("clearly states refund policy", async ({ page }) => {
    await page.goto("/refund");
    const text = await page.textContent("body");
    expect(text).toMatch(/non-refundable|refund/i);
  });

  test("mentions cancellation process", async ({ page }) => {
    await page.goto("/refund");
    const text = await page.textContent("body");
    expect(text).toMatch(/cancel/i);
  });

  test("mentions processing time for refunds", async ({ page }) => {
    await page.goto("/refund");
    const text = await page.textContent("body");
    expect(text).toMatch(/5|7|business days/i);
  });

  test("has contact email for refund requests", async ({ page }) => {
    await page.goto("/refund");
    await expect(page.getByText(/support@optionsgyani\.in/i).first()).toBeVisible();
  });
});

test.describe("Razorpay compliance — pricing page content", () => {
  test("clearly shows subscription prices in INR", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    // Check rendered price spans directly
    const price = page.locator("span.text-5xl").filter({ hasText: "₹499" });
    await expect(price).toBeVisible();
  });

  test("mentions GST applicability", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/gst/i).first()).toBeVisible();
  });

  test("pricing shows billing period (monthly/annual)", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/monthly/i).first()).toBeVisible();
  });
});

test.describe("Razorpay compliance — footer legal links", () => {
  test("footer on homepage has all required legal links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer").last();

    const requiredLinks = [/terms/i, /privacy/i, /refund/i, /contact/i];
    for (const name of requiredLinks) {
      await expect(footer.getByRole("link", { name }).first()).toBeVisible();
    }
  });
});

test.describe("Razorpay compliance — about page content", () => {
  test("describes the business clearly", async ({ page }) => {
    await page.goto("/about");
    const text = await page.textContent("body");
    expect(text).toMatch(/analytics|backtesting|options|NSE/i);
  });

  test("includes SEBI disclaimer", async ({ page }) => {
    await page.goto("/about");
    const text = await page.textContent("body");
    expect(text).toMatch(/SEBI|not.*registered|educational/i);
  });
});
