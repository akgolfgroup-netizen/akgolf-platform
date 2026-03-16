/**
 * Strokes Gained Category Benchmarks (A–K)
 * Ported from akgolf-iup category-sg-benchmarks.ts
 *
 * Values based on professional tour data and amateur benchmarks.
 */

export interface SGBenchmark {
  category: string;
  label: string;
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
    category: "K", label: "Nybegynner", handicapRange: [45, 54], averageScore: 125,
    sg: { total: -6.0, offTheTee: -1.5, approach: -2.5, aroundTheGreen: -1.5, putting: -0.5 },
  },
  {
    category: "J", label: "Grunnleggende", handicapRange: [37, 44], averageScore: 115,
    sg: { total: -5.0, offTheTee: -1.3, approach: -2.0, aroundTheGreen: -1.2, putting: -0.5 },
  },
  {
    category: "I", label: "Utviklende", handicapRange: [30, 36], averageScore: 108,
    sg: { total: -4.0, offTheTee: -1.0, approach: -1.7, aroundTheGreen: -0.9, putting: -0.4 },
  },
  {
    category: "H", label: "Fremskritt", handicapRange: [25, 29], averageScore: 103,
    sg: { total: -3.5, offTheTee: -0.9, approach: -1.5, aroundTheGreen: -0.8, putting: -0.3 },
  },
  {
    category: "G", label: "Mellomnivå", handicapRange: [20, 24], averageScore: 98,
    sg: { total: -3.0, offTheTee: -0.8, approach: -1.3, aroundTheGreen: -0.6, putting: -0.3 },
  },
  {
    category: "F", label: "Kompetent", handicapRange: [15, 19], averageScore: 93,
    sg: { total: -2.5, offTheTee: -0.7, approach: -1.1, aroundTheGreen: -0.5, putting: -0.2 },
  },
  {
    category: "E", label: "Avansert", handicapRange: [12, 14], averageScore: 90,
    sg: { total: -2.0, offTheTee: -0.6, approach: -0.9, aroundTheGreen: -0.4, putting: -0.1 },
  },
  {
    category: "D", label: "Dyktig", handicapRange: [9, 11], averageScore: 87,
    sg: { total: -1.7, offTheTee: -0.5, approach: -0.7, aroundTheGreen: -0.3, putting: -0.2 },
  },
  {
    category: "C", label: "Meget dyktig", handicapRange: [6, 8], averageScore: 84,
    sg: { total: -1.3, offTheTee: -0.4, approach: -0.5, aroundTheGreen: -0.2, putting: -0.2 },
  },
  {
    category: "B", label: "Expert", handicapRange: [3, 5], averageScore: 81,
    sg: { total: -0.8, offTheTee: -0.3, approach: -0.3, aroundTheGreen: -0.1, putting: -0.1 },
  },
  {
    category: "A", label: "Elite", handicapRange: [0, 2], averageScore: 78,
    sg: { total: -0.3, offTheTee: -0.1, approach: -0.1, aroundTheGreen: 0.0, putting: -0.1 },
  },
];

export function getBenchmarkByCategory(category: string): SGBenchmark | undefined {
  return SG_BENCHMARKS.find((b) => b.category === category);
}

export function getBenchmarkByHandicap(handicap: number): SGBenchmark | undefined {
  return SG_BENCHMARKS.find(
    (b) => handicap >= b.handicapRange[0] && handicap <= b.handicapRange[1]
  );
}
