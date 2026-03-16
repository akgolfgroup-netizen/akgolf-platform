import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

const corsOrigin = () => process.env.WEBSITE_URL ?? "http://localhost:3003";

export async function GET(request: NextRequest) {
  const upcoming = request.nextUrl.searchParams.get("upcoming") === "true";

  try {
    const tournaments = await prisma.tournament.findMany({
      where: upcoming
        ? { startDate: { gte: new Date() } }
        : {},
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        level: true,
        course: true,
        location: true,
        registrationDeadline: true,
        series: true,
      },
      orderBy: { startDate: "asc" },
      take: 50,
    });

    const formatted = tournaments.map((t) => ({
      ...t,
      startDate: t.startDate.toISOString().split("T")[0],
      endDate: t.endDate?.toISOString().split("T")[0] ?? null,
      registrationDeadline: t.registrationDeadline?.toISOString().split("T")[0] ?? null,
    }));

    return NextResponse.json(
      { tournaments: formatted },
      {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin(),
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[tournaments] DB error:", error);
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
