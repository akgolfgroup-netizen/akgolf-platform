"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { subMonths, startOfDay, subDays } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getHandicapEntries(months = 12) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  return prisma.handicapEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: subMonths(new Date(), months) },
    },
    orderBy: { date: "asc" },
  });
}

export async function addHandicapEntry(data: {
  date: string;
  handicapIndex: number;
  source?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  await prisma.handicapEntry.create({
    data: {
      userId: user.id,
      date: new Date(data.date),
      handicapIndex: data.handicapIndex,
      source: data.source ?? "MANUAL",
    },
  });

  revalidatePath("/analyse");
}

export async function getTrainingLogsForAnalyse(days = 90) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  return prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: subDays(new Date(), days) },
    },
    include: {
      planSession: { select: { weekId: true, focusArea: true, durationMinutes: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getPlanVsActual(weeks = 8) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const from = subDays(new Date(), weeks * 7);

  // Planned sessions from active plan
  const plan = await prisma.trainingPlan.findFirst({
    where: { studentId: user.id, isActive: true },
    include: {
      weeks: {
        where: { weekStart: { gte: from } },
        include: {
          sessions: {
            include: { trainingLogs: { where: { userId: user.id } } },
          },
        },
        orderBy: { weekNumber: "asc" },
      },
    },
  });

  if (!plan) return [];

  return plan.weeks.map((week) => ({
    weekNumber: week.weekNumber,
    weekStart: week.weekStart,
    planned: week.sessions.length,
    completed: week.sessions.filter((s) => s.trainingLogs.length > 0).length,
  }));
}

export async function getConsistencyData(days = 84) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const from = subDays(startOfDay(new Date()), days);

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: from },
    },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  return logs.map((l) => l.date.toISOString().split("T")[0]);
}
