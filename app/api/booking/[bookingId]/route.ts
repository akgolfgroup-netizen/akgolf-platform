import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { getPortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;

  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`booking-get:${clientIp}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  // Get authenticated user (optional for this endpoint)
  const user = await getPortalUser();

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
        studentId: true,
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

    // Only return sensitive info (email, clientSecret) if user owns the booking or is staff
    const isOwner = user?.id === booking.studentId;
    const isStaff = user?.role === "ADMIN" || user?.role === "INSTRUCTOR";

    // Strip sensitive data for unauthenticated users
    const safeBooking = {
      id: booking.id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      amount: booking.amount,
      vatAmount: booking.vatAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      ServiceType: booking.ServiceType,
      Instructor: booking.Instructor,
      // Only include user info and clientSecret for owner/staff
      User: isOwner || isStaff ? booking.User : { name: booking.User.name },
      clientSecret: isOwner || isStaff ? clientSecret : null,
    };

    return NextResponse.json(safeBooking);
  } catch (error) {
    logger.error("[booking/get] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
