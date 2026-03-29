import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { sendBookingConfirmationSms } from "@/lib/portal/sms/send-booking-sms";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

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

    // Oppdater booking til CONFIRMED
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        stripePaymentId: paymentIntentId,
      },
      include: {
        ServiceType: { select: { name: true, duration: true } },
        Instructor: {
          select: { User: { select: { name: true, email: true, phone: true } } },
        },
        User: { select: { name: true, email: true } },
      },
    });

    // Opprett betalingstransaksjon
    await prisma.paymentTransaction.create({
      data: {
        id: crypto.randomUUID(),
        bookingId,
        paymentMethod: booking.paymentMethod,
        grossAmount: booking.amount,
        vatAmount: booking.vatAmount,
        vatRate: booking.ServiceType
          ? Math.round((booking.vatAmount / booking.amount) * 100)
          : 0,
        netAmount: booking.amount - booking.vatAmount,
        providerRef: paymentIntentId,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send bekreftelses-e-post (non-blocking)
    if (booking.User.email && booking.Instructor.User.email) {
      sendBookingConfirmation({
        bookingId,
        studentName: booking.User.name ?? "Kunde",
        studentEmail: booking.User.email,
        instructorName: booking.Instructor.User.name ?? "Instruktør",
        instructorEmail: booking.Instructor.User.email,
        serviceName: booking.ServiceType.name,
        startTime: booking.startTime,
        duration: booking.ServiceType.duration,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) =>
        console.error("[confirm-payment] Email failed:", err)
      );
    }

    // Send SMS til instruktør (non-blocking)
    if (booking.Instructor.User.phone) {
      sendBookingConfirmationSms({
        instructorPhone: booking.Instructor.User.phone,
        instructorName: booking.Instructor.User.name ?? "Instruktør",
        studentName: booking.User.name ?? "Kunde",
        serviceName: booking.ServiceType.name,
        startTime: booking.startTime,
        duration: booking.ServiceType.duration,
      }).catch((err: unknown) =>
        console.error("[confirm-payment] SMS failed:", err)
      );
    }

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (error) {
    console.error("[confirm-payment] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
