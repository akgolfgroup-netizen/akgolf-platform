import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { getDGRankings, getSkillDecompositions } from "@/lib/portal/datagolf/client";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutter — DataGolf-API kan vaere treg

/**
 * CRON: DataGolf-sync.
 *
 * Schedule: daglig 04:00 UTC.
 *
 * Henter top 200 PGA Tour-spillere fra DataGolf via:
 *   1. getDGRankings — DataGolf-rangering (top 200 etter dg_rank)
 *   2. getSkillDecompositions — SG-fordeling (sg_ott, sg_app, sg_arg, sg_putt)
 *
 * Krysser navn for a koble dg_id og lagrer til DataGolfCache (upsert).
 * Brukes av findClosestPgaPeer (Spillerprofil 360) for benchmark-matching.
 *
 * Krever: DATAGOLF_API_KEY satt i Vercel-env.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!process.env.DATAGOLF_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "DATAGOLF_API_KEY ikke konfigurert" },
      { status: 500 },
    );
  }

  const started = Date.now();
  let rankingsCount = 0;
  let skillsCount = 0;
  let upserted = 0;
  const errors: string[] = [];

  try {
    // 1. Hent rangeringer
    const rankings = await getDGRankings();
    rankingsCount = rankings.length;
    const top200 = rankings.filter((r) => r.dg_rank > 0 && r.dg_rank <= 200);

    // 2. Hent skill-decomposition fra PGA Tour
    const skills = await getSkillDecompositions("pga");
    skillsCount = skills.length;

    // 3. Index skill-data per dg_id
    const skillByDgId = new Map<number, (typeof skills)[number]>();
    for (const s of skills) {
      skillByDgId.set(s.dg_id, s);
    }

    // 4. Upsert hver topp-200-spiller i DataGolfCache
    for (const r of top200) {
      const skill = skillByDgId.get(r.dg_id);

      try {
        await prisma.dataGolfCache.upsert({
          where: { dgId: r.dg_id },
          create: {
            dgId: r.dg_id,
            playerName: r.player_name,
            sgTotal: skill?.sg_total ?? 0,
            sgOtt: skill?.sg_ott ?? 0,
            sgApp: skill?.sg_app ?? 0,
            sgArg: skill?.sg_arg ?? 0,
            sgPutt: skill?.sg_putt ?? 0,
            dgRank: r.dg_rank,
            owgrRank: r.owgr_rank,
            updatedAt: new Date(),
          },
          update: {
            playerName: r.player_name,
            sgTotal: skill?.sg_total ?? undefined,
            sgOtt: skill?.sg_ott ?? undefined,
            sgApp: skill?.sg_app ?? undefined,
            sgArg: skill?.sg_arg ?? undefined,
            sgPutt: skill?.sg_putt ?? undefined,
            dgRank: r.dg_rank,
            owgrRank: r.owgr_rank,
            updatedAt: new Date(),
          },
        });
        upserted += 1;
      } catch (err) {
        errors.push(`${r.player_name} (${r.dg_id}): ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const duration = Date.now() - started;
    logger.info(
      `[datagolf-sync] OK — rankings=${rankingsCount}, skills=${skillsCount}, upserted=${upserted}, errors=${errors.length}, duration=${duration}ms`,
    );

    return NextResponse.json({
      ok: true,
      rankingsCount,
      skillsCount,
      upserted,
      errorCount: errors.length,
      errors: errors.slice(0, 10),
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("[datagolf-sync] failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        rankingsCount,
        skillsCount,
        upserted,
      },
      { status: 500 },
    );
  }
}
