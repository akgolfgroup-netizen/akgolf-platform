/**
 * DataGolf player cache.
 *
 * Bruker eksisterende Prisma-modell `DataGolfCache` som lagrer SG-stats
 * per spiller (DG-id). TTL: 24t — etter dette refetcher vi.
 *
 * NB: For generisk caching av andre DataGolf-data (turneringer osv.)
 * må vi opprette ny modell. Denne filen håndterer kun spiller-stats.
 */

import { prisma } from "@/lib/portal/prisma";

const TTL_HOURS = 24;

export interface DataGolfPlayerStats {
  dgId: number;
  playerName: string;
  sgTotal: number;
  sgOtt: number;
  sgApp: number;
  sgArg: number;
  sgPutt: number;
  dgRank: number | null;
  owgrRank: number | null;
  updatedAt: Date;
}

/**
 * Hent player stats fra cache. Returner null hvis ikke cached eller utløpt.
 */
export async function getCachedPlayerStats(dgId: number): Promise<DataGolfPlayerStats | null> {
  const cached = await prisma.dataGolfCache.findUnique({ where: { dgId } });
  if (!cached) return null;

  const ageHours = (Date.now() - cached.updatedAt.getTime()) / (1000 * 60 * 60);
  if (ageHours >= TTL_HOURS) return null;

  return cached;
}

/**
 * Lagre player stats til cache (upsert).
 */
export async function setCachedPlayerStats(
  stats: Omit<DataGolfPlayerStats, "updatedAt">,
): Promise<void> {
  await prisma.dataGolfCache.upsert({
    where: { dgId: stats.dgId },
    create: {
      dgId: stats.dgId,
      playerName: stats.playerName,
      sgTotal: stats.sgTotal,
      sgOtt: stats.sgOtt,
      sgApp: stats.sgApp,
      sgArg: stats.sgArg,
      sgPutt: stats.sgPutt,
      dgRank: stats.dgRank,
      owgrRank: stats.owgrRank,
      updatedAt: new Date(),
    },
    update: {
      sgTotal: stats.sgTotal,
      sgOtt: stats.sgOtt,
      sgApp: stats.sgApp,
      sgArg: stats.sgArg,
      sgPutt: stats.sgPutt,
      dgRank: stats.dgRank,
      owgrRank: stats.owgrRank,
      updatedAt: new Date(),
    },
  });
}
