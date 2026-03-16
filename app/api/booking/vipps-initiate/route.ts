import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { initiateVippsPayment } from "@/lib/portal/vipps";
import { BookingStatus, PaymentMethod } from "@prisma/client";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  let body: { bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { bookingId } = body;
  if (!bookingId) {
    return NextResponse.json({ error: "Mangler bookingId" }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId: user.id,
    },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      amount: true,
      serviceType: { select: { name: true } },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking ikke funnet" }, { status: 404 });
  }

  if (booking.status !== BookingStatus.PENDING) {
    return NextResponse.json(
      { error: "Booking er ikke i PENDING-status" },
      { status: 400 }
    );
  }

  if (booking.paymentMethod !== PaymentMethod.VIPPS) {
    return NextResponse.json(
      { error: "Booking er ikke satt til Vipps-betaling" },
      { status: 400 }
    );
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (!nextAuthUrl) {
    console.error("[vipps-initiate] NEXTAUTH_URL is not configured");
    return NextResponse.json({ error: "Intern konfigurasjonsfeil" }, { status: 500 });
  }

  try {
    const { url: paymentUrl } = await initiateVippsPayment({
      bookingId: booking.id,
      orderId: booking.id,
      amount: booking.amount,
      description: `AK Golf Academy — ${booking.serviceType.name}`,
      // Vipps appends /v2/payments/{orderId} to callbackPrefix automatically
      callbackUrl: `${nextAuthUrl}/api/webhooks/vipps`,
      fallbackUrl: `${nextAuthUrl}/portal/booking/${bookingId}/confirmation`,
    });

    // Persist the Vipps order ID on the booking (orderId === bookingId by convention)
    await prisma.booking.update({
      where: { id: bookingId },
      data: { vippsOrderId: bookingId },
    });

    return NextResponse.json({ paymentUrl }, { status: 200 });
  } catch (error) {
    console.error("[vipps-initiate] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke starte Vipps-betaling" },
      { status: 500 }
    );
  }
}
