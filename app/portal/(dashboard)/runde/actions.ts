"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

export async function searchCourses(query: string) {
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
      ],
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
}

export async function getCourseHoles(courseId: string, teeColor = "yellow") {
  const holes = await prisma.hole.findMany({
    where: { courseId, teeColor },
    orderBy: { holeNumber: "asc" },
    select: {
      id: true,
      holeNumber: true,
      par: true,
      handicap: true,
      lengthMeter: true,
      teeColor: true,
    },
  });
  return holes;
}

export async function startRound(courseId: string, teeColor: string, weather?: string) {
  const user = await requirePortalUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      Hole: {
        where: { teeColor },
        orderBy: { holeNumber: "asc" },
      },
    },
  });

  if (!course) throw new Error("Bane ikke funnet");

  const round = await prisma.round.create({
    data: {
      id: nanoid(),
      userId: user.id,
      courseId,
      date: new Date(),
      startTime: new Date(),
      teeColor,
      weather: weather ?? null,
      source: "LIVE",
      updatedAt: new Date(),
    },
  });

  return { roundId: round.id, holes: course.Hole, courseName: course.name, coursePar: course.par };
}

export async function saveHoleResult(
  roundId: string,
  data: {
    holeId: string;
    holeNumber: number;
    par: number;
    score: number;
    putts: number;
    fairwayHit: boolean | null;
    gir: boolean;
    upAndDown?: boolean | null;
    sandSave?: boolean | null;
    penalty?: number;
    strategyFollowed?: boolean | null;
  }
) {
  const user = await requirePortalUser();

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    select: { userId: true },
  });

  if (!round || round.userId !== user.id) throw new Error("Runde ikke funnet");

  const scoreToPar = data.score - data.par;

  await prisma.holeResult.upsert({
    where: {
      roundId_holeNumber: { roundId, holeNumber: data.holeNumber },
    },
    create: {
      id: nanoid(),
      roundId,
      holeId: data.holeId,
      holeNumber: data.holeNumber,
      par: data.par,
      score: data.score,
      scoreToPar,
      putts: data.putts,
      fairwayHit: data.fairwayHit,
      gir: data.gir,
      upAndDown: data.upAndDown ?? null,
      sandSave: data.sandSave ?? null,
      penalty: data.penalty ?? 0,
      strategyFollowed: data.strategyFollowed ?? null,
    },
    update: {
      score: data.score,
      scoreToPar,
      putts: data.putts,
      fairwayHit: data.fairwayHit,
      gir: data.gir,
      upAndDown: data.upAndDown ?? null,
      sandSave: data.sandSave ?? null,
      penalty: data.penalty ?? 0,
      strategyFollowed: data.strategyFollowed ?? null,
    },
  });
}

export async function completeRound(roundId: string) {
  const user = await requirePortalUser();

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: {
      HoleResult: true,
      Course: { select: { par: true } },
    },
  });

  if (!round || round.userId !== user.id) throw new Error("Runde ikke funnet");

  const holes = round.HoleResult;
  const totalScore = holes.reduce((sum, h) => sum + h.score, 0);
  const scoreToPar = totalScore - (round.Course?.par ?? 72);
  const totalPutts = holes.reduce((sum, h) => sum + h.putts, 0);
  const girCount = holes.filter((h) => h.gir).length;
  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;

  const round3 = (n: number | null) => n !== null ? Math.round(n * 1000) / 1000 : null;
  const holesWithSG = holes.filter((h) => h.sgTotal !== null);

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
      fairwaysTotal: fairwayHoles.length,
      sgTotal: round3(holesWithSG.reduce((s, h) => s + (h.sgTotal ?? 0), 0) || null),
      sgOffTheTee: round3(holesWithSG.reduce((s, h) => s + (h.sgTee ?? 0), 0) || null),
      sgApproach: round3(holesWithSG.reduce((s, h) => s + (h.sgApproach ?? 0), 0) || null),
      sgShortGame: round3(holesWithSG.reduce((s, h) => s + (h.sgShortGame ?? 0), 0) || null),
      sgPutting: round3(holesWithSG.reduce((s, h) => s + (h.sgPutting ?? 0), 0) || null),
      updatedAt: new Date(),
    },
  });

  return updated;
}

export async function getUserRounds(limit = 20) {
  const user = await requirePortalUser();

  return prisma.round.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: limit,
    include: {
      Course: { select: { name: true, par: true, location: true } },
      _count: { select: { HoleResult: true } },
    },
  });
}

export async function getRoundDetail(roundId: string) {
  const user = await requirePortalUser();

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: {
      Course: {
        include: {
          Hole: {
            where: { teeColor: "yellow" },
            orderBy: { holeNumber: "asc" },
          },
        },
      },
      HoleResult: {
        orderBy: { holeNumber: "asc" },
        include: {
          Shot: { orderBy: { shotNumber: "asc" } },
        },
      },
    },
  });

  if (!round || round.userId !== user.id) return null;
  return round;
}
