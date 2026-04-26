/**
 * Offentlig API for å hente tilgjengelige tidspunkter (slots)
 * 
 * GET /api/portal/public/slots?instructorId=xxx&serviceTypeId=xxx&date=YYYY-MM-DD
 * 
 * Features:
 * - 30 sekunders cache med Next.js unstable_cache
 * - Støtte for InstructorDateAvailability overrides
 * - Konfliktsjekk mot eksisterende bookinger og blokkerte tider
 * - Rate limiting
 * - Google Calendar blokkerte tider
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  generateSlots,
  generateSmartSlotsForWindow,
  getAvailabilityForDate,
  type ServiceDuration,
  type SlotStrategy,
} from "@/lib/portal/slots";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { unstable_cache, revalidateTag } from "next/cache";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// Cache-konfigurasjon
const CACHE_MAX_AGE = 30; // sekunder
const STALE_WHILE_REVALIDATE = 60; // sekunder
const CACHE_TAG_PREFIX = "slots";

// Cache key generator (inkluderer strategy så compact og all caches separat)
const getSlotsCacheKey = (
  instructorId: string,
  dateStr: string,
  serviceTypeId: string,
  strategy: SlotStrategy = "all"
) => `${CACHE_TAG_PREFIX}:${instructorId}:${dateStr}:${serviceTypeId}:${strategy}`;

// Cached slot generation with Next.js unstable_cache
const getCachedSlotsData = unstable_cache(
  async (
    instructorId: string,
    date: Date,
    nextDay: Date,
    serviceTypeId: string,
    strategy: SlotStrategy
  ): Promise<{ slots: string[]; source: string }> => {
    const startTime = Date.now();
    const supabase = await createServerSupabase();

    // Hent tilgjengelighet med støtte for date-overrides
    const [serviceTypeResult, availabilityWindows, existingBookingsResult, blockedTimesResult, allServiceTypesResult] =
      await Promise.all([
        supabase
          .from("ServiceType")
          .select("duration, bufferAfter, bufferBefore, minNoticeHours, isActive")
          .eq("id", serviceTypeId)
          .single(),
        getAvailabilityForDate(instructorId, date),
        supabase
          .from("Booking")
          .select("startTime, endTime, serviceTypeId")
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
        // Kun nødvendig for compact-strategi (orphan-sjekk)
        strategy === "compact"
          ? supabase
              .from("ServiceType")
              .select("duration, bufferAfter")
              .eq("isActive", true)
          : Promise.resolve({ data: [] as { duration: number; bufferAfter: number }[] }),
      ]);

    const serviceType = serviceTypeResult.data;
    const existingBookingsRaw = existingBookingsResult.data || [];
    const blockedTimesRaw = blockedTimesResult.data || [];
    const allDurations: ServiceDuration[] = (allServiceTypesResult.data || []).map((d) => ({
      duration: d.duration as number,
      bufferAfter: d.bufferAfter as number,
    }));

    if (!serviceType || !serviceType.isActive) {
      return { slots: [], source: "error" };
    }

    if (availabilityWindows.length === 0) {
      return { slots: [], source: "no-availability" };
    }

    const existingBookings = existingBookingsRaw.map((b) => ({
      startTime: new Date(b.startTime as string),
      endTime: new Date(b.endTime as string),
      serviceTypeId: (b as { serviceTypeId?: string | null }).serviceTypeId ?? null,
    }));
    const blockedTimes = blockedTimesRaw.map((b) => ({
      startTime: new Date(b.startTime as string),
      endTime: new Date(b.endTime as string),
    }));

    const allSlots: string[] = [];
    for (const window of availabilityWindows) {
      if (strategy === "compact") {
        const windowSlots = generateSmartSlotsForWindow({
          availStart: window.startTime,
          availEnd: window.endTime,
          date,
          request: {
            duration: serviceType.duration,
            bufferBefore: serviceType.bufferBefore,
            bufferAfter: serviceType.bufferAfter,
            serviceTypeId,
          },
          existingBookings,
          blockedTimes,
          minNoticeHours: serviceType.minNoticeHours,
          allDurations,
        });
        allSlots.push(...windowSlots);
      } else {
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
    }

    // Sorter kronologisk
    allSlots.sort();

    logger.debug(
      `[slots-cache] Generated ${allSlots.length} slots (${strategy}) for ${instructorId} ${date.toISOString().split("T")[0]} (${Date.now() - startTime}ms)`
    );

    return { slots: allSlots, source: "cache" };
  },
  ["slots-data"],
  {
    revalidate: CACHE_MAX_AGE,
    tags: [CACHE_TAG_PREFIX],
  }
);

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const rateLimit = checkRateLimit(
    `public:${getClientIp(req)}`,
    RATE_LIMITS.API_GENERAL
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429 }
    );
  }

  const corsOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
  };

  const { searchParams } = new URL(req.url);
  const serviceTypeId = searchParams.get("serviceTypeId");
  const instructorId = searchParams.get("instructorId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD
  const nocache = searchParams.get("nocache") === "true"; // Force refresh
  const strategyParam = searchParams.get("strategy"); // "compact" | "all" | null
  const strategy: SlotStrategy = strategyParam === "compact" ? "compact" : "all";

  if (!serviceTypeId || !instructorId || !dateStr) {
    return NextResponse.json(
      { error: "Mangler parametere: serviceTypeId, instructorId, date" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      }
    );
  }

  // Valider datoformat
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return NextResponse.json(
      { error: "Ugyldig datoformat. Bruk YYYY-MM-DD" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      }
    );
  }

  // Parse dato som UTC midnatt
  const [year, month, day] = dateStr.split("-").map(Number);

  // Valider at datoen er gyldig
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return NextResponse.json(
      { error: "Ugyldig dato" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      }
    );
  }

  const nextDay = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));

  try {
    const supabase = await createServerSupabase();

    // Valider at instructoren tilbyr denne serviceType
    const { data: instructor, error: instructorError } = await supabase
      .from("Instructor")
      .select("id")
      .eq("id", instructorId)
      .filter("ServiceType.id", "eq", serviceTypeId)
      .single();

    if (instructorError || !instructor) {
      return NextResponse.json(
        { error: "Instruktør tilbyr ikke denne tjenesten" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Bruk cache hvis ikke nocache
    let slots: string[];
    let source: string;

    if (!nocache) {
      const cached = await getCachedSlotsData(
        instructorId,
        date,
        nextDay,
        serviceTypeId,
        strategy
      );
      slots = cached.slots;
      source = cached.source;

      if (source === "error") {
        return NextResponse.json(
          { error: "Tjeneste ikke funnet eller ikke aktiv" },
          { status: 404, headers: corsHeaders }
        );
      }
    } else {
      // Force fresh data
      const fresh = await getCachedSlotsData(
        instructorId,
        date,
        nextDay,
        serviceTypeId,
        strategy
      );
      slots = fresh.slots;
      source = "fresh";
    }

    logger.debug(
      `[slots] Returning ${slots.length} slots for ${instructorId} ${dateStr} (${Date.now() - startTime}ms, source: ${source})`
    );

    return NextResponse.json(slots, {
      headers: {
        ...corsHeaders,
        "X-Cache": nocache ? "BYPASS" : source === "cache" ? "HIT" : "MISS",
        "X-Response-Time": `${Date.now() - startTime}ms`,
      },
    });
  } catch (error) {
    logger.error("[slots] Error:", error);
    return NextResponse.json(
      { error: "Service unavailable" },
      {
        status: 503,
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      }
    );
  }
}

/**
 * POST for å manuelt invalidere cache (brukes av admin etter endringer)
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(
    `public:${getClientIp(req)}`,
    RATE_LIMITS.API_GENERAL
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429 }
    );
  }

  try {
    const { instructorId, date } = (await req.json()) as {
      instructorId?: string;
      date?: string;
    };

    if (!instructorId) {
      return NextResponse.json(
        { error: "instructorId påkrevd" },
        { status: 400 }
      );
    }

    // Revalidate cache tags
    revalidateTag(CACHE_TAG_PREFIX, {});
    if (date) {
      revalidateTag(getSlotsCacheKey(instructorId, date, ""), {});
    }

    // Also invalidate general availability
    revalidateTag(`availability:${instructorId}`, {});

    return NextResponse.json({
      success: true,
      message: "Cache invalidert",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("[slots POST] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke invalidere cache" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const corsOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
