import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import {
  generateSlots,
  getAvailabilityForDate,
} from "@/lib/portal/slots";
import { BookingStatus } from "@prisma/client";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const dynamic = "force-dynamic";

// Anbefalte tidspunkter - maks 4 per dag
const RECOMMENDED_SLOTS = ["10:00", "13:00", "15:00", "17:00"];

interface SmartSlot {
  time: string;
  available: boolean;
  isoString?: string;
}

interface DaySlots {
  date: string;
  dayName: string;
  dayNumber: number;
  slots: SmartSlot[];
}

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`public:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }
  
  const corsOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
  };

  const { searchParams } = new URL(req.url);
  const serviceTypeId = searchParams.get("serviceTypeId");
  const instructorId = searchParams.get("instructorId");
  const weekOffset = parseInt(searchParams.get("weekOffset") || "0", 10);

  if (!serviceTypeId || !instructorId) {
    return NextResponse.json(
      { error: "Mangler parametere: serviceTypeId, instructorId" },
      { status: 400, headers: { "Access-Control-Allow-Origin": corsOrigin } }
    );
  }

  try {
    // Hent service type info
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
      select: { duration: true, bufferAfter: true, minNoticeHours: true },
    });

    if (!serviceType) {
      return NextResponse.json({ error: "Tjeneste ikke funnet" }, { status: 404, headers: corsHeaders });
    }

    // Valider at instructoren tilbyr denne serviceType
    const instructor = await prisma.instructor.findFirst({
      where: {
        id: instructorId,
        ServiceType: { some: { id: serviceTypeId } },
      },
      select: { 
        id: true,
        User: { select: { name: true } }
      },
    });

    if (!instructor) {
      return NextResponse.json({ error: "Instruktør ikke funnet" }, { status: 404, headers: corsHeaders });
    }

    // Beregn ukeperiode (mandag til søndag)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Finn mandag i denne uken (med offset)
    const currentDay = today.getDay(); // 0 = søndag, 1 = mandag, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysFromMonday + (weekOffset * 7));
    
    // Generer 7 dager
    const weekDays: DaySlots[] = [];
    const dayNames = ["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dateStr = date.toISOString().split("T")[0];
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      // Hent tilgjengelighet for denne dagen
      const [availabilityWindows, existingBookings, blockedTimes] = await Promise.all([
        getAvailabilityForDate(instructorId, date),
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

      // Generer alle slots for dagen
      let allSlots: string[] = [];
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

      // Sjekk hvilke anbefalte tidspunkter som er tilgjengelige
      const slots: SmartSlot[] = RECOMMENDED_SLOTS.map(timeStr => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const slotDate = new Date(date);
        slotDate.setHours(hours, minutes, 0, 0);
        
        // Sjekk om dette tidspunktet finnes i available slots
        const isoString = slotDate.toISOString();
        const available = allSlots.some(slot => {
          const slotDate = new Date(slot);
          return slotDate.getHours() === hours && slotDate.getMinutes() === minutes;
        });
        
        // Ikke vis tidspunkter i fortiden
        const isPast = slotDate < new Date();
        
        return {
          time: timeStr,
          available: available && !isPast,
          isoString: available ? isoString : undefined,
        };
      });

      weekDays.push({
        date: dateStr,
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        slots,
      });
    }

    return NextResponse.json({
      weekOffset,
      weekStart: weekStart.toISOString().split("T")[0],
      instructor: {
        id: instructor.id,
        name: instructor.User?.name || "Instruktør",
      },
      days: weekDays,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error("Error fetching smart slots:", error);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": corsOrigin } }
    );
  }
}

export async function OPTIONS(_req: NextRequest) {
  const corsOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
