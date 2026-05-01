// VERIFY: Allokeringsmotor — beregner %-fordeling per uke basert på HCP, svakhet, fase, turnering
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 4.1

import {
  HCP_BASELINE_ALLOCATION,
  WEAKNESS_SKEW,
  PHASE_MULTIPLIERS,
  SEASON_BY_MONTH,
  hcpToBaselineKey,
  normalizeAllocation,
  roundTo100,
  type AreaAllocation,
  type Phase,
  type AllocationArea,
} from "./formulas";
import { computeDominantBuckets, type DistanceVector } from "@/lib/portal/golf/distance-buckets";
import type { AllocationSource } from "@prisma/client";

export interface AllocationInput {
  userId: string;
  hcp: number;
  weeklyHours: number;
  age: number;
  goal: string; // PlayerType som string
  homeCourseHoles?: Array<{ hole: number; par: number; lengthMeters: number }>;
  homeCourseDriverCarry?: number;
  weakestArea?: "tee" | "approach" | "arg" | "putting" | string;
  importedSG?: { tee: number; approach: number; arg: number; putting: number; samples: number };
  upcomingTournaments?: Array<{ startsAt: Date; importance: number; name: string }>;
  planHorizonWeeks: number;
  startDate?: Date;
}

export interface SlagAllocation {
  tee: number;
  "200+": number;
  "150-200": number;
  "100-150": number;
  "50-100": number;
}

export interface SpillAllocation {
  putting: number;
  chipping: number;
  bunker: number;
  banetrening: number;
}

export interface WeeklyAllocation {
  weekStart: Date;
  phase: Phase;
  triggers: string[];
  allocation: {
    fysisk: number;
    teknikk: number;
    slag: SlagAllocation;
    spill: SpillAllocation;
    mental: number;
  };
}

export interface AllocationOutput {
  weeks: WeeklyAllocation[];
  rationale: string[];
  source: AllocationSource;
  distanceBuckets?: DistanceVector;
}

const AREA_TO_SKEW_TARGET: Record<string, AllocationArea> = {
  tee: "slag",
  approach: "slag",
  arg: "spill",
  putting: "spill",
  putting_short: "spill",
  shortgame: "spill",
  driver: "slag",
  iron: "slag",
  mental: "mental",
  fysisk: "fysisk",
  course: "spill",
};

