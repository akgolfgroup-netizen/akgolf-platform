import { prisma } from "@/lib/portal/prisma";

/**
 * Invoice generation stub for AK Golf Portal.
 *
 * Currently creates a PaymentTransaction with INVOICE method and logs the
 * invoice details. In the future, this can be extended to generate a PDF,
 * integrate with an accounting system (e.g., Fiken, Tripletex), or send
 * the invoice via email.
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
}

/**
 * Generate an invoice for a booking.
 *
 * For now this creates a PaymentTransaction with INVOICE method and stores
 * the invoiceId on the booking. A real implementation would generate a PDF
 * and/or push to an external accounting system.
 *
 * @param booking  - Booking data including service type and student
 * @param customer - Customer payment preference (company details if business)
 * @returns The generated invoice record
 */
export async function generateInvoice(
  booking: InvoiceBooking,
  customer: InvoiceCustomer
): Promise<GeneratedInvoice> {
  // Generate a human-readable invoice ID
  const dateStr = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const seq = Math.floor(Math.random() * 9000) + 1000;
  const invoiceId = `INV-${dateStr}-${seq}`;

  console.log(`[Invoice] Generating invoice ${invoiceId} for booking ${booking.id}`);
  console.log(`[Invoice] Customer: ${customer.customerType}`, {
    companyName: customer.companyName,
    orgNumber: customer.orgNumber,
    invoiceEmail: customer.invoiceEmail,
  });
  console.log(
    `[Invoice] Amount: ${booking.amount} oere (VAT: ${booking.vatAmount} oere, rate: ${booking.serviceType.vatRate}%)`
  );

  // Create PaymentTransaction record
  const transaction = await prisma.paymentTransaction.create({
    data: {
      bookingId: booking.id,
      paymentMethod: "INVOICE",
      grossAmount: booking.amount,
      vatAmount: booking.vatAmount,
      vatRate: booking.serviceType.vatRate,
      netAmount: booking.amount - booking.vatAmount,
      providerRef: invoiceId,
      status: "PENDING",
    },
  });

  // Store invoiceId on the booking
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      invoiceId,
      paymentMethod: "INVOICE",
      paymentStatus: "PENDING",
    },
  });

  console.log(
    `[Invoice] Invoice ${invoiceId} created — transaction ${transaction.id}`
  );

  // TODO: In production, generate PDF and/or send to accounting system
  // TODO: Send invoice email to customer.invoiceEmail or booking.student.email

  return {
    invoiceId,
    transactionId: transaction.id,
    bookingId: booking.id,
    amount: booking.amount,
    vatAmount: booking.vatAmount,
  };
}
