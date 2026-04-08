import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookingStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { invalidateSlotsCache, invalidateBookingsCache } from "@/lib/portal/booking/cache";
import { broadcastUpdate } from "@/app/api/portal/bookings/live/route";
import { logger } from "@/lib/logger";
import { notifyNewBooking, notifyBookingConfirmed } from "@/lib/portal/notifications/triggers";

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
      // Sjekk for eksisterende bookinger med overlappende tid
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

      // Sjekk for blokkerte tider
      const blocked = await tx.blockedTime.findFirst({
        where: {
          OR: [{ instructorId }, { instructorId: null }],
          AND: [
            { startTime: { lt: end } },
            { endTime: { gt: start } },
          ],
        },
      });

      if (blocked) {
        throw new Error("TIME_BLOCKED");
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
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000,
      timeout: 10000,
    });

    // Invalider cache og broadcast oppdatering
    const dateStr = start.toISOString().split("T")[0];
    
    await Promise.all([
      invalidateSlotsCache(instructorId, dateStr),
      invalidateBookingsCache(instructorId),
      broadcastUpdate(instructorId, dateStr, "BOOKING_CREATED", {
        bookingId: booking.id,
        startTime: start.toISOString(),
      }),
    ]);

    // Send notifikasjoner
    const fullBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        User: { select: { name: true, email: true } },
        ServiceType: { select: { name: true, duration: true } },
        Instructor: { select: { User: { select: { name: true } } } },
        Location: { select: { name: true } },
      },
    });

    if (fullBooking) {
      notifyBookingConfirmed(fullBooking).catch(console.error);
      notifyNewBooking(fullBooking).catch(console.error);
    }

    logger.info(`[create-group] Created group booking ${booking.id} for instructor ${instructorId}`);

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
    if (error instanceof Error && error.message === "TIME_BLOCKED") {
      return NextResponse.json(
        { error: "Tidspunktet er ikke lenger tilgjengelig" },
        { status: 409 }
      );
    }
    logger.error("[create-group] Error:", error);
    return NextResponse.json(
      { error: "Noe gikk galt. Prøv igjen." },
      { status: 500 }
    );
  }
}
