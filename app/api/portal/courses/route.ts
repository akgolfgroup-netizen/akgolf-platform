import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/courses — Sok etter baner
 * Query params: ?q=oslo&country=NO
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const country = req.nextUrl.searchParams.get("country") ?? "NO";

  const courses = await prisma.course.findMany({
    where: {
      country,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      location: true,
      par: true,
      courseRating: true,
      slopeRating: true,
      totalLength: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return NextResponse.json(courses, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
