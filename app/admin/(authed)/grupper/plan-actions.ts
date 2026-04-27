"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { getActiveTemplates, getTemplateById } from "@/lib/portal/training/template-service";

export interface TemplateOption {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  weeksAvailable: number;
  source: "db" | "fallback";
}

async function requireStaff() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

async function assertCanEditGroup(groupId: string) {
  const user = await requireStaff();
  if (user.role === "ADMIN") return user;
  const group = await prisma.trainingGroup.findUnique({
    where: { id: groupId },
    select: { coachId: true },
  });
  if (!group || group.coachId !== user.id) {
    throw new Error("Kun gruppens coach kan endre planen");
  }
  return user;
}

/**
 * Hent maler tilgjengelig for å lage gruppeplaner.
 */
export async function listTemplatesForGroupPlan(): Promise<TemplateOption[]> {
  await requireStaff();
  const templates = await getActiveTemplates();
  return templates.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    iconName: t.iconName,
    badge: t.badge,
    weeksAvailable: t.weekPattern.length,
    source: t.source,
  }));
}

export interface CreateGroupPlanFromTemplateInput {
  groupId: string;
  templateId: string;
  /** Antall uker planen skal vare (1, 4, 8 eller 12) */
  weeks: number;
  /** ISO-dato (YYYY-MM-DD) for første uke. Mandag anbefales. */
  startDate: string;
  /** Valgfri tittel (overstyrer template.title) */
  title?: string;
}

/**
 * Lag en TrainingPlan tilknyttet en gruppe basert på en mal.
 * Spillerne får planen distribuert via `syncGroupPlanToMembers` separat.
 *
 * Plan-eier (studentId) settes til coachen som proxy — gruppe-plan er en
 * "mal-plan" som ikke vises i spilleroversikten direkte.
 */
export async function createGroupPlanFromTemplate(
  input: CreateGroupPlanFromTemplateInput,
): Promise<{ planId: string }> {
  const user = await assertCanEditGroup(input.groupId);

  if (![1, 4, 8, 12].includes(input.weeks)) {
    throw new Error("Antall uker må være 1, 4, 8 eller 12");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) {
    throw new Error("Ugyldig startdato");
  }

  const template = await getTemplateById(input.templateId);
  if (!template) throw new Error("Mal ikke funnet");

  // Deaktiver eksisterende gruppeplan (kun én aktiv om gangen per gruppe)
  await prisma.trainingPlan.updateMany({
    where: { groupId: input.groupId, isActive: true },
    data: { isActive: false, updatedAt: new Date() },
  });

  const startDate = new Date(`${input.startDate}T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + input.weeks * 7 - 1);

  const planId = randomUUID();

  // Bygg uker + økter parallelt med plan-creation
  const weeksData = Array.from({ length: input.weeks }, (_, i) => {
    const weekStart = new Date(startDate);
    weekStart.setUTCDate(startDate.getUTCDate() + i * 7);
    const weekId = randomUUID();
    const focus = template.weeklyFocusTemplate.replace("{n}", String(i + 1));
    return { weekId, weekNumber: i + 1, weekStart, focus };
  });

  await prisma.trainingPlan.create({
    data: {
      id: planId,
      studentId: user.id,
      createdById: user.id,
      groupId: input.groupId,
      title: input.title?.trim() || template.title,
      description: template.description,
      periodType: template.periodType,
      startDate,
      endDate,
      isActive: true,
      aiGenerated: false,
      updatedAt: new Date(),
      TrainingPlanWeek: {
        create: weeksData.map((w) => ({
          id: w.weekId,
          weekNumber: w.weekNumber,
          weekStart: w.weekStart,
          focus: w.focus,
          TrainingPlanSession: {
            create: template.weekPattern.map((s, idx) => ({
              id: randomUUID(),
              dayOfWeek: s.dayOfWeek,
              title: s.title,
              description: s.description ?? null,
              durationMinutes: s.durationMinutes,
              focusArea: s.focusArea,
              sortOrder: idx,
              exercises: [],
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/admin/grupper");
  updateTag("group-plans");
  return { planId };
}
