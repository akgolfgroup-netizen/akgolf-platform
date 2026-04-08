import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`coaching:${getClientIp(request)}`, RATE_LIMITS.COACHING_BOOK);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabase();

    const { data: packages, error } = await supabase
      .from("CoachingPackage")
      .select(
        "id, name, slug, priceNok, billingType, bookingType, sessionsPerMonth, sessionDurationMin, bookingWindowDays, bookingWindowHours, maxBookingsPerWeek, slotsRequired, description, sortOrder"
      )
      .eq("isActive", true)
      .order("sortOrder", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(packages, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("[coaching/packages] Error:", msg);
    return NextResponse.json(
      { error: "Kunne ikke hente pakker", detail: msg },
      { status: 503 }
    );
  }
}
