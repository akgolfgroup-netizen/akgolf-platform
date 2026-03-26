import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Logger tilgjengelige drop-in-plasser innen 48 timer.
 *
 * Selve slot-tilgangen styres av /api/coaching/slots som filtrerer
 * basert på bookingType og tidsvinduer. Denne cron-en er en
 * placeholder for fremtidig push-varsling eller cache-oppdatering.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  try {
    // Finn alle aktive slots som IKKE er reservert for junior_elite
    const openSlots = await prisma.coachingAvailability.findMany({
      where: {
        isActive: true,
        OR: [
          { reservedFor: null },
          { NOT: { reservedFor: "junior_elite" } },
        ],
      },
      select: {
        id: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        reservedFor: true,
      },
    });

    // Finn bookinger innen de neste 48 timene
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        startTime: { gte: now, lte: in48h },
      },
      select: { id: true, startTime: true, endTime: true },
    });

    const totalOpenSlots = openSlots.length;
    const totalBookings = upcomingBookings.length;

    console.log(
      `[cron/dropin] Status: ${totalOpenSlots} apne slots totalt, ${totalBookings} bookinger neste 48t`
    );

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      message: "Drop-in slot-sjekk fullfort (placeholder)",
      openSlotsTotal: totalOpenSlots,
      bookingsNext48h: totalBookings,
    });
  } catch (error) {
    console.error("[cron/dropin] Uventet feil:", error);
    return NextResponse.json(
      { error: "Intern feil i drop-in-cron" },
      { status: 500 }
    );
  }
}
