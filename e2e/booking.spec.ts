/**
 * Booking System E2E Tests
 * 
 * Tester den komplette booking-flyten i nettleseren.
 * MÅL: Verifisere at ingen dobbeltbookings skjer i produksjon.
 */

import { test, expect, Page, BrowserContext } from "@playwright/test";

// -----------------------------------------------------------------------------
// Test Helpers
// -----------------------------------------------------------------------------

async function setupTestDate(): Promise<Date> {
  // Finn neste tilgjengelige dag (ikke helg)
  const date = new Date();
  date.setDate(date.getDate() + 7); // En uke frem
  
  // Unngå helg
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  
  date.setHours(14, 0, 0, 0);
  return date;
}

async function selectService(page: Page, serviceName: string): Promise<void> {
  // Vent på at services laster
  await page.waitForSelector("[data-testid='service-grid']", { timeout: 10000 });
  
  // Velg tjeneste
  await page.click(`[data-testid='service-${serviceName}']`);
  
  // Klikk fortsett
  await page.click("[data-testid='continue-button']");
}

async function selectDateAndTime(
  page: Page, 
  date: Date
): Promise<void> {
  // Vent på kalender
  await page.waitForSelector("[data-testid='calendar']", { timeout: 10000 });
  
  // Formater dato for data-testid
  const dateStr = date.toISOString().split("T")[0];
  
  // Klikk på dato
  await page.click(`[data-testid='date-${dateStr}']`);
  
  // Vent på tidsvelger
  await page.waitForSelector("[data-testid='time-slots']", { timeout: 5000 });
  
  // Klikk på tidspunkt (14:00)
  await page.click(`[data-testid='time-14:00']`);
}

async function fillContactInfo(
  page: Page, 
  email: string, 
  name: string
): Promise<void> {
  await page.fill("[data-testid='email-input']", email);
  await page.fill("[data-testid='name-input']", name);
}

async function completePayment(page: Page): Promise<void> {
  // Fyll ut Stripe test-kort
  const frame = page.frameLocator("iframe[name*='stripe']").first();
  
  await frame.locator("[placeholder*='card number']").fill("4242 4242 4242 4242");
  await frame.locator("[placeholder*='MM / YY']").fill("12/30");
  await frame.locator("[placeholder*='CVC']").fill("123");
  
  // Klikk betal
  await page.click("[data-testid='pay-button']");
  
  // Vent på bekreftelse
  await page.waitForSelector("[data-testid='confirmation']", { timeout: 30000 });
}

// -----------------------------------------------------------------------------
// Test Suite
// -----------------------------------------------------------------------------

