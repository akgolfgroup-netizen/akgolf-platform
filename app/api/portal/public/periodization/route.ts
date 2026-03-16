import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

const corsOrigin = () => process.env.WEBSITE_URL ?? "http://localhost:3003";

export async function GET() {
  try {
    const periods = await prisma.periodizationPeriod.findMany({
      where: {
        studentId: null, // Only global periods (not per-student)
      },
      select: {
        id: true,
        periodType: true,
        startDate: true,
        endDate: true,
        label: true,
      },
      orderBy: { startDate: "asc" },
    });

    const formatted = periods.map((p) => ({
      ...p,
      startDate: p.startDate.toISOString().split("T")[0],
      endDate: p.endDate.toISOString().split("T")[0],
    }));

    return NextResponse.json(
      { periods: formatted },
      {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin(),
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[periodization] DB error:", error);
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
