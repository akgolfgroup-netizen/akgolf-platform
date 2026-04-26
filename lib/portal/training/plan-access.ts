/**
 * Tilgangsstyring for TrainingPlan.
 *
 * Brukes av server actions for å avgjøre om en bruker kan se/redigere
 * en gitt plan. Dekker både plan-eier (spiller), tildelt coach (staff
 * som har laget eller fått ansvar for planen) og admin.
 */

import type { TrainingPlan } from "@prisma/client";
import { isStaff } from "@/lib/portal/rbac";

export type PlanAccessRole = "owner" | "coach" | "admin" | null;

export type PlanAccessSubject = Pick<
  TrainingPlan,
  "studentId" | "createdById"
>;

export type AccessUser = {
  id: string;
  role?: string;
};

/**
 * Returnerer hvilken tilgang brukeren har til planen, eller null hvis ingen.
 *
 * - "owner"  — `plan.studentId === user.id` (plan-eier).
 * - "coach"  — staff (ADMIN/INSTRUCTOR) som har opprettet planen.
 * - "admin"  — ADMIN-rollen, uavhengig av createdById.
 * - null     — ingen tilgang.
 */
export function canAccessPlan(
  plan: PlanAccessSubject,
  user: AccessUser
): PlanAccessRole {
  if (plan.studentId === user.id) return "owner";
  if (user.role === "ADMIN") return "admin";
  if (isStaff(user.role) && plan.createdById === user.id) return "coach";
  return null;
}

/**
 * Kan brukeren redigere planen?
 * Eier, tildelt coach og admin kan redigere.
 */
export function canEditPlan(
  plan: PlanAccessSubject,
  user: AccessUser
): boolean {
  return canAccessPlan(plan, user) !== null;
}
