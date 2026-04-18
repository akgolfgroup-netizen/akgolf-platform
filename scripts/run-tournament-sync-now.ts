#!/usr/bin/env tsx
/**
 * Engangsscript: Kjør tournament-sync mot prod-DB fra lokal miljø.
 * Bruker DIRECT_URL og samme logikk som sync-route.
 *
 * Usage:
 *   npx tsx scripts/run-tournament-sync-now.ts [year]
 */

import "dotenv/config";
import { Client } from "pg";
import { nanoid } from "nanoid";
import { fetchGolfBoxTournaments } from "../modules/tournament-planner/sources/golfbox";
import { fetchNordicGolfTourSchedule } from "../modules/tournament-planner/sources/nordic-golf-tour";
import { fetchJmiSchedule } from "../modules/tournament-planner/sources/jmi-sweden";
import { fetchGlobalJuniorTourSchedule } from "../modules/tournament-planner/sources/global-junior-tour";
import type { ImportableTournament } from "../modules/tournament-planner/types";

const year = parseInt(process.argv[2] || String(new Date().getFullYear()), 10);

const SOURCES: Array<{ name: string; fetch: () => Promise<ImportableTournament[]> }> = [
  { name: "golfbox", fetch: () => fetchGolfBoxTournaments(year) },
  { name: "nordic_golf_tour", fetch: () => fetchNordicGolfTourSchedule(year) },
  { name: "jmi_sweden", fetch: () => fetchJmiSchedule(year) },
  { name: "global_junior_tour", fetch: () => fetchGlobalJuniorTourSchedule() },
];

async function upsertTournament(
  client: Client,
  t: ImportableTournament,
): Promise<"imported" | "updated"> {
  // Sjekk om finnes (composite unique source+sourceId)
  const existing = await client.query(
    `SELECT id FROM "Tournament" WHERE source = $1 AND "sourceId" = $2`,
    [t.source, t.sourceId],
  );

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE "Tournament" SET
        name = $1, "startDate" = $2, "endDate" = $3, location = $4,
        series = $5, "externalUrl" = $6, "numberOfHoles" = $7,
        "registrationDeadline" = $8, level = $9, "updatedAt" = NOW()
      WHERE id = $10`,
      [
        t.name,
        t.startDate,
        t.endDate ?? null,
        t.venue ?? null,
        t.series ?? null,
        t.externalUrl ?? null,
        t.numberOfHoles ?? null,
        t.registrationDeadline ?? null,
        t.level ?? "nasjonal",
        existing.rows[0].id,
      ],
    );
    return "updated";
  } else {
    await client.query(
      `INSERT INTO "Tournament" (id, source, "sourceId", name, "startDate", "endDate",
        location, series, "externalUrl", "numberOfHoles", "registrationDeadline",
        level, "isPrivate", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false, NOW(), NOW())`,
      [
        nanoid(),
        t.source,
        t.sourceId,
        t.name,
        t.startDate,
        t.endDate ?? null,
        t.venue ?? null,
        t.series ?? null,
        t.externalUrl ?? null,
        t.numberOfHoles ?? null,
        t.registrationDeadline ?? null,
        t.level ?? "nasjonal",
      ],
    );
    return "imported";
  }
}

async function main() {
  const directUrl = process.env.DIRECT_URL;
  if (!directUrl) {
    console.error("DIRECT_URL mangler i .env");
    process.exit(1);
  }

  const client = new Client({ connectionString: directUrl });
  await client.connect();
  console.log(`Tilkoblet prod-DB. Synker turneringer for ${year}...\n`);

  const totals = { imported: 0, updated: 0, errors: 0 };
  const bySource: Record<string, { imported: number; updated: number; errors: number }> = {};

  for (const source of SOURCES) {
    const stats = { imported: 0, updated: 0, errors: 0 };
    bySource[source.name] = stats;
    console.log(`[${source.name}] henter...`);

    try {
      const tournaments = await source.fetch();
      console.log(`[${source.name}] fant ${tournaments.length} turneringer`);

      for (const t of tournaments) {
        try {
          const action = await upsertTournament(client, t);
          stats[action] += 1;
          totals[action] += 1;
        } catch (err) {
          stats.errors += 1;
          totals.errors += 1;
          console.error(`  ERR ${t.sourceId} (${t.name}): ${err instanceof Error ? err.message : err}`);
        }
      }

      console.log(`[${source.name}] ${stats.imported} imported, ${stats.updated} updated, ${stats.errors} errors`);
    } catch (err) {
      console.error(`[${source.name}] FETCH FAILED: ${err instanceof Error ? err.message : err}`);
      stats.errors += 1;
    }
    console.log("");
  }

  await client.end();

  console.log("=== RESULTAT ===");
  console.log(`Imported: ${totals.imported}`);
  console.log(`Updated:  ${totals.updated}`);
  console.log(`Errors:   ${totals.errors}`);
  console.log("\nPer kilde:", JSON.stringify(bySource, null, 2));
}

main().catch((err) => {
  console.error("Uventet feil:", err);
  process.exit(1);
});
