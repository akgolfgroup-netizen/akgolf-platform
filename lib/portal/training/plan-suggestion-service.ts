/**
 * PlanSuggestion-service (Sprint 2 — forslags-modus).
 *
 * Server-only — bruker prisma. Kalles fra:
 *   - admin/treningsplan/actions.ts (proposeSessionEdit)
 *   - portal/treningsplan/actions.ts (acceptSuggestion, rejectSuggestion, listPendingSuggestions)
 */

import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import type {
  PlanSuggestionView,
  SessionEditDiff,
  SessionSuggestionPayload,
  SuggestionTargetType,
} from "./plan-suggestion-types";

const SESSION_FIELDS: (keyof SessionEditDiff)[] = [
  "title",
  "description",
  "durationMinutes",
  "focusArea",
  "facilityId",
  "dayOfWeek",
];

/**
 * Bygg diff for en sesjons-endring: kun feltene som faktisk endres.
 */
export function buildSessionDiff(
  current: Partial<SessionEditDiff>,
  proposed: Partial<SessionEditDiff>
): { before: SessionEditDiff; after: SessionEditDiff } {
  const before: SessionEditDiff = {};
  const after: SessionEditDiff = {};

  for (const field of SESSION_FIELDS) {
    if (proposed[field] === undefined) continue;
    const beforeVal = current[field];
    const afterVal = proposed[field];
    if (beforeVal === afterVal) continue;
    (before as Record<string, unknown>)[field] = beforeVal ?? null;
    (after as Record<string, unknown>)[field] = afterVal ?? null;
  }

  return { before, after };
}

/**
 * Opprett et forslag — kun coach kaller dette.
 * Caller MÅ ha verifisert at brukeren har tilgang til planen.
 */
export async function createSuggestion(params: {
  planId: string;
  proposedById: string;
  targetType: SuggestionTargetType;
  targetId: string | null;
  diffJson: SessionSuggestionPayload | Record<string, unknown>;
  rationale?: string | null;
}): Promise<{ id: string }> {
  const id = nanoid();
  await prisma.planSuggestion.create({
    data: {
      id,
      planId: params.planId,
      proposedById: params.proposedById,
      targetType: params.targetType,
      targetId: params.targetId,
      diffJson: params.diffJson as object,
      rationale: params.rationale?.trim() || null,
      status: "PENDING",
    },
  });
  return { id };
}

/**
 * Hent alle aktive (PENDING) forslag for en plan, beriket for visning.
 */
export async function listPendingSuggestionsForPlan(
  planId: string
): Promise<PlanSuggestionView[]> {
  const rows = await prisma.planSuggestion.findMany({
    where: { planId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      User_proposedBy: { select: { id: true, name: true } },
    },
  });

  // Hent økt-titler i bulk for session-targets
  const sessionIds = rows
    .filter((r) => r.targetType === "session" && r.targetId)
    .map((r) => r.targetId as string);
  const sessions = sessionIds.length
    ? await prisma.trainingPlanSession.findMany({
        where: { id: { in: sessionIds } },
        select: { id: true, title: true, dayOfWeek: true },
      })
    : [];
  const sessionMap = new Map(sessions.map((s) => [s.id, s]));

  return rows.map((r) => {
    const sessionInfo = r.targetId ? sessionMap.get(r.targetId) : null;
    let targetLabel = "Treningsplanen";
    if (r.targetType === "session" && sessionInfo) {
      targetLabel = sessionInfo.title;
    } else if (r.targetType === "session") {
      targetLabel = "Slettet økt";
    } else if (r.targetType === "week") {
      targetLabel = "En uke";
    } else if (r.targetType === "distribution") {
      targetLabel = "AK-fordelingen";
    }

    return {
      id: r.id,
      planId: r.planId,
      targetType: r.targetType as SuggestionTargetType,
      targetId: r.targetId,
      status: r.status as PlanSuggestionView["status"],
      rationale: r.rationale,
      createdAt: r.createdAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() ?? null,
      rejectionReason: r.rejectionReason,
      proposedBy: {
        id: r.User_proposedBy.id,
        name: r.User_proposedBy.name,
      },
      targetLabel,
      diff: r.diffJson as unknown as SessionSuggestionPayload,
    };
  });
}

/**
 * Bruk en sesjons-diff på en TrainingPlanSession (idempotent — overskriver felter).
 */
export async function applySessionDiff(
  sessionId: string,
  diff: SessionEditDiff
): Promise<void> {
  const data: Record<string, unknown> = {};
  if (diff.title !== undefined) data.title = diff.title;
  if (diff.description !== undefined) data.description = diff.description;
  if (diff.durationMinutes !== undefined) data.durationMinutes = diff.durationMinutes;
  if (diff.focusArea !== undefined) data.focusArea = diff.focusArea;
  if (diff.facilityId !== undefined) data.facilityId = diff.facilityId;
  if (diff.dayOfWeek !== undefined) data.dayOfWeek = diff.dayOfWeek;

  if (Object.keys(data).length === 0) return;

  await prisma.trainingPlanSession.update({
    where: { id: sessionId },
    data,
  });
}
