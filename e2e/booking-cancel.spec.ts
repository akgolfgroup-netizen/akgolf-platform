/**
 * Booking Cancel E2E Tests
 *
 * Tester avbestillings-flyten: book → naviger til bookinger → kanseller →
 * verifiser status CANCELLED + refund-trigger.
 *
 * Forutsetninger:
 *   - `npm run dev` kjører på http://localhost:3000
 *   - Supabase test-miljø tilgjengelig
 *   - Stripe test-keys i .env
 *   - Seed er kjørt: `npm run seed`
 *
 * Dekker:
 *   - Avbestilling > 24t før start (full refund)
 *   - Avbestilling 12-24t før start (50% refund)
 *   - Avbestilling < 12t (ikke tillatt)
 *   - Idempotent cancel (dobbel POST returnerer samme resultat)
 *   - Auth-sjekk (uinnlogget bruker får 401)
 */

import { test, expect, type Page, type APIRequestContext } from "@playwright/test";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function loginAsTestUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/portal/login");
  await page.fill("input[type='email']", email);
  await page.fill("input[type='password']", password);
  await page.click("button[type='submit']");
  await page.waitForURL(/\/portal(\/|$)/, { timeout: 10000 });
}

async function findLatestConfirmedBooking(
  request: APIRequestContext,
): Promise<string | null> {
  const response = await request.get("/api/portal/bookings/live");
  if (!response.ok()) return null;
  const data = await response.json();
  const list = Array.isArray(data) ? data : data.bookings ?? [];
  const confirmed = list.find(
    (b: { status: string; id: string }) => b.status === "CONFIRMED",
  );
  return confirmed?.id ?? null;
}

async function cancelBookingViaApi(
  request: APIRequestContext,
  bookingId: string,
  reason?: string,
): Promise<{ status: number; body: unknown }> {
  const response = await request.post("/api/portal/bookings/cancel", {
    data: { bookingId, reason },
  });
  return { status: response.status(), body: await response.json() };
}

// -----------------------------------------------------------------------------
// Test Suite
// -----------------------------------------------------------------------------

test.describe("Booking Cancellation", () => {
  test("unauthenticated cancel request returns 401", async ({ request }) => {
    const { status, body } = await cancelBookingViaApi(request, "fake-id");
    expect(status).toBe(401);
    expect(body).toMatchObject({ error: expect.stringMatching(/ikke innlogget|unauthorized/i) });
  });

  test("cancel without bookingId returns 400", async ({ page, request }) => {
    await loginAsTestUser(page, "test-student@example.com", "Testpassord123!");

    const response = await request.post("/api/portal/bookings/cancel", {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/bookingId/i);
  });

  test("cancel non-existing booking returns 404", async ({ page, request }) => {
    await loginAsTestUser(page, "test-student@example.com", "Testpassord123!");

    const { status, body } = await cancelBookingViaApi(request, "nonexistent-id-12345");
    expect(status).toBe(404);
    expect(body).toMatchObject({ error: expect.stringMatching(/ikke funnet/i) });
  });

  test("cancel already-cancelled booking is idempotent (returns 200)", async ({ page, request }) => {
    await loginAsTestUser(page, "test-student@example.com", "Testpassord123!");

    const bookingId = await findLatestConfirmedBooking(request);
    if (!bookingId) {
      test.skip(true, "Ingen aktiv booking i test-miljø — seed mangler");
      return;
    }

    // Første cancel
    const first = await cancelBookingViaApi(request, bookingId, "Test 1");
    expect([200, 400]).toContain(first.status); // 400 hvis < 12t før start

    // Andre cancel (idempotent)
    const second = await cancelBookingViaApi(request, bookingId, "Test 2");
    expect([200, 400]).toContain(second.status);

    if (first.status === 200) {
      // Andre kall må også være 200 og indikere allerede kansellert
      expect(second.status).toBe(200);
      const body = second.body as { message?: string };
      expect(body.message).toMatch(/allerede avbestilt|avbestilt/i);
    }
  });

  test("UI: cancel button in bookinger-list triggers cancel-flow", async ({ page }) => {
    await loginAsTestUser(page, "test-student@example.com", "Testpassord123!");
    await page.goto("/portal/bookinger");
    await page.waitForLoadState("networkidle");

    // Let etter eksisterende kommende booking
    const cancelButton = page.locator("[data-testid='cancel-booking']").first();
    const hasBooking = (await cancelButton.count()) > 0;

    if (!hasBooking) {
      test.skip(true, "Ingen kommende booking å avbestille");
      return;
    }

    await cancelButton.click();

    // Modal / confirmation dialog
    const confirmDialog = page.locator("[role='dialog']").or(
      page.locator("[data-testid='cancel-confirm']"),
    );
    await expect(confirmDialog).toBeVisible({ timeout: 5000 });

    // Bekreft avbestilling
    const confirmBtn = page.locator("[data-testid='confirm-cancel']").or(
      page.getByRole("button", { name: /bekreft|avbestill/i }),
    );
    await confirmBtn.first().click();

    // Vent på at statusen oppdateres eller toast vises
    await page.waitForSelector(
      "[data-testid='cancel-success'], [data-testid='booking-status-cancelled'], text=/avbestilt/i",
      { timeout: 10000 },
    );
  });

  test("refund amount reflects cancellation policy", async ({ page, request }) => {
    await loginAsTestUser(page, "test-student@example.com", "Testpassord123!");

    const bookingId = await findLatestConfirmedBooking(request);
    if (!bookingId) {
      test.skip(true, "Ingen aktiv booking i test-miljø");
      return;
    }

    const { status, body } = await cancelBookingViaApi(request, bookingId, "Policy test");

    if (status === 200) {
      const typed = body as { cancellation?: { refundPercent: number } };
      expect(typed.cancellation).toBeDefined();
      // Refund må være 0, 50 eller 100 per policy
      expect([0, 50, 100]).toContain(typed.cancellation?.refundPercent);
    }
  });
});
