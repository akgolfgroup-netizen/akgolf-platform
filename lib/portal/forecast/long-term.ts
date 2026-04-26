/**
 * Langterm-prognoser (24/36 måneder).
 *
 * CoachingForecast-modellen har felter for nextRound, hcp6m, hcp12m.
 * Denne modulen utvider med 24/36-måneders ekstrapolasjon basert på
 * trend-modellering.
 *
 * NB: For ekte 24/36-mnd prognoser bør CoachingForecast-modellen utvides
 * med hcp24mExpected/hcp36mExpected + CI95-felter (Sprint 6 Prisma-migrasjon).
 * Foreløpig ekstrapolerer vi fra eksisterende felter.
 */

import { prisma } from "@/lib/portal/prisma";

export interface LongTermForecast {
  userId: string;
  generatedAt: Date | null;
  hcpNow: number | null;
  hcp6m: { expected: number | null; low: number | null; high: number | null };
  hcp12m: { expected: number | null; low: number | null; high: number | null };
  hcp24m: { expected: number | null; low: number | null; high: number | null };
  hcp36m: { expected: number | null; low: number | null; high: number | null };
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export async function getLongTermForecast(userId: string): Promise<LongTermForecast | null> {
  const forecast = await prisma.coachingForecast.findFirst({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });

  if (!forecast) return null;

  const f = forecast as Record<string, unknown>;
  const num = (key: string): number | null => {
    const v = f[key];
    return typeof v === "number" ? v : null;
  };

  const hcpNow = num("currentScoreAvg");
  const hcp6m = num("hcp6mExpected");
  const hcp12m = num("hcp12mExpected");

  // Ekstrapoler 24/36 mnd via lineær trend
  // Antagelse: forbedringsrate avtar over tid (90% per ekstra 12mnd)
  const trend12m = hcp12m !== null && hcp6m !== null ? hcp12m - hcp6m : 0;
  const hcp24mExpected = hcp12m !== null ? hcp12m + trend12m * 0.7 : null;
  const hcp36mExpected = hcp24mExpected !== null ? hcp24mExpected + trend12m * 0.5 : null;

  // CI utvider seg over tid
  const ci12mLow = num("hcp12mCi95Low");
  const ci12mHigh = num("hcp12mCi95High");
  const ci12mWidth = ci12mLow !== null && ci12mHigh !== null ? ci12mHigh - ci12mLow : 4;

  const ci24mWidth = ci12mWidth * 1.5;
  const ci36mWidth = ci12mWidth * 2.0;

  const hcp24mLow = hcp24mExpected !== null ? hcp24mExpected - ci24mWidth / 2 : null;
  const hcp24mHigh = hcp24mExpected !== null ? hcp24mExpected + ci24mWidth / 2 : null;
  const hcp36mLow = hcp36mExpected !== null ? hcp36mExpected - ci36mWidth / 2 : null;
  const hcp36mHigh = hcp36mExpected !== null ? hcp36mExpected + ci36mWidth / 2 : null;

  // Confidence reduseres jo lenger frem
  const baseError = num("predictionErrorSg") ?? 1.0;
  const confidence: "HIGH" | "MEDIUM" | "LOW" =
    baseError < 0.5 ? "HIGH" : baseError < 1.5 ? "MEDIUM" : "LOW";

  return {
    userId,
    generatedAt: forecast.generatedAt,
    hcpNow,
    hcp6m: {
      expected: hcp6m,
      low: num("hcp6mCi95Low"),
      high: num("hcp6mCi95High"),
    },
    hcp12m: {
      expected: hcp12m,
      low: ci12mLow,
      high: ci12mHigh,
    },
    hcp24m: {
      expected: hcp24mExpected !== null ? Math.round(hcp24mExpected * 10) / 10 : null,
      low: hcp24mLow !== null ? Math.round(hcp24mLow * 10) / 10 : null,
      high: hcp24mHigh !== null ? Math.round(hcp24mHigh * 10) / 10 : null,
    },
    hcp36m: {
      expected: hcp36mExpected !== null ? Math.round(hcp36mExpected * 10) / 10 : null,
      low: hcp36mLow !== null ? Math.round(hcp36mLow * 10) / 10 : null,
      high: hcp36mHigh !== null ? Math.round(hcp36mHigh * 10) / 10 : null,
    },
    confidence,
  };
}
