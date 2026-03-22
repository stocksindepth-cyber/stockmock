// ─── 01-public-pages.spec.js ─────────────────────────────────────────────────
// Verifies every public page loads, has correct title/heading, no crash errors
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

const PUBLIC_PAGES = [
  { url: "/",         titleContains: "OptionsGyani",     heading: null },
  { url: "/about",    titleContains: "About",            heading: "About OptionsGyani" },
  { url: "/contact",  titleContains: "Contact",          heading: "Contact Us" },
  { url: "/pricing",  titleContains: "OptionsGyani",     heading: null },   // client component — inherits root title
  { url: "/refund",   titleContains: "Refund",           heading: "Refund & Cancellation Policy" },
  { url: "/privacy",  titleContains: "OptionsGyani",     heading: null },   // check server metadata exists
  { url: "/terms",    titleContains: "OptionsGyani",     heading: null },
  { url: "/features", titleContains: "OptionsGyani",     heading: null },
  { url: "/learn",    titleContains: "OptionsGyani",     heading: null },
  { url: "/strategies", titleContains: "OptionsGyani",  heading: null },
];

const STRATEGY_PAGES = [
  "/strategies/iron-condor-nifty",
  "/strategies/short-straddle-banknifty",
  "/strategies/bull-call-spread-nifty",
  "/strategies/nifty-weekly-expiry-guide",
];

const LEARN_PAGES = [
  "/learn/what-are-options",
  "/learn/delta-gamma",
  "/learn/theta-decay",
  "/learn/iron-condor",
  "/learn/india-vix",
  "/learn/backtesting-guide",
];

test.describe("Public pages — load & content", () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.url} — loads, no crash`, async ({ page: pw }) => {
      const errors = [];
      pw.on("pageerror", (e) => errors.push(e.message));

      const res = await pw.goto(page.url, { timeout: 20_000 });
      expect(res.status()).toBe(200);
      await expect(pw).toHaveTitle(new RegExp(page.titleContains, "i"));

      if (page.heading) {
        await expect(pw.getByRole("heading", { name: page.heading, exact: false })).toBeVisible();
      }

      // No unhandled JS errors
      expect(errors.filter((e) => !e.includes("ResizeObserver"))).toHaveLength(0);
    });
  }

  for (const url of STRATEGY_PAGES) {
    test(`${url} — renders strategy content`, async ({ page }) => {
      const res = await page.goto(url);
      expect(res.status()).toBe(200);
      // Strategy pages should have an h1
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      const text = await h1.textContent();
      expect(text.length).toBeGreaterThan(5);
    });
  }

  for (const url of LEARN_PAGES) {
    test(`${url} — renders article content`, async ({ page }) => {
      const res = await page.goto(url);
      expect(res.status()).toBe(200);
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
    });
  }
});

test.describe("Footer — present on every page", () => {
  const pages = ["/", "/pricing", "/about", "/learn"];

  for (const url of pages) {
    test(`${url} — footer visible with legal links`, async ({ page }) => {
      await page.goto(url);
      const footer = page.locator("footer").last();
      await expect(footer).toBeVisible();

      // All critical legal links must be in footer (use first() to handle duplicates)
      await expect(footer.getByRole("link", { name: /terms/i }).first()).toBeVisible();
      await expect(footer.getByRole("link", { name: /privacy/i }).first()).toBeVisible();
      await expect(footer.getByRole("link", { name: /refund/i }).first()).toBeVisible();
      await expect(footer.getByRole("link", { name: /contact/i }).first()).toBeVisible();
    });
  }
});

test.describe("Navbar — navigation works", () => {
  test("Navbar renders brand logo link", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByRole("link", { name: /optionsgyani/i }).first();
    await expect(logo).toBeVisible();
  });

  test("Nav links navigate correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /pricing/i }).first().click();
    await expect(page).toHaveURL(/pricing/);
  });
});
