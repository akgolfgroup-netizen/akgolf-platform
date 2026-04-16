import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

const GAME_TYPE_PREFIX = {
  NEAR_GAME: "NEAR",
  PUTTING_GAME: "PUTT",
  PRESSURE_GAME: "PRESS",
} as const;

type GameType = keyof typeof GAME_TYPE_PREFIX;

function decodeGameSessionName(name: string): { gameType: GameType; pressureLevel: number; displayName: string } {
  const parts = name.split("|");
  const prefix = parts[0] as string;
  const gameType = (Object.entries(GAME_TYPE_PREFIX).find(([, v]) => v === prefix)?.[0] ?? "NEAR_GAME") as GameType;
  const pressureLevel = parseInt(parts[1] ?? "1", 10) || 1;
  const displayName = parts.slice(2).join("|") || gameType;
  return { gameType, pressureLevel, displayName };
}

/**
 * GET /api/portal/ai/games/[id] — Get game session with shots
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { id: sessionId } = await params;

  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return NextResponse.json({ error: "Sesjon ikke funnet" }, { status: 404 });
  }

  if (session.createdById !== user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const shots = await prisma.trackManShotData.findMany({
    where: { sessionId },
    orderBy: { shotNumber: "asc" },
  });

  const decoded = decodeGameSessionName(session.name ?? "");

  return NextResponse.json({
    session: {
      ...session,
      ...decoded,
    },
    shots,
    summary: {
      totalShots: shots.length,
      avgBallSpeed: shots.filter((s) => s.ballSpeed !== null).length > 0
        ? Math.round(
            (shots.reduce((a, s) => a + (s.ballSpeed ?? 0), 0) /
              shots.filter((s) => s.ballSpeed !== null).length) *
              10
          ) / 10
        : null,
      avgCarry: shots.filter((s) => s.carryDistance !== null).length > 0
        ? Math.round(
            (shots.reduce((a, s) => a + (s.carryDistance ?? 0), 0) /
              shots.filter((s) => s.carryDistance !== null).length) *
              10
          ) / 10
        : null,
    },
  });
}
