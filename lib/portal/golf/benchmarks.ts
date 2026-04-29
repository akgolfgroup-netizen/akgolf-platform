/**
 * Peer- og pyramide-benchmarks for HCP 6–10.
 *
 * Brukt av Statistikk-side og spillerprofil for sammenligning. Verdiene er
 * placeholder til vi har ekte peer-pool-tall fra databasen — hentes fra AK
 * pyramide-snitt og kan oppdateres uten UI-endringer.
 */

export interface GolfBenchmark {
  /** Driving distance i meter */
  drivingDistance: number;
  /** Strokes Gained off-the-tee per runde */
  sgOffTheTee: number;
  /** Greens in regulation, prosent (0–100) */
  girPct: number;
  /** Putts per runde */
  puttsPerRound: number;
  /** Scrambling-prosent (up & down rundt green) */
  scramblingPct: number;
  /** Approach proximity i meter */
  approachProx: number;
}

/** Snitt for HCP 6–10 (peer-gruppe). */
export const PEER_BENCHMARK: GolfBenchmark = {
  drivingDistance: 215,
  sgOffTheTee: 0.3,
  girPct: 52,
  puttsPerRound: 31.4,
  scramblingPct: 51,
  approachProx: 9.1,
};

/** AK-pyramide-snitt — bredere referanse enn peer. */
export const PYRAMID_BENCHMARK: GolfBenchmark = {
  drivingDistance: 200,
  sgOffTheTee: 0,
  girPct: 48,
  puttsPerRound: 32.1,
  scramblingPct: 46,
  approachProx: 10.2,
};

/**
 * Enkel percentil-heuristikk: 50 = peer-snitt, ±0.5*peer = ±50 percentiler.
 * Bare for visning — bytt til ekte peer-pool-utregning nar tilgjengelig.
 */
export function percentile(
  value: number,
  peer: number,
  lowerIsBetter = false,
): number {
  if (peer === 0) return 50;
  const ratio = value / peer;
  const adjusted = lowerIsBetter ? 2 - ratio : ratio;
  return Math.max(0, Math.min(100, Math.round(50 + (adjusted - 1) * 80)));
}
