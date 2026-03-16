"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import type { GoalCategory, GoalStatus } from "@prisma/client";

export async function getGoals() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  return prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGoal(data: {
  title: string;
  description?: string;
  category: GoalCategory;
  targetValue?: number;
  unit?: string;
  targetDate?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: data.title,
      description: data.description ?? null,
      category: data.category,
      targetValue: data.targetValue ?? null,
      unit: data.unit ?? null,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    },
  });

  revalidatePath("/profil");
}

export async function updateGoal(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: GoalCategory;
    targetValue: number;
    currentValue: number;
    unit: string;
    targetDate: string;
    status: GoalStatus;
  }>
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const existing = await prisma.goal.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) throw new Error("Mål ikke funnet");

  await prisma.goal.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.targetValue !== undefined && { targetValue: data.targetValue }),
      ...(data.currentValue !== undefined && { currentValue: data.currentValue }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.targetDate !== undefined && { targetDate: new Date(data.targetDate) }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });

  revalidatePath("/profil");
}

export async function deleteGoal(id: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const existing = await prisma.goal.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) throw new Error("Mål ikke funnet");

  await prisma.goal.delete({ where: { id } });
  revalidatePath("/profil");
}
