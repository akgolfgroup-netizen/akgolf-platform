import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { fetchGolfBoxTournaments } from "@/modules/tournament-planner/sources/golfbox";
import { fetchNordicGolfTourSchedule } from "@/modules/tournament-planner/sources/nordic-golf-tour";
import { fetchJmiSchedule } from "@/modules/tournament-planner/sources/jmi-sweden";
import { fetchGlobalJuniorTourSchedule } from "@/modules/tournament-planner/sources/global-junior-tour";
import type { ImportableTournament } from "@/modules/tournament-planner/types";

interface SyncResult {
  imported: number;
  updated: number;
  skipped: number;
  bySource: Record<string, { imported: number; updated: number; errors: number }>;
  errors: Array<{ source: string; error: string }>;
}

type SourceName = "golfbox" | "nordic_golf_tour" | "jmi_sweden" | "global_junior_tour";

interface Source {
  name: SourceName;
  fetch: (year: number) => Promise<ImportableTournament[]>;
}

const SOURCES: Source[] = [
  { name: "golfbox", fetch: (year) => fetchGolfBoxTournaments(year) },
  { name: "nordic_golf_tour", fetch: (year) => fetchNordicGolfTourSchedule(year) },
  { name: "jmi_sweden", fetch: (year) => fetchJmiSchedule(year) },
  { name: "global_junior_tour", fetch: () => fetchGlobalJuniorTourSchedule() },
];

async function runSync(req: NextRequest, year: number, userId: string | undefined) {

  const result: SyncResult = {
    imported: 0,
    updated: 0,
    skipped: 0,
    bySource: {},
    errors: [],
  };

  for (const source of SOURCES) {
    const stats = { imported: 0, updated: 0, errors: 0 };
    result.bySource[source.name] = stats;

    try {
      const tournaments = await source.fetch(year);
      logger.info(`[sync] ${source.name}: ${tournaments.length} turneringer hentet`);

      for (const t of tournaments) {
        try {
          const existing = await prisma.tournament.findUnique({
            where: {
              source_sourceId: { source: t.source, sourceId: t.sourceId },
            },
            select: { id: true },
          });

          await prisma.tournament.upsert({
            where: {
              source_sourceId: { source: t.source, sourceId: t.sourceId },
            },
            update: {
              name: t.name,
              startDate: t.startDate,
              endDate: t.endDate,
              location: t.venue,
              series: t.series,
              externalUrl: t.externalUrl,
              numberOfHoles: t.numberOfHoles,
              registrationDeadline: t.registrationDeadline,
              level: t.level ?? "nasjonal",
              updatedAt: new Date(),
            },
            create: {
              id: nanoid(),
              source: t.source,
              sourceId: t.sourceId,
              name: t.name,
              startDate: t.startDate,
              endDate: t.endDate,
              location: t.venue,
              series: t.series,
              externalUrl: t.externalUrl,
              numberOfHoles: t.numberOfHoles,
              registrationDeadline: t.registrationDeadline,
              level: t.level ?? "nasjonal",
              updatedAt: new Date(),
            },
          });

          if (existing) {
            stats.updated += 1;
            result.updated += 1;
          } else {
            stats.imported += 1;
            result.imported += 1;
          }
        } catch (innerErr) {
          stats.errors += 1;
          const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
          logger.error(`[sync] ${source.name} upsert error for ${t.sourceId}: ${msg}`);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push({ source: source.name, error: msg });
      logger.error(`[sync] ${source.name} fetch failed: ${msg}`);
    }
  }

  return NextResponse.json({
    success: true,
    year,
    syncedBy: userId ?? "cron",
    ...result,
  });
}

/** Autorisasjon: Bearer-token (cron) ELLER staff-session */
async function authorize(
  req: NextRequest,
): Promise<{ ok: true; userId: string | undefined } | { ok: false; response: NextResponse }> {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      response: NextResponse.json({ error: "For mange forespørsler" }, { status: 429 }),
    };
  }

  const syncSecret = process.env.TOURNAMENT_SYNC_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const isBearerAuthorized =
    (!!syncSecret && authHeader === `Bearer ${syncSecret}`) ||
    (!!cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (isBearerAuthorized) {
    return { ok: true, userId: undefined };
  }

  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Ikke autorisert" }, { status: 403 }),
    };
  }
  return { ok: true, userId: user.id };
}

export async function POST(req: NextRequest) {
  const auth = await authorize(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => ({}));
  const year: number = typeof body.year === "number" ? body.year : new Date().getFullYear();

  return runSync(req, year, auth.userId);
}

export async function GET(req: NextRequest) {
  const auth = await authorize(req);
  if (!auth.ok) return auth.response;

  const yearParam = req.nextUrl.searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

  return runSync(req, year, auth.userId);
}
