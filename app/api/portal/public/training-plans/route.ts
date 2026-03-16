import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

const corsOrigin = () => process.env.WEBSITE_URL ?? "http://localhost:3003";

export async function GET(request: NextRequest) {
  const group = request.nextUrl.searchParams.get("group");

  try {
    const plans = await prisma.trainingPlan.findMany({
      where: {
        isActive: true,
        ...(group === "junior"
          ? {
              student: {
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
        weeks: {
          select: {
            weekNumber: true,
            focus: true,
            sessions: {
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
  } catch (error) {
    console.error("[training-plans] DB error:", error);
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
