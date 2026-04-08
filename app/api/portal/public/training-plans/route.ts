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
  const group = request.nextUrl.searchParams.get("group");

  try {
    // Use service client for public endpoints to bypass RLS
    const supabase = createServiceClient();

    // Build the query
    let query = supabase
      .from("TrainingPlan")
      .select(
        `
        id,
        title,
        periodType,
        startDate,
        endDate,
        goals,
        TrainingPlanWeek (
          weekNumber,
          focus,
          TrainingPlanSession (
            dayOfWeek,
            title,
            durationMinutes,
            focusArea,
            exercises,
            sortOrder
          )
        )
      `
      )
      .eq("isActive", true)
      .order("startDate", { ascending: false })
      .limit(10);

    // Filter for junior group if requested
    if (group === "junior") {
      // This is a more complex query that would require joining with User table
      // For now, we'll fetch and filter manually or you may need to adjust the database structure
      // Alternative: use RPC function or a view for this complex filter
    }

    const { data: plans, error } = await query;

    if (error) throw error;

    // Parse goals from JSON string if needed and format dates
    const formatted = plans?.map((plan) => ({
      id: plan.id,
      title: plan.title,
      periodType: plan.periodType,
      startDate: new Date(plan.startDate).toISOString().split("T")[0],
      endDate: new Date(plan.endDate).toISOString().split("T")[0],
      goals: plan.goals ? JSON.parse(plan.goals) : [],
      TrainingPlanWeek: (plan.TrainingPlanWeek as unknown as Array<{
        weekNumber: number;
        focus: string;
        TrainingPlanSession: Array<{
          dayOfWeek: number;
          title: string;
          durationMinutes: number;
          focusArea: string;
          exercises: unknown;
          sortOrder: number;
        }>;
      }>)?.map((week) => ({
        weekNumber: week.weekNumber,
        focus: week.focus,
        TrainingPlanSession: week.TrainingPlanSession?.sort((a, b) => a.sortOrder - b.sortOrder) || [],
      })).sort((a, b) => a.weekNumber - b.weekNumber) || [],
    })) || [];

    return NextResponse.json(
      { plans: formatted },
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
