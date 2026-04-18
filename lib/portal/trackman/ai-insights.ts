// TrackMan AI Insights — kjerne-logikk uten auth-avhengighet
// Kan kalles fra både server actions og import-pipeline

import Anthropic from "@anthropic-ai/sdk";
import { subDays } from "date-fns";
import { prisma } from "@/lib/portal/prisma";
import {
  buildTrackManInsightsPrompt,
  type TrackManTrainingContext,
} from "@/lib/portal/ai/prompts/trackman-insights";
import type { TrackManAnalyticsSummary } from "@/app/portal/(dashboard)/trackman/actions";

async function buildTrainingContext(userId: string): Promise<TrackManTrainingContext | undefined> {
  const since = subDays(new Date(), 14);

  const [logs, activePlan] = await Promise.all([
    prisma.trainingLog.findMany({
      where: { userId, date: { gte: since } },
      select: { durationMinutes: true, focusArea: true },
    }),
    prisma.trainingPlan.findFirst({
      where: { studentId: userId, isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        TrainingPlanWeek: {
          orderBy: { weekNumber: "asc" },
          take: 20,
        },
      },
    }),
  ]);

  if (logs.length === 0 && !activePlan) return undefined;

  const totalMinutes = logs.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
  const hoursLast14d = totalMinutes / 60;
  const weeklyHours = hoursLast14d / 2;

  const focusCount = new Map<string, number>();
  for (const l of logs) {
    if (!l.focusArea) continue;
    focusCount.set(l.focusArea, (focusCount.get(l.focusArea) ?? 0) + 1);
  }
  const topFocusAreas = Array.from(focusCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const periodType = activePlan?.periodType as
    | "grunnperiode"
    | "spesialiseringsperiode"
    | "turneringsperiode"
    | undefined;

  const validPeriod =
    periodType === "grunnperiode" ||
    periodType === "spesialiseringsperiode" ||
    periodType === "turneringsperiode"
      ? periodType
      : null;

  let planFocus: string | null = null;
  if (activePlan) {
    const today = new Date();
    const weekIdx = Math.floor(
      (today.getTime() - new Date(activePlan.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    const currentWeek =
      activePlan.TrainingPlanWeek.find((w) => w.weekNumber === weekIdx + 1) ??
      activePlan.TrainingPlanWeek[0];
    planFocus = currentWeek?.focus ?? null;
  }

  return {
    sessionsLast14d: logs.length,
    hoursLast14d,
    weeklyHours,
    topFocusAreas,
    activePeriodType: validPeriod,
    planFocus,
  };
}

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const INSIGHT_CACHE_HOURS = 24;

export type TrackManInsightResult = {
  insights: string[];
  focusAreas: string[];
  metadata: {
    generatedAt: string;
    cached: boolean;
    model: string;
  };
};

/**
 * Generer (eller hent cached) AI-innsikter for en TrackMan-sesjon.
 * Cache-tid: 24 timer. Krever ingen auth — kalles med eksplisitt userId.
 */
export async function generateTrackManInsightsCore(
  sessionId: string,
  userId: string,
  playerName?: string | null
): Promise<TrackManInsightResult> {
  const analytics = await prisma.trackManSessionAnalytics.findUnique({
    where: { sessionId },
  });

  if (!analytics) {
    throw new Error("Fant ingen analytics for denne sesjonen");
  }

  // Eierskaps-sjekk (ikke auth, men data-integritet)
  if (analytics.userId !== userId) {
    throw new Error("Session tilhører ikke angitt bruker");
  }

  // Sjekk om det er nok data for meningsfulle innsikter
  let totalShots = 0;
  for (const stats of [analytics.driverStats, analytics.ironStats, analytics.wedgeStats]) {
    if (stats && typeof stats === "object" && !Array.isArray(stats)) {
      const count = (stats as Record<string, unknown>)["shotCount"];
      if (typeof count === "number") totalShots += count;
    }
  }

  if (totalShots < 5) {
    const fallback = {
      insights: [
        "For få slag registrert i denne sesjonen for å gi detaljerte innsikter. Prøv å få inn minst 10–15 slag neste gang.",
      ],
      focusAreas: ["Øk antall slag i neste TrackMan-økt for bedre analyse"],
      metadata: {
        generatedAt: new Date().toISOString(),
        cached: false,
        model: ANTHROPIC_MODEL,
      },
    };
    // Ikke lagre fallback i DB — la spilleren regenerere når det er nok data
    return fallback;
  }

  // Sjekk cache
  const cacheCutoff = new Date(Date.now() - INSIGHT_CACHE_HOURS * 60 * 60 * 1000);
  const hasFreshCache =
    analytics.generatedInsights.length > 0 &&
    analytics.recommendedFocus.length > 0 &&
    analytics.updatedAt > cacheCutoff;

  if (hasFreshCache) {
    return {
      insights: analytics.generatedInsights,
      focusAreas: analytics.recommendedFocus,
      metadata: {
        generatedAt: analytics.updatedAt.toISOString(),
        cached: true,
        model: ANTHROPIC_MODEL,
      },
    };
  }

  // Bygg prompt
  const summary: TrackManAnalyticsSummary = {
    id: analytics.id,
    sessionId: analytics.sessionId,
    driverStats: analytics.driverStats as Record<string, unknown> | null,
    ironStats: analytics.ironStats as Record<string, unknown> | null,
    wedgeStats: analytics.wedgeStats as Record<string, unknown> | null,
    avgBallSpeed: analytics.avgBallSpeed,
    maxBallSpeed: analytics.maxBallSpeed,
    avgCarryDistance: analytics.avgCarryDistance,
    maxCarryDistance: analytics.maxCarryDistance,
    ballSpeedConsistency: analytics.ballSpeedConsistency,
    distanceConsistency: analytics.distanceConsistency,
    shotShapeDistribution: analytics.shotShapeDistribution as Record<string, unknown> | null,
    missPattern: analytics.missPattern as Record<string, unknown> | null,
    sweetSpotPercentage: analytics.sweetSpotPercentage,
    trendBallSpeed: analytics.trendBallSpeed,
    trendDistance: analytics.trendDistance,
    trendConsistency: analytics.trendConsistency,
    generatedInsights: analytics.generatedInsights,
    recommendedFocus: analytics.recommendedFocus,
    createdAt: analytics.createdAt,
    updatedAt: analytics.updatedAt,
  };

  const trainingContext = await buildTrainingContext(userId);

  const { system, user: userPrompt } = buildTrackManInsightsPrompt(
    summary,
    playerName ?? undefined,
    trainingContext
  );

  // Kall Anthropic
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Parse JSON-respons
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Ingen tekstrespons fra AI");
  }

  let parsed: { insights: string[]; focusAreas: string[] };
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      throw new Error("Kunne ikke tolke AI-respons som JSON");
    }
  }

  if (!Array.isArray(parsed.insights) || !Array.isArray(parsed.focusAreas)) {
    throw new Error("Ugyldig responsformat fra AI");
  }

  const insights = parsed.insights.slice(0, 5);
  const focusAreas = parsed.focusAreas.slice(0, 3);

  // Lagre i DB
  await prisma.trackManSessionAnalytics.update({
    where: { sessionId },
    data: {
      generatedInsights: insights,
      recommendedFocus: focusAreas,
    },
  });

  return {
    insights,
    focusAreas,
    metadata: {
      generatedAt: new Date().toISOString(),
      cached: false,
      model: ANTHROPIC_MODEL,
    },
  };
}
