import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

const corsOrigin = () => process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`public:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }
  const upcoming = request.nextUrl.searchParams.get("upcoming") === "true";

  try {
    // Use service client for public endpoints to bypass RLS
    const supabase = createServiceClient();

    let query = supabase
      .from("Tournament")
      .select(
        "id, name, startDate, endDate, level, course, location, registrationDeadline, series"
      )
      .order("startDate", { ascending: true })
      .limit(50);

    // Filter for upcoming tournaments if requested
    if (upcoming) {
      const today = new Date().toISOString().split("T")[0];
      query = query.gte("startDate", today);
    }

    const { data: tournaments, error } = await query;

    if (error) throw error;

    const formatted = tournaments?.map((t) => ({
      ...t,
      startDate: new Date(t.startDate).toISOString().split("T")[0],
      endDate: t.endDate ? new Date(t.endDate).toISOString().split("T")[0] : null,
      registrationDeadline: t.registrationDeadline
        ? new Date(t.registrationDeadline).toISOString().split("T")[0]
        : null,
    })) || [];

    return NextResponse.json(
      { tournaments: formatted },
      {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin(),
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": corsOrigin() } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": corsOrigin(),
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
