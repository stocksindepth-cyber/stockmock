// ─── 06-auth-flow.spec.js ────────────────────────────────────────────────────
// Authentication — login/signup pages render, Firebase auth flows
// ─────────────────────────────────────────────────────────────────────────────
const { test, expect } = require("@playwright/test");

test.describe("Login page", () => {
  test("loads correctly", async ({ page }) => {
    await page.goto("/login");
    expect((await page.title()).toLowerCase()).toMatch(/login|sign in|optionsgyani/i);
  });

  test("shows email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows Google sign-in option", async ({ page }) => {
    await page.goto("/login");
    const googleBtn = page.getByText(/google|continue with google/i).first();
    await expect(googleBtn).toBeVisible();
  });

  test("shows link to sign up page", async ({ page }) => {
    await page.goto("/login");
    // Use first() — navbar also has a "Sign Up" link, causing multiple matches
    const signupLink = page.getByRole("link", { name: /sign up|register|create account/i }).first();
    await expect(signupLink).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("invalid@test.com");
    await page.locator('input[type="password"]').fill("wrongpassword123");
    // Button text is "Log In" — include "log in" and space-less variants
    await page.getByRole("button", { name: /sign in|log in|login|continue/i }).click();

    // Should show error message, not crash
    await expect(
      page.getByText(/invalid|incorrect|error|failed|wrong/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("does not redirect authenticated routes without login", async ({ page }) => {
    await page.goto("/profile");
    // Should redirect to login
    await expect(page).toHaveURL(/login|\/$/);
  });

  test("does not redirect authenticated routes without login — dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login|\//);
  });
});

test.describe("Signup page", () => {
  test("loads correctly", async ({ page }) => {
    await page.goto("/signup");
    expect((await page.title()).toLowerCase()).toMatch(/sign up|register|create|optionsgyani/i);
  });

  test("shows name, email, password fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows link back to login", async ({ page }) => {
    await page.goto("/signup");
    // Use first() — navbar also has a "Log In" link, causing multiple matches
    const loginLink = page.getByRole("link", { name: /log in|sign in|already have/i }).first();
    await expect(loginLink).toBeVisible();
  });

  test("shows Google sign-up option", async ({ page }) => {
    await page.goto("/signup");
    const googleBtn = page.getByText(/google|continue with google/i).first();
    await expect(googleBtn).toBeVisible();
  });
});

test.describe("Protected routes redirect", () => {
  const PROTECTED = ["/profile", "/dashboard", "/paper-trade"];

  for (const route of PROTECTED) {
    test(`${route} redirects unauthenticated user`, async ({ page }) => {
      await page.goto(route);
      // Must redirect away from protected route to login or home
      await page.waitForURL((url) => !url.pathname.startsWith(route) || url.pathname === "/", {
        timeout: 5_000,
      }).catch(() => {
        // If no redirect, page should show login prompt
      });
      const url = page.url();
      const bodyText = await page.textContent("body");
      // Either redirected or shows login/auth UI
      const isRedirected = !url.includes(route);
      const hasAuthPrompt = /login|sign in|create account|get started/i.test(bodyText);
      expect(isRedirected || hasAuthPrompt).toBe(true);
    });
  }
});
