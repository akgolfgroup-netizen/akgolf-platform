import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/courses/:id/holes — Hent alle hull for en bane
 * Query params: ?tee=yellow
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teeColor = req.nextUrl.searchParams.get("tee") ?? "yellow";

  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      par: true,
      courseRating: true,
      slopeRating: true,
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  const holes = await prisma.hole.findMany({
    where: { courseId: id, teeColor },
    orderBy: { holeNumber: "asc" },
    select: {
      id: true,
      holeNumber: true,
      par: true,
      handicap: true,
      lengthMeter: true,
      teeColor: true,
      latitude: true,
      longitude: true,
      greenLat: true,
      greenLon: true,
    },
  });

  return NextResponse.json({ course, holes }, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