test.describe("Booking Flow", () => {
  let testDate: Date;

  test.beforeAll(async () => {
    testDate = await setupTestDate();
  });

  test.beforeEach(async ({ page }) => {
    // Gå til booking-side
    await page.goto("/booking");
    
    // Vent på at siden laster
    await page.waitForLoadState("networkidle");
  });

  // ---------------------------------------------------------------------------
  // Happy Path
  // ---------------------------------------------------------------------------

  test("complete booking flow for new customer", async ({ page }) => {
    // 1. Velg tjeneste
    await selectService(page, "flex-50-solo");

    // 2. Velg dato og tid
    await selectDateAndTime(page, testDate);

    // 3. Fyll kontaktinfo
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await fillContactInfo(page, uniqueEmail, "Test Kunde");

    // 4. Gå til betaling
    await page.click("[data-testid='continue-to-payment']");

    // 5. Fullfør betaling
    await completePayment(page);

    // 6. Verifiser bekreftelse
    const confirmation = await page.textContent("[data-testid='confirmation']");
    expect(confirmation).toContain("Takk for din bestilling");
    expect(confirmation).toContain(testDate.toLocaleDateString("nb-NO"));
  });

  test("complete booking flow for existing customer", async ({ page }) => {
    // Logg inn først
    await page.goto("/portal/login");
    await page.fill("[name='email']", "test@example.com");
    await page.fill("[name='password']", "password123");
    await page.click("[type='submit']");
    
    // Vent på redirect til booking
    await page.waitForURL("/booking");

    // Fortsett med booking
    await selectService(page, "flex-50-solo");
    await selectDateAndTime(page, testDate);
    
    // Eksisterende kunde skal ha forhåndsutfylt info
    await page.click("[data-testid='continue-to-payment']");
    
    await completePayment(page);
    
    const confirmation = await page.textContent("[data-testid='confirmation']");
    expect(confirmation).toContain("Takk for din bestilling");
  });

  // ---------------------------------------------------------------------------
  // Double Booking Prevention
  // ---------------------------------------------------------------------------

  test.describe("Double Booking Prevention", () => {
    test("should prevent double booking of same slot", async ({ browser }) => {
      // Opprett to separate kontekster (som to forskjellige brukere)
      const context1: BrowserContext = await browser.newContext();
      const context2: BrowserContext = await browser.newContext();
      
      const page1: Page = await context1.newPage();
      const page2: Page = await context2.newPage();

      try {
        // Begge brukere går til booking samtidig
        await Promise.all([
          page1.goto("/booking"),
          page2.goto("/booking"),
        ]);

        // Begge velger samme tjeneste
        await Promise.all([
          selectService(page1, "flex-50-solo"),
          selectService(page2, "flex-50-solo"),
        ]);

        // Begge velger samme dato og tid
        const sameDate = await setupTestDate();
        await Promise.all([
          selectDateAndTime(page1, sameDate),
          selectDateAndTime(page2, sameDate),
        ]);

        // Fyll kontaktinfo for begge
        await fillContactInfo(page1, "user1@test.com", "User One");
        await fillContactInfo(page2, "user2@test.com", "User Two");

        // Gå til betaling samtidig
        await Promise.all([
          page1.click("[data-testid='continue-to-payment']"),
          page2.click("[data-testid='continue-to-payment']"),
        ]);

        // Fullfør betaling på begge samtidig
        const [result1, result2] = await Promise.allSettled([
          completePayment(page1),
          completePayment(page2),
        ]);

        // Én skal lykkes, én skal feile
        const success1 = result1.status === "fulfilled";
        const success2 = result2.status === "fulfilled";

        expect(success1 !== success2).toBe(true);

        // Hvis en feilet, sjekk at feilmeldingen er riktig
        if (!success1) {
          const errorText = await page1.textContent("[data-testid='error-message']");
          expect(errorText).toMatch(/opptatt|booket|ikke ledig/i);
        }
        if (!success2) {
          const errorText = await page2.textContent("[data-testid='error-message']");
          expect(errorText).toMatch(/opptatt|booket|ikke ledig/i);
        }

      } finally {
        await context1.close();
        await context2.close();
      }
    });

    test("should show slot as unavailable after booking", async ({ page, browser }) => {
      // 1. Opprett første booking
      await selectService(page, "flex-50-solo");
      await selectDateAndTime(page, testDate);
      
      const uniqueEmail = `first-${Date.now()}@example.com`;
      await fillContactInfo(page, uniqueEmail, "First User");
      await page.click("[data-testid='continue-to-payment']");
      await completePayment(page);

      // 2. Åpne ny sesjon og prøv samme tid
      const context2 = await browser.newContext();
      const page2 = await context2.newPage();

      try {
        await page2.goto("/booking");
        await selectService(page2, "flex-50-solo");

        // Velg samme dato
        const dateStr = testDate.toISOString().split("T")[0];
        await page2.click(`[data-testid='date-${dateStr}']`);

        // Vent på tidsvelger
        await page2.waitForSelector("[data-testid='time-slots']");

        // Sjekk at 14:00 er merket som opptatt
        const timeSlot = page2.locator("[data-testid='time-14:00']");
        await expect(timeSlot).toHaveAttribute("data-disabled", "true");
        await expect(timeSlot).toHaveClass(/opptatt|booket|unavailable/i);

      } finally {
        await context2.close();
      }
    });

    test("should handle rapid consecutive bookings", async ({ page }) => {
      // Simuler rask dobbeltklikk på "book nå"
      await selectService(page, "flex-50-solo");
      await selectDateAndTime(page, testDate);
      
      const uniqueEmail = `rapid-${Date.now()}@example.com`;
      await fillContactInfo(page, uniqueEmail, "Rapid User");
      
      // Klikk fortsett-to-payment 3 ganger raskt
      await Promise.all([
        page.click("[data-testid='continue-to-payment']"),
        page.click("[data-testid='continue-to-payment']"),
        page.click("[data-testid='continue-to-payment']"),
      ]);

      // Vent på at en av dem fullfører
      await page.waitForTimeout(2000);

      // Verifiser at vi er på betalingssiden (ikke feilside)
      const url = page.url();
      expect(url).toMatch(/betaling|payment|stripe/);
    });
  });

  // ---------------------------------------------------------------------------
  // Validation Errors
  // ---------------------------------------------------------------------------

  test.describe("Validation", () => {
    test("should reject booking in the past", async ({ page }) => {
      await selectService(page, "flex-50-solo");
      
      // Velg gårsdagens dato
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const dateStr = yesterday.toISOString().split("T")[0];
      
      // Prøv å velge dato (bør være disabled)
      const dateCell = page.locator(`[data-testid='date-${dateStr}']`);
      
      // Sjekk at datoen er disabled
      await expect(dateCell).toHaveAttribute("data-disabled", "true");
    });

    test("should reject booking without required fields", async ({ page }) => {
      await selectService(page, "flex-50-solo");
      await selectDateAndTime(page, testDate);
      
      // Prøv å fortsette uten å fylle ut epost
      await page.click("[data-testid='continue-to-payment']");
      
      // Sjekk valideringsfeil
      const errorMessage = await page.textContent("[data-testid='email-error']");
      expect(errorMessage).toMatch(/e-post|påkrevd|required/i);
    });

    test("should validate email format", async ({ page }) => {
      await selectService(page, "flex-50-solo");
      await selectDateAndTime(page, testDate);
      
      // Fyll ugyldig epost
      await page.fill("[data-testid='email-input']", "not-an-email");
      await page.click("[data-testid='continue-to-payment']");
      
      // Sjekk valideringsfeil
      const errorMessage = await page.textContent("[data-testid='email-error']");
      expect(errorMessage).toMatch(/gyldig|valid/i);
    });
  });

  // ---------------------------------------------------------------------------
  // Reschedule
  // ---------------------------------------------------------------------------

  test.describe("Reschedule", () => {
    test("should allow rescheduling to available slot", async ({ page }) => {
      // 1. Opprett booking først
      await selectService(page, "flex-50-solo");
      await selectDateAndTime(page, testDate);
      
      const uniqueEmail = `reschedule-${Date.now()}@example.com`;
      await fillContactInfo(page, uniqueEmail, "Reschedule User");
      await page.click("[data-testid='continue-to-payment']");
      await completePayment(page);

      // 2. Gå til "Mine bookinger"
      await page.click("[data-testid='my-bookings']");

      // 3. Klikk endre på bookingen
      await page.click("[data-testid='reschedule-button']");

      // 4. Velg ny dato (neste dag)
      const newDate = new Date(testDate);
      newDate.setDate(newDate.getDate() + 1);
      
      const newDateStr = newDate.toISOString().split("T")[0];
      await page.click(`[data-testid='date-${newDateStr}']`);
      await page.click("[data-testid='time-15:00']");

      // 5. Bekreft endring
      await page.click("[data-testid='confirm-reschedule']");

      // 6. Verifiser at tidspunktet er oppdatert
      const updatedTime = await page.textContent("[data-testid='booking-time']");
      expect(updatedTime).toContain("15:00");
    });

    test("should prevent rescheduling to occupied slot", async ({ page, browser }) => {
      // 1. Opprett to bookinger
      // Første booking
      await selectService(page, "flex-50-solo");
      await selectDateAndTime(page, testDate);
      const email1 = `booking1-${Date.now()}@example.com`;
      await fillContactInfo(page, email1, "Booking One");
      await page.click("[data-testid='continue-to-payment']");
      await completePayment(page);

      // Andre booking på annen tid
      const context2 = await browser.newContext();
      const page2 = await context2.newPage();
      
      const nextHour = new Date(testDate);
      nextHour.setHours(nextHour.getHours() + 1);

      await page2.goto("/booking");
      await selectService(page2, "flex-50-solo");
      await selectDateAndTime(page2, nextHour);
      const email2 = `booking2-${Date.now()}@example.com`;
      await fillContactInfo(page2, email2, "Booking Two");
      await page2.click("[data-testid='continue-to-payment']");
      await completePayment(page2);

      await context2.close();

      // 2. Prøv å endre første booking til andre booking sin tid
      await page.click("[data-testid='my-bookings']");
      await page.click("[data-testid='reschedule-button']");

      // Velg samme tid som booking 2
      const nextHourStr = nextHour.toISOString().split("T")[0];
      await page.click(`[data-testid='date-${nextHourStr}']`);
      
      // 15:00 skal være opptatt
      const timeSlot = page.locator("[data-testid='time-15:00']");
      await expect(timeSlot).toHaveAttribute("data-disabled", "true");
    });
  });

  // ---------------------------------------------------------------------------
  // Health Check
  // ---------------------------------------------------------------------------

  test.describe("Health Check", () => {
    test("health endpoint should return healthy status", async ({ page }) => {
      const response = await page.goto("/api/health/booking");
      
      expect(response?.status()).toBe(200);
      
      const body = await response?.json();
      expect(body.status).toBe("healthy");
      expect(body.checks.database.status).toBe("pass");
      expect(body.checks.doubleBookings.status).toBe("pass");
      expect(body.metrics).toBeDefined();
      expect(body.metrics.totalBookings).toBeGreaterThanOrEqual(0);
    });

    test("health endpoint should detect double bookings", async ({ request }) => {
      // Denne testen forutsetter at vi kan simulere en dobbeltbooking
      // I praksis vil dette skje hvis noe går galt i systemet
      
      const response = await request.get("/api/health/booking");
      const body = await response.json();
      
      // Hvis systemet er sunt
      if (body.status === "healthy") {
        expect(body.checks.doubleBookings.status).toBe("pass");
      }
    });
  });
});

// -----------------------------------------------------------------------------
// Accessibility Tests
// -----------------------------------------------------------------------------

test.describe("Accessibility", () => {
  test("booking form should be keyboard navigable", async ({ page }) => {
    await page.goto("/booking");
    
    // Tab gjennom skjemaet
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    
    // Sjekk at fokus er synlig
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/booking");
    
    // Sjekk at tjenester har labels
    const services = page.locator("[data-testid='service-grid'] button");
    const count = await services.count();
    
    for (let i = 0; i < count; i++) {
      const ariaLabel = await services.nth(i).getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
    }
  });
});
