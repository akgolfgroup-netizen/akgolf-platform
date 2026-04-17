/**
 * API-endepunkt for Coaching Forecast (spiller-portal).
 *
 * GET /api/portal/player/coaching-forecast
 *   Henter spillerens siste forecast + historikk (maks 5).
 *
 * Tilgang: Kun innlogget portal-bruker. Henter alltid for
 * den autentiserte brukeren — ingen userId-parameter.
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import {
  getLatestForecast,
  listForecasts,
} from "@/lib/portal/predictions/coaching-forecast-service";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`forecast:player:get:${ip}`, RATE_LIMITS.API_GENERAL);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "For mange forespørsler, prøv igjen senere" },
        { status: 429 },
      );
    }

    const user = await requirePortalUser();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 5;
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 20)
      : 5;

    const [latest, history] = await Promise.all([
      getLatestForecast(prisma, user.id),
      listForecasts(prisma, user.id, { limit }),
    ]);

    return NextResponse.json({ latest, history });
  } catch (error) {
    logger.error("[player coaching-forecast GET] failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Kunne ikke hente forecast" },
      { status: 500 },
    );
  }
}
