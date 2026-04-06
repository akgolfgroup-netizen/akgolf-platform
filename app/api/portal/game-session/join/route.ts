import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

/**
 * POST /api/portal/game-session/join — Bli med i spillokt via kode
 * Body: { joinCode: string }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { joinCode } = await req.json();
  if (!joinCode || typeof joinCode !== "string") {
    return NextResponse.json({ error: "joinCode er paakrevd" }, { status: 400 });
  }

  const session = await prisma.gameSession.findUnique({
    where: { joinCode: joinCode.toUpperCase() },
    include: {
      Course: { select: { name: true, par: true } },
      Players: { select: { userId: true } },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Ugyldig kode" }, { status: 404 });
  }

  if (!session.isActive) {
    return NextResponse.json({ error: "Spillokten er avsluttet" }, { status: 400 });
  }

  if (session.Players.some((p) => p.userId === user.id)) {
    return NextResponse.json({ error: "Du er allerede med" }, { status: 400 });
  }

  if (session.Players.length >= 4) {
    return NextResponse.json({ error: "Spillokten er full (maks 4)" }, { status: 400 });
  }

  await prisma.gamePlayer.create({
    data: {
      id: nanoid(),
      gameSessionId: session.id,
      userId: user.id,
      displayName: user.name,
    },
  });

  return NextResponse.json({
    sessionId: session.id,
    courseName: session.Course.name,
    playerCount: session.Players.length + 1,
  });
}
