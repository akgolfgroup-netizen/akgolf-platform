/**
 * Spiller-benchmark mot PGA Tour-spillere via DataGolf.
 *
 * Brukes av GolfCard.tsx i Spillerprofil 360.
 * Tar elevens SG-profil og finner mest lik PGA Tour-spiller.
 *
 * Standardvalg: cosine-similarity over (sgOtt, sgApp, sgArg, sgPutt) i normalized space.
 */

import { prisma } from "@/lib/portal/prisma";

export interface BenchmarkMatch {
  peerName: string;
  similarityPct: number;
  reason: string;
  sgOtt: number;
  sgApp: number;
  sgArg: number;
  sgPutt: number;
}

export interface PlayerSgProfile {
  sgOtt: number;
  sgApp: number;
  sgArg: number;
  sgPutt: number;
}

/**
 * Finn nærmeste PGA Tour-spiller via SG-profil.
 *
 * Bruker eksisterende DataGolfCache. Forutsetter at den er populert via
 * cron-job (TODO Sprint 4 ekstra: bygg sync-CRON for DataGolf-data).
 */
export async function findClosestPgaPeer(
  profile: PlayerSgProfile,
): Promise<BenchmarkMatch | null> {
  const peers = await prisma.dataGolfCache.findMany({
    where: { dgRank: { not: null, lt: 200 } },
    take: 200,
  });

  if (peers.length === 0) return null;

  let best: { peer: typeof peers[0]; sim: number } | null = null;

  for (const peer of peers) {
    const sim = cosineSimilarity(
      [profile.sgOtt, profile.sgApp, profile.sgArg, profile.sgPutt],
      [peer.sgOtt, peer.sgApp, peer.sgArg, peer.sgPutt],
    );
    if (!best || sim > best.sim) {
      best = { peer, sim };
    }
  }

  if (!best) return null;

  const reason = describeProfile(profile, {
    sgOtt: best.peer.sgOtt,
    sgApp: best.peer.sgApp,
    sgArg: best.peer.sgArg,
    sgPutt: best.peer.sgPutt,
  });

  return {
    peerName: best.peer.playerName,
    similarityPct: Math.round(best.sim * 100),
    reason,
    sgOtt: best.peer.sgOtt,
    sgApp: best.peer.sgApp,
    sgArg: best.peer.sgArg,
    sgPutt: best.peer.sgPutt,
  };
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function describeProfile(player: PlayerSgProfile, _peer: PlayerSgProfile): string {
  // Finn sterkeste og svakeste område for player
  const areas: Array<{ name: string; value: number }> = [
    { name: "approach", value: player.sgApp },
    { name: "putt", value: player.sgPutt },
    { name: "rundt grønn", value: player.sgArg },
    { name: "drive", value: player.sgOtt },
  ];
  const sorted = [...areas].sort((a, b) => b.value - a.value);
  const strongest = sorted[0].name;
  const weakest = sorted[sorted.length - 1].name;
  return `Sterk ${strongest}, svak ${weakest} — likner profilen til peer.`;
}
