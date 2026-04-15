"use server";

import { Prisma } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { computeUSI, type USIResult } from "./compute-usi";
import { analyzeGaps } from "./gap-analysis";
import {
  generateTrainingPrescription,
  type TrainingPrescriptionResult,
} from "./generate-prescription";

export type { USIResult, TrainingPrescriptionResult };

/**
 * Compute and return the current USI for the logged-in player.
 * If `persist` is true, also saves it to the database.
 * If `withPrescription` is true, also generates and persists a TrainingPrescription.
 */
export async function getPlayerUSI(
  persist = false,
  withPrescription = false
): Promise<{ usi: USIResult; prescription: TrainingPrescriptionResult | null } | null> {
  const user = await requirePortalUser();
  const usi = await computeUSI(user.id);
  if (!usi) return null;

  let prescription: TrainingPrescriptionResult | null = null;

  if (persist || withPrescription) {
    await prisma.unifiedSkillIndex.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        sgOtt: usi.sgOtt,
        sgApp: usi.sgApp,
        sgArg: usi.sgArg,
        sgPutt: usi.sgPutt,
        ballSpeedScore: usi.ballSpeedScore,
        consistencyScore: usi.consistencyScore,
        pressureScore: usi.pressureScore,
        trainingEfficiency: usi.trainingEfficiency,
        trendMomentum: usi.trendMomentum,
        totalUsi: usi.totalUsi,
        estimatedHandicap: usi.estimatedHandicap,
        estimatedCategory: usi.estimatedCategory,
        uncertaintyJson: usi.uncertainty as unknown as Prisma.InputJsonValue,
        vsTourAvgPct: usi.vsTourAvgPct,
      },
      update: {
        sgOtt: usi.sgOtt,
        sgApp: usi.sgApp,
        sgArg: usi.sgArg,
        sgPutt: usi.sgPutt,
        ballSpeedScore: usi.ballSpeedScore,
        consistencyScore: usi.consistencyScore,
        pressureScore: usi.pressureScore,
        trainingEfficiency: usi.trainingEfficiency,
        trendMomentum: usi.trendMomentum,
        totalUsi: usi.totalUsi,
        estimatedHandicap: usi.estimatedHandicap,
        estimatedCategory: usi.estimatedCategory,
        uncertaintyJson: usi.uncertainty as unknown as Prisma.InputJsonValue,
        vsTourAvgPct: usi.vsTourAvgPct,
      },
    });
  }

  if (withPrescription) {
    const gapAnalysis = analyzeGaps(usi);
    prescription = await generateTrainingPrescription(usi, gapAnalysis);

    await prisma.trainingPrescription.create({
      data: {
        userId: user.id,
        focusAreas: prescription.focusAreas,
        weeklyHours: prescription.weeklyHours,
        suggestedFormulaIds: prescription.suggestedFormulaIds,
        predictedHcpChange: prescription.predictedHcpChange,
        confidence: prescription.confidence,
        gradientJson: prescription.gradientJson as unknown as Prisma.InputJsonValue,
        gapAnalysisJson: prescription.gapAnalysisJson as unknown as Prisma.InputJsonValue,
      },
    });
  }

  return { usi, prescription };
}

/**
 * Retrieve the cached USI from the database without re-computing.
 */
export async function getCachedUSI(): Promise<USIResult | null> {
  const user = await requirePortalUser();
  const cached = await prisma.unifiedSkillIndex.findUnique({
    where: { userId: user.id },
  });

  if (!cached) return null;

  return {
    sgOtt: cached.sgOtt,
    sgApp: cached.sgApp,
    sgArg: cached.sgArg,
    sgPutt: cached.sgPutt,
    ballSpeedScore: cached.ballSpeedScore,
    consistencyScore: cached.consistencyScore,
    pressureScore: cached.pressureScore,
    trainingEfficiency: cached.trainingEfficiency,
    trendMomentum: cached.trendMomentum,
    totalUsi: cached.totalUsi,
    estimatedHandicap: cached.estimatedHandicap,
    estimatedCategory: cached.estimatedCategory,
    uncertainty: (cached.uncertaintyJson ?? {}) as unknown as USIResult["uncertainty"],
    vsTourAvgPct: cached.vsTourAvgPct,
    predictedHcp30d: null,
    predictedHcp90d: null,
  };
}

/**
 * Retrieve the latest TrainingPrescription for the logged-in player.
 */
export async function getLatestTrainingPrescription(): Promise<TrainingPrescriptionResult | null> {
  const user = await requirePortalUser();
  const latest = await prisma.trainingPrescription.findFirst({
    where: { userId: user.id },
    orderBy: { generatedAt: "desc" },
  });

  if (!latest) return null;

  return {
    focusAreas: latest.focusAreas,
    weeklyHours: latest.weeklyHours,
    suggestedFormulaIds: latest.suggestedFormulaIds,
    predictedHcpChange: latest.predictedHcpChange,
    confidence: latest.confidence,
    gradientJson: (latest.gradientJson ?? {}) as unknown as TrainingPrescriptionResult["gradientJson"],
    gapAnalysisJson: (latest.gapAnalysisJson ?? {}) as unknown as TrainingPrescriptionResult["gapAnalysisJson"],
    reasoning: "",
  };
}
