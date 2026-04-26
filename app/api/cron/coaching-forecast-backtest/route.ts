/**
 * CRON: Coaching Forecast Backtesting.
 *
 * Kjører daglig kl 04:00 UTC.
 *
 * For hver forecast hvor deadline har passert og faktisk utfall ikke er logget:
 *   1. Hent siste 20 runder fra (deadline − 90 dager).
 *   2. Beregn actualSgTotal via computePlayerSgProfile().
 *   3. Beregn actualScoreAvg via predictScoreFromSg().
 *   4. Kall backfillActualOutcome() for å lagre resultatet.
 *
 * Autorisasjon: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import {
  findForecastsReadyForBacktest,
  backfillActualOutcome,
} from "@/lib/portal/predictions/coaching-forecast-service";
import {
  computePlayerSgProfile,
  predictScoreFromSg,
} from "@/lib/portal/golf/calculate-sg-from-rounds";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET;

const DAYS_WINDOW = 90;
const MAX_ROUNDS = 20;

export async function GET(request: NextRequest) {
  // ── Autorisasjon ─────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!CRON_SECRET || token !== CRON_SECRET) {
    logger.warn("[cron:coaching-forecast-backtest] Uautorisert forsøk", {
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
    });
    return NextResponse.json({ error: "Uautorisert" }, { status: 401 });
  }

  try {
    const forecasts = await findForecastsReadyForBacktest(prisma);
    logger.info("[cron:coaching-forecast-backtest] Starter backtest", {
      count: forecasts.length,
    });

    const results: Array<{
      forecastId: string;
      userId: string;
      success: boolean;
      actualSgTotal?: number;
      actualScoreAvg?: number;
      withinCi95?: boolean;
      predictionErrorSg?: number;
      error?: string;
    }> = [];

    for (const fc of forecasts) {
      try {
        const windowStart = new Date(fc.deadline);
        windowStart.setDate(windowStart.getDate() - DAYS_WINDOW);

        const rounds = await prisma.roundStats.findMany({
          where: {
            userId: fc.userId,
            date: { gte: windowStart },
          },
          orderBy: { date: "desc" },
          take: MAX_ROUNDS,
        });

        if (rounds.length === 0) {
          logger.info("[cron:coaching-forecast-backtest] Ingen runder funnet", {
            forecastId: fc.id,
            userId: fc.userId,
            windowStart: windowStart.toISOString(),
          });
          results.push({
            forecastId: fc.id,
            userId: fc.userId,
            success: false,
            error: "Ingen runder i vinduet",
          });
          continue;
        }

        const roundInputs = rounds.map((r) => ({
          id: r.id,
          date: r.date,
          totalScore: r.totalScore ?? null,
          par: 72,
          courseRating: fc.avgCourseRating,
          slopeRating: fc.avgSlopeRating,
          sgTotal: r.sgTotal ?? null,
          sgOffTheTee: r.sgOffTheTee ?? null,
          sgApproach: r.sgApproach ?? null,
          sgAroundTheGreen: r.sgAroundTheGreen ?? null,
          sgPutting: r.sgPutting ?? null,
          windMs: null,
          rainMm: null,
          tempC: null,
        }));

        const profile = computePlayerSgProfile(roundInputs, { maxRounds: MAX_ROUNDS });
        const actualSgTotal = profile.meanSgTotal;
        const actualScoreAvg = predictScoreFromSg(
          actualSgTotal,
          fc.avgCourseRating,
          fc.avgSlopeRating,
        );

        await backfillActualOutcome(prisma, fc.id, {
          scoreAvg: actualScoreAvg,
          sgTotal: actualSgTotal,
          measuredAt: new Date(),
        });

        // Hent oppdatert forecast for å logge resultatene
        const updated = await prisma.coachingForecast.findUnique({
          where: { id: fc.id },
          select: { withinCi95: true, predictionErrorSg: true },
        });

        logger.info("[cron:coaching-forecast-backtest] Backtest fullført", {
          forecastId: fc.id,
          userId: fc.userId,
          roundsUsed: rounds.length,
          actualSgTotal,
          actualScoreAvg,
          withinCi95: updated?.withinCi95,
          predictionErrorSg: updated?.predictionErrorSg,
        });

        results.push({
          forecastId: fc.id,
          userId: fc.userId,
          success: true,
          actualSgTotal,
          actualScoreAvg,
          withinCi95: updated?.withinCi95 ?? undefined,
          predictionErrorSg: updated?.predictionErrorSg ?? undefined,
        });
      } catch (innerError) {
        const msg = innerError instanceof Error ? innerError.message : String(innerError);
        logger.error("[cron:coaching-forecast-backtest] Feil for forecast", {
          forecastId: fc.id,
          userId: fc.userId,
          error: msg,
        });
        results.push({
          forecastId: fc.id,
          userId: fc.userId,
          success: false,
          error: msg,
        });
      }
    }

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.length - succeeded;

    logger.info("[cron:coaching-forecast-backtest] Fullført", {
      total: results.length,
      succeeded,
      failed,
    });

    return NextResponse.json({
      ok: true,
      processed: results.length,
      succeeded,
      failed,
      results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("[cron:coaching-forecast-backtest] Kritisk feil", { error: msg });
    return NextResponse.json({ error: "Backtest feilet" }, { status: 500 });
  }
}
