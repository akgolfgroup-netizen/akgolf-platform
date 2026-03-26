import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateSlots } from "@/lib/portal/slots";
import { BookingStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceTypeId = searchParams.get("serviceTypeId");
  const instructorId = searchParams.get("instructorId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  if (!serviceTypeId || !instructorId || !dateStr) {
    return NextResponse.json(
      { error: "Mangler parametere: serviceTypeId, instructorId, date" },
      { status: 400 }
    );
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const dayOfWeek = date.getUTCDay();
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));

  try {
    const [serviceType, availabilityWindows, existingBookings, blockedTimes] =
      await Promise.all([
        prisma.serviceType.findUnique({
          where: { id: serviceTypeId },
          select: { duration: true, bufferAfter: true, minNoticeHours: true },
        }),
        prisma.instructorAvailability.findMany({
          where: { instructorId, dayOfWeek },
        }),
        prisma.booking.findMany({
          where: {
            instructorId,
            startTime: { gte: date, lt: nextDay },
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          },
          select: { startTime: true, endTime: true },
        }),
        prisma.blockedTime.findMany({
          where: {
            OR: [{ instructorId }, { instructorId: null }],
            startTime: { lt: nextDay },
            endTime: { gt: date },
          },
          select: { startTime: true, endTime: true },
        }),
      ]);

    if (!serviceType) {
      return NextResponse.json([]);
    }

    // Valider at instruktøren tilbyr denne tjenesten
    const instructor = await prisma.instructor.findFirst({
      where: {
        id: instructorId,
        serviceTypes: { some: { id: serviceTypeId } },
      },
      select: { id: true },
    });
    if (!instructor) {
      return NextResponse.json([]);
    }

    if (availabilityWindows.length === 0) {
      return NextResponse.json([]);
    }

    const allSlots: string[] = [];
    for (const window of availabilityWindows) {
      const windowSlots = generateSlots({
        availStart: window.startTime,
        availEnd: window.endTime,
        duration: serviceType.duration,
        bufferAfter: serviceType.bufferAfter,
        date,
        existingBookings,
        blockedTimes,
        minNoticeHours: serviceType.minNoticeHours,
      });
      allSlots.push(...windowSlots);
    }

    allSlots.sort();

    return NextResponse.json(allSlots, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[booking/slots] DB error:", error);
    return NextResponse.json(
      { error: "Tjeneste utilgjengelig" },
      { status: 503 }
    );
  }
}
