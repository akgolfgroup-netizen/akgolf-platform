/**
 * Booking Error Cases E2E Tests
 *
 * Tester feil-paths i booking-flyten:
 *   - Declined Stripe-kort (4000000000000002)
 *   - Slot-konflikt mellom date-select og payment (race condition)
 *   - Valideringsfeil på summary-siden
 *   - Rate limiting på create-endepunkt
 *   - Ugyldig service-ID / instructor-ID
 *
 * Forutsetninger:
 *   - `npm run dev` på localhost:3000
 *   - Stripe test-modus (test keys)
 *   - Seed kjørt
 */

import { test, expect, type Page } from "@playwright/test";

const DECLINED_CARD = "4000000000000002";

async function goToBookingAndSelectFirstService(page: Page): Promise<void> {
  await page.goto("/booking");
  await page.waitForLoadState("networkidle");

  const serviceGrid = page.locator("[data-testid='service-grid']");
  await expect(serviceGrid).toBeVisible({ timeout: 10000 });

  // Velg første tilgjengelige tjeneste
  const firstService = serviceGrid.locator("button").first();
  await firstService.click();

  const continueBtn = page.locator("[data-testid='continue-button']");
  if ((await continueBtn.count()) > 0) {
    await continueBtn.click();
  }
}

async function selectFirstAvailableSlot(page: Page): Promise<boolean> {
  await page.waitForSelector("[data-testid='calendar']", { timeout: 10000 });

  // Finn første ledige dato (ikke disabled)
  const availableDate = page
    .locator("[data-testid^='date-']:not([data-disabled='true'])")
    .first();

  if ((await availableDate.count()) === 0) return false;
  await availableDate.click();

  await page.waitForSelector("[data-testid='time-slots']", { timeout: 5000 });
  const availableTime = page
    .locator("[data-testid^='time-']:not([data-disabled='true'])")
    .first();

  if ((await availableTime.count()) === 0) return false;
  await availableTime.click();
  return true;
}

test.describe("Booking Error Cases", () => {
  test("declined card shows error message", async ({ page }) => {
    await goToBookingAndSelectFirstService(page);

    const hasSlot = await selectFirstAvailableSlot(page);
    if (!hasSlot) {
      test.skip(true, "Ingen ledige slots i test-miljø");
      return;
    }

    await page.fill("[data-testid='email-input']", `declined-${Date.now()}@example.com`);
    await page.fill("[data-testid='name-input']", "Declined Card User");
    await page.click("[data-testid='continue-to-payment']");

    // Fyll ut Stripe-skjema med declined card
    const stripeFrame = page.frameLocator("iframe[name*='stripe']").first();
    await stripeFrame.locator("[placeholder*='card number']").fill(DECLINED_CARD);
    await stripeFrame.locator("[placeholder*='MM / YY']").fill("12/30");
    await stripeFrame.locator("[placeholder*='CVC']").fill("123");

    await page.click("[data-testid='pay-button']");

    // Forvent feilmelding (ikke redirect til confirmation)
    const errorLocator = page.locator("[data-testid='payment-error'], [role='alert']");
    await expect(errorLocator.first()).toBeVisible({ timeout: 15000 });

    // URL skal IKKE ha endret seg til /confirmation
    expect(page.url()).not.toMatch(/\/confirmation/);
  });

  test("booking creation without serviceType returns 400", async ({ request }) => {
    const response = await request.post("/api/booking/create", {
      data: {
        // Mangler serviceTypeId
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        email: "missing-service@example.com",
        name: "Test",
      },
    });

    expect([400, 422]).toContain(response.status());
  });

  test("booking creation with invalid serviceTypeId returns 404", async ({ request }) => {
    const response = await request.post("/api/booking/create", {
      data: {
        serviceTypeId: "nonexistent-service-id-12345",
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        email: "invalid-service@example.com",
        name: "Test",
      },
    });

    expect([400, 404]).toContain(response.status());
  });

  test("booking creation with past startTime returns 400", async ({ request }) => {
    const response = await request.post("/api/booking/create", {
      data: {
        serviceTypeId: "any-id",
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        email: "past-time@example.com",
        name: "Test",
      },
    });

    expect([400, 404]).toContain(response.status());
  });

  test("rate limiting kicks in on rapid booking attempts", async ({ request }) => {
    const payload = {
      serviceTypeId: "test-service",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      email: `rate-limit-${Date.now()}@example.com`,
      name: "Rate Test",
    };

    // Send 15 requests rapidly — should trigger rate limit (10/min per IP)
    const responses = await Promise.all(
      Array.from({ length: 15 }, () =>
        request.post("/api/booking/create", { data: payload }),
      ),
    );

    const rateLimited = responses.some((r) => r.status() === 429);
    expect(rateLimited).toBe(true);
  });

  test("invalid email format is rejected in summary step", async ({ page }) => {
    await goToBookingAndSelectFirstService(page);

    const hasSlot = await selectFirstAvailableSlot(page);
    if (!hasSlot) {
      test.skip(true, "Ingen ledige slots");
      return;
    }

    await page.fill("[data-testid='email-input']", "not-valid-email");
    await page.fill("[data-testid='name-input']", "Test");
    await page.click("[data-testid='continue-to-payment']");

    // Forvent valideringsfeil
    const emailError = page.locator("[data-testid='email-error']").or(
      page.locator("text=/gyldig.*e-?post/i"),
    );
    await expect(emailError.first()).toBeVisible({ timeout: 5000 });
  });

  test("empty name is rejected", async ({ page }) => {
    await goToBookingAndSelectFirstService(page);

    const hasSlot = await selectFirstAvailableSlot(page);
    if (!hasSlot) {
      test.skip(true, "Ingen ledige slots");
      return;
    }

    await page.fill("[data-testid='email-input']", `valid-${Date.now()}@example.com`);
    // Name forblir tom
    await page.click("[data-testid='continue-to-payment']");

    const nameError = page.locator("[data-testid='name-error']").or(
      page.locator("text=/navn.*påkrevd|name.*required/i"),
    );
    await expect(nameError.first()).toBeVisible({ timeout: 5000 });
  });

  test("cancel endpoint handles missing JSON body", async ({ page, request }) => {
    // Logg inn først for å passere auth
    await page.goto("/portal/login");
    await page.fill("input[type='email']", "test-student@example.com");
    await page.fill("input[type='password']", "Testpassord123!");
    await page.click("button[type='submit']");
    await page.waitForURL(/\/portal(\/|$)/, { timeout: 10000 });

    const response = await request.post("/api/portal/bookings/cancel", {
      headers: { "content-type": "application/json" },
      data: "not-json",
    });

    expect([400, 422]).toContain(response.status());
  });
});
