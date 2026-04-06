import { randomUUID } from "crypto";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";

/**
 * Invoice generation via Stripe Invoicing.
 *
 * Creates a Stripe Invoice for the booking, which handles:
 * - Professional PDF generation
 * - Email delivery to customer
 * - Payment tracking and reminders
 * - MVA/tax calculation
 */

export interface InvoiceBooking {
  id: string;
  amount: number;
  vatAmount: number;
  serviceType: {
    name: string;
    vatRate: number;
  };
  student: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface InvoiceCustomer {
  customerType: "PRIVATE" | "BUSINESS";
  companyName?: string | null;
  orgNumber?: string | null;
  invoiceEmail?: string | null;
  invoiceAddress?: string | null;
}

export interface GeneratedInvoice {
  invoiceId: string;
  transactionId: string;
  bookingId: string;
  amount: number;
  vatAmount: number;
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
}

/**
 * Generate and send an invoice for a booking via Stripe.
 */
export async function generateInvoice(
  booking: InvoiceBooking,
  customer: InvoiceCustomer
): Promise<GeneratedInvoice> {
  const dateStr = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const seq = Math.floor(Math.random() * 9000) + 1000;
  const invoiceId = `INV-${dateStr}-${seq}`;

  logger.info(`[Invoice] Generating invoice ${invoiceId} for booking ${booking.id}`);

  // Find or create Stripe customer
  const user = await prisma.user.findUnique({
    where: { id: booking.student.id },
    select: { stripeCustomerId: true },
  });

  let stripeCustomerId = user?.stripeCustomerId;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: customer.invoiceEmail ?? booking.student.email ?? undefined,
      name:
        customer.customerType === "BUSINESS"
          ? customer.companyName ?? booking.student.name ?? undefined
          : booking.student.name ?? undefined,
      metadata: {
        userId: booking.student.id,
        customerType: customer.customerType,
        ...(customer.orgNumber && { orgNumber: customer.orgNumber }),
      },
    });
    stripeCustomerId = stripeCustomer.id;

    await prisma.user.update({
      where: { id: booking.student.id },
      data: { stripeCustomerId },
    });
  }

  // Create Stripe Invoice
  const netAmount = booking.amount - booking.vatAmount;

  const stripeInvoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    collection_method: "send_invoice",
    days_until_due: 14,
    metadata: {
      bookingId: booking.id,
      invoiceId,
    },
  });

  // Add line item (amount in øre for Stripe)
  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    invoice: stripeInvoice.id,
    amount: netAmount * 100,
    currency: "nok",
    description: booking.serviceType.name,
    metadata: { bookingId: booking.id },
    tax_rates: [], // MVA handled via Stripe Tax or manual rate
  });

  // If there's VAT, add as separate line
  if (booking.vatAmount > 0) {
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      invoice: stripeInvoice.id,
      amount: booking.vatAmount * 100,
      currency: "nok",
      description: `MVA ${booking.serviceType.vatRate}%`,
      metadata: { bookingId: booking.id },
    });
  }

  // Finalize and send
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
  await stripe.invoices.sendInvoice(stripeInvoice.id);

  logger.info(
    `[Invoice] Stripe invoice ${stripeInvoice.id} sent to ${customer.invoiceEmail ?? booking.student.email}`
  );

  // Create PaymentTransaction record
  const transaction = await prisma.paymentTransaction.create({
    data: {
      id: randomUUID(),
      bookingId: booking.id,
      paymentMethod: "INVOICE",
      grossAmount: booking.amount,
      vatAmount: booking.vatAmount,
      vatRate: booking.serviceType.vatRate,
      netAmount,
      providerRef: stripeInvoice.id,
      status: "PENDING",
      updatedAt: new Date(),
    },
  });

  // Store invoiceId on the booking
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      invoiceId,
      paymentMethod: "INVOICE",
      paymentStatus: "PENDING",
      stripePaymentId: stripeInvoice.id,
    },
  });

  logger.info(`[Invoice] Invoice ${invoiceId} created — transaction ${transaction.id}`);

  return {
    invoiceId,
    transactionId: transaction.id,
    bookingId: booking.id,
    amount: booking.amount,
    vatAmount: booking.vatAmount,
    stripeInvoiceId: stripeInvoice.id,
    stripeInvoiceUrl: finalizedInvoice.hosted_invoice_url ?? undefined,
  };
}
