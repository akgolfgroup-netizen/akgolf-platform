"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import {
  startOfISOWeek,
  endOfISOWeek,
  isWithinInterval,
} from "date-fns";

export async function getActivePlan(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const id = studentId ?? user.id;

  return prisma.trainingPlan.findFirst({
    where: { studentId: id, isActive: true },
    include: {
      weeks: {
        include: { sessions: { orderBy: { sortOrder: "asc" } } },
        orderBy: { weekNumber: "asc" },
      },
    },
  });
}

export async function getCurrentWeekSessions(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;
  const now = new Date();
  const weekStart = startOfISOWeek(now);
  const weekEnd = endOfISOWeek(now);

  const plan = await prisma.trainingPlan.findFirst({
    where: { studentId: id, isActive: true },
    include: {
      weeks: {
        where: {
          weekStart: { lte: weekEnd },
        },
        include: { sessions: { orderBy: { dayOfWeek: "asc" } } },
        orderBy: { weekNumber: "asc" },
      },
    },
  });

  if (!plan) return [];

  // Find week that contains today
  const currentWeek = plan.weeks.find((w) =>
    isWithinInterval(now, {
      start: w.weekStart,
      end: endOfISOWeek(w.weekStart),
    })
  );

  return currentWeek?.sessions ?? [];
}
