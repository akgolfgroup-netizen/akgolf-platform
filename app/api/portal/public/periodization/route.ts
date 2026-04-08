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
  try {
    // Use service client for public endpoints to bypass RLS
    const supabase = createServiceClient();

    const { data: periods, error } = await supabase
      .from("PeriodizationPeriod")
      .select("id, periodType, startDate, endDate, label")
      .is("studentId", null) // Only global periods (not per-student)
      .order("startDate", { ascending: true });

    if (error) throw error;

    const formatted = periods?.map((p) => ({
      ...p,
      startDate: new Date(p.startDate).toISOString().split("T")[0],
      endDate: new Date(p.endDate).toISOString().split("T")[0],
    })) || [];

    return NextResponse.json(
      { periods: formatted },
      {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin(),
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
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
