"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import type { GameFormat } from "@prisma/client";

// ─── Typer ──────────────────────────────────────────────

export type GameSessionPlayer = {
  userId: string;
  displayName: string | null;
  User: { id: string; name: string | null; image: string | null };
};

export type GameSessionRound = {
  userId: string;
  totalScore: number | null;
  scoreToPar: number | null;
  sgTotal: number | null;
};

export type GameSessionData = {
  id: string;
  name: string | null;
  courseId: string;
  date: string;
  teeColor: string;
  format: GameFormat;
  createdById: string;
  joinCode: string;
  isActive: boolean;
  Course: { name: string; par: number };
  Players: GameSessionPlayer[];
  Rounds: GameSessionRound[];
};

export type CourseData = {
  id: string;
  name: string;
  location: string | null;
  par: number;
  courseRating: number | null;
  slopeRating: number | null;
};

export type ChallengeData = {
  id: string;
  title: string;
  type: string;
  metric: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  Creator: { name: string | null };
  Participants: { userId: string; currentValue: number | null; rank: number | null }[];
  _participantCount: number;
};

// ─── Server Actions ─────────────────────────────────────

/**
 * Hent brukerens spillokter (nyeste forst)
 */
export async function getGameSessions(): Promise<GameSessionData[]> {
  const user = await requirePortalUser();

  try {
    const sessions = await prisma.gameSession.findMany({
      where: {
        OR: [
          { createdById: user.id },
          { Players: { some: { userId: user.id } } },
        ],
      },
      include: {
        Course: { select: { name: true, par: true } },
        Players: {
          select: {
            userId: true,
            displayName: true,
            User: { select: { id: true, name: true, image: true } },
          },
        },
        Rounds: {
          select: {
            userId: true,
            totalScore: true,
            scoreToPar: true,
            sgTotal: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 20,
    });

    return sessions.map((s) => ({
      id: s.id,
      name: s.name,
      courseId: s.courseId,
      date: s.date.toISOString(),
      teeColor: s.teeColor,
      format: s.format,
      createdById: s.createdById,
      joinCode: s.joinCode,
      isActive: s.isActive,
      Course: s.Course,
      Players: s.Players,
      Rounds: s.Rounds,
    }));
  } catch (error) {
    console.error("Feil ved henting av spillokter:", error);
    return [];
  }
}

/**
 * Hent nylige baner (norske, sortert alfabetisk)
 */
export async function getRecentCourses(): Promise<CourseData[]> {
  await requirePortalUser();

  try {
    const courses = await prisma.course.findMany({
      where: { country: "NO" },
      select: {
        id: true,
        name: true,
        location: true,
        par: true,
        courseRating: true,
        slopeRating: true,
      },
      orderBy: { name: "asc" },
      take: 12,
    });

    return courses;
  } catch (error) {
    console.error("Feil ved henting av baner:", error);
    return [];
  }
}

/**
 * Hent aktive utfordringer brukeren deltar i eller som er offentlige
 */
export async function getChallenges(): Promise<ChallengeData[]> {
  const user = await requirePortalUser();
  const now = new Date();

  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        endDate: { gte: now },
        OR: [
          { isPublic: true },
          { createdById: user.id },
        ],
      },
      include: {
        Creator: { select: { name: true } },
        Participants: {
          select: { userId: true, currentValue: true, rank: true },
        },
      },
      orderBy: { endDate: "asc" },
      take: 10,
    });

    return challenges.map((c) => ({
      id: c.id,
      title: c.title,
      type: c.type,
      metric: c.metric,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      isPublic: c.isPublic,
      Creator: c.Creator,
      Participants: c.Participants,
      _participantCount: c.Participants.length,
    }));
  } catch (error) {
    console.error("Feil ved henting av utfordringer:", error);
    return [];
  }
}

/**
 * Opprett ny spillokt
 */
export async function createGameSession(data: {
  courseId: string;
  name?: string;
  teeColor?: string;
  format?: string;
}): Promise<{ success: boolean; sessionId?: string; joinCode?: string; error?: string }> {
  const user = await requirePortalUser();
  const { courseId, name, teeColor, format } = data;

  if (!courseId) {
    return { success: false, error: "Velg en bane" };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { name: true },
    });

    if (!course) {
      return { success: false, error: "Bane ikke funnet" };
    }

    // Generer unik join-kode
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let joinCode = "";
    for (let attempt = 0; attempt < 10; attempt++) {
      joinCode = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("");

      const existing = await prisma.gameSession.findUnique({
        where: { joinCode },
        select: { id: true },
      });

      if (!existing) break;
    }

    const sessionId = nanoid();
    const now = new Date();

    const validFormats: GameFormat[] = ["STROKEPLAY", "STABLEFORD", "MATCHPLAY", "BESTBALL", "SCRAMBLE"];
    const gameFormat = validFormats.includes(format as GameFormat)
      ? (format as GameFormat)
      : "STROKEPLAY";

    await prisma.gameSession.create({
      data: {
        id: sessionId,
        name: name ?? `Runde pa ${course.name}`,
        courseId,
        date: now,
        teeColor: teeColor ?? "yellow",
        format: gameFormat,
        createdById: user.id,
        joinCode,
        updatedAt: now,
      },
    });

    await prisma.gamePlayer.create({
      data: {
        id: nanoid(),
        gameSessionId: sessionId,
        userId: user.id,
        displayName: user.name,
      },
    });

    revalidatePath("/portal/spill");
    return { success: true, sessionId, joinCode };
  } catch (error) {
    console.error("Feil ved oppretting av spillokt:", error);
    return { success: false, error: "Kunne ikke opprette spillokt" };
  }
}

/**
 * Bli med i spillokt via kode
 */
export async function joinGameSession(
  joinCode: string
): Promise<{ success: boolean; sessionId?: string; courseName?: string; error?: string }> {
  const user = await requirePortalUser();

  if (!joinCode || joinCode.length < 4) {
    return { success: false, error: "Ugyldig kode" };
  }

  try {
    const session = await prisma.gameSession.findUnique({
      where: { joinCode: joinCode.toUpperCase() },
      include: {
        Course: { select: { name: true } },
        Players: { select: { userId: true } },
      },
    });

    if (!session) {
      return { success: false, error: "Fant ingen spillokt med denne koden" };
    }

    if (!session.isActive) {
      return { success: false, error: "Spillokten er avsluttet" };
    }

    if (session.Players.some((p) => p.userId === user.id)) {
      return { success: false, error: "Du er allerede med i dette spillet" };
    }

    if (session.Players.length >= 4) {
      return { success: false, error: "Spillokten er full (maks 4 spillere)" };
    }

    await prisma.gamePlayer.create({
      data: {
        id: nanoid(),
        gameSessionId: session.id,
        userId: user.id,
        displayName: user.name,
      },
    });

    revalidatePath("/portal/spill");
    return {
      success: true,
      sessionId: session.id,
      courseName: session.Course.name,
    };
  } catch (error) {
    console.error("Feil ved joining av spillokt:", error);
    return { success: false, error: "Kunne ikke bli med i spillokten" };
  }
}

/**
 * Sok etter baner (for ny-spill-dialogen)
 */
export async function searchCourses(query: string): Promise<CourseData[]> {
  await requirePortalUser();

  try {
    const courses = await prisma.course.findMany({
      where: {
        country: "NO",
        ...(query.length > 0 && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        location: true,
        par: true,
        courseRating: true,
        slopeRating: true,
      },
      orderBy: { name: "asc" },
      take: 20,
    });

    return courses;
  } catch (error) {
    console.error("Feil ved banesok:", error);
    return [];
  }
}
