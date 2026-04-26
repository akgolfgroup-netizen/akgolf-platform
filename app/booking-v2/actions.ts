"use server";

/**
 * Booking V2 server actions.
 *
 * Disse er stubs som validerer input og returnerer mock-resultater.
 * Når Anders sier ifra, kobles de til ekte server-logikk:
 *
 * - holdSlot       → lib/portal/booking/locking.ts
 * - releaseSlot    → lib/portal/booking/locking.ts
 * - createBooking  → lib/portal/booking/conflict-check.ts + Stripe
 *                    (chargeOffSession for Flex, Checkout for ny abo,
 *                    createInvoiceForBooking for bedrift)
 * - joinWaitlist   → lib/portal/booking/waitlist.ts
 *
 * Aldri dupliser denne logikken her — importer den når wiring skjer.
 */

export interface BookingPayload {
  serviceId: string;
  trainerId: "anders" | "markus" | "any";
  date: string; // ISO date
  time: string; // HH:mm
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    handicap?: string;
    note?: string;
  };
  paymentMethod: "card" | "apple" | "gpay" | "invoice";
}

export interface BookingResult {
  ok: true;
  bookingId: string;
  // VERIFY: Stripe-handoff URL settes av createCheckoutSession i ekte impl
  checkoutUrl?: string;
}

export interface BookingError {
  ok: false;
  reason: "slot-taken" | "quota-exceeded" | "validation" | "stripe-error";
  message: string;
}

export async function createBooking(
  payload: BookingPayload
): Promise<BookingResult | BookingError> {
  // TODO: validate payload med zod
  if (!payload.customer.email || !payload.serviceId) {
    return { ok: false, reason: "validation", message: "E-post og tjeneste må fylles ut." };
  }

  // TODO: call lib/portal/booking/conflict-check.ts → kontroller at slottet er ledig
  // TODO: call lib/portal/booking/subscription-quota.ts → sjekk kvota for abonnement
  // TODO: route til riktig Stripe-helper basert på service.category og paymentMethod
  //   - abonnement → Stripe Checkout subscription-mode
  //   - flex/bane med kort → Stripe Checkout payment-mode
  //   - flex med lagret kort → lib/portal/stripe/off-session.ts chargeOffSession()
  //   - bedrift faktura → lib/portal/stripe/invoice.ts createInvoiceForBooking()

  return {
    ok: true,
    bookingId: `AK-${new Date().toISOString().slice(0, 7)}-${payload.time.replace(":", "")}`,
  };
}

export async function holdSlot(_serviceId: string, _date: string, _time: string): Promise<{ ok: boolean; expiresAt?: string }> {
  // TODO: kall lib/portal/booking/locking.ts → reserver slot i 10 min
  return { ok: true, expiresAt: new Date(Date.now() + 10 * 60_000).toISOString() };
}

export async function releaseSlot(_holdId: string): Promise<{ ok: boolean }> {
  // TODO: kall lib/portal/booking/locking.ts → frigi reservasjon
  return { ok: true };
}

export interface WaitlistPayload {
  email: string;
  phone?: string;
  preferredDay?: "any" | "weekday" | "weekend";
  preferredWindow?: "any" | "morning" | "afternoon" | "evening";
  trainerId?: "anders" | "markus" | "any";
}

export async function joinWaitlist(
  payload: WaitlistPayload
): Promise<{ ok: boolean; position?: number }> {
  if (!payload.email) {
    return { ok: false };
  }
  // TODO: kall lib/portal/booking/waitlist.ts → opprett WaitlistEntry
  return { ok: true, position: 3 };
}
