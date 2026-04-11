import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { invalidateSlotsCache, invalidateBookingsCache } from "@/lib/portal/booking/cache";
import { broadcastUpdate } from "@/app/api/portal/bookings/live/route";
import { logger } from "@/lib/logger";
import { notifyNewBooking, notifyBookingConfirmed } from "@/lib/portal/notifications/triggers";
import { Prisma } from "@prisma/client";
import { checkUserQuota, checkWeeklyLimit } from "@/lib/portal/booking/subscription-quota";

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

    for (const p of participants) {
      if (!p.name || !p.email) {
        return NextResponse.json(
          { error: "Alle deltakere må ha navn og e-post" },
          { status: 400 }
        );
      }
    }

    // Hent service type utenfor transaksjon (immutable referansedata)
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
      select: { duration: true, price: true, vatRate: true, maxStudents: true },
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

    // Sjekk per-uke grense for abonnementbrukere
    const quotaCheck = await checkUserQuota(user.id);
    if (quotaCheck.hasQuota) {
      const weeklyError = await checkWeeklyLimit(user.id, quotaCheck.tier);
      if (weeklyError) {
        return NextResponse.json({ error: weeklyError }, { status: 400 });
      }
    }

    const start = new Date(startTime);
    const end = addMinutes(start, serviceType.duration);
    const vatAmount = Math.round((serviceType.price * serviceType.vatRate) / 100);
    const bookingId = nanoid();

    // Pessimistisk lås via Prisma $transaction + FOR UPDATE
    const booking = await prisma.$transaction(async (tx) => {
      // Lås eksisterende bookinger for dette tidspunktet med FOR UPDATE
      const existingCount = await tx.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "Booking"
        WHERE "instructorId" = ${instructorId}
          AND "serviceTypeId" = ${serviceTypeId}
          AND "startTime" = ${start}
          AND "status" IN ('PENDING', 'CONFIRMED')
        FOR UPDATE
      `;

      const count = Number(existingCount[0].count);
      if (count >= serviceType.maxStudents) {
        throw new Error("CAPACITY_FULL");
      }

      // Sjekk blokkerte tider
      const blockedCount = await tx.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "BlockedTime"
        WHERE ("instructorId" = ${instructorId} OR "instructorId" IS NULL)
          AND "startTime" < ${end}
          AND "endTime" > ${start}
      `;

      if (Number(blockedCount[0].count) > 0) {
        throw new Error("TIME_BLOCKED");
      }

      // Opprett booking i samme transaksjon
      const newBooking = await tx.booking.create({
        data: {
          id: bookingId,
          studentId: user.id,
          instructorId,
          serviceTypeId,
          startTime: start,
          endTime: end,
          status: "CONFIRMED",
          paymentMethod: paymentMethod === "VIPPS" ? "VIPPS" : "STRIPE",
          paymentStatus: "PENDING",
          amount: serviceType.price,
          vatAmount,
          isGroupBooking: true,
          updatedAt: new Date(),
        },
      });

      // Opprett deltakere i samme transaksjon
      await tx.groupParticipant.createMany({
        data: participants.map((p: Participant) => ({
          id: nanoid(),
          bookingId,
          name: p.name,
          email: p.email,
          phone: p.phone ?? null,
        })),
      });

      return newBooking;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
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
    const supabase = await createServerSupabase();
    const { data: fullBooking, error: fullBookingError } = await supabase
      .from("Booking")
      .select(`
        *,
        User (
          name,
          email
        ),
        ServiceType (
          name,
          duration
        ),
        Instructor (
          User (
            name
          )
        ),
        Location (
          name
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fullBooking && !fullBookingError) {
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
