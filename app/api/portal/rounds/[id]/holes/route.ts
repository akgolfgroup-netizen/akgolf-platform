import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import { calculateShotSG, calculateHoleSG } from "@/lib/portal/golf/sg-calculator";
import type { LieType } from "@/lib/portal/golf/expected-strokes";

/**
 * POST /api/portal/rounds/:id/holes — Lagre hull-resultat (hurtigmodus eller detaljert)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id: roundId } = await params;

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    select: { userId: true },
  });

  if (!round || round.userId !== user.id) {
    return NextResponse.json({ error: "Runde ikke funnet" }, { status: 404 });
  }

  const body = await req.json();
  const {
    holeId,
    holeNumber,
    par,
    score,
    putts,
    fairwayHit,
    gir,
    upAndDown,
    sandSave,
    penalty,
    shots,
    strategyFollowed,
  } = body;

  if (!holeId || !holeNumber || !par || score === undefined || putts === undefined) {
    return NextResponse.json(
      { error: "holeId, holeNumber, par, score og putts er paakrevd" },
      { status: 400 }
    );
  }

  const scoreToPar = score - par;

  // Beregn SG fra slag-data hvis tilgjengelig
  let sgData: {
    sgTotal: number;
    sgTee: number;
    sgApproach: number;
    sgShortGame: number;
    sgPutting: number;
  } | null = null;

  const createdShots: Array<{
    id: string;
    shotNumber: number;
    fromLie: string;
    fromDistance: number;
    toLie: string;
    toDistance: number;
    club: string;
    expectedBefore: number;
    expectedAfter: number;
    strokesGained: number;
    sgCategory: string;
  }> = [];

  if (shots && Array.isArray(shots) && shots.length > 0) {
    // Detaljmodus: slag-for-slag SG
    for (const shot of shots) {
      const sg = calculateShotSG(
        shot.fromLie as LieType,
        shot.fromDistance,
        shot.toLie,
        shot.toDistance
      );
      createdShots.push({
        id: nanoid(),
        shotNumber: shot.shotNumber,
        fromLie: shot.fromLie,
        fromDistance: shot.fromDistance,
        toLie: shot.toLie,
        toDistance: shot.toDistance,
        club: shot.club,
        expectedBefore: sg.expectedBefore,
        expectedAfter: sg.expectedAfter,
        strokesGained: sg.strokesGained,
        sgCategory: sg.sgCategory,
      });
    }

    sgData = calculateHoleSG(
      shots.map((s: { fromLie: string; fromDistance: number; toLie: string; toDistance: number }) => ({
        fromLie: s.fromLie as LieType,
        fromDistance: s.fromDistance,
        toLie: s.toLie,
        toDistance: s.toDistance,
      }))
    );
  }

  // Upsert hull-resultat
  const holeResult = await prisma.holeResult.upsert({
    where: {
      roundId_holeNumber: { roundId, holeNumber },
    },
    create: {
      id: nanoid(),
      roundId,
      holeId,
      holeNumber,
      par,
      score,
      scoreToPar,
      putts,
      fairwayHit: fairwayHit ?? null,
      gir: gir ?? false,
      upAndDown: upAndDown ?? null,
      sandSave: sandSave ?? null,
      penalty: penalty ?? 0,
      sgTotal: sgData?.sgTotal ?? null,
      sgTee: sgData?.sgTee ?? null,
      sgApproach: sgData?.sgApproach ?? null,
      sgShortGame: sgData?.sgShortGame ?? null,
      sgPutting: sgData?.sgPutting ?? null,
      strategyFollowed: strategyFollowed ?? null,
    },
    update: {
      score,
      scoreToPar,
      putts,
      fairwayHit: fairwayHit ?? null,
      gir: gir ?? false,
      upAndDown: upAndDown ?? null,
      sandSave: sandSave ?? null,
      penalty: penalty ?? 0,
      sgTotal: sgData?.sgTotal ?? null,
      sgTee: sgData?.sgTee ?? null,
      sgApproach: sgData?.sgApproach ?? null,
      sgShortGame: sgData?.sgShortGame ?? null,
      sgPutting: sgData?.sgPutting ?? null,
      strategyFollowed: strategyFollowed ?? null,
    },
  });

  // Lagre individuelle slag
  if (createdShots.length > 0) {
    await prisma.shot.deleteMany({ where: { holeResultId: holeResult.id } });
    await prisma.shot.createMany({
      data: createdShots.map((s) => ({
        ...s,
        holeResultId: holeResult.id,
        holeId,
      })),
    });
  }

  return NextResponse.json({ holeResult, shots: createdShots });
}
