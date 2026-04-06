import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
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
    const plans = await prisma.trainingPlan.findMany({
      where: {
        isActive: true,
        ...(group === "junior"
          ? {
              User_TrainingPlan_studentIdToUser: {
                role: "STUDENT",
              },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        periodType: true,
        startDate: true,
        endDate: true,
        goals: true,
        TrainingPlanWeek: {
          select: {
            weekNumber: true,
            focus: true,
            TrainingPlanSession: {
              select: {
                dayOfWeek: true,
                title: true,
                durationMinutes: true,
                focusArea: true,
                exercises: true,
              },
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { weekNumber: "asc" },
        },
      },
      orderBy: { startDate: "desc" },
      take: 10,
    });

    // Parse goals from JSON string if needed
    const formatted = plans.map((plan) => ({
      ...plan,
      startDate: plan.startDate.toISOString().split("T")[0],
      endDate: plan.endDate.toISOString().split("T")[0],
      goals: plan.goals ? JSON.parse(plan.goals) : [],
    }));

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
