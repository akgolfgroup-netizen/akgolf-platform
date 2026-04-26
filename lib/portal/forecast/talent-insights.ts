/**
 * Talent-data backend.
 *
 * CoachingForecast-modellen har 30+ felter som ikke er fullt eksponert i UI.
 * Denne modulen samler alle forecast-felter strukturert per spiller.
 *
 * Brukes av MentalForecastCard.tsx i Spillerprofil 360 (kun data — ingen ny visualisering).
 */

import { prisma } from "@/lib/portal/prisma";

export interface TalentInsights {
  userId: string;
  generatedAt: Date | null;
  modelVersion: string | null;
  current: {
    scoreAvg: number | null;
    sgTotal: number | null;
    sgOtt: number | null;
    sgApp: number | null;
    sgArg: number | null;
    sgPutt: number | null;
  };
  shortTerm: {
    nextRound: number | null;
    nextRoundLow: number | null;
    nextRoundHigh: number | null;
  };
  midTerm: {
    hcp6mExpected: number | null;
    hcp6mLow: number | null;
    hcp6mHigh: number | null;
  };
  longTerm: {
    hcp12mExpected: number | null;
    hcp12mLow: number | null;
    hcp12mHigh: number | null;
    // 24/36 mnd kommer i Sprint 6.4
  };
  talent: {
    talentScore: number | null;
    norwegianPercentile: number | null;
    predictionError: number | null;
  };
}

export async function getTalentInsights(userId: string): Promise<TalentInsights | null> {
  const forecast = await prisma.coachingForecast.findFirst({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });

  if (!forecast) {
    return null;
  }

  // forecast er "any"-typet pga 30+ felter — vi caster trygt med fallback til null
  // siden vi vet at modellen inneholder feltene per Prisma-schema.
  const f = forecast as Record<string, unknown>;
  const num = (key: string): number | null => {
    const v = f[key];
    return typeof v === "number" ? v : null;
  };

  return {
    userId,
    generatedAt: forecast.generatedAt,
    modelVersion: forecast.modelVersion ?? null,
    current: {
      scoreAvg: num("currentScoreAvg"),
      sgTotal: num("currentSgTotal"),
      sgOtt: num("currentSgOtt"),
      sgApp: num("currentSgApp"),
      sgArg: num("currentSgArg"),
      sgPutt: num("currentSgPutt"),
    },
    shortTerm: {
      nextRound: num("nextRoundExpected"),
      nextRoundLow: num("nextRoundCi95Low"),
      nextRoundHigh: num("nextRoundCi95High"),
    },
    midTerm: {
      hcp6mExpected: num("hcp6mExpected"),
      hcp6mLow: num("hcp6mCi95Low"),
      hcp6mHigh: num("hcp6mCi95High"),
    },
    longTerm: {
      hcp12mExpected: num("hcp12mExpected"),
      hcp12mLow: num("hcp12mCi95Low"),
      hcp12mHigh: num("hcp12mCi95High"),
    },
    talent: {
      talentScore: num("talentScore"),
      norwegianPercentile: num("norwegianPercentile"),
      predictionError: num("predictionErrorSg"),
    },
  };
}
