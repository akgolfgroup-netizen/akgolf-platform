// Feedback collector — trener-inline + spiller-NPS

import type { Prisma } from "@prisma/client";

export type FeedbackType = "AI_OUTPUT" | "PLAYER_NPS" | "PARENT_SATISFACTION";

export interface TrainerFeedback {
  aiCallId: string;
  outcome: "APPROVED" | "EDITED" | "REJECTED";
  ratings?: {
    relevance: 1 | 2 | 3 | 4 | 5;
    accuracy: 1 | 2 | 3 | 4 | 5;
    actionability: 1 | 2 | 3 | 4 | 5;
  };
  comments?: string;
  editsAreas?: string[];
  editsSeverity?: "MINOR" | "MAJOR";
}

export interface PlayerNPS {
  playerId: string;
  nps: number; // 0-10
  category?: string;
  reason?: string; // åpen tekst
  recommendForImprovement?: string;
}

/**
 * Lagre trener-feedback per AI-call.
 * Returnerer feedback-ID.
 */
export async function logTrainerFeedback(
  prisma: { aIAuditLog: { update: (args: Prisma.AIAuditLogUpdateArgs) => Promise<unknown> } },
  feedback: TrainerFeedback
): Promise<void> {
  await prisma.aIAuditLog.update({
    where: { id: feedback.aiCallId },
    data: {
      approvedByUser: feedback.outcome === "APPROVED",
      // Lagre feedback i outputs JSON-felt
      outputs: {
        feedback,
      } as never,
    },
  });
}

/**
 * Logg NPS-svar fra spilleren.
 * Lagres i AIAuditLog med spesialfeature.
 */
export async function logPlayerNPS(
  prisma: { aIAuditLog: { create: (args: Prisma.AIAuditLogCreateArgs) => Promise<unknown> } },
  nps: PlayerNPS
): Promise<void> {
  await prisma.aIAuditLog.create({
    data: {
      callerId: nps.playerId,
      callerRole: "STUDENT",
      feature: "feedback:player_nps",
      modelUsed: "n/a",
      inputs: { category: nps.category } as never,
      outputs: {
        nps: nps.nps,
        reason: nps.reason,
        recommendForImprovement: nps.recommendForImprovement,
      } as never,
    },
  });
}

/**
 * Aggreger NPS-resultater for en periode.
 */
export async function aggregateNPS(
  prisma: { aIAuditLog: { findMany: (args: Prisma.AIAuditLogFindManyArgs) => Promise<Array<{ outputs: unknown; inputs: unknown }>> } },
  startDate: Date,
  endDate: Date
): Promise<{
  totalResponses: number;
  promoters: number; // 9-10
  passives: number; // 7-8
  detractors: number; // 0-6
  npsScore: number;
  byCategory: Record<string, { count: number; nps: number }>;
}> {
  const logs = await prisma.aIAuditLog.findMany({
    where: {
      feature: "feedback:player_nps",
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  let promoters = 0;
  let passives = 0;
  let detractors = 0;
  const byCategory: Record<string, { count: number; promoters: number; detractors: number }> = {};

  for (const log of logs) {
    const outputs = log.outputs as { nps?: number };
    const inputs = log.inputs as { category?: string };
    const score = outputs.nps;
    if (typeof score !== "number") continue;

    if (score >= 9) promoters++;
    else if (score >= 7) passives++;
    else detractors++;

    const cat = inputs.category ?? "unknown";
    if (!byCategory[cat]) byCategory[cat] = { count: 0, promoters: 0, detractors: 0 };
    byCategory[cat].count++;
    if (score >= 9) byCategory[cat].promoters++;
    else if (score < 7) byCategory[cat].detractors++;
  }

  const total = promoters + passives + detractors;
  const npsScore = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

  const byCategoryAggregated: Record<string, { count: number; nps: number }> = {};
  for (const [cat, data] of Object.entries(byCategory)) {
    byCategoryAggregated[cat] = {
      count: data.count,
      nps: Math.round(((data.promoters - data.detractors) / data.count) * 100),
    };
  }

  return {
    totalResponses: total,
    promoters,
    passives,
    detractors,
    npsScore: Math.round(npsScore),
    byCategory: byCategoryAggregated,
  };
}
