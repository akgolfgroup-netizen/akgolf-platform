import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/portal/stripe";
import { prisma } from "@/lib/portal/prisma";
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    // Return generic message — never expose SDK internals to the response
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const paymentIntentId = paymentIntent.id;

    // Atomic idempotency guard: only update bookings still in PENDING state
    const booking = await prisma.booking.findFirst({
      where: {
        stripePaymentId: paymentIntentId,
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
        `[Stripe Webhook] Already processed or not found: ${paymentIntentId}`
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
            paymentMethod: PaymentMethod.STRIPE,
            grossAmount: booking.amount,
            vatAmount: booking.vatAmount,
            vatRate,
            feeAmount: 0,
            netAmount,
            providerRef: paymentIntentId,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        }),
      ]);
      console.log(`[Stripe Webhook] Booking ${booking.id} confirmed`);

      // Send confirmation emails (non-blocking — don't fail the webhook)
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
        console.error("[Stripe Webhook] Email send failed:", err)
      );
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await prisma.booking.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
        paymentStatus: PaymentStatus.PENDING,
      },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
    console.log(
      `[Stripe Webhook] Payment failed for PaymentIntent: ${paymentIntent.id}`
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
