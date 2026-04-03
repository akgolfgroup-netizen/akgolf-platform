import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

interface Participant {
  name: string;
  email: string;
  phone?: string;
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(req)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Ikke innlogget" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      serviceTypeId,
      instructorId,
      startTime,
      participants,
      paymentMethod = "STRIPE",
    } = body as {
      serviceTypeId: string;
      instructorId: string;
      startTime: string;
      participants: Participant[];
      paymentMethod?: "STRIPE" | "VIPPS";
    };

    if (!serviceTypeId || !instructorId || !startTime) {
      return NextResponse.json(
        { error: "Mangler obligatoriske felter" },
        { status: 400 }
      );
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: "Minst én deltaker er påkrevd" },
        { status: 400 }
      );
    }

    // Validate participant data
    for (const p of participants) {
      if (!p.name || !p.email) {
        return NextResponse.json(
          { error: "Alle deltakere må ha navn og e-post" },
          { status: 400 }
        );
      }
    }

    // Fetch service type
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
      select: {
        duration: true,
        price: true,
        vatRate: true,
        maxStudents: true,
      },
    });

    if (!serviceType) {
      return NextResponse.json(
        { error: "Tjeneste ikke funnet" },
        { status: 404 }
      );
    }

    if (serviceType.maxStudents <= 1) {
      return NextResponse.json(
        { error: "Denne tjenesten støtter ikke gruppebooking" },
        { status: 400 }
      );
    }

    if (participants.length > serviceType.maxStudents) {
      return NextResponse.json(
        { error: `Maks ${serviceType.maxStudents} deltakere for denne tjenesten` },
        { status: 400 }
      );
    }

    // Check remaining capacity and create booking atomically
    const start = new Date(startTime);
    const end = addMinutes(start, serviceType.duration);
    const vatAmount = Math.round((serviceType.price * serviceType.vatRate) / 100);

    const booking = await prisma.$transaction(async (tx) => {
      const existingBookingsCount = await tx.booking.count({
        where: {
          instructorId,
          serviceTypeId,
          startTime: start,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
      });

      const remainingSpots = serviceType.maxStudents - existingBookingsCount;
      if (remainingSpots < 1) {
        throw new Error("CAPACITY_FULL");
      }

      return tx.booking.create({
        data: {
          id: nanoid(),
          studentId: user.id,
          instructorId,
          serviceTypeId,
          startTime: start,
          endTime: end,
          status: BookingStatus.CONFIRMED,
          paymentMethod: paymentMethod === "VIPPS" ? PaymentMethod.VIPPS : PaymentMethod.STRIPE,
          paymentStatus: PaymentStatus.PENDING,
          amount: serviceType.price,
          vatAmount,
          isGroupBooking: true,
          updatedAt: new Date(),
          GroupParticipant: {
            create: participants.map((p: Participant) => ({
              id: nanoid(),
              name: p.name,
              email: p.email,
              phone: p.phone ?? null,
            })),
          },
        },
        select: {
          id: true,
        },
      });
    });

    return NextResponse.json({
      bookingId: booking.id,
      message: "Gruppebooking opprettet",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CAPACITY_FULL") {
      return NextResponse.json(
        { error: "Ingen ledige plasser for dette tidspunktet" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Noe gikk galt. Prøv igjen." },
      { status: 500 }
    );
  }
}
