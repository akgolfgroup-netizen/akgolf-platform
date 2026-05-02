/**
 * Onboarding V2 E2E Tests
 *
 * Tester 7-stegs onboarding wizard for nye brukere.
 *
 * Forutsetninger:
 *   - `npm run dev` på localhost:3000
 *   - Test-bruker uten fullført onboarding (TEST_STUDENT_EMAIL)
 *
 * Hvis test-bruker allerede har fullført onboarding, skippes wizard-testene
 * og kun redirect-verifisering kjøres.
 */

import { test, expect, type Page } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_STUDENT_EMAIL ?? "test-student@example.com";
const TEST_PASSWORD = process.env.TEST_STUDENT_PASSWORD ?? "Testpassord123!";

async function loginAsTestUser(page: Page): Promise<void> {
  await page.goto("/portal/login");
  await page.fill("input[type='email']", TEST_EMAIL);
  await page.fill("input[type='password']", TEST_PASSWORD);
  await page.click("button[type='submit']");
  await page.waitForURL(/\/portal/, { timeout: 15000 });
}

test.describe("Onboarding V2 — auth", () => {
  test("uinnlogget bruker redirectes til login", async ({ page }) => {
    await page.goto("/portal/onboarding");
    await expect(page).toHaveURL(/\/portal\/login/);
  });
});

test.describe("Onboarding V2 — wizard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/portal/onboarding");
  });

  test("fullfører 7-stegs wizard", async ({ page }) => {
    // Hvis allerede fullført, redirectes til /portal — skip test
    if (page.url().includes("/portal") && !page.url().includes("/onboarding")) {
      test.skip(true, "Bruker har allerede fullført onboarding");
      return;
    }

    // Verifiser at wizard lastes
    await expect(page.getByText("AK Golf · Velkommen")).toBeVisible();

    // ── Steg 1: Profil ──
    await expect(page.getByText("Din golfbakgrunn")).toBeVisible();
    await page.fill('input[placeholder*="handicap"]', "12.4");
    await page.fill('input[placeholder*="35"]', "35");
    await page.fill('input[placeholder*="5"]', "5");
    await page.getByRole("button", { name: /neste/i }).click();

    // ── Steg 2: Mål ──
    await expect(page.getByText("Hva vil du oppnå?")).toBeVisible();
    // Velg første goal-chip
    const firstChip = page.locator("button").filter({ hasText: /ned i hcp|length|nøyaktighet/i }).first();
    if (await firstChip.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstChip.click();
    }
    // Velg player type
    await page.getByText("Performance").first().click();
    await page.getByRole("button", { name: /neste/i }).click();

    // ── Steg 3: Frekvens ──
    await expect(page.getByText(/frekvens|ofte/i)).toBeVisible();
    const freqOption = page.locator("button, [role='radio']").first();
    if (await freqOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await freqOption.click();
    }
    await page.getByRole("button", { name: /neste/i }).click();

    // ── Steg 4: Hjemmebane ──
    await expect(page.getByText(/hjemmebane|bane/i)).toBeVisible();
    const courseInput = page.locator("input[type='text']").first();
    if (await courseInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await courseInput.fill("Bærums Golfklubb");
    }
    await page.getByRole("button", { name: /neste/i }).click();

    // ── Steg 5: Standardvisning ──
    await expect(page.getByText(/visning|dashboard|layout/i)).toBeVisible();
    const viewOption = page.locator("button, [role='radio']").first();
    if (await viewOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await viewOption.click();
    }
    await page.getByRole("button", { name: /neste/i }).click();

    // ── Steg 6: Cold-start ──
    await expect(page.getByText(/svakhet|område|forbedre/i)).toBeVisible();
    const weaknessOption = page.locator("button, [role='radio']").first();
    if (await weaknessOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await weaknessOption.click();
    }
    await page.getByRole("button", { name: /neste/i }).click();

    // ── Steg 7: Klar ──
    await expect(page.getByText(/klar|ferdig|kom i gang/i)).toBeVisible();
    await page.getByRole("button", { name: /fullfør/i }).click();

    // Vent på lagring og redirect
    await page.waitForURL(/\/portal\/dagbok/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/portal\/dagbok/);
  });

  test("skip-knapp fungerer", async ({ page }) => {
    // Hvis allerede fullført, skip
    if (page.url().includes("/portal") && !page.url().includes("/onboarding")) {
      test.skip(true, "Bruker har allerede fullført onboarding");
      return;
    }

    await expect(page.getByText("AK Golf · Velkommen")).toBeVisible();

    const skipBtn = page.getByText(/hopp over/i);
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForURL(/\/portal/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/portal(?!\/onboarding)/);
    }
  });
});
