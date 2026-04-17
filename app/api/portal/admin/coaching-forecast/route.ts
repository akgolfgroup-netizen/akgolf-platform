/**
 * API-endepunkt for Coaching Forecast (admin/coach-only).
 *
 * GET  /api/portal/admin/coaching-forecast?userId=...&limit=5
 *   Henter spillerens forecast-historikk.
 *
 * POST /api/portal/admin/coaching-forecast
 *   Genererer og lagrer ny forecast for spilleren.
 *   Body: GenerateForecastRequest (validert med Zod).
 *
 * Tilgang: ADMIN eller INSTRUCTOR. INVITED har ikke tilgang (forecasts er
 * spillersensitive data).
 *
 * Rate limit: 20/min per IP (AI_ENDPOINTS — Monte-Carlo er tyngre enn
 * vanlig DB-spørring).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import {
  runAndSaveForecast,
  listForecasts,
} from "@/lib/portal/predictions/coaching-forecast-service";

// ── Zod-skjemaer ──────────────────────────────────────────────────

const DiagnosticSchema = z
  .object({
    faceAngleStdDevDeg: z
      .object({
        OTT: z.number().nonnegative().optional(),
        APP: z.number().nonnegative().optional(),
        ARG: z.number().nonnegative().optional(),
        PUTT: z.number().nonnegative().optional(),
      })
      .optional(),
    ballSpeedScore: z.number().min(0).max(100).optional(),
    pressureGapSg: z
      .object({
        OTT: z.number().optional(),
        APP: z.number().optional(),
        ARG: z.number().optional(),
        PUTT: z.number().optional(),
      })
      .optional(),
    varianceSg: z
      .object({
        OTT: z.number().nonnegative().optional(),
        APP: z.number().nonnegative().optional(),
        ARG: z.number().nonnegative().optional(),
        PUTT: z.number().nonnegative().optional(),
      })
      .optional(),
  })
  .optional();

const GenerateForecastBodySchema = z.object({
  userId: z.string().min(1),
  targetScoreAvg: z.number().min(50).max(120),
  deadline: z.string().datetime(), // ISO 8601
  avgCourseRating: z.number().min(50).max(85),
  avgSlopeRating: z.number().int().min(55).max(155),
  hoursPerWeek: z.number().min(0).max(50),
  age: z.number().int().min(8).max(80),
  currentCategory: z.string().regex(/^[A-K]$/).optional(),
  diagnostic: DiagnosticSchema,
  monteCarloRuns: z.number().int().min(100).max(50_000).optional(),
  maxRounds: z.number().int().min(5).max(100).optional(),
});

// ── GET: hent forecast-historikk ──────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`forecast:get:${ip}`, RATE_LIMITS.API_GENERAL);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "For mange forespørsler, prøv igjen senere" },
        { status: 429 },
      );
    }

    // Auth + RBAC
    const user = await requirePortalUser();
    if (!isStaff(user.role)) {
      return NextResponse.json(
        { error: "Kun ADMIN eller INSTRUCTOR har tilgang" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId er påkrevd" }, { status: 400 });
    }

    const limitParam = searchParams.get("limit");
    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 10;
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 100)
      : 10;

    const forecasts = await listForecasts(prisma, userId, { limit });

    return NextResponse.json({ forecasts });
  } catch (error) {
    logger.error("[coaching-forecast GET] failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Kunne ikke hente forecasts" },
      { status: 500 },
    );
  }
}

// ── POST: generer ny forecast ─────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Rate limit (strammere — Monte-Carlo er tungt)
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`forecast:post:${ip}`, RATE_LIMITS.AI_ENDPOINTS);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "For mange forespørsler, prøv igjen senere" },
        { status: 429 },
      );
    }

    // Auth + RBAC
    const user = await requirePortalUser();
    if (!isStaff(user.role)) {
      return NextResponse.json(
        { error: "Kun ADMIN eller INSTRUCTOR har tilgang" },
        { status: 403 },
      );
    }

    // Valider input
    const body = await request.json();
    const parsed = GenerateForecastBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Ugyldig input",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const req = {
      ...parsed.data,
      deadline: new Date(parsed.data.deadline),
    };

    // Deadline må være i fremtiden (minst 1 uke fram)
    const minDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (req.deadline < minDeadline) {
      return NextResponse.json(
        { error: "Deadline må være minst 1 uke fram i tid" },
        { status: 400 },
      );
    }

    // Sjekk at spilleren eksisterer
    const player = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true },
    });
    if (!player) {
      return NextResponse.json({ error: "Spiller finnes ikke" }, { status: 404 });
    }

    // Kjør motoren og lagre
    const { output, forecastId } = await runAndSaveForecast(prisma, req);

    logger.info("[coaching-forecast POST] generated", {
      forecastId,
      userId: req.userId,
      generatedBy: user.id,
      probability: output.probabilityOfSuccess,
      totalHours: output.estimatedTotalHours,
    });

    return NextResponse.json({ forecastId, forecast: output }, { status: 201 });
  } catch (error) {
    logger.error("[coaching-forecast POST] failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Kunne ikke generere forecast" },
      { status: 500 },
    );
  }
}
