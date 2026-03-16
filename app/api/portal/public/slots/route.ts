import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateSlots } from "@/lib/portal/slots";
import { BookingStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const corsOrigin =
    process.env.WEBSITE_URL ?? "http://localhost:3003";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
  };

  const { searchParams } = new URL(req.url);
  const serviceTypeId = searchParams.get("serviceTypeId");
  const instructorId = searchParams.get("instructorId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  if (!serviceTypeId || !instructorId || !dateStr) {
    return NextResponse.json(
      { error: "Mangler parametere: serviceTypeId, instructorId, date" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      }
    );
  }

  // Parse dato som UTC midnatt
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
            OR: [
              { instructorId },
              { instructorId: null }, // global blocks
            ],
            startTime: { lt: nextDay },
            endTime: { gt: date },
          },
          select: { startTime: true, endTime: true },
        }),
      ]);

    if (!serviceType) {
      return NextResponse.json([], { headers: corsHeaders });
    }

    // Valider at instructoren tilbyr denne serviceType
    const instructor = await prisma.instructor.findFirst({
      where: {
        id: instructorId,
        serviceTypes: { some: { id: serviceTypeId } },
      },
      select: { id: true },
    });
    if (!instructor) {
      return NextResponse.json([], { headers: corsHeaders });
    }

    if (availabilityWindows.length === 0) {
      return NextResponse.json([], { headers: corsHeaders });
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

    // Sorter kronologisk
    allSlots.sort();

    return NextResponse.json(allSlots, { headers: corsHeaders });
  } catch (error) {
    console.error("[slots] DB error:", error);
    return NextResponse.json(
      { error: "Service unavailable" },
      {
        status: 503,
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const corsOrigin = process.env.WEBSITE_URL ?? "http://localhost:3003";
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
