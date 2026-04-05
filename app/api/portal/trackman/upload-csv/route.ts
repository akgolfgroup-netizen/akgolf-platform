import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import {
  parseTrackManCSV,
  convertToMetric,
  aggregateByClub,
} from "@/lib/portal/golf/trackman-parser";

/**
 * POST /api/portal/trackman/upload-csv — Last opp TrackMan CSV
 * Body: { csvContent: string, sessionDate?: string, club?: string }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { csvContent, sessionDate } = body;

  if (!csvContent || typeof csvContent !== "string") {
    return NextResponse.json(
      { error: "csvContent er paakrevd" },
      { status: 400 }
    );
  }

  let shots;
  try {
    const rawShots = parseTrackManCSV(csvContent);
    shots = rawShots.map(convertToMetric);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Feil ved parsing av CSV" },
      { status: 400 }
    );
  }

  if (shots.length === 0) {
    return NextResponse.json(
      { error: "Ingen gyldige slag funnet i CSV-filen" },
      { status: 400 }
    );
  }

  // Aggreger per klubb
  const clubAggregates = aggregateByClub(shots);

  // Lagre en TrackmanSession per klubb
  const sessions = [];
  for (const agg of clubAggregates) {
    const clubShots = shots.filter((s) => s.club === agg.club);
    const session = await prisma.trackmanSession.create({
      data: {
        id: nanoid(),
        userId: user.id,
        sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
        club: agg.club,
        shots: JSON.parse(JSON.stringify(clubShots)),
        averages: JSON.parse(JSON.stringify(agg)),
      },
    });
    sessions.push(session);
  }

  // Oppdater PlayerBag med nye gjennomsnitt
  let bag = await prisma.playerBag.findUnique({
    where: { userId: user.id },
    include: { clubs: true },
  });

  if (!bag) {
    bag = await prisma.playerBag.create({
      data: {
        id: nanoid(),
        userId: user.id,
      },
      include: { clubs: true },
    });
  }

  for (const agg of clubAggregates) {
    const existingClub = bag.clubs.find(
      (c) => c.name.toLowerCase() === agg.club.toLowerCase()
    );

    if (existingClub) {
      await prisma.playerClub.update({
        where: { id: existingClub.id },
        data: {
          avgCarry: agg.avgCarry,
          avgTotal: agg.avgTotal,
          avgOffline: agg.avgOffline,
          shotCount: existingClub.shotCount + agg.count,
        },
      });
    } else {
      await prisma.playerClub.create({
        data: {
          id: nanoid(),
          bagId: bag.id,
          name: agg.club,
          avgCarry: agg.avgCarry,
          avgTotal: agg.avgTotal,
          avgOffline: agg.avgOffline,
          shotCount: agg.count,
        },
      });
    }
  }

  return NextResponse.json({
    message: `${shots.length} slag importert fra ${clubAggregates.length} klubber`,
    sessions: sessions.length,
    clubSummary: clubAggregates.map((a) => ({
      club: a.club,
      count: a.count,
      avgCarry: a.avgCarry,
      avgTotal: a.avgTotal,
      lateralStdDev: a.lateralStdDev,
      carryStdDev: a.carryStdDev,
    })),
  });
}
