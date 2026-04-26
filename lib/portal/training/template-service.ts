/**
 * Template-service for treningsplan-maler.
 *
 * Sentralisert lese-tilgang til TrainingPlanTemplate i DB med fallback til
 * hardkodede maler i lib/portal/training/standard-templates.ts.
 *
 * Brukes både av spillerens wizard (PlanCreatorModal) og av admin-UI.
 */

import { prisma } from "@/lib/portal/prisma";
import {
  STANDARD_TEMPLATES,
  type StandardTemplate,
  type TemplateSession,
} from "./standard-templates";

export type ResolvedTemplate = StandardTemplate & {
  source: "db" | "fallback";
};

/**
 * Konverter DB-rad til StandardTemplate-format.
 */
function dbRowToTemplate(row: {
  id: string;
  title: string;
  description: string | null;
  iconName: string | null;
  badge: string | null;
  periodType: string;
  weekPattern: unknown;
  weeklyFocusTemplate: string | null;
}): StandardTemplate {
  const pattern = Array.isArray(row.weekPattern)
    ? (row.weekPattern as TemplateSession[])
    : [];
  return {
    id: row.id as StandardTemplate["id"],
    title: row.title,
    description: row.description ?? "",
    iconName: row.iconName ?? "fitness_center",
    badge: row.badge ?? undefined,
    periodType: (row.periodType as StandardTemplate["periodType"]) ?? "PREPARATION",
    weekPattern: pattern,
    weeklyFocusTemplate: row.weeklyFocusTemplate ?? "",
  };
}

/**
 * Hent alle aktive, offentlige maler. Faller tilbake til hardkodet
 * STANDARD_TEMPLATES hvis tabellen er tom (f.eks. før engangs-migreringen).
 */
export async function getActiveTemplates(): Promise<ResolvedTemplate[]> {
  try {
    const rows = await prisma.trainingPlanTemplate.findMany({
      where: { isActive: true, isPublic: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (rows.length > 0) {
      return rows.map((r) => ({ ...dbRowToTemplate(r), source: "db" }));
    }
  } catch (err) {
    // Hvis tabellen ikke finnes eller DB er nede, fall tilbake.
    console.warn("[template-service] DB-fetch feilet, bruker fallback:", err);
  }

  return STANDARD_TEMPLATES.map((t) => ({ ...t, source: "fallback" }));
}

/**
 * Hent én mal med id. Sjekker DB først, faller tilbake til hardkodet.
 */
export async function getTemplateById(
  id: string
): Promise<ResolvedTemplate | null> {
  try {
    const row = await prisma.trainingPlanTemplate.findUnique({
      where: { id },
    });
    if (row && row.isActive) {
      return { ...dbRowToTemplate(row), source: "db" };
    }
  } catch {
    // ignored — fall through to fallback
  }

  const fallback = STANDARD_TEMPLATES.find((t) => t.id === id);
  return fallback ? { ...fallback, source: "fallback" } : null;
}

/**
 * Admin-only: hent alle maler inkl. inaktive og private (for admin-UI).
 */
export async function getAllTemplatesForAdmin(): Promise<
  Array<
    StandardTemplate & {
      isActive: boolean;
      isPublic: boolean;
      createdAt: Date;
      sortOrder: number;
    }
  >
> {
  const rows = await prisma.trainingPlanTemplate.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return rows.map((r) => ({
    ...dbRowToTemplate(r),
    isActive: r.isActive,
    isPublic: r.isPublic,
    createdAt: r.createdAt,
    sortOrder: r.sortOrder,
  }));
}
