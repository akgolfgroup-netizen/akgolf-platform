/**
 * USI Gap Analysis
 *
 * Compares a player's USI dimensions against their A–K category benchmarks
 * to identify weaknesses, calculate improvement potential, and recommend
 * focus areas and drills.
 */

import { SG_BENCHMARKS, getBenchmarkByCategory } from "@/lib/portal/golf/sg-benchmarks";
import { sgToHandicap } from "@/lib/portal/golf/sg-to-handicap";
import type { USIResult } from "./compute-usi";

export interface DimensionGap {
  dimension: "OTT" | "APP" | "ARG" | "PUTT";
  playerValue: number;
  benchmarkValue: number;
  gap: number; // negative = below benchmark
  potentialHcpGain: number;
}

export interface GapAnalysis {
  category: string;
  topWeakness: DimensionGap;
  secondaryWeaknesses: DimensionGap[];
  strengths: DimensionGap[];
  averageGap: number;
  totalPotentialHcpGain: number;
  focusAreas: string[];
  drillCategories: string[];
  weeklyHoursRecommendation: number;
}

const DIMENSION_MAP: { key: keyof USIResult; field: keyof (typeof SG_BENCHMARKS)[0]["sg"]; label: DimensionGap["dimension"] }[] = [
  { key: "sgOtt", field: "offTheTee", label: "OTT" },
  { key: "sgApp", field: "approach", label: "APP" },
  { key: "sgArg", field: "aroundTheGreen", label: "ARG" },
  { key: "sgPutt", field: "putting", label: "PUTT" },
];

/**
 * Approximate HCP gain from improving a specific SG dimension by `improvement` strokes.
 * Heuristic: 1 SG_total ≈ 3 HCP strokes. A dimension contributes a fraction of total SG.
 */
function estimateHcpGainFromDimension(
  currentValue: number,
  improvement: number,
  dimensionWeight: number
): number {
  const currentHcp = sgToHandicap(currentValue * dimensionWeight);
  const improvedHcp = sgToHandicap((currentValue + improvement) * dimensionWeight);
  // Lower HCP is better, so gain = current - improved
  return Math.max(0, currentHcp - improvedHcp);
}

export function analyzeGaps(usi: USIResult): GapAnalysis {
  const benchmark = getBenchmarkByCategory(usi.estimatedCategory);
  if (!benchmark) {
    throw new Error(`Unknown category: ${usi.estimatedCategory}`);
  }

  const gaps: DimensionGap[] = DIMENSION_MAP.map((dim) => {
    const playerValue = usi[dim.key] as number;
    const benchmarkValue = benchmark.sg[dim.field];
    const gap = playerValue - benchmarkValue; // negative = worse than benchmark
    const weights: Record<DimensionGap["dimension"], number> = {
      OTT: 0.20,
      APP: 0.30,
      ARG: 0.15,
      PUTT: 0.10,
    };
    const potentialHcpGain = estimateHcpGainFromDimension(
      playerValue,
      Math.max(0, -gap) + 0.3, // assume they can close gap + 0.3 SG
      weights[dim.label]
    );

    return {
      dimension: dim.label,
      playerValue,
      benchmarkValue,
      gap,
      potentialHcpGain,
    };
  });

  const sortedByGap = [...gaps].sort((a, b) => a.gap - b.gap);
  const topWeakness = sortedByGap[0];
  const secondaryWeaknesses = sortedByGap.slice(1).filter((g) => g.gap < -0.1);
  const strengths = sortedByGap.filter((g) => g.gap >= 0);

  const averageGap = gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length;
  const totalPotentialHcpGain = gaps.reduce((sum, g) => sum + g.potentialHcpGain, 0);

  // Focus areas based on weaknesses
  const focusAreas: string[] = [];
  if (topWeakness && topWeakness.gap < -0.05) {
    focusAreas.push(topWeakness.dimension);
  }
  for (const g of secondaryWeaknesses) {
    focusAreas.push(g.dimension);
  }

  // Map dimensions to drill/exercise categories
  const drillCategoryMap: Record<string, string[]> = {
    OTT: ["driving", "long game", "tee shots"],
    APP: ["approach", "iron play", "wedges"],
    ARG: ["short game", "chipping", "bunker", "pitching"],
    PUTT: ["putting", "green reading"],
  };

  const drillCategories = Array.from(
    new Set(focusAreas.flatMap((area) => drillCategoryMap[area] ?? []))
  );

  // Weekly hours recommendation based on current category and number of focus areas
  const baseHours: Record<string, number> = {
    K: 4,
    J: 5,
    I: 6,
    H: 7,
    G: 8,
    F: 9,
    E: 10,
    D: 11,
    C: 12,
    B: 13,
    A: 14,
  };
  const weeklyHoursRecommendation =
    (baseHours[benchmark.category] ?? 8) + focusAreas.length * 0.5;

  return {
    category: benchmark.category,
    topWeakness,
    secondaryWeaknesses,
    strengths,
    averageGap,
    totalPotentialHcpGain,
    focusAreas,
    drillCategories,
    weeklyHoursRecommendation,
  };
}
