import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";

export async function POST(req: NextRequest) {
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
        serviceType: { select: { name: true, duration: true } },
        instructor: {
          select: { user: { select: { name: true, email: true } } },
        },
        student: { select: { name: true, email: true } },
      },
    });

    // Opprett betalingstransaksjon
    await prisma.paymentTransaction.create({
      data: {
        bookingId,
        paymentMethod: booking.paymentMethod,
        grossAmount: booking.amount,
        vatAmount: booking.vatAmount,
        vatRate: booking.serviceType
          ? Math.round((booking.vatAmount / booking.amount) * 100)
          : 0,
        netAmount: booking.amount - booking.vatAmount,
        providerRef: paymentIntentId,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });

    // Send bekreftelses-e-post (non-blocking)
    if (booking.student.email && booking.instructor.user.email) {
      sendBookingConfirmation({
        bookingId,
        studentName: booking.student.name ?? "Kunde",
        studentEmail: booking.student.email,
        instructorName: booking.instructor.user.name ?? "Instruktør",
        instructorEmail: booking.instructor.user.email,
        serviceName: booking.serviceType.name,
        startTime: booking.startTime,
        duration: booking.serviceType.duration,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) =>
        console.error("[confirm-payment] Email failed:", err)
      );
    }

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (error) {
    console.error("[confirm-payment] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
