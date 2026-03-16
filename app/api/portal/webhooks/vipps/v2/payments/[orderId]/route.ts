import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getVippsPaymentDetails } from "@/lib/portal/vipps";
import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";

export const dynamic = "force-dynamic";

// Vipps eCommerce v2 POSTs callbacks to {callbackPrefix}/v2/payments/{orderId}
// Body: { merchantSerialNumber, orderId, transactionInfo: { status, amount, timeStamp } }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  if (!orderId) {
    // Always return 200 to Vipps — they require it even on invalid requests
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }

  try {
    // Server-side verification: fetch actual payment status from Vipps
    // This prevents spoofed callbacks from triggering booking confirmation
    const details = await getVippsPaymentDetails(orderId);
    const status = details.transactionInfo?.status?.toUpperCase();

    if (status === "RESERVE" || status === "CAPTURED" || status === "SALE") {
      // Idempotency guard: find booking that has not yet been paid
      const booking = await prisma.booking.findFirst({
        where: {
          id: orderId,
          paymentStatus: { not: PaymentStatus.PAID },
        },
        select: {
          id: true,
          amount: true,
          vatAmount: true,
          startTime: true,
          serviceType: { select: { name: true, duration: true, vatRate: true } },
          student: { select: { name: true, email: true } },
          instructor: {
            select: {
              user: { select: { name: true, email: true } },
            },
          },
          location: { select: { name: true } },
        },
      });

      if (!booking) {
        console.log(
          `[Vipps Webhook] Already processed or not found: ${orderId}`
        );
      } else {
        const vatRate = booking.serviceType?.vatRate ?? 25;
        const netAmount = booking.amount - booking.vatAmount;

        await prisma.$transaction([
          prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: BookingStatus.CONFIRMED,
              paymentStatus: PaymentStatus.PAID,
            },
          }),
          prisma.paymentTransaction.create({
            data: {
              bookingId: booking.id,
              paymentMethod: PaymentMethod.VIPPS,
              grossAmount: booking.amount,
              vatAmount: booking.vatAmount,
              vatRate,
              feeAmount: 0,
              netAmount,
              providerRef: orderId,
              status: PaymentStatus.PAID,
              paidAt: new Date(),
            },
          }),
        ]);
        console.log(`[Vipps Webhook] Booking ${booking.id} confirmed`);

        // Send confirmation emails (non-blocking)
        sendBookingConfirmation({
          bookingId: booking.id,
          studentName: booking.student?.name ?? "Golfer",
          studentEmail: booking.student?.email ?? "",
          instructorName: booking.instructor?.user?.name ?? "Trener",
          instructorEmail: booking.instructor?.user?.email ?? "",
          serviceName: booking.serviceType?.name ?? "Coaching",
          startTime: booking.startTime,
          duration: booking.serviceType?.duration ?? 60,
          amount: booking.amount,
          vatAmount: booking.vatAmount,
          location: booking.location?.name ?? "Gamle Fredrikstad Golfklubb",
        }).catch((err) =>
          console.error("[Vipps Webhook] Email send failed:", err)
        );
      }
    } else {
      // VOID / CANCELLED / REJECTED or unrecognised — log for observability
      console.log(
        `[Vipps Webhook] Non-confirming status for ${orderId}: ${status}`
      );
    }
  } catch (error) {
    // Log but still return 200 — Vipps requires it even on internal errors
    console.error("[Vipps Webhook] Error processing payment:", error);
  }

  // Always return 200 to Vipps
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
