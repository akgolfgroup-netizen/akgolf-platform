import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";

/**
 * POST /api/portal/rounds/:id/complete — Fullfar runde og beregn aggregater
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id: roundId } = await params;

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: {
      HoleResult: true,
      Course: { select: { par: true, name: true } },
    },
  });

  if (!round || round.userId !== user.id) {
    return NextResponse.json({ error: "Runde ikke funnet" }, { status: 404 });
  }

  const holes = round.HoleResult;
  if (holes.length === 0) {
    return NextResponse.json(
      { error: "Ingen hull-resultater registrert" },
      { status: 400 }
    );
  }

  // Beregn aggregater
  const totalScore = holes.reduce((sum, h) => sum + h.score, 0);
  const scoreToPar = totalScore - (round.Course?.par ?? 72);
  const totalPutts = holes.reduce((sum, h) => sum + h.putts, 0);
  const girCount = holes.filter((h) => h.gir).length;

  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit === true).length;
  const fairwaysTotal = fairwayHoles.length;

  // SG aggregater (kun fra hull med SG-data)
  const holesWithSG = holes.filter((h) => h.sgTotal !== null);
  const sgTotal = holesWithSG.length > 0
    ? holesWithSG.reduce((sum, h) => sum + (h.sgTotal ?? 0), 0)
    : null;
  const sgOffTheTee = holesWithSG.length > 0
    ? holesWithSG.reduce((sum, h) => sum + (h.sgTee ?? 0), 0)
    : null;
  const sgApproach = holesWithSG.length > 0
    ? holesWithSG.reduce((sum, h) => sum + (h.sgApproach ?? 0), 0)
    : null;
  const sgShortGame = holesWithSG.length > 0
    ? holesWithSG.reduce((sum, h) => sum + (h.sgShortGame ?? 0), 0)
    : null;
  const sgPutting = holesWithSG.length > 0
    ? holesWithSG.reduce((sum, h) => sum + (h.sgPutting ?? 0), 0)
    : null;

  // DECADE score
  const holesWithStrategy = holes.filter((h) => h.strategyFollowed !== null);
  const decadeScore = holesWithStrategy.length > 0
    ? Math.round(
        (holesWithStrategy.filter((h) => h.strategyFollowed).length /
          holesWithStrategy.length) *
          100
      )
    : null;

  const round3 = (n: number | null) =>
    n !== null ? Math.round(n * 1000) / 1000 : null;

  // Oppdater runden
  const updated = await prisma.round.update({
    where: { id: roundId },
    data: {
      isComplete: true,
      endTime: new Date(),
      totalScore,
      scoreToPar,
      totalPutts,
      girCount,
      fairwaysHit,
      fairwaysTotal,
      sgTotal: round3(sgTotal),
      sgOffTheTee: round3(sgOffTheTee),
      sgApproach: round3(sgApproach),
      sgShortGame: round3(sgShortGame),
      sgPutting: round3(sgPutting),
      decadeScore: decadeScore !== null ? decadeScore : null,
      updatedAt: new Date(),
    },
    include: {
      Course: { select: { name: true, par: true } },
      HoleResult: { orderBy: { holeNumber: "asc" } },
    },
  });

  return NextResponse.json(updated);
}
