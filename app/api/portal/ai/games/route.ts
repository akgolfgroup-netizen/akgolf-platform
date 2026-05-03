import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

const GAME_TYPE_PREFIX = {
  NEAR_GAME: "NEAR",
  PUTTING_GAME: "PUTT",
  PRESSURE_GAME: "PRESS",
} as const;

type GameType = keyof typeof GAME_TYPE_PREFIX;

function encodeGameSessionName(gameType: GameType, pressureLevel: number, displayName?: string): string {
  return `${GAME_TYPE_PREFIX[gameType]}|${pressureLevel}|${displayName ?? gameType}`;
}

async function ensurePracticeCourse(): Promise<string> {
  const existing = await prisma.course.findFirst({
    where: { name: "Practice Facility" },
  });
  if (existing) return existing.id;

  const course = await prisma.course.create({
    data: {
      id: nanoid(),
      name: "Practice Facility",
      location: "Simulator",
      par: 72,
      totalLength: 6000,
      courseRating: 72,
      slopeRating: 113,
      updatedAt: new Date(),
    },
  });
  return course.id;
}

/**
 * POST /api/portal/ai/games — Create a game session
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();
  const { gameType, pressureLevel = 1, displayName } = body;

  if (!gameType || !GAME_TYPE_PREFIX[gameType as GameType]) {
    return NextResponse.json({ error: "Ugyldig spilltype" }, { status: 400 });
  }

  const courseId = await ensurePracticeCourse();
  const name = encodeGameSessionName(gameType as GameType, pressureLevel, displayName);

  const session = await prisma.gameSession.create({
    data: {
      id: nanoid(),
      name,
      courseId,
      date: new Date(),
      format: "STROKEPLAY",
      createdById: user.id,
      joinCode: nanoid(8),
      isActive: true,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({
    sessionId: session.id,
    gameType,
    pressureLevel,
    displayName: displayName ?? gameType,
  });
}