/** Hovedmotor: beregner ukentlig allokering */
export function computeAllocation(input: AllocationInput): AllocationOutput {
  const rationale: string[] = [];
  const start = input.startDate ?? new Date();

  // 1. Bestem source
  let source: AllocationSource = "HCP_BASELINE";
  if (input.importedSG && input.importedSG.samples >= 5) {
    source = "IMPORTED";
    rationale.push(`Importert SG-data (${input.importedSG.samples} runder) brukes som basis`);
  } else if (input.weakestArea) {
    source = "SELF_RATED";
    rationale.push(`Selvrapportert svakhet: ${input.weakestArea}`);
  } else {
    rationale.push(`HCP-baseline: ${hcpToBaselineKey(input.hcp)}`);
  }

  // 2. Hent baseline
  const baselineKey = hcpToBaselineKey(input.hcp);
  let base = { ...HCP_BASELINE_ALLOCATION[baselineKey] };
  rationale.push(`Baseline: fysisk=${base.fysisk}% teknikk=${base.teknikk}% slag=${base.slag}% spill=${base.spill}% mental=${base.mental}%`);

  // 3. Apply skew
  if (input.weakestArea) {
    const targetArea = (AREA_TO_SKEW_TARGET[input.weakestArea] ?? "teknikk") as AllocationArea;
    const others = (Object.keys(base) as AllocationArea[]).filter((a) => a !== targetArea);
    const subtractPerOther = WEAKNESS_SKEW / others.length;

    base[targetArea] += WEAKNESS_SKEW;
    for (const area of others) {
      base[area] = Math.max(0, base[area] - subtractPerOther);
    }
    base = normalizeAllocation(base);
    rationale.push(`Svakhets-skew (+${WEAKNESS_SKEW}pp til ${targetArea}): fysisk=${base.fysisk}% teknikk=${base.teknikk}% slag=${base.slag}% spill=${base.spill}% mental=${base.mental}%`);
  }

  // 4. Distance-buckets (gjenbrukes for alle uker)
  let distanceBuckets: DistanceVector | undefined;
  if (input.homeCourseHoles && input.homeCourseHoles.length > 0) {
    const driverCarry = input.homeCourseDriverCarry ?? 200;
    distanceBuckets = computeDominantBuckets(input.homeCourseHoles, driverCarry);
    rationale.push(`Hjemmebane distance-buckets: tee=${distanceBuckets.tee}% 200+=${distanceBuckets["200+"]}% 150-200=${distanceBuckets["150-200"]}% 100-150=${distanceBuckets["100-150"]}% 50-100=${distanceBuckets["50-100"]}% <50=${distanceBuckets["<50"]}%`);
  }

  // 5. Bygg uker
  const weeks: WeeklyAllocation[] = [];

  for (let w = 0; w < input.planHorizonWeeks; w++) {
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + w * 7);
    const month = weekStart.getMonth() + 1;
    let phase: Phase = SEASON_BY_MONTH[month] ?? "sesong";
    const triggers: string[] = [];

    // 6. Turnering-taper
    if (input.upcomingTournaments) {
      for (const t of input.upcomingTournaments) {
        const daysUntil = Math.ceil((t.startsAt.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 28) {
          phase = "taper";
          triggers.push(`Turnering: ${t.name} om ${daysUntil} dager`);
          rationale.push(`Uke ${w + 1}: taper pga ${t.name} (${daysUntil}d)`);
          break; // Prioriter første match
        }
      }
    }

    // 7. Apply phase multipliers
    const multipliers = PHASE_MULTIPLIERS[phase];
    let weekAlloc: AreaAllocation = {
      fysisk: base.fysisk * multipliers.fysisk,
      teknikk: base.teknikk * multipliers.teknikk,
      slag: base.slag * multipliers.slag,
      spill: base.spill * multipliers.spill,
      mental: base.mental * multipliers.mental,
    };
    weekAlloc = normalizeAllocation(weekAlloc);
    weekAlloc = roundTo100(weekAlloc);

    // 8. Fordel SLAG på distance-buckets
    const slagTotal = weekAlloc.slag;
    const slagAlloc: SlagAllocation = distanceBuckets
      ? {
          tee: Math.round((distanceBuckets.tee / 100) * slagTotal),
          "200+": Math.round((distanceBuckets["200+"] / 100) * slagTotal),
          "150-200": Math.round((distanceBuckets["150-200"] / 100) * slagTotal),
          "100-150": Math.round((distanceBuckets["100-150"] / 100) * slagTotal),
          "50-100": Math.round((distanceBuckets["50-100"] / 100) * slagTotal),
        }
      : {
          tee: Math.round(slagTotal * 0.2),
          "200+": Math.round(slagTotal * 0.15),
          "150-200": Math.round(slagTotal * 0.2),
          "100-150": Math.round(slagTotal * 0.25),
          "50-100": Math.round(slagTotal * 0.2),
        };

    // Juster slagAlloc til å summere til slagTotal
    const slagSum = Object.values(slagAlloc).reduce((a, b) => a + b, 0);
    const slagDiff = slagTotal - slagSum;
    if (slagDiff !== 0) {
      const maxKey = Object.entries(slagAlloc).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as keyof SlagAllocation;
      slagAlloc[maxKey] += slagDiff;
    }

    // 9. Fordel SPILL på underområder
    const spillTotal = weekAlloc.spill;
    const spillAlloc: SpillAllocation = {
      putting: Math.round(spillTotal * 0.35),
      chipping: Math.round(spillTotal * 0.3),
      bunker: Math.round(spillTotal * 0.15),
      banetrening: Math.round(spillTotal * 0.2),
    };
    const spillSum = Object.values(spillAlloc).reduce((a, b) => a + b, 0);
    const spillDiff = spillTotal - spillSum;
    if (spillDiff !== 0) {
      const maxKey = Object.entries(spillAlloc).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as keyof SpillAllocation;
      spillAlloc[maxKey] += spillDiff;
    }

    weeks.push({
      weekStart,
      phase,
      triggers,
      allocation: {
        fysisk: weekAlloc.fysisk,
        teknikk: weekAlloc.teknikk,
        slag: slagAlloc,
        spill: spillAlloc,
        mental: weekAlloc.mental,
      },
    });
  }

  return { weeks, rationale, source, distanceBuckets };
}
