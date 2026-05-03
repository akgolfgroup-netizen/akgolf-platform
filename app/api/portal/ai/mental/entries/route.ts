import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/portal/ai/mental/entries — Add a mental scorecard entry
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();

  const entry = await prisma.mentalScorecardEntry.create({
    data: {
      roundId: body.roundId,
      userId: user.id,
      hole: body.hole ?? 1,
      shotNumber: body.shotNumber ?? 1,
      plannedShot: body.plannedShot ?? null,
      targetDescription: body.targetDescription ?? null,
      focusLevel: body.focusLevel ?? null,
      focusQuality: body.focusQuality ?? null,
      confidence: body.confidence ?? null,
      pressureLevel: body.pressureLevel ?? 1,
      pressureSources: body.pressureSources ?? [],
      routineCompleted: body.routineCompleted ?? false,
      routineDuration: body.routineDuration ?? null,
      visualizationQuality: body.visualizationQuality ?? null,
      sawShotClearly: body.sawShotClearly ?? false,
      outcome: body.outcome ?? null,
      processScore: body.processScore ?? null,
      emotion: body.emotion ?? null,
      emotionIntensity: body.emotionIntensity ?? null,
      committedToShot: body.committedToShot ?? false,
      lastMinuteDoubt: body.lastMinuteDoubt ?? false,
      acceptedResult: body.acceptedResult ?? false,
      dwelling: body.dwelling ?? false,
      situation: body.situation ?? null,
      scoreAtMoment: body.scoreAtMoment ?? null,
      position: body.position ?? null,
    },
  });

  // Update mental profile baselines asynchronously
  await recalculateMentalProfile(user.id);

  return NextResponse.json({ entry });
}

async function recalculateMentalProfile(userId: string) {
  const entries = await prisma.mentalScorecardEntry.findMany({
    where: { userId, hole: { gt: 0 } },
  });

  if (entries.length === 0) return;

  const focusLevels = entries.map((e) => e.focusLevel).filter((v): v is number => v !== null);
  const confidences = entries.map((e) => e.confidence).filter((v): v is number => v !== null);
  const commitments = entries.filter((e) => e.committedToShot);
  const acceptances = entries.filter((e) => e.acceptedResult);

  const focusBaseline = focusLevels.length > 0
    ? Math.round(focusLevels.reduce((a, b) => a + b, 0) / focusLevels.length)
    : null;
  const baselineConfidence = confidences.length > 0
    ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
    : null;
  const commitmentRate = entries.length > 0 ? commitments.length / entries.length : 0;
  const acceptanceRate = entries.length > 0 ? acceptances.length / entries.length : 0;

  await prisma.mentalProfile.upsert({
    where: { userId },
    create: {
      userId,
      baselineConfidence,
      focusBaseline,
      commitmentRate,
      acceptanceRate,
    },
    update: {
      baselineConfidence,
      focusBaseline,
      commitmentRate,
      acceptanceRate,
    },
  });
}
