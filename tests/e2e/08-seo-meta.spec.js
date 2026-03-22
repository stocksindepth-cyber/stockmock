// ─── 08-seo-meta.spec.js ─────────────────────────────────────────────────────
// SEO — meta tags, OG tags, canonical, schema.org for key pages
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

const SEO_PAGES = [
  {
    url: "/",
    title: /OptionsGyani/i,
    description: /options|backtest|NSE|nifty/i,
    keywords: /nifty|banknifty|options/i,
  },
  {
    url: "/pricing",
    title: /pricing|OptionsGyani/i,
    description: /options|backtest|plan|free/i,
  },
  {
    url: "/strategies/iron-condor-nifty",
    title: /iron condor|nifty/i,
    description: /iron condor|nifty|strategy/i,
  },
  {
    url: "/learn/what-are-options",
    title: /options|OptionsGyani/i,
    description: /options|learn|NSE/i,
  },
];

test.describe("SEO — meta tags", () => {
  for (const pg of SEO_PAGES) {
    test(`${pg.url} — has title and meta description`, async ({ page }) => {
      await page.goto(pg.url);

      // Title
      const title = await page.title();
      expect(title).toMatch(pg.title);
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70); // SEO best practice

      // Meta description
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      if (pg.description) {
        expect(desc).toMatch(pg.description);
      }
      expect(desc?.length || 0).toBeLessThan(165); // SEO best practice
    });
  }
});

test.describe("SEO — Open Graph tags", () => {
  test("homepage has og:title, og:description, og:image", async ({ page }) => {
    await page.goto("/");

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
    expect(ogTitle).toMatch(/OptionsGyani/i);

    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
    expect(ogDesc).toBeTruthy();

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toBeTruthy();
  });

  test("homepage has twitter:card tag", async ({ page }) => {
    await page.goto("/");
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    expect(twitterCard).toBeTruthy();
    expect(twitterCard).toBe("summary_large_image");
  });
});

test.describe("SEO — schema.org structured data", () => {
  test("homepage has JSON-LD schema", async ({ page }) => {
    await page.goto("/");
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    const schema = JSON.parse(jsonLd);
    expect(schema["@context"]).toBe("https://schema.org");
  });
});

test.describe("SEO — robots and canonical", () => {
  test("homepage not blocked by robots meta", async ({ page }) => {
    await page.goto("/");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    if (robots) {
      expect(robots).not.toContain("noindex");
    }
  });

  test("200 response on all sitemap-worthy pages", async ({ request }) => {
    const urls = ["/", "/pricing", "/about", "/contact", "/learn", "/strategies", "/backtest", "/chain"];
    for (const url of urls) {
      const res = await request.get(url);
      expect(res.status()).toBe(200);
    }
  });
});
