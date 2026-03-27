import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        amount: true,
        vatAmount: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        stripePaymentId: true,
        ServiceType: {
          select: { name: true, duration: true },
        },
        Instructor: {
          select: { User: { select: { name: true } } },
        },
        User: {
          select: { name: true, email: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking ikke funnet" },
        { status: 404 }
      );
    }

    // If booking has a Stripe payment intent, include clientSecret for payment page
    let clientSecret: string | null = null;
    if (
      booking.stripePaymentId &&
      booking.status === "PENDING" &&
      booking.paymentStatus === "PENDING"
    ) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          booking.stripePaymentId
        );
        clientSecret = paymentIntent.client_secret;
      } catch {
        // PaymentIntent not found or expired — ignore
      }
    }

    return NextResponse.json({
      ...booking,
      clientSecret,
    });
  } catch (error) {
    console.error("[booking/get] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
