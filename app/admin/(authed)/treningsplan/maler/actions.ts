"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAllTemplatesForAdmin } from "@/lib/portal/training/template-service";

async function requireStaff() {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    throw new Error("Kun staff har tilgang");
  }
  return user;
}

const sessionSchema = z.object({
  dayOfWeek: z.number().int().min(1).max(7),
  title: z.string().min(1).max(200),
  durationMinutes: z.number().int().min(1).max(480),
  focusArea: z.string().max(100),
  description: z.string().max(1000).optional(),
});

const templateSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd").max(200),
  description: z.string().max(1000).optional(),
  iconName: z.string().max(50).optional(),
  badge: z.string().max(50).optional(),
  periodType: z.enum(["PREPARATION", "COMPETITION", "RECOVERY", "OFF_SEASON"]),
  weekPattern: z.array(sessionSchema).min(1, "Minst én økt").max(20),
  weeklyFocusTemplate: z.string().max(200).optional(),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type TemplateInput = z.infer<typeof templateSchema>;

export async function listTemplatesForAdmin() {
  await requireStaff();
  return getAllTemplatesForAdmin();
}

export async function createTemplate(input: TemplateInput) {
  const user = await requireStaff();
  const parsed = templateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ugyldig input");
  }

  const data = parsed.data;
  const id = nanoid();

  await prisma.trainingPlanTemplate.create({
    data: {
      id,
      title: data.title,
      description: data.description,
      iconName: data.iconName,
      badge: data.badge,
      periodType: data.periodType,
      weekPattern: data.weekPattern,
      weeklyFocusTemplate: data.weeklyFocusTemplate,
      isPublic: data.isPublic,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      createdById: user.id,
    },
  });

  revalidatePath("/admin/treningsplan/maler");
  revalidatePath("/portal/treningsplan");
  return { success: true, id };
}

export async function updateTemplate(id: string, input: Partial<TemplateInput>) {
  await requireStaff();

  const existing = await prisma.trainingPlanTemplate.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("Mal ikke funnet");

  const partial = templateSchema.partial().safeParse(input);
  if (!partial.success) {
    throw new Error(partial.error.issues[0]?.message ?? "Ugyldig input");
  }

  await prisma.trainingPlanTemplate.update({
    where: { id },
    data: {
      ...partial.data,
      ...(partial.data.weekPattern
        ? { weekPattern: partial.data.weekPattern }
        : {}),
    },
  });

  revalidatePath("/admin/treningsplan/maler");
  revalidatePath("/portal/treningsplan");
  return { success: true };
}

export async function toggleTemplateActive(id: string) {
  await requireStaff();
  const t = await prisma.trainingPlanTemplate.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!t) throw new Error("Mal ikke funnet");

  await prisma.trainingPlanTemplate.update({
    where: { id },
    data: { isActive: !t.isActive },
  });

  revalidatePath("/admin/treningsplan/maler");
  revalidatePath("/portal/treningsplan");
  return { success: true, isActive: !t.isActive };
}

export async function deleteTemplate(id: string) {
  await requireStaff();
  await prisma.trainingPlanTemplate.delete({ where: { id } });

  revalidatePath("/admin/treningsplan/maler");
  revalidatePath("/portal/treningsplan");
  return { success: true };
}
