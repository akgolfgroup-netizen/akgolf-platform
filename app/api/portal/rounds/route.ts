import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

/**
 * GET /api/portal/rounds — List brukerens runder
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const rounds = await prisma.round.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 50,
    include: {
      Course: { select: { name: true, par: true, location: true } },
      _count: { select: { HoleResult: true } },
    },
  });

  return NextResponse.json(rounds);
}

/**
 * POST /api/portal/rounds — Start ny runde
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId, teeColor, weather, windSpeed, windDir, temperature } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId er paakrevd" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      Hole: {
        where: { teeColor: teeColor ?? "yellow" },
        orderBy: { holeNumber: "asc" },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  const round = await prisma.round.create({
    data: {
      id: nanoid(),
      userId: user.id,
      courseId,
      date: new Date(),
      startTime: new Date(),
      teeColor: teeColor ?? "yellow",
      weather: weather ?? null,
      windSpeed: windSpeed ?? null,
      windDir: windDir ?? null,
      temperature: temperature ?? null,
      source: "LIVE",
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({
    round,
    holes: course.Hole,
    courseName: course.name,
    coursePar: course.par,
  });
}
