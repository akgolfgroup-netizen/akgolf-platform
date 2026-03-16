"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";
import { checkAchievements } from "@/lib/portal/achievements/check-achievements";

export async function getTrainingLogs(month?: Date) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const ref = month ?? new Date();
  const from = startOfMonth(ref);
  const to = endOfMonth(ref);

  return prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: from, lte: to },
    },
    include: {
      planSession: {
        select: { id: true, title: true, focusArea: true, durationMinutes: true },
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function logSession(data: {
  planSessionId?: string;
  date: string;
  durationMinutes?: number;
  focusArea?: string;
  notes?: string;
  rating?: number;
  deviatedFromPlan?: boolean;
  deviationReason?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  await prisma.trainingLog.create({
    data: {
      userId: user.id,
      planSessionId: data.planSessionId ?? null,
      date: new Date(data.date),
      durationMinutes: data.durationMinutes ?? null,
      focusArea: data.focusArea ?? null,
      exercises: [],
      notes: data.notes ?? null,
      rating: data.rating ?? null,
      deviatedFromPlan: data.deviatedFromPlan ?? false,
      deviationReason: data.deviationReason ?? null,
    },
  });

  revalidatePath("/dagbok");
  revalidatePath("/treningsplan");
  revalidatePath("/analyse");

  // Check achievements in background
  checkAchievements(user.id).catch(() => {});
}

export async function updateTrainingLog(
  id: string,
  data: Partial<{
    durationMinutes: number;
    focusArea: string;
    notes: string;
    rating: number;
    deviatedFromPlan: boolean;
    deviationReason: string;
  }>
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existing = await prisma.trainingLog.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) throw new Error("Not found");

  await prisma.trainingLog.update({ where: { id }, data });
  revalidatePath("/dagbok");
}

export async function deleteTrainingLog(id: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existing = await prisma.trainingLog.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) throw new Error("Not found");

  await prisma.trainingLog.delete({ where: { id } });
  revalidatePath("/dagbok");
  revalidatePath("/analyse");
}

// Returns planSessionIds that have been logged today by the current user
export async function getLoggedSessionIds() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: today, lt: tomorrow },
      planSessionId: { not: null },
    },
    select: { planSessionId: true },
  });

  return logs.map((l) => l.planSessionId!);
}
