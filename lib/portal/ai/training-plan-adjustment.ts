import { subDays, differenceInDays } from "date-fns";
import { prisma } from "@/lib/portal/prisma";

export type AdjustmentReason = "improved" | "simplify" | "stagnant";

export interface ProgressionAnalysis {
  userId: string;
  shouldRegenerate: boolean;
  reason: AdjustmentReason | null;
  evidence: string;
  currentFocusAreas: string[];
  suggestedFocusAreas: string[];
  sessionCount: number;
  averageRating: number | null;
  averageSuccessRate: number | null;
  planAgeDays: number | null;
}

const LOOKBACK_DAYS = 14;
const MIN_SESSIONS_FOR_SIGNAL = 3;
const COOLDOWN_DAYS = 10;
const IMPROVED_RATING_THRESHOLD = 4.3; // out of 5
const IMPROVED_SUCCESS_THRESHOLD = 0.75;
const SIMPLIFY_SUCCESS_THRESHOLD = 0.35;
const SIMPLIFY_RATING_THRESHOLD = 2.6;

export async function analyzeProgressionAndAdjust(
  userId: string
): Promise<ProgressionAnalysis> {
  const since = subDays(new Date(), LOOKBACK_DAYS);

  const [logs, activePlan, prescription] = await Promise.all([
    prisma.trainingLog.findMany({
      where: { userId, date: { gte: since } },
      include: { TrainingLogExercises: true },
      orderBy: { date: "desc" },
    }),
    prisma.trainingPlan.findFirst({
      where: {
        studentId: userId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.trainingPrescription.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    }),
  ]);

  const planAgeDays = activePlan
    ? differenceInDays(new Date(), activePlan.createdAt)
    : null;

  const currentFocusAreas = prescription?.focusAreas ?? [];

  // Aggregate per focusArea
  const perFocus = new Map<string, { ratings: number[]; successRates: number[]; count: number }>();
  for (const log of logs) {
    const area = log.focusArea ?? "Annet";
    const bucket = perFocus.get(area) ?? { ratings: [], successRates: [], count: 0 };
    bucket.count += 1;
    if (log.rating != null) bucket.ratings.push(log.rating);
    for (const ex of log.TrainingLogExercises) {
      if (ex.successRate != null) bucket.successRates.push(ex.successRate);
    }
    perFocus.set(area, bucket);
  }

  // Overall averages
  const allRatings = logs.map((l) => l.rating).filter((r): r is number => r != null);
  const allSuccess = logs
    .flatMap((l) => l.TrainingLogExercises.map((e) => e.successRate))
    .filter((s): s is number => s != null);

  const averageRating =
    allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : null;
  const averageSuccessRate =
    allSuccess.length > 0 ? allSuccess.reduce((a, b) => a + b, 0) / allSuccess.length : null;

  // Cooldown check
  if (planAgeDays != null && planAgeDays < COOLDOWN_DAYS) {
    return {
      userId,
      shouldRegenerate: false,
      reason: null,
      evidence: `Plan under cooldown (${planAgeDays} dager siden generert, krever ${COOLDOWN_DAYS}).`,
      currentFocusAreas,
      suggestedFocusAreas: currentFocusAreas,
      sessionCount: logs.length,
      averageRating,
      averageSuccessRate,
      planAgeDays,
    };
  }

  if (logs.length < MIN_SESSIONS_FOR_SIGNAL) {
    return {
      userId,
      shouldRegenerate: false,
      reason: null,
      evidence: `For få økter (${logs.length}) for å justere plan.`,
      currentFocusAreas,
      suggestedFocusAreas: currentFocusAreas,
      sessionCount: logs.length,
      averageRating,
      averageSuccessRate,
      planAgeDays,
    };
  }

  // Find an "improved" focus area among current focus
  const improvedAreas: string[] = [];
  const needsSimplifyAreas: string[] = [];

  for (const [area, data] of perFocus.entries()) {
    if (data.count < MIN_SESSIONS_FOR_SIGNAL) continue;
    const avgRating =
      data.ratings.length > 0 ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length : null;
    const avgSuccess =
      data.successRates.length > 0
        ? data.successRates.reduce((a, b) => a + b, 0) / data.successRates.length
        : null;

    const isCurrentFocus = currentFocusAreas.some((f) =>
      f.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(f.toLowerCase())
    );

    if (!isCurrentFocus) continue;

    const ratingImproved = avgRating != null && avgRating >= IMPROVED_RATING_THRESHOLD;
    const successImproved = avgSuccess != null && avgSuccess >= IMPROVED_SUCCESS_THRESHOLD;
    const ratingStruggling = avgRating != null && avgRating <= SIMPLIFY_RATING_THRESHOLD;
    const successStruggling = avgSuccess != null && avgSuccess <= SIMPLIFY_SUCCESS_THRESHOLD;

    if (ratingImproved || successImproved) {
      improvedAreas.push(area);
    } else if (ratingStruggling || successStruggling) {
      needsSimplifyAreas.push(area);
    }
  }

  if (improvedAreas.length > 0) {
    const gapAnalysis = prescription?.gapAnalysisJson as Record<string, unknown> | undefined;
    const orderedWeaknesses = Array.isArray(gapAnalysis?.orderedWeaknesses)
      ? (gapAnalysis.orderedWeaknesses as string[])
      : [];

    // Shift to next weakness not already mastered
    const suggestedFocusAreas = orderedWeaknesses.length > 0
      ? orderedWeaknesses.filter((w) => !improvedAreas.includes(w)).slice(0, 3)
      : currentFocusAreas.filter((f) => !improvedAreas.includes(f));

    if (suggestedFocusAreas.length === 0) {
      return {
        userId,
        shouldRegenerate: false,
        reason: null,
        evidence: `Forbedret på ${improvedAreas.join(", ")}, men ingen ny svakhet å flytte fokus til.`,
        currentFocusAreas,
        suggestedFocusAreas: currentFocusAreas,
        sessionCount: logs.length,
        averageRating,
        averageSuccessRate,
        planAgeDays,
      };
    }

    return {
      userId,
      shouldRegenerate: true,
      reason: "improved",
      evidence: `Forbedret på ${improvedAreas.join(", ")} basert på ${logs.length} logger siste ${LOOKBACK_DAYS} dager.`,
      currentFocusAreas,
      suggestedFocusAreas,
      sessionCount: logs.length,
      averageRating,
      averageSuccessRate,
      planAgeDays,
    };
  }

  if (needsSimplifyAreas.length > 0) {
    return {
      userId,
      shouldRegenerate: true,
      reason: "simplify",
      evidence: `Sliter med ${needsSimplifyAreas.join(", ")} (snitt rating ${averageRating?.toFixed(1) ?? "?"}, success ${(averageSuccessRate ?? 0).toFixed(2)}).`,
      currentFocusAreas,
      suggestedFocusAreas: currentFocusAreas, // behold fokus men regenerer med enklere variant
      sessionCount: logs.length,
      averageRating,
      averageSuccessRate,
      planAgeDays,
    };
  }

  return {
    userId,
    shouldRegenerate: false,
    reason: null,
    evidence: "Ingen terskel trigget. Plan forblir uendret.",
    currentFocusAreas,
    suggestedFocusAreas: currentFocusAreas,
    sessionCount: logs.length,
    averageRating,
    averageSuccessRate,
    planAgeDays,
  };
}

export function buildAdjustmentGoals(
  analysis: ProgressionAnalysis,
  baseGoals: string | null
): string {
  const base = baseGoals?.trim() || "Bli en bedre golfer med strukturert trening.";
  if (analysis.reason === "improved") {
    return `${base}\n\nAuto-justering: Spilleren har forbedret seg på tidligere fokusområder (${analysis.currentFocusAreas.join(", ") || "generell teknikk"}). Flytt fokus til: ${analysis.suggestedFocusAreas.join(", ")}.`;
  }
  if (analysis.reason === "simplify") {
    return `${base}\n\nAuto-justering: Spilleren sliter med nåværende øvelser (snitt-rating ${analysis.averageRating?.toFixed(1) ?? "?"}, success ${(analysis.averageSuccessRate ?? 0).toFixed(2)}). Behold fokusområdene ${analysis.currentFocusAreas.join(", ")}, men bruk ENKLERE varianter, kortere avstander, lavere press og mer repetisjon.`;
  }
  return base;
}
