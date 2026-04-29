/**
 * PGA Tour benchmark-tabell for Strokes Gained.
 * Basert på etablerte SG-tabeller (Broadie / PGA Tour).
 * Alle distanser i meter.
 */

export type LieType = "tee" | "fairway" | "rough" | "bunker" | "green";

interface BenchmarkPoint {
  distance: number;
  expected: number;
}

/** Benchmark-kurver per lie. Lineær interpolering mellom punkter. */
const BENCHMARKS: Record<LieType, BenchmarkPoint[]> = {
  tee: [
    { distance: 400, expected: 4.0 },
    { distance: 350, expected: 3.92 },
    { distance: 300, expected: 3.82 },
    { distance: 250, expected: 3.72 },
    { distance: 200, expected: 3.58 },
    { distance: 150, expected: 3.22 },
    { distance: 120, expected: 3.02 },
    { distance: 100, expected: 2.88 },
    { distance: 80, expected: 2.74 },
    { distance: 60, expected: 2.62 },
    { distance: 40, expected: 2.48 },
    { distance: 20, expected: 2.28 },
    { distance: 10, expected: 2.15 },
    { distance: 5, expected: 2.08 },
    { distance: 1, expected: 2.02 },
  ],
  fairway: [
    { distance: 200, expected: 3.25 },
    { distance: 180, expected: 3.12 },
    { distance: 160, expected: 3.0 },
    { distance: 140, expected: 2.88 },
    { distance: 120, expected: 2.76 },
    { distance: 100, expected: 2.66 },
    { distance: 80, expected: 2.56 },
    { distance: 60, expected: 2.46 },
    { distance: 50, expected: 2.4 },
    { distance: 40, expected: 2.34 },
    { distance: 30, expected: 2.26 },
    { distance: 20, expected: 2.16 },
    { distance: 15, expected: 2.1 },
    { distance: 10, expected: 2.04 },
    { distance: 5, expected: 1.96 },
    { distance: 1, expected: 1.9 },
  ],
  rough: [
    { distance: 200, expected: 3.55 },
    { distance: 180, expected: 3.42 },
    { distance: 160, expected: 3.3 },
    { distance: 140, expected: 3.18 },
    { distance: 120, expected: 3.06 },
    { distance: 100, expected: 2.96 },
    { distance: 80, expected: 2.86 },
    { distance: 60, expected: 2.76 },
    { distance: 50, expected: 2.7 },
    { distance: 40, expected: 2.64 },
    { distance: 30, expected: 2.56 },
    { distance: 20, expected: 2.46 },
    { distance: 15, expected: 2.4 },
    { distance: 10, expected: 2.34 },
    { distance: 5, expected: 2.26 },
    { distance: 1, expected: 2.2 },
  ],
  bunker: [
    { distance: 100, expected: 3.3 },
    { distance: 80, expected: 3.18 },
    { distance: 60, expected: 3.06 },
    { distance: 50, expected: 3.0 },
    { distance: 40, expected: 2.92 },
    { distance: 30, expected: 2.84 },
    { distance: 20, expected: 2.74 },
    { distance: 15, expected: 2.68 },
    { distance: 10, expected: 2.62 },
    { distance: 5, expected: 2.54 },
    { distance: 1, expected: 2.48 },
  ],
  green: [
    { distance: 15, expected: 2.15 },
    { distance: 12, expected: 2.08 },
    { distance: 10, expected: 2.02 },
    { distance: 8, expected: 1.92 },
    { distance: 6, expected: 1.78 },
    { distance: 5, expected: 1.68 },
    { distance: 4, expected: 1.58 },
    { distance: 3, expected: 1.45 },
    { distance: 2, expected: 1.28 },
    { distance: 1.5, expected: 1.18 },
    { distance: 1, expected: 1.08 },
    { distance: 0.5, expected: 1.02 },
    { distance: 0.1, expected: 1.0 },
  ],
};

function interpolate(points: BenchmarkPoint[], distance: number): number {
  const sorted = [...points].sort((a, b) => b.distance - a.distance);

  const min = sorted[sorted.length - 1];
  if (distance <= min.distance) return min.expected;

  const max = sorted[0];
  if (distance >= max.distance) return max.expected;

  for (let i = 0; i < sorted.length - 1; i++) {
    const upper = sorted[i];
    const lower = sorted[i + 1];
    if (distance <= upper.distance && distance >= lower.distance) {
      const ratio =
        (upper.distance - distance) / (upper.distance - lower.distance);
      return upper.expected + ratio * (lower.expected - upper.expected);
    }
  }

  return sorted[0].expected;
}

export function expectedStrokesFromLie(
  lie: LieType,
  distanceMeters: number,
  _par?: number
): number {
  const clampedDist = Math.max(0.1, distanceMeters);
  const points = BENCHMARKS[lie];
  if (!points) return 3.0;
  return Math.round(interpolate(points, clampedDist) * 1000) / 1000;
}

interface ShotState {
  lie: LieType;
  distance: number;
  par?: number;
}

export function calculateShotSg(
  before: ShotState,
  after: ShotState
): number {
  const expBefore = expectedStrokesFromLie(
    before.lie,
    before.distance,
    before.par
  );
  const expAfter = expectedStrokesFromLie(
    after.lie,
    after.distance,
    after.par
  );
  const sg = expBefore - expAfter - 1;
  return Math.round(sg * 1000) / 1000;
}

export function getSgCategory(
  fromLie: LieType,
  fromDistance: number,
  par: number,
  _shotNumber: number
): "OTT" | "APP" | "ARG" | "PUT" {
  if (fromLie === "green") return "PUT";
  if (fromLie === "tee" && par !== 3) return "OTT";
  if (fromLie === "tee" && par === 3) return "APP";
  if (fromDistance >= 45) return "APP";
  return "ARG";
}

export function expectedStrokesForHole(par: number): number {
  return par;
}
