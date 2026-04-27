/**
 * Stripe Payment Link for manuell booking på ny kunde (Fase E).
 *
 * Når en coach lager en booking på en spiller som ikke har lagret kort:
 *   - Lag en Stripe Payment Link knyttet til bookingens beløp
 *   - Send link via e-post + SMS
 *   - Kunden betaler via standard Stripe Checkout
 *   - Webhook (payment_intent.succeeded) merker bookingen som PAID
 *
 * Forskjell fra catalog.ts: Payment Link bruker eksisterende Stripe Price
 * eller lager en engang-Price for nøyaktig dette beløpet. Vi bruker
 * eksisterende `stripePriceId` fra ServiceType (etter Fase C backfill);
 * faller tilbake til ad-hoc Price hvis stripePriceId mangler.
 */

import { stripe } from "@/lib/portal/stripe";
import { logger } from "@/lib/logger";

export interface CreateBookingPaymentLinkInput {
  bookingId: string;
  serviceName: string;
  /** Beløp i kroner */
  amountKr: number;
  /** Stripe Price-ID hvis finnes (Fase C). Optional. */
  stripePriceId?: string | null;
  /** Stripe Customer-ID hvis finnes. Optional. */
  customerId?: string | null;
  /** Hvor brukeren skal sendes etter betaling */
  successUrl: string;
}

export interface BookingPaymentLink {
  url: string;
  paymentLinkId: string;
}

/**
 * Lager en Stripe Payment Link for en spesifikk booking.
 * Returnerer URL som kunden kan klikke for å betale.
 */
export async function createBookingPaymentLink(
  input: CreateBookingPaymentLinkInput,
): Promise<BookingPaymentLink> {
  let priceId = input.stripePriceId;

  // Fallback: hvis ServiceType ikke har stripePriceId (backfill ikke kjørt),
  // lag en engang-Price for dette beløpet.
  if (!priceId) {
    const product = await stripe.products.create({
      name: input.serviceName,
      metadata: { source: "akgolf-manual-booking", bookingId: input.bookingId },
    });
    const price = await stripe.prices.create({
      product: product.id,
      currency: "nok",
      unit_amount: Math.round(input.amountKr * 100),
      metadata: { bookingId: input.bookingId },
    });
    priceId = price.id;
    logger.info(
      `[payment-link] Created ad-hoc price ${price.id} for booking ${input.bookingId}`,
    );
  }

  const link = await stripe.paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      bookingId: input.bookingId,
      source: "akgolf-manual-booking",
    },
    after_completion: {
      type: "redirect",
      redirect: { url: input.successUrl },
    },
    payment_intent_data: {
      metadata: {
        bookingId: input.bookingId,
        source: "akgolf-manual-booking",
      },
    },
  });

  logger.info(
    `[payment-link] Created ${link.id} for booking ${input.bookingId}`,
  );

  return { url: link.url, paymentLinkId: link.id };
}
