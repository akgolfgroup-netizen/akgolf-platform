/**
 * SG → Handicap → A-K Category Mapping
 *
 * This module bridges Strokes Gained values to AK Golf Academy's A–K
 * player categories as defined in the master document
 * (ak-golf-masterdokument-v2_2026-04-12.docx).
 *
 * It uses cubic Hermite spline interpolation over the SG_BENCHMARKS
 * control points so that any SG_total can be translated into an
 * estimated handicap and corresponding category.
 */

import { SG_BENCHMARKS } from "./sg-benchmarks";

interface SgHcpPoint {
  sg: number;
  hcp: number;
  category: string;
}

const POINTS: SgHcpPoint[] = SG_BENCHMARKS.map((b) => ({
  sg: b.sg.total,
  hcp: (b.handicapRange[0] + b.handicapRange[1]) / 2,
  category: b.category,
}));

/**
 * Compute the slope between two neighbouring control points.
 */
function getSlope(i: number): number {
  if (i <= 0) {
    return (POINTS[1].hcp - POINTS[0].hcp) / (POINTS[1].sg - POINTS[0].sg);
  }
  if (i >= POINTS.length - 1) {
    const last = POINTS.length - 1;
    return (
      (POINTS[last].hcp - POINTS[last - 1].hcp) /
      (POINTS[last].sg - POINTS[last - 1].sg)
    );
  }
  return (
    (POINTS[i + 1].hcp - POINTS[i - 1].hcp) /
    (POINTS[i + 1].sg - POINTS[i - 1].sg)
  );
}

/**
 * Convert total Strokes Gained to an estimated handicap index using
 * cubic Hermite spline interpolation over the A–K benchmarks.
 *
 * NOTE: POINTS is ordered K (index 0, worst SG) to A (index 10, best SG).
 */
export function sgToHandicap(sgTotal: number): number {
  const first = 0; // K
  const last = POINTS.length - 1; // A

  // Extrapolate linearly below the bottom (K) benchmark
  if (sgTotal <= POINTS[first].sg) {
    const next = first + 1; // J
    const slope =
      (POINTS[next].hcp - POINTS[first].hcp) /
      (POINTS[next].sg - POINTS[first].sg);
    return POINTS[first].hcp + slope * (sgTotal - POINTS[first].sg);
  }

  // Extrapolate linearly above the top (A) benchmark
  if (sgTotal >= POINTS[last].sg) {
    const prev = last - 1; // B
    const slope =
      (POINTS[last].hcp - POINTS[prev].hcp) /
      (POINTS[last].sg - POINTS[prev].sg);
    return Math.max(0, POINTS[last].hcp + slope * (sgTotal - POINTS[last].sg));
  }

  // Find the interval that contains sgTotal
  // Since POINTS goes from K (-6.0) to A (-0.3), we search upward
  let i = 0;
  while (i < POINTS.length - 1 && sgTotal > POINTS[i + 1].sg) {
    i++;
  }

  const p0 = POINTS[i];
  const p1 = POINTS[i + 1];

  const dx = p1.sg - p0.sg;
  const t = (sgTotal - p0.sg) / dx;

  // Tangents at the two endpoints
  const m0 = getSlope(i) * dx;
  const m1 = getSlope(i + 1) * dx;

  const t2 = t * t;
  const t3 = t2 * t;

  // Cubic Hermite basis functions
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return h00 * p0.hcp + h10 * m0 + h01 * p1.hcp + h11 * m1;
}

/**
 * Map a handicap index to the closest A–K category.
 * Uses nearest-neighbour to the category midpoints for values that fall
 * between the defined ranges.
 */
export function handicapToCategory(hcp: number): string {
  // Strict match inside a defined range
  for (const b of SG_BENCHMARKS) {
    if (hcp >= b.handicapRange[0] && hcp <= b.handicapRange[1]) {
      return b.category;
    }
  }

  // Edge cases: nearest midpoint
  let closest = SG_BENCHMARKS[0];
  let minDiff = Infinity;
  for (const b of SG_BENCHMARKS) {
    const midpoint = (b.handicapRange[0] + b.handicapRange[1]) / 2;
    const diff = Math.abs(hcp - midpoint);
    if (diff < minDiff) {
      minDiff = diff;
      closest = b;
    }
  }
  return closest.category;
}

/**
 * Convenience helper: SG_total → A–K category.
 */
export function sgToCategory(sgTotal: number): string {
  return handicapToCategory(sgToHandicap(sgTotal));
}

/**
 * Category-specific SG → Handicap mapping.
 * Uses per-category benchmarks from SG_BENCHMARKS.
 */
const CATEGORY_FIELDS = {
  offTheTee: "offTheTee" as const,
  approach: "approach" as const,
  aroundTheGreen: "aroundTheGreen" as const,
  putting: "putting" as const,
};

export function sgToHandicapCategory(
  sgValue: number | null,
  field: keyof typeof CATEGORY_FIELDS
): number | null {
  if (sgValue === null) return null;

  // Points are ordered K (index 0, worst SG) to A (index 10, best SG)
  const points = SG_BENCHMARKS.map((b) => ({
    sg: b.sg[field],
    hcp: (b.handicapRange[0] + b.handicapRange[1]) / 2,
  }));

  const first = 0; // K
  const last = points.length - 1; // A

  // Extrapolate below K benchmark
  if (sgValue <= points[first].sg) {
    const next = first + 1; // J
    const slope =
      (points[next].hcp - points[first].hcp) /
      (points[next].sg - points[first].sg);
    return points[first].hcp + slope * (sgValue - points[first].sg);
  }

  // Extrapolate above A benchmark
  if (sgValue >= points[last].sg) {
    const prev = last - 1; // B
    const slope =
      (points[last].hcp - points[prev].hcp) /
      (points[last].sg - points[prev].sg);
    return Math.max(0, points[last].hcp + slope * (sgValue - points[last].sg));
  }

  // Find interval (search upward since points go from worst to best SG)
  let i = 0;
  while (i < points.length - 1 && sgValue > points[i + 1].sg) {
    i++;
  }

  const p0 = points[i];
  const p1 = points[i + 1];
  const dx = p1.sg - p0.sg;
  const t = (sgValue - p0.sg) / dx;

  const getLocalSlope = (idx: number) => {
    if (idx <= 0) {
      return (points[1].hcp - points[0].hcp) / (points[1].sg - points[0].sg);
    }
    if (idx >= points.length - 1) {
      const l = points.length - 1;
      return (points[l].hcp - points[l - 1].hcp) / (points[l].sg - points[l - 1].sg);
    }
    return (
      (points[idx + 1].hcp - points[idx - 1].hcp) /
      (points[idx + 1].sg - points[idx - 1].sg)
    );
  };

  const m0 = getLocalSlope(i) * dx;
  const m1 = getLocalSlope(i + 1) * dx;

  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return h00 * p0.hcp + h10 * m0 + h01 * p1.hcp + h11 * m1;
}
