import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateSlots } from "@/lib/portal/slots";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`booking:slots:${clientIp}`, RATE_LIMITS.BOOKING_SLOTS);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

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
    const supabase = await createServerSupabase();

    // Fetch all required data in parallel
    const [
      serviceTypeResult,
      availabilityWindowsResult,
      existingBookingsResult,
      blockedTimesResult,
    ] = await Promise.all([
      supabase
        .from("ServiceType")
        .select("duration, bufferAfter, bufferBefore, minNoticeHours")
        .eq("id", serviceTypeId)
        .single(),
      supabase
        .from("InstructorAvailability")
        .select("startTime, endTime")
        .eq("instructorId", instructorId)
        .eq("dayOfWeek", dayOfWeek),
      supabase
        .from("Booking")
        .select("startTime, endTime")
        .eq("instructorId", instructorId)
        .gte("startTime", date.toISOString())
        .lt("startTime", nextDay.toISOString())
        .in("status", ["PENDING", "CONFIRMED"]),
      supabase
        .from("BlockedTime")
        .select("startTime, endTime")
        .or(`instructorId.eq.${instructorId},instructorId.is.null`)
        .lt("startTime", nextDay.toISOString())
        .gt("endTime", date.toISOString()),
    ]);

    const serviceType = serviceTypeResult.data;
    const availabilityWindows = availabilityWindowsResult.data ?? [];
    const existingBookings = existingBookingsResult.data ?? [];
    const blockedTimes = blockedTimesResult.data ?? [];

    if (!serviceType) {
      return NextResponse.json([]);
    }

    // Valider at instruktøren tilbyr denne tjenesten
    const { data: instructor, error: instructorError } = await supabase
      .from("Instructor")
      .select("id")
      .eq("id", instructorId)
      .filter("ServiceType", "cs", `{${serviceTypeId}}`)
      .single();

    if (instructorError || !instructor) {
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
        bufferBefore: serviceType.bufferBefore,
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
    logger.error("[booking/slots] DB error:", error);
    return NextResponse.json(
      { error: "Tjeneste utilgjengelig" },
      { status: 503 }
    );
  }
}
