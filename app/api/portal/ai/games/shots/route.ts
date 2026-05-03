import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/portal/ai/games/shots — Log a shot for a game session
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();
  const { sessionId, club, distance, result, notes, pressureLevel = 1 } = body;

  if (!sessionId || !club) {
    return NextResponse.json(
      { error: "sessionId og club er paakrevd" },
      { status: 400 }
    );
  }

  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return NextResponse.json({ error: "Sesjon ikke funnet" }, { status: 404 });
  }

  if (session.createdById !== user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const shotCount = await prisma.trackManShotData.count({
    where: { sessionId },
  });

  const shot = await prisma.trackManShotData.create({
    data: {
      sessionId,
      userId: user.id,
      shotNumber: shotCount + 1,
      club,
      carryDistance: distance ?? null,
      totalDistance: distance ?? null,
      notes: result ? `${result}${notes ? " — " + notes : ""}` : (notes ?? null),
      pressureLevel,
      context: "TRAINING",
    },
  });

  return NextResponse.json({ shot });
}
