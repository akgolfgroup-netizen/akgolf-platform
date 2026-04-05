"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

export interface ChatContext {
  userName: string;
  handicap: number | null;
  recentRounds: {
    date: string;
    courseName: string | null;
    totalScore: number | null;
    sgTotal: number | null;
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen: number | null;
    sgPutting: number | null;
  }[];
  recentTrainingLogs: {
    date: string;
    focusArea: string | null;
    durationMinutes: number | null;
    notes: string | null;
    rating: number | null;
  }[];
  activePlan: {
    title: string;
    periodType: string;
    startDate: string;
    endDate: string;
  } | null;
  trackmanAverages: {
    club: string;
    averages: Record<string, unknown>;
  }[];
  upcomingTournaments: {
    name: string;
    startDate: string;
    course: string | null;
  }[];
}

export async function getChatContext(): Promise<ChatContext> {
  const user = await requirePortalUser();

  const [
    handicapEntry,
    recentRounds,
    recentLogs,
    activePlan,
    trackmanSessions,
    tournamentPlans,
  ] = await Promise.all([
    prisma.handicapEntry.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { handicapIndex: true },
    }),
    prisma.roundStats.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 10,
      select: {
        date: true,
        courseName: true,
        totalScore: true,
        sgTotal: true,
        sgOffTheTee: true,
        sgApproach: true,
        sgAroundTheGreen: true,
        sgPutting: true,
      },
    }),
    prisma.trainingLog.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 20,
      select: {
        date: true,
        focusArea: true,
        durationMinutes: true,
        notes: true,
        rating: true,
      },
    }),
    prisma.trainingPlan.findFirst({
      where: { studentId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        periodType: true,
        startDate: true,
        endDate: true,
      },
    }),
    prisma.trackmanSession.findMany({
      where: { userId: user.id },
      orderBy: { sessionDate: "desc" },
      take: 5,
      select: {
        club: true,
        averages: true,
      },
    }),
    prisma.playerTournamentPlan.findMany({
      where: {
        studentId: user.id,
        Tournament: { startDate: { gte: new Date() } },
      },
      orderBy: { Tournament: { startDate: "asc" } },
      take: 3,
      include: {
        Tournament: {
          select: { name: true, startDate: true, course: true },
        },
      },
    }),
  ]);

  return {
    userName: user.name ?? "Spiller",
    handicap: handicapEntry?.handicapIndex ?? null,
    recentRounds: recentRounds.map((r) => ({
      date: r.date.toISOString(),
      courseName: r.courseName,
      totalScore: r.totalScore,
      sgTotal: r.sgTotal,
      sgApproach: r.sgApproach,
      sgOffTheTee: r.sgOffTheTee,
      sgAroundTheGreen: r.sgAroundTheGreen,
      sgPutting: r.sgPutting,
    })),
    recentTrainingLogs: recentLogs.map((l) => ({
      date: l.date.toISOString(),
      focusArea: l.focusArea,
      durationMinutes: l.durationMinutes,
      notes: l.notes,
      rating: l.rating,
    })),
    activePlan: activePlan
      ? {
          title: activePlan.title,
          periodType: activePlan.periodType,
          startDate: activePlan.startDate.toISOString(),
          endDate: activePlan.endDate.toISOString(),
        }
      : null,
    trackmanAverages: trackmanSessions.map((t) => ({
      club: t.club,
      averages: t.averages as Record<string, unknown>,
    })),
    upcomingTournaments: tournamentPlans.map((tp) => ({
      name: tp.Tournament.name,
      startDate: tp.Tournament.startDate.toISOString(),
      course: tp.Tournament.course,
    })),
  };
}

export async function getQuickInsight(): Promise<string> {
  const user = await requirePortalUser();

  const [lastRound, lastLog, handicap] = await Promise.all([
    prisma.roundStats.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: {
        date: true,
        totalScore: true,
        sgTotal: true,
        sgOffTheTee: true,
        sgApproach: true,
        sgAroundTheGreen: true,
        sgPutting: true,
      },
    }),
    prisma.trainingLog.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { date: true, focusArea: true, rating: true },
    }),
    prisma.handicapEntry.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { handicapIndex: true },
    }),
  ]);

  const parts: string[] = [];
  if (handicap) {
    parts.push(`Handicap: ${handicap.handicapIndex}`);
  }
  if (lastRound) {
    const sgParts: string[] = [];
    if (lastRound.sgOffTheTee !== null)
      sgParts.push(`Tee: ${lastRound.sgOffTheTee.toFixed(1)}`);
    if (lastRound.sgApproach !== null)
      sgParts.push(`Approach: ${lastRound.sgApproach.toFixed(1)}`);
    if (lastRound.sgAroundTheGreen !== null)
      sgParts.push(`Kortspill: ${lastRound.sgAroundTheGreen.toFixed(1)}`);
    if (lastRound.sgPutting !== null)
      sgParts.push(`Putting: ${lastRound.sgPutting.toFixed(1)}`);
    parts.push(`Siste runde: ${lastRound.totalScore ?? "?"} (SG: ${sgParts.join(", ")})`);
  }
  if (lastLog) {
    const daysAgo = Math.floor(
      (Date.now() - lastLog.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    parts.push(
      `Siste trening: ${daysAgo === 0 ? "i dag" : `${daysAgo} dager siden`} (${lastLog.focusArea ?? "generell"})`
    );
  }

  if (parts.length === 0) {
    return "Ingen data registrert enna. Logg din forste runde eller trening for a fa innsikt.";
  }

  return parts.join(" | ");
}
