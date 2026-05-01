// VERIFY: AK-formler for tidsallokering — rimelige defaults, justeres i tuning-pass
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 3

export type AllocationArea = "fysisk" | "teknikk" | "slag" | "spill" | "mental";
export type Phase = "off_season" | "forberedelse" | "sesong" | "avslutning" | "taper";

export interface AreaAllocation {
  fysisk: number;
  teknikk: number;
  slag: number;
  spill: number;
  mental: number;
}

/** Baseline-fordeling per HCP-bucket (sum = 100%) */
export const HCP_BASELINE_ALLOCATION: Record<string, AreaAllocation> = {
  hcp_0_5:   { fysisk: 15, teknikk: 20, slag: 30, spill: 25, mental: 10 },
  hcp_6_12:  { fysisk: 15, teknikk: 25, slag: 30, spill: 22, mental: 8 },
  hcp_13_20: { fysisk: 15, teknikk: 25, slag: 28, spill: 25, mental: 7 },
  hcp_21_30: { fysisk: 18, teknikk: 30, slag: 22, spill: 25, mental: 5 },
  hcp_31_54: { fysisk: 20, teknikk: 35, slag: 18, spill: 22, mental: 5 },
};

/** Hvor mange pp som tildeles svakhetsområdet */
export const WEAKNESS_SKEW = 15;

/** Multiplikatorer per treningsfase — normaliseres tilbake til 100% etterpå */
export const PHASE_MULTIPLIERS: Record<Phase, AreaAllocation> = {
  off_season:   { fysisk: 1.5, teknikk: 1.3, slag: 0.6, spill: 0.5, mental: 1.0 },
  forberedelse: { fysisk: 1.0, teknikk: 1.4, slag: 1.0, spill: 0.8, mental: 1.0 },
  sesong:       { fysisk: 0.7, teknikk: 0.7, slag: 1.2, spill: 1.4, mental: 1.1 },
  avslutning:   { fysisk: 1.0, teknikk: 0.8, slag: 0.9, spill: 1.0, mental: 1.3 },
  taper:        { fysisk: 0.5, teknikk: 0.4, slag: 1.3, spill: 1.5, mental: 1.5 },
};

/** Norsk sesonginndeling per måned */
export const SEASON_BY_MONTH: Record<number, Phase> = {
  1: "off_season", 2: "off_season", 3: "off_season",
  4: "forberedelse", 5: "forberedelse",
  6: "sesong", 7: "sesong", 8: "sesong", 9: "sesong",
  10: "avslutning",
  11: "off_season", 12: "off_season",
};

/** Mapper HCP til riktig baseline-nøkkel */
export function hcpToBaselineKey(hcp: number): string {
  if (hcp <= 5) return "hcp_0_5";
  if (hcp <= 12) return "hcp_6_12";
  if (hcp <= 20) return "hcp_13_20";
  if (hcp <= 30) return "hcp_21_30";
  return "hcp_31_54";
}

/** Normaliserer en AreaAllocation slik at summen blir nøyaktig 100% */
export function normalizeAllocation(alloc: AreaAllocation): AreaAllocation {
  const sum = alloc.fysisk + alloc.teknikk + alloc.slag + alloc.spill + alloc.mental;
  if (sum === 0) return { fysisk: 20, teknikk: 20, slag: 20, spill: 20, mental: 20 };
  const factor = 100 / sum;
  return {
    fysisk: Math.round(alloc.fysisk * factor),
    teknikk: Math.round(alloc.teknikk * factor),
    slag: Math.round(alloc.slag * factor),
    spill: Math.round(alloc.spill * factor),
    mental: Math.round(alloc.mental * factor),
  };
}

/** Runder av og justerer siste verdi for å garantere sum = 100% */
export function roundTo100(alloc: AreaAllocation): AreaAllocation {
  const rounded = {
    fysisk: Math.round(alloc.fysisk),
    teknikk: Math.round(alloc.teknikk),
    slag: Math.round(alloc.slag),
    spill: Math.round(alloc.spill),
    mental: Math.round(alloc.mental),
  };
  const sum = Object.values(rounded).reduce((a, b) => a + b, 0);
  const diff = 100 - sum;
  if (diff !== 0) {
    // Juster største verdi for å absorbere avrundingsdifferansen
    const entries = Object.entries(rounded) as [AllocationArea, number][];
    const maxKey = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    rounded[maxKey] += diff;
  }
  return rounded;
}
