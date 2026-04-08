import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * GET /api/booking/services
 * Returns active, public services with instructors.
 * Reads directly from the database (same monorepo as portal).
 */
export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(request)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabase();
    
    const { data: types, error } = await supabase
      .from("ServiceType")
      .select(`
        id,
        name,
        description,
        category,
        duration,
        price,
        color,
        minNoticeHours,
        maxAdvanceDays,
        allowStripe,
        allowVipps,
        Instructor!inner (
          id,
          title,
          User (
            name,
            image
          )
        )
      `)
      .eq("isPublic", true)
      .eq("isActive", true)
      .order("sortOrder", { ascending: true });

    if (error) {
      logger.error("[booking/services] DB error:", error);
      return NextResponse.json(
        { error: "Tjenester er midlertidig utilgjengelige" },
        { status: 503 }
      );
    }

    return NextResponse.json(types, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    logger.error("[booking/services] DB error:", error);
    return NextResponse.json(
      { error: "Tjenester er midlertidig utilgjengelige" },
      { status: 503 }
    );
  }
}
