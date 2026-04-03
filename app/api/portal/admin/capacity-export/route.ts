import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import { BookingStatus } from "@prisma/client";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * API-endepunkt for kapasitetseksport til Google Sheets
 *
 * GET /api/portal/admin/capacity-export
 * Authorization: Bearer {CRON_SECRET}
 */
export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  // Sjekk autorisasjon via CRON_SECRET
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Hent alle instruktorer
  const instructors = await prisma.instructor.findMany({
    include: {
      User: { select: { name: true } },
      InstructorAvailability: true,
    },
  });

  // Hent bookinger denne uken
  const weeklyBookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: weekStart, lte: weekEnd },
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
    },
    include: {
      ServiceType: { select: { price: true, duration: true } },
      Instructor: { select: { id: true } },
    },
  });

  // Beregn kapasitet per instruktor
  const coaches = instructors.map((instructor) => {
    let weeklySlots = 0;
    let maxWeeklyRevenue = 0;
    const avgPricePerHour = 1500;

    for (const avail of instructor.InstructorAvailability) {
      const startMinutes = parseInt(avail.startTime.split(":")[0]) * 60 + parseInt(avail.startTime.split(":")[1]);
      const endMinutes = parseInt(avail.endTime.split(":")[0]) * 60 + parseInt(avail.endTime.split(":")[1]);
      const slotsInWindow = Math.floor((endMinutes - startMinutes) / 50);
      weeklySlots += slotsInWindow;
      maxWeeklyRevenue += slotsInWindow * avgPricePerHour;
    }

    const bookedSlots = weeklyBookings.filter(
      (b) => b.Instructor?.id === instructor.id
    ).length;

    const weeklyRevenue = weeklyBookings
      .filter((b) => b.Instructor?.id === instructor.id)
      .reduce((sum, b) => sum + b.ServiceType.price, 0);

    return {
      name: instructor.User.name ?? "Ukjent",
      weeklySlots,
      bookedSlots,
      occupancy: weeklySlots > 0 ? Math.round((bookedSlots / weeklySlots) * 1000) / 1000 : 0,
      weeklyRevenue,
      maxWeeklyRevenue,
    };
  });

  // Daglig nedbrytning
  const dailyBreakdown = [];
  const dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    const dayOfWeek = day.getDay();
    const dayData: Record<string, { booked: number; total: number }> = {};

    for (const instructor of instructors) {
      const totalSlots = instructor.InstructorAvailability
        .filter((a: { dayOfWeek: number }) => a.dayOfWeek === dayOfWeek)
        .reduce((sum: number, a: { startTime: string; endTime: string }) => {
          const startMinutes = parseInt(a.startTime.split(":")[0]) * 60 + parseInt(a.startTime.split(":")[1]);
          const endMinutes = parseInt(a.endTime.split(":")[0]) * 60 + parseInt(a.endTime.split(":")[1]);
          return sum + Math.floor((endMinutes - startMinutes) / 50);
        }, 0);

      const bookedSlots = weeklyBookings.filter(
        (b) =>
          b.Instructor?.id === instructor.id &&
          new Date(b.startTime).toDateString() === day.toDateString()
      ).length;

      const name = instructor.User.name ?? "Ukjent";
      dayData[name] = { booked: bookedSlots, total: totalSlots };
    }

    dailyBreakdown.push({
      day: dayNames[dayOfWeek],
      ...Object.fromEntries(
        Object.entries(dayData).map(([name, data]) => [name.split(" ")[0], data])
      ),
    });
  }

  return NextResponse.json({
    generatedAt: now.toISOString(),
    weekRange: `${format(weekStart, "d. MMM", { locale: nb })} - ${format(weekEnd, "d. MMM", { locale: nb })}`,
    coaches,
    dailyBreakdown,
  });
}
