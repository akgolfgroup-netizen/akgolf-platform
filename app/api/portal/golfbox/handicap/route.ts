import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import {
  calculateHandicapDifferential,
  calculateHandicapIndex,
  calculatePlayingHandicap,
  calculateAdjustedGrossScore,
} from "@/lib/portal/golf/golfbox/handicap";

/**
 * GET /api/portal/golfbox/handicap — Beregn oppdatert handicap fra siste 20 runder
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  // Hent siste 20 fullforte runder med bane-data
  const rounds = await prisma.round.findMany({
    where: { userId: user.id, isComplete: true },
    orderBy: { date: "desc" },
    take: 20,
    include: {
      Course: { select: { par: true, courseRating: true, slopeRating: true } },
      HoleResult: {
        select: { score: true, par: true },
        orderBy: { holeNumber: "asc" },
      },
    },
  });

  if (rounds.length < 3) {
    return NextResponse.json({
      handicapIndex: null,
      message: "Trenger minst 3 runder for handicap-beregning",
      roundCount: rounds.length,
    });
  }

  // Beregn differensialer
  const differentials: number[] = [];
  const roundDetails: Array<{
    date: Date;
    course: string | null;
    score: number;
    adjustedScore: number;
    differential: number;
  }> = [];

  for (const round of rounds) {
    const cr = round.Course?.courseRating;
    const sr = round.Course?.slopeRating;
    const par = round.Course?.par ?? 72;

    if (!cr || !sr) continue;

    // Beregn Playing Handicap (bruk forrige handicap eller 36 som default)
    const currentHcp = await prisma.handicapEntry.findFirst({
      where: { userId: user.id, date: { lt: round.date } },
      orderBy: { date: "desc" },
      select: { handicapIndex: true },
    });

    const playingHcp = calculatePlayingHandicap(
      currentHcp?.handicapIndex ?? 36,
      sr,
      cr,
      par
    );

    const adjustedScore = calculateAdjustedGrossScore(
      round.HoleResult.map((h) => ({ score: h.score, par: h.par })),
      playingHcp
    );

    const differential = calculateHandicapDifferential(adjustedScore, cr, sr);
    differentials.push(differential);

    roundDetails.push({
      date: round.date,
      course: null,
      score: round.totalScore ?? 0,
      adjustedScore,
      differential,
    });
  }

  const handicapIndex = calculateHandicapIndex(differentials);

  // Lagre ny handicap-entry
  await prisma.handicapEntry.create({
    data: {
      id: nanoid(),
      userId: user.id,
      date: new Date(),
      handicapIndex,
      source: "MANUAL",
    },
  });

  return NextResponse.json({
    handicapIndex,
    roundCount: differentials.length,
    differentials: roundDetails,
    playingHandicapExample: rounds[0]?.Course
      ? calculatePlayingHandicap(
          handicapIndex,
          rounds[0].Course.slopeRating ?? 113,
          rounds[0].Course.courseRating ?? 72,
          rounds[0].Course.par ?? 72
        )
      : null,
  });
}
