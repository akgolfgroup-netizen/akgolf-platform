import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { prisma } from "@/lib/portal/prisma";
import { Prisma } from "@prisma/client";
import { computeUSI } from "@/lib/portal/usi/compute-usi";
import { analyzeGaps } from "@/lib/portal/usi/gap-analysis";
import { generateTrainingPrescription } from "@/lib/portal/usi/generate-prescription";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutter for batch-beregning

/**
 * Cron job: kjører daglig kl 03:00 UTC
 * Beregner Unified Skill Index for alle aktive studenter
 * og lagrer snapshot for trend-analyse.
 */
export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Hent aktive studenter med minst én runde siste 30 dager
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      role: "STUDENT",
      RoundStats: {
        some: {
          date: { gte: thirtyDaysAgo },
        },
      },
    },
    select: {
      id: true,
      UnifiedSkillIndex: {
        select: { estimatedCategory: true },
      },
    },
  });

  let processed = 0;
  let skipped = 0;
  let errors = 0;
  let categoryChanges = 0;

  for (const user of users) {
    try {
      const usi = await computeUSI(user.id);
      if (!usi) {
        skipped++;
        continue;
      }

      // Upsert UnifiedSkillIndex
      const index = await prisma.unifiedSkillIndex.upsert({
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

      // Lagre snapshot for trend-historikk
      await prisma.unifiedSkillSnapshot.create({
        data: {
          userId: user.id,
          unifiedSkillIndexId: index.id,
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
          vsTourAvgPct: usi.vsTourAvgPct,
        },
      });

      // Generer og lagre treningspreskripsjon
      try {
        const gapAnalysis = analyzeGaps(usi);
        const prescription = await generateTrainingPrescription(usi, gapAnalysis);
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
      } catch (prescriptionErr) {
        logger.error(`[Compute USI Cron] Prescription error for user ${user.id}:`, prescriptionErr);
      }

      if (
        user.UnifiedSkillIndex &&
        user.UnifiedSkillIndex.estimatedCategory !== usi.estimatedCategory
      ) {
        categoryChanges++;
      }

      processed++;
    } catch (err) {
      logger.error(`[Compute USI Cron] Error for user ${user.id}:`, err);
      errors++;
    }
  }

  logger.info(
    `[Compute USI Cron] Processed: ${processed}, Skipped: ${skipped}, Errors: ${errors}, CategoryChanges: ${categoryChanges}`
  );

  return NextResponse.json({
    ok: true,
    processed,
    skipped,
    errors,
    categoryChanges,
    timestamp: now.toISOString(),
  });
}
