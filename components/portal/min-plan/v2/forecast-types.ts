import type { LucideIcon } from "lucide-react";
import {
  CircleDot,
  FlagTriangleRight,
  Target,
  Zap,
} from "lucide-react";
import type { FocusTone } from "./focus-card";

export interface CategoryHours {
  hours: number;
  ci95Low: number;
  ci95High: number;
}

export interface TechTactMentalPhys {
  tek: number;
  tak: number;
  mental: number;
  fys: number;
}

export interface ForecastDataV2 {
  id: string;
  generatedAt: string;
  currentScoreAvg: number;
  currentSgTotal: number;
  currentSgOtt: number | null;
  currentSgApp: number | null;
  currentSgArg: number | null;
  currentSgPutt: number | null;
  currentCategory: string;
  targetScoreAvg: number;
  targetCategory: string;
  deadline: string;
  requiredSgDelta: number;
  deltaAllocationJson: Record<string, number>;
  estimatedTotalHours: number;
  estimatedHoursCi95Low: number;
  estimatedHoursCi95High: number;
  estimatedHoursPerWeek: number;
  hoursPerCategoryJson: Record<string, CategoryHours>;
  techTactMentalPhysJson: Record<string, TechTactMentalPhys>;
  probabilityOfSuccess: number;
  confidenceInterval95: [number, number];
  primaryFocusCategory: string;
  rootCauseJson: Record<string, string>;
  recommendationsJson: string[];
  assumptionsJson: string[];
  modelVersion: string;
  monteCarloRuns: number;
  withinCi95?: boolean | null;
  predictionErrorSg?: number | null;
}

export const CATEGORY_LABELS: Record<string, string> = {
  OTT: "Tee",
  APP: "Innspill",
  ARG: "Kort spill",
  PUTT: "Putting",
};

export const CATEGORY_TONE: Record<string, FocusTone> = {
  PUTT: "putt",
  APP: "iron",
  ARG: "short",
  OTT: "driver",
};

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  PUTT: CircleDot,
  APP: Target,
  ARG: FlagTriangleRight,
  OTT: Zap,
};

export function round1(n: number): string {
  return n.toFixed(1);
}

export function formatDeadline(d: string): string {
  return new Date(d).toLocaleDateString("no-NO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
