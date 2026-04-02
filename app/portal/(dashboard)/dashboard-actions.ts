"use server";

import { prisma } from "@/lib/portal/prisma";
import { subDays, startOfDay } from "date-fns";

export async function getDashboardStats(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [sessionsCount, roundsCount] = await Promise.all([
    prisma.booking.count({
      where: {
        studentId: userId,
        status: "COMPLETED",
        startTime: { gte: thirtyDaysAgo },
      },
    }),
    prisma.roundStats.count({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  return { sessionsCount, roundsCount };
}

export async function getHandicapData(userId: string) {
  const entries = await prisma.handicapEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 2,
    select: { handicapIndex: true, date: true },
  });

  const current = entries[0]?.handicapIndex ?? null;
  const previous = entries[1]?.handicapIndex ?? null;
  const trend =
    current !== null && previous !== null ? current - previous : null;

  return { current, trend };
}

export async function getNextBooking(userId: string) {
  const booking = await prisma.booking.findFirst({
    where: {
      studentId: userId,
      status: "CONFIRMED",
      startTime: { gte: startOfDay(new Date()) },
    },
    include: {
      Instructor: {
        include: {
          User: { select: { name: true } },
        },
      },
      ServiceType: { select: { name: true, duration: true } },
    },
    orderBy: { startTime: "asc" },
  });

  if (!booking) return null;

  return {
    id: booking.id,
    instructorName: booking.Instructor?.User?.name ?? "Instruktør",
    serviceName: booking.ServiceType?.name ?? "Coaching",
    duration: booking.ServiceType?.duration ?? 60,
    startTime: booking.startTime,
  };
}

export async function getCoachInsight(userId: string) {
  const session = await prisma.coachingSession.findFirst({
    where: { studentId: userId },
    orderBy: { sessionDate: "desc" },
    select: {
      aiSummary: true,
      aiFocusAreas: true,
      primaryFocus: true,
      sessionDate: true,
    },
  });

  if (!session?.aiFocusAreas?.length && !session?.aiSummary) return null;

  return {
    focusAreas: session.aiFocusAreas,
    primaryFocus: session.primaryFocus,
    summary: session.aiSummary,
    date: session.sessionDate,
  };
}

interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: string | Date;
}

export async function getLatestAiInsight(userId: string): Promise<WeeklyInsight | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      latestAiInsight: true,
      aiInsightGeneratedAt: true,
    },
  });

  if (!user?.latestAiInsight || !user.aiInsightGeneratedAt) {
    return null;
  }

  const insight = user.latestAiInsight as {
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    focusTip?: string;
  };

  return {
    summary: insight.summary ?? "",
    strengths: insight.strengths ?? [],
    improvements: insight.improvements ?? [],
    focusTip: insight.focusTip ?? "",
    generatedAt: user.aiInsightGeneratedAt,
  };
}
