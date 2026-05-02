import { NextRequest, NextResponse } from "next/server";
import { addDays, subDays } from "date-fns";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { createNotification } from "@/lib/portal/notifications";
import {
  analyzeProgressionAndAdjust,
  buildAdjustmentGoals,
  type ProgressionAnalysis,
} from "@/lib/portal/ai/training-plan-adjustment";
import { generateTrainingPlan } from "@/lib/portal/ai/training-plan";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BATCH_LIMIT = 25;
const DEFAULT_DURATION_WEEKS = 4;

/**
 * Cron job: daily 03:00 UTC.
 * Analyzes last 14 days of TrainingLog per active student, and regenerates
 * the active TrainingPlan when thresholds for "improved" or "simplify" are met.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = subDays(new Date(), 30);

  const candidates = await prisma.user.findMany({
    where: {
      isActive: true,
      role: "STUDENT",
      OR: [
        { lastActiveAt: { gte: thirtyDaysAgo } },
        { TrainingLog: { some: { date: { gte: thirtyDaysAgo } } } },
      ],
      TrainingPlan_TrainingPlan_studentIdToUser: {
        some: { isActive: true },
      },
    },
    select: { id: true, name: true },
    take: BATCH_LIMIT,
  });

  let processed = 0;
  let regenerated = 0;
  let skipped = 0;
  let errors = 0;
  const report: Array<{
    userId: string;
    regenerated: boolean;
    reason: string | null;
    evidence: string;
  }> = [];

  for (const user of candidates) {
    processed++;
    try {
      const analysis = await analyzeProgressionAndAdjust(user.id);

      if (!analysis.shouldRegenerate) {
        skipped++;
        report.push({
          userId: user.id,
          regenerated: false,
          reason: analysis.reason,
          evidence: analysis.evidence,
        });
        continue;
      }

      await regeneratePlanForUser(user.id, analysis);
      regenerated++;
      report.push({
        userId: user.id,
        regenerated: true,
        reason: analysis.reason,
        evidence: analysis.evidence,
      });
    } catch (err) {
      errors++;
      logger.error(`[auto-adjust-training-plans] Failed for user ${user.id}:`, err);
      report.push({
        userId: user.id,
        regenerated: false,
        reason: null,
        evidence: `Feil: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  logger.info(
    `[auto-adjust-training-plans] processed=${processed} regenerated=${regenerated} skipped=${skipped} errors=${errors}`
  );

  return NextResponse.json({
    ok: true,
    processed,
    regenerated,
    skipped,
    errors,
    report,
    timestamp: new Date().toISOString(),
  });
}

async function regeneratePlanForUser(
  userId: string,
  analysis: ProgressionAnalysis
) {
  const activePlan = await prisma.trainingPlan.findFirst({
    where: { studentId: userId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!activePlan) {
    return;
  }

  const prescription = await prisma.trainingPrescription
    .findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    })
    .then((p) =>
      p
        ? {
            focusAreas:
              analysis.reason === "improved"
                ? analysis.suggestedFocusAreas
                : p.focusAreas,
            weeklyHours: p.weeklyHours,
            suggestedFormulaIds: p.suggestedFormulaIds,
            predictedHcpChange: p.predictedHcpChange,
            confidence: p.confidence,
            gradientJson: (p.gradientJson ?? {}) as Record<string, unknown>,
            gapAnalysisJson: (p.gapAnalysisJson ?? {}) as Record<string, unknown>,
            reasoning: "",
          }
        : undefined
    );

  const goals = buildAdjustmentGoals(analysis, activePlan.goals);
  const startDate = new Date().toISOString().split("T")[0];

  const result = await generateTrainingPlan(
    {
      goals,
      periodType: activePlan.periodType,
      durationWeeks: DEFAULT_DURATION_WEEKS,
      startDate,
    },
    prescription
  );

  // Single transaction: deactivate old, create new, weeks, sessions
  const planId = nanoid();
  const planStart = new Date(startDate);

  await prisma.$transaction(async (tx) => {
    await tx.trainingPlan.updateMany({
      where: { studentId: userId, isActive: true },
      data: { isActive: false, updatedAt: new Date() },
    });

    const reasonTag =
      analysis.reason === "improved"
        ? "[Auto-justert: forbedret fokus]"
        : "[Auto-justert: forenklet]";

    await tx.trainingPlan.create({
      data: {
        id: planId,
        studentId: userId,
        createdById: activePlan.createdById,
        title: `${result.title} ${reasonTag}`,
        description: analysis.evidence,
        goals: goals,
        periodType: activePlan.periodType,
        startDate: planStart,
        endDate: addDays(planStart, DEFAULT_DURATION_WEEKS * 7 - 1),
        isActive: true,
        aiGenerated: true,
        updatedAt: new Date(),
      },
    });

    for (const w of result.weeks) {
      const weekId = nanoid();
      const weekStart = addDays(planStart, (w.weekNumber - 1) * 7);

      await tx.trainingPlanWeek.create({
        data: {
          id: weekId,
          planId,
          weekNumber: w.weekNumber,
          weekStart,
          focus: w.focus,
          volumeLabel: w.volumeLabel,
        },
      });

      for (let idx = 0; idx < w.sessions.length; idx++) {
        const s = w.sessions[idx];
        await tx.trainingPlanSession.create({
          data: {
            id: nanoid(),
            weekId,
            dayOfWeek: s.dayOfWeek,
            title: s.title,
            description: s.description,
            durationMinutes: s.durationMinutes,
            focusArea: s.focusArea,
            exercises: s.exercises,
            sortOrder: idx,
          },
        });
      }
    }
  });

  const title =
    analysis.reason === "improved"
      ? "Treningsplanen er oppdatert — nytt fokus"
      : "Treningsplanen er oppdatert — enklere variant";
  const message =
    analysis.reason === "improved"
      ? `Bra jobbet! Fokuset er flyttet til ${analysis.suggestedFocusAreas.join(", ") || "nye områder"} basert på progresjonen din.`
      : `Vi har forenklet øvelsene på ${analysis.currentFocusAreas.join(", ") || "planen"} så det blir lettere å bygge momentum.`;

  await createNotification({
    userId,
    type: "PLAN_GENERATED",
    title,
    message,
    linkUrl: "/portal/treningsplan",
  });
}

// Expose POST for manual testing
export async function POST(req: NextRequest) {
  return GET(req);
}
