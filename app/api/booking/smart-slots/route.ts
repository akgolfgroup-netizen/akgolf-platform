import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
  month: string;
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
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hent service type info
    const { data: serviceType, error: serviceError } = await supabase
      .from("ServiceType")
      .select("duration, bufferAfter, minNoticeHours")
      .eq("id", serviceTypeId)
      .single();

    if (serviceError || !serviceType) {
      return NextResponse.json({ error: "Tjeneste ikke funnet" }, { status: 404, headers: corsHeaders });
    }

    // Valider at instructoren tilbyr denne serviceType
    const { data: instructor, error: instructorError } = await supabase
      .from("Instructor")
      .select(`
        id,
        User(name)
      `)
      .eq("id", instructorId)
      .single();

    if (instructorError || !instructor) {
      return NextResponse.json({ error: "Instruktør ikke funnet" }, { status: 404, headers: corsHeaders });
    }

    // Sjekk om instructor har serviceType
    const { data: instructorServiceType } = await supabase
      .from("_InstructorToServiceType")
      .select("A")
      .eq("A", instructorId)
      .eq("B", serviceTypeId)
      .single();

    if (!instructorServiceType) {
      return NextResponse.json({ error: "Instruktør tilbyr ikke denne tjenesten" }, { status: 404, headers: corsHeaders });
    }

    // Beregn ukeperiode (mandag til søndag)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentDay = today.getDay();
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
      const dayOfWeek = date.getDay(); // 0 = søndag, 1 = mandag, etc.
      const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // 1-7 (man-søn)
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      // Hent tilgjengelighet for denne dagen (fra InstructorAvailability)
      const { data: availabilityWindows } = await supabase
        .from("InstructorAvailability")
        .select("startTime, endTime")
        .eq("instructorId", instructorId)
        .eq("dayOfWeek", dayOfWeek);

      // Hent eksisterende bookinger
      const { data: existingBookings } = await supabase
        .from("Booking")
        .select("startTime, endTime")
        .eq("instructorId", instructorId)
        .gte("startTime", date.toISOString())
        .lt("startTime", nextDay.toISOString())
        .in("status", ["PENDING", "CONFIRMED"]);

      // Hent blokkerte tider
      const { data: blockedTimes } = await supabase
        .from("BlockedTime")
        .select("startTime, endTime")
        .or(`instructorId.eq.${instructorId},instructorId.is.null`)
        .lt("startTime", nextDay.toISOString())
        .gt("endTime", date.toISOString());

      // Generer alle slots for dagen
      let allSlots: string[] = [];
      
      // Default tilgjengelighet: 10:00-18:00 på hverdager (man-fre), 10:00-14:00 på lør, ingen på søn
      let windowsToUse = availabilityWindows;
      if (!availabilityWindows || availabilityWindows.length === 0) {
        const dayOfWeekAdjusted = dayOfWeek === 0 ? 7 : dayOfWeek; // 1=man, 7=søn
        if (dayOfWeekAdjusted >= 1 && dayOfWeekAdjusted <= 5) {
          // Mandag-fredag: 10:00-18:00
          windowsToUse = [{ startTime: "10:00", endTime: "18:00" }];
        } else if (dayOfWeekAdjusted === 6) {
          // Lørdag: 10:00-14:00
          windowsToUse = [{ startTime: "10:00", endTime: "14:00" }];
        }
        // Søndag: ingen tilgjengelighet
      }
      
      if (windowsToUse && windowsToUse.length > 0) {
        for (const window of windowsToUse) {
          // InstructorAvailability lagrer tid som "HH:MM" string
          const [startH, startM] = window.startTime.split(':').map(Number);
          const [endH, endM] = window.endTime.split(':').map(Number);
          
          const windowStart = new Date(date);
          windowStart.setHours(startH, startM, 0, 0);
          const windowEnd = new Date(date);
          windowEnd.setHours(endH, endM, 0, 0);
          
          let currentSlot = new Date(windowStart);
          while (currentSlot < windowEnd) {
            const slotEnd = new Date(currentSlot);
            slotEnd.setMinutes(slotEnd.getMinutes() + serviceType.duration);
            
            // Sjekk om slot er innenfor vinduet
            if (slotEnd <= windowEnd) {
              // Sjekk om slot overlapper med eksisterende bookinger
              const isBooked = existingBookings?.some(booking => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                return currentSlot < bookingEnd && slotEnd > bookingStart;
              });
              
              // Sjekk om slot overlapper med blokkerte tider
              const isBlocked = blockedTimes?.some(blocked => {
                const blockedStart = new Date(blocked.startTime);
                const blockedEnd = new Date(blocked.endTime);
                return currentSlot < blockedEnd && slotEnd > blockedStart;
              });
              
              // Sjekk min notice
              const minNoticeMs = (serviceType.minNoticeHours || 24) * 60 * 60 * 1000;
              const isTooSoon = new Date(currentSlot.getTime() - minNoticeMs) < new Date();
              
              if (!isBooked && !isBlocked && !isTooSoon) {
                allSlots.push(currentSlot.toISOString());
              }
            }
            
            // Neste slot (30 min intervaller)
            currentSlot.setMinutes(currentSlot.getMinutes() + 30);
          }
        }
      }
      
      allSlots.sort();

      // Sjekk hvilke anbefalte tidspunkter som er tilgjengelige
      const slots: SmartSlot[] = RECOMMENDED_SLOTS.map(timeStr => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const slotDate = new Date(date);
        slotDate.setHours(hours, minutes, 0, 0);
        
        const isoString = slotDate.toISOString();
        const available = allSlots.some(slot => {
          const slotDate = new Date(slot);
          return slotDate.getHours() === hours && slotDate.getMinutes() === minutes;
        });
        
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
        month: date.toLocaleDateString("nb-NO", { month: "short" }).replace(".", ""),
        slots,
      });
    }

    return NextResponse.json({
      weekOffset,
      weekStart: weekStart.toISOString().split("T")[0],
      instructor: {
        id: instructor.id,
        name: instructor.User?.[0]?.name || "Instruktør",
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
