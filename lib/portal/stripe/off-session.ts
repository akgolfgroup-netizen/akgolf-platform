/**
 * Stripe off-session trekk for Flex-økter.
 *
 * Når en Booking er COMPLETED og:
 *   - Tjenesten er Flex (ikke abonnement)
 *   - Brukeren har lagret betalingsmetode (PaymentMethod på Stripe Customer)
 *
 * → Trekk automatisk via PaymentIntent { off_session: true, confirm: true }.
 *
 * For bedrifter (User.organizationNumber satt) → bruk faktura i stedet.
 *
 * Standardvalg:
 *  - Bare for tjenester der ServiceType.billingMode = "PAY_PER_SESSION"
 *    (eller fallback: ikke knyttet til en aktiv UserSubscription)
 *  - Beløp = ServiceType.priceKr * 100 (Stripe forventer øre)
 */

import { stripe } from "@/lib/portal/stripe";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

export interface ChargeResult {
  chargedKr: number;
  paymentIntentId: string;
  status: "succeeded" | "requires_action" | "failed";
}

/**
 * Forsøk auto-trekk for en fullført Flex-booking.
 *
 * Returnerer null hvis:
 *  - Bookingen er knyttet til et aktivt abonnement (kvota dekker)
 *  - Brukeren mangler Stripe Customer eller PaymentMethod
 *  - Bookingen allerede er betalt
 */
export async function chargeOffSession(bookingId: string): Promise<ChargeResult | null> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      User: {
        select: {
          id: true,
          email: true,
          stripeCustomerId: true,
        },
      },
      ServiceType: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });

  if (!booking) throw new Error(`Booking ${bookingId} not found`);
  if (booking.paymentStatus === "PAID") return null;
  if (!booking.User.stripeCustomerId) {
    logger.info(`[off-session] no stripe customer for user ${booking.User.id}`);
    return null;
  }
  if (!booking.ServiceType?.price) {
    logger.warn(`[off-session] no price on service ${booking.ServiceType?.id}`);
    return null;
  }

  // Sjekk: er bookingen dekket av abonnement-kvota?
  const activeSub = await prisma.userSubscription.findFirst({
    where: {
      userId: booking.User.id,
      status: "ACTIVE",
    },
    select: { id: true },
  });
  if (activeSub) {
    // Abonnement dekker — ingen separat trekk
    return null;
  }

  // Hent default PaymentMethod
  const customer = await stripe.customers.retrieve(booking.User.stripeCustomerId);
  if (customer.deleted) {
    logger.warn(`[off-session] stripe customer deleted: ${booking.User.stripeCustomerId}`);
    return null;
  }
  const defaultPm =
    typeof customer.invoice_settings?.default_payment_method === "string"
      ? customer.invoice_settings.default_payment_method
      : customer.invoice_settings?.default_payment_method?.id;

  if (!defaultPm) {
    logger.info(`[off-session] no default payment method for ${booking.User.email}`);
    return null;
  }

  // Trekk via PaymentIntent off-session
  const amountKr = booking.ServiceType.price;
  const intent = await stripe.paymentIntents.create({
    amount: amountKr * 100, // øre
    currency: "nok",
    customer: booking.User.stripeCustomerId,
    payment_method: defaultPm,
    off_session: true,
    confirm: true,
    description: `${booking.ServiceType.name} — ${new Date(booking.startTime).toLocaleDateString("nb-NO")}`,
    metadata: {
      bookingId: booking.id,
      userId: booking.User.id,
      source: "off-session-auto",
    },
  });

  // Lagre i PaymentTransaction (uavhengig av webhook-bekreftelse for redundans)
  // Standardvalg #2: MVA-fritak på coaching → vatAmount=0, vatRate=0
  await prisma.paymentTransaction.create({
    data: {
      id: nanoid(),
      bookingId: booking.id,
      paymentMethod: "STRIPE",
      grossAmount: amountKr,
      vatAmount: 0,
      vatRate: 0,
      netAmount: amountKr,
      providerRef: intent.id,
      status: intent.status === "succeeded" ? "PAID" : "PENDING",
      paidAt: intent.status === "succeeded" ? new Date() : null,
      updatedAt: new Date(),
    },
  });

  // Oppdater booking
  if (intent.status === "succeeded") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: "PAID", stripePaymentId: intent.id },
    });
  }

  return {
    chargedKr: amountKr,
    paymentIntentId: intent.id,
    status: intent.status as "succeeded" | "requires_action" | "failed",
  };
}
