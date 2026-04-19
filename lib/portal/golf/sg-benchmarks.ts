/**
 * Strokes Gained Category Benchmarks (A-K) — snittscore-basert.
 *
 * Kilde: Masterdokument v2.0 §2.1. A = <68 (verdenselite),
 * B = 68-72 (nasjonal elite), C = 72-74 (U21), ..., K = 100+ (nybegynner jr).
 *
 * SG-verdiene er gjennomsnitt per kategori. A-B er basert på PGA/DP World Tour-
 * referanser (positive SG vs. scratch). C-K er norsk amatørdata. Rekalibreres
 * nattlig når NorwegianSkillBenchmark er oppdatert.
 */

export interface SGBenchmark {
  category: string;
  label: string;
  scoreRange: [number, number];
  /** Bakoverkompatibilitet. Bruk scoreRange for nye oppslag. */
  handicapRange: [number, number];
  averageScore: number;
  sg: {
    total: number;
    offTheTee: number;
    approach: number;
    aroundTheGreen: number;
    putting: number;
  };
}

export const SG_BENCHMARKS: SGBenchmark[] = [
  {
    category: "K",
    label: "Nybegynner jr.",
    scoreRange: [100, 150],
    handicapRange: [45, 54],
    averageScore: 110,
    sg: { total: -6.0, offTheTee: -1.5, approach: -2.5, aroundTheGreen: -1.5, putting: -0.5 },
  },
  {
    category: "J",
    label: "Nybegynner sr.",
    scoreRange: [95, 100],
    handicapRange: [37, 44],
    averageScore: 97,
    sg: { total: -4.8, offTheTee: -1.2, approach: -2.0, aroundTheGreen: -1.2, putting: -0.4 },
  },
  {
    category: "I",
    label: "Rekrutt jr.",
    scoreRange: [90, 95],
    handicapRange: [30, 36],
    averageScore: 92,
    sg: { total: -4.0, offTheTee: -1.0, approach: -1.7, aroundTheGreen: -0.9, putting: -0.4 },
  },
  {
    category: "H",
    label: "Rekrutt sr.",
    scoreRange: [85, 90],
    handicapRange: [25, 29],
    averageScore: 87,
    sg: { total: -3.2, offTheTee: -0.9, approach: -1.4, aroundTheGreen: -0.7, putting: -0.2 },
  },
  {
    category: "G",
    label: "Klubbspiller jr.",
    scoreRange: [80, 85],
    handicapRange: [20, 24],
    averageScore: 82,
    sg: { total: -2.5, offTheTee: -0.7, approach: -1.1, aroundTheGreen: -0.5, putting: -0.2 },
  },
  {
    category: "F",
    label: "Klubbspiller sr.",
    scoreRange: [78, 80],
    handicapRange: [15, 19],
    averageScore: 79,
    sg: { total: -2.0, offTheTee: -0.6, approach: -0.9, aroundTheGreen: -0.4, putting: -0.1 },
  },
  {
    category: "E",
    label: "Regional U18",
    scoreRange: [76, 78],
    handicapRange: [12, 14],
    averageScore: 77,
    sg: { total: -1.5, offTheTee: -0.5, approach: -0.7, aroundTheGreen: -0.2, putting: -0.1 },
  },
  {
    category: "D",
    label: "Regional elite",
    scoreRange: [74, 76],
    handicapRange: [9, 11],
    averageScore: 75,
    sg: { total: -0.9, offTheTee: -0.3, approach: -0.4, aroundTheGreen: -0.1, putting: -0.1 },
  },
  {
    category: "C",
    label: "Nasjonal U21",
    scoreRange: [72, 74],
    handicapRange: [6, 8],
    averageScore: 73,
    sg: { total: -0.3, offTheTee: -0.1, approach: -0.1, aroundTheGreen: 0.0, putting: -0.1 },
  },
  {
    category: "B",
    label: "Nasjonal elite",
    scoreRange: [68, 72],
    handicapRange: [3, 5],
    averageScore: 70,
    sg: { total: 0.8, offTheTee: 0.2, approach: 0.3, aroundTheGreen: 0.1, putting: 0.2 },
  },
  {
    category: "A",
    label: "Verdenselite",
    scoreRange: [0, 68],
    handicapRange: [-5, 2],
    averageScore: 66,
    sg: { total: 3.5, offTheTee: 0.8, approach: 1.3, aroundTheGreen: 0.6, putting: 0.8 },
  },
];

export function getBenchmarkByCategory(
  category: string
): SGBenchmark | undefined {
  return SG_BENCHMARKS.find((b) => b.category === category);
}

/**
 * PRIMÆR: Finn benchmark basert på snittscore.
 */
export function getBenchmarkByScore(
  avgScore: number
): SGBenchmark | undefined {
  return SG_BENCHMARKS.find(
    (b) => avgScore >= b.scoreRange[0] && avgScore < b.scoreRange[1] + 0.0001
  );
}

/**
 * Bakoverkompatibilitet. Bruk getBenchmarkByScore når snittscore er kjent.
 */
export function getBenchmarkByHandicap(
  handicap: number
): SGBenchmark | undefined {
  return SG_BENCHMARKS.find(
    (b) => handicap >= b.handicapRange[0] && handicap <= b.handicapRange[1]
  );
}

/**
 * SG-dimensjonsnavn (matcher USI og RoundStats).
 */
export const SG_DIMENSIONS = [
  "offTheTee",
  "approach",
  "aroundTheGreen",
  "putting",
] as const;

export type SGDimension = (typeof SG_DIMENSIONS)[number];

export const SG_DIMENSION_LABEL: Record<SGDimension, string> = {
  offTheTee: "Langspill",
  approach: "Innspill",
  aroundTheGreen: "Kortspill",
  putting: "Putting",
};
