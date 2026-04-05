import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * GET /api/portal/game-session — Liste brukerens aktive spillokter
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const sessions = await prisma.gameSession.findMany({
    where: {
      OR: [
        { createdById: user.id },
        { Players: { some: { userId: user.id } } },
      ],
    },
    orderBy: { date: "desc" },
    take: 20,
    include: {
      Course: { select: { name: true, par: true } },
      Players: {
        include: {
          User: { select: { id: true, name: true, image: true } },
        },
      },
      Rounds: {
        where: { isComplete: true },
        select: {
          userId: true,
          totalScore: true,
          scoreToPar: true,
          sgTotal: true,
        },
      },
    },
  });

  return NextResponse.json(sessions);
}

/**
 * POST /api/portal/game-session — Opprett ny spillokt
 * Body: { courseId, teeColor?, format?, name? }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId, teeColor, format, name } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId er paakrevd" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { name: true },
  });

  if (!course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  // Generer unik join-kode
  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.gameSession.findUnique({
      where: { joinCode },
    });
    if (!existing) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  const sessionId = nanoid();

  const session = await prisma.gameSession.create({
    data: {
      id: sessionId,
      name: name ?? `Runde pa ${course.name}`,
      courseId,
      date: new Date(),
      teeColor: teeColor ?? "yellow",
      format: format ?? "STROKEPLAY",
      createdById: user.id,
      joinCode,
      updatedAt: new Date(),
    },
  });

  // Legg til skaperen som spiller
  await prisma.gamePlayer.create({
    data: {
      id: nanoid(),
      gameSessionId: sessionId,
      userId: user.id,
      displayName: user.name,
    },
  });

  return NextResponse.json({
    session,
    joinCode,
    courseName: course.name,
  });
}
