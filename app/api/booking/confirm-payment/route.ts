import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { sendBookingConfirmationSms } from "@/lib/portal/sms/send-booking-sms";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Rate limiting to prevent abuse
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`confirm-payment:${clientIp}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: { bookingId?: string; paymentIntentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { bookingId, paymentIntentId } = body;
  if (!bookingId || !paymentIntentId) {
    return NextResponse.json(
      { error: "Mangler bookingId eller paymentIntentId" },
      { status: 400 }
    );
  }

  try {
    // Verifiser betaling med Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Betalingen er ikke fullført", status: paymentIntent.status },
        { status: 400 }
      );
    }

    // Sjekk at bookingId matcher metadata
    if (paymentIntent.metadata.bookingId !== bookingId) {
      return NextResponse.json(
        { error: "Booking-ID stemmer ikke med betalingen" },
        { status: 400 }
      );
    }

    // Idempotens-guard: sjekk om allerede prosessert (av webhook eller tidligere kall)
    const existingBooking = await prisma.booking.findFirst({
      where: { id: bookingId, paymentStatus: { not: PaymentStatus.PAID } },
      include: {
        ServiceType: { select: { name: true, duration: true } },
        Instructor: {
          select: { User: { select: { name: true, email: true, phone: true } } },
        },
        User: { select: { name: true, email: true } },
      },
    });

    if (!existingBooking) {
      // Allerede bekreftet av webhook — returner suksess uten å gjøre noe
      return NextResponse.json({ success: true, status: "CONFIRMED" });
    }

    // Atomisk oppdatering: booking + PaymentTransaction i én transaksjon
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          stripePaymentId: paymentIntentId,
        },
      }),
      prisma.paymentTransaction.create({
        data: {
          id: crypto.randomUUID(),
          bookingId,
          paymentMethod: existingBooking.paymentMethod,
          grossAmount: existingBooking.amount,
          vatAmount: existingBooking.vatAmount,
          vatRate: existingBooking.ServiceType
            ? Math.round((existingBooking.vatAmount / existingBooking.amount) * 100)
            : 0,
          netAmount: existingBooking.amount - existingBooking.vatAmount,
          providerRef: paymentIntentId,
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ]);

    // Send bekreftelses-e-post (non-blocking)
    if (existingBooking.User.email && existingBooking.Instructor.User.email) {
      sendBookingConfirmation({
        bookingId,
        studentName: existingBooking.User.name ?? "Kunde",
        studentEmail: existingBooking.User.email,
        instructorName: existingBooking.Instructor.User.name ?? "Instruktør",
        instructorEmail: existingBooking.Instructor.User.email,
        serviceName: existingBooking.ServiceType.name,
        startTime: existingBooking.startTime,
        duration: existingBooking.ServiceType.duration,
        amount: existingBooking.amount,
        vatAmount: existingBooking.vatAmount,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) =>
        logger.error("[confirm-payment] Email failed:", err)
      );
    }

    // Send SMS til instruktør (non-blocking)
    if (existingBooking.Instructor.User.phone) {
      sendBookingConfirmationSms({
        instructorPhone: existingBooking.Instructor.User.phone,
        instructorName: existingBooking.Instructor.User.name ?? "Instruktør",
        studentName: existingBooking.User.name ?? "Kunde",
        serviceName: existingBooking.ServiceType.name,
        startTime: existingBooking.startTime,
        duration: existingBooking.ServiceType.duration,
      }).catch((err: unknown) =>
        logger.error("[confirm-payment] SMS failed:", err)
      );
    }

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (error) {
    logger.error("[confirm-payment] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
