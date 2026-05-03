import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { estimateScoreForCourse } from "@/lib/portal/golf/decade-caddy";

export const dynamic = "force-dynamic";

/**
 * GET /api/portal/ai/score-estimate — List cached score estimates
 * POST /api/portal/ai/score-estimate — Generate new score estimate
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const estimates = await prisma.scoreEstimate.findMany({
    where: { userId: user.id },
    orderBy: { generatedAt: "desc" },
  });

  return NextResponse.json({ estimates });
}

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId er paakrevd" }, { status: 400 });
  }

  const course = await prisma.referenceCourse.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  const dispersions = await prisma.clubDispersionData.findMany({
    where: { userId: user.id },
  });

  const estimate = estimateScoreForCourse(course, dispersions);

  const cached = await prisma.scoreEstimate.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    create: {
      userId: user.id,
      courseId: course.id,
      expectedScore: estimate.expectedScore,
      scoreRangeLow: estimate.scoreRangeLow,
      scoreRangeHigh: estimate.scoreRangeHigh,
      confidence: estimate.confidence,
      breakdown: estimate.breakdown as unknown as import("@prisma/client").Prisma.InputJsonValue,
      reasoning: estimate.reasoning,
    },
    update: {
      expectedScore: estimate.expectedScore,
      scoreRangeLow: estimate.scoreRangeLow,
      scoreRangeHigh: estimate.scoreRangeHigh,
      confidence: estimate.confidence,
      breakdown: estimate.breakdown as unknown as import("@prisma/client").Prisma.InputJsonValue,
      reasoning: estimate.reasoning,
      generatedAt: new Date(),
    },
  });

  return NextResponse.json({ estimate: cached });
}
