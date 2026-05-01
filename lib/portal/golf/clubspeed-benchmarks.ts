// VERIFY: ClubSpeed-benchmarks per HCP-bucket (cold-start fallback)
// Basert på gjennomsnittlige data for amatører. Kilde: TrackMan, Arccos

export interface ClubSpeedBenchmark {
  driver: { carry: number; total: number };
  fiveIron: { carry: number; total: number };
  sevenIron: { carry: number; total: number };
  pitchingWedge: { carry: number; total: number };
}

/** Snitt-carry (meter) per HCP-bucket */
export const HCP_CLUBSPEED_BENCHMARKS: Record<string, ClubSpeedBenchmark> = {
  hcp_0_5: {
    driver: { carry: 250, total: 270 },
    fiveIron: { carry: 185, total: 195 },
    sevenIron: { carry: 165, total: 175 },
    pitchingWedge: { carry: 115, total: 120 },
  },
  hcp_6_12: {
    driver: { carry: 230, total: 250 },
    fiveIron: { carry: 170, total: 180 },
    sevenIron: { carry: 150, total: 160 },
    pitchingWedge: { carry: 105, total: 110 },
  },
  hcp_13_20: {
    driver: { carry: 210, total: 230 },
    fiveIron: { carry: 155, total: 165 },
    sevenIron: { carry: 135, total: 145 },
    pitchingWedge: { carry: 95, total: 100 },
  },
  hcp_21_30: {
    driver: { carry: 190, total: 210 },
    fiveIron: { carry: 140, total: 150 },
    sevenIron: { carry: 120, total: 130 },
    pitchingWedge: { carry: 85, total: 90 },
  },
  hcp_31_54: {
    driver: { carry: 170, total: 190 },
    fiveIron: { carry: 125, total: 135 },
    sevenIron: { carry: 105, total: 115 },
    pitchingWedge: { carry: 75, total: 80 },
  },
};

export function getBenchmarkByHcp(hcp: number): ClubSpeedBenchmark {
  const key = hcp <= 5 ? "hcp_0_5" : hcp <= 12 ? "hcp_6_12" : hcp <= 20 ? "hcp_13_20" : hcp <= 30 ? "hcp_21_30" : "hcp_31_54";
  return HCP_CLUBSPEED_BENCHMARKS[key];
}
