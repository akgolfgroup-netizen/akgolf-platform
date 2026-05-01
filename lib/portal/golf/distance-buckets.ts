// VERIFY: Distance-bucket-beregning for hjemmebane
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 3.4

export interface HoleData {
  hole: number;
  par: number;
  lengthMeters: number;
}

export interface DistanceVector {
  tee: number;
  "200+": number;
  "150-200": number;
  "100-150": number;
  "50-100": number;
  "<50": number;
}

function placeBucket(buckets: Record<string, number>, distance: number, weight: number) {
  if (distance >= 200) buckets["200+"] += weight;
  else if (distance >= 150) buckets["150-200"] += weight;
  else if (distance >= 100) buckets["100-150"] += weight;
  else if (distance >= 50) buckets["50-100"] += weight;
  else buckets["<50"] += weight;
}

function normalizeToPercent(buckets: Record<string, number>): DistanceVector {
  const sum = Object.values(buckets).reduce((a, b) => a + b, 0);
  if (sum === 0) {
    return { tee: 0, "200+": 20, "150-200": 20, "100-150": 20, "50-100": 20, "<50": 20 };
  }
  const factor = 100 / sum;
  const result: Record<string, number> = {};
  for (const [key, val] of Object.entries(buckets)) {
    result[key] = Math.round(val * factor);
  }
  // Juster for avrunding
  const currentSum = Object.values(result).reduce((a, b) => a + b, 0);
  const diff = 100 - currentSum;
  if (diff !== 0) {
    const maxKey = Object.entries(result).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    result[maxKey] += diff;
  }
  return result as unknown as DistanceVector;
}

/** Beregner dominante distance-buckets gitt hull-data og driver carry */
export function computeDominantBuckets(
  holes: HoleData[],
  driverCarry: number,
): DistanceVector {
  const buckets: Record<string, number> = {
    tee: 0, "200+": 0, "150-200": 0, "100-150": 0, "50-100": 0, "<50": 0,
  };

  for (const hole of holes) {
    if (hole.par === 3) {
      placeBucket(buckets, hole.lengthMeters, 1);
      continue;
    }
    if (hole.par === 4) {
      const approachDist = Math.max(50, hole.lengthMeters - driverCarry);
      placeBucket(buckets, approachDist, 1);
      buckets.tee += 1;
      continue;
    }
    if (hole.par === 5) {
      const second = Math.max(50, hole.lengthMeters - driverCarry);
      const third = Math.max(50, second - 200); // antar 5-jern på 2nd
      placeBucket(buckets, third, 1);
      buckets.tee += 1;
      continue;
    }
  }

  return normalizeToPercent(buckets);
}
