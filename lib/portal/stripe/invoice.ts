/**
 * Stripe Invoice for bedrifter (User.organizationNumber satt).
 *
 * Standardvalg #4: Bedrift = faktura, 14 dager forfall.
 * Standardvalg #2: MVA-fritak (idrett/undervisning, sktl § 5-9) → vatRate=0.
 *
 * Flyt:
 *   1. Hent eller opprett Stripe Customer
 *   2. Legg til invoice item for bookingen
 *   3. Opprett invoice med 14d forfall
 *   4. Send invoice til kunde
 *   5. Lagre PaymentTransaction (status PENDING til invoice.paid-webhook lander)
 */

import { stripe } from "@/lib/portal/stripe";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

const INVOICE_DAYS_UNTIL_DUE = 14;

export interface InvoiceResult {
  invoiceId: string;
  amountKr: number;
  hostedUrl: string | null;
  dueAt: Date;
}

export async function createInvoiceForBooking(bookingId: string): Promise<InvoiceResult | null> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      User: {
        select: {
          id: true,
          email: true,
          name: true,
          stripeCustomerId: true,
        },
      },
      ServiceType: { select: { id: true, name: true, price: true } },
    },
  });

  if (!booking) throw new Error(`Booking ${bookingId} not found`);
  if (!booking.User.email) {
    logger.warn(`[invoice] user ${booking.User.id} mangler email`);
    return null;
  }
  if (!booking.ServiceType?.price) {
    logger.warn(`[invoice] no price on service ${booking.ServiceType?.id}`);
    return null;
  }
  if (booking.paymentStatus === "PAID") return null;

  // Hent customer-prefs (org.nr lagres på CustomerPaymentPreference)
  const pref = await prisma.customerPaymentPreference.findUnique({
    where: { userId: booking.User.id },
    select: { orgNumber: true, companyName: true },
  });

  // Hent eller opprett Stripe Customer
  let customerId = booking.User.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: booking.User.email,
      name: pref?.companyName ?? booking.User.name ?? undefined,
      metadata: {
        userId: booking.User.id,
        orgNumber: pref?.orgNumber ?? "",
      },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: booking.User.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const amountKr = booking.ServiceType.price;
  const description = `${booking.ServiceType.name} — ${new Date(booking.startTime).toLocaleDateString("nb-NO")}`;

  // Invoice items legges på et "draft invoice"-utkast som customer har for tiden
  await stripe.invoiceItems.create({
    customer: customerId,
    amount: amountKr * 100,
    currency: "nok",
    description,
    metadata: { bookingId, userId: booking.User.id },
  });

  // Opprett invoice
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: INVOICE_DAYS_UNTIL_DUE,
    auto_advance: true,
    description: `Coaching-fakturering — ${booking.ServiceType.name}`,
    metadata: { bookingId, userId: booking.User.id },
  });

  if (!invoice.id) {
    throw new Error("Stripe returnerte invoice uten id");
  }

  // Send invoice
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
  await stripe.invoices.sendInvoice(invoice.id);

  // Lagre PaymentTransaction (PENDING til paid-webhook)
  await prisma.paymentTransaction.create({
    data: {
      id: nanoid(),
      bookingId,
      paymentMethod: "INVOICE",
      grossAmount: amountKr,
      vatAmount: 0,
      vatRate: 0,
      netAmount: amountKr,
      providerRef: invoice.id,
      status: "PENDING",
      updatedAt: new Date(),
    },
  });

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + INVOICE_DAYS_UNTIL_DUE);

  return {
    invoiceId: invoice.id,
    amountKr,
    hostedUrl: finalized.hosted_invoice_url ?? null,
    dueAt,
  };
}
