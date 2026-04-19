import type { SGDimension } from "@/lib/portal/golf/sg-benchmarks";

export interface DimensionBreakdown {
  dimension: SGDimension;
  label: string;
  sgValue: number;
  category: string;
  benchmarkCategory: string;
  gap: "strength" | "on-level" | "gap";
}

export interface PlayerProfile {
  userId: string;
  userName: string | null;
  category: string;
  categoryLabel: string;
  averageScore: number | null;
  handicap: number | null;
  totalUsi: number;
  totalSg: number;
  progressToNextPct: number | null;
  nextCategory: string | null;
  dimensions: DimensionBreakdown[];
  tournamentContext: string;
}

export interface GapAnalysisRow {
  dimension: SGDimension;
  label: string;
  current: number;
  target: number;
  gap: number;
  isBottleneck: boolean;
  statusLabel: string;
}

export interface GapAnalysis {
  currentCategory: string;
  targetCategory: string | null;
  rows: GapAnalysisRow[];
  totalGap: number;
  estimatedMonths: number | null;
  trainingEfficiency: number;
  assumption: string;
}

export interface TrainingIndex {
  weeklyHours: number;
  recommendedSummer: [number, number];
  recommendedWinter: [number, number];
  planAdherencePct: number;
  sgPerHourPerMonth: number;
  distribution: {
    onCourse: number;
    skillTechnical: number;
    shortGame: number;
    putting: number;
    physicalMental: number;
  };
  courseGolfRatio: number;
}

export interface TestHistoryEntry {
  testNumber: number;
  testName: string;
  value: number;
  unit: string;
  passed: boolean;
  conductedAt: string;
  percentile?: number;
}

export interface TestHistory {
  recent: TestHistoryEntry[];
  byNumber: Record<number, TestHistoryEntry[]>;
  missingTests: number[];
}
