import type { SGDimension } from "@/lib/portal/golf/sg-benchmarks";

export type SignalKind =
  | "stagnation"
  | "regression"
  | "low-plan-adherence"
  | "tournament-ready-missing-prep"
  | "promotion-ready"
  | "test-gap"
  | "course-heavy"
  | "on-track";

export type SignalSeverity = "low" | "medium" | "high";

export interface CoachingSignalEvidence {
  kind: string;
  label: string;
  value?: string;
}

export interface CoachingRecommendation {
  label: string;
  detail?: string;
  link?: string;
}

export interface CoachingSignal {
  userId: string;
  playerName: string | null;
  priorityScore: number;
  severity: SignalSeverity;
  primaryKind: SignalKind;
  primaryFocus: SGDimension | null;
  headline: string;
  evidence: CoachingSignalEvidence[];
  recommendedActions: CoachingRecommendation[];
  confidenceLevel: "low" | "medium" | "high";
  kinds: SignalKind[];
}
