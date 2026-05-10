/**
 * Signal Registry — AK Golf HQ
 * Definerer alle coaching-signaler som systemet kan generere.
 */

export enum SignalType {
  // Treningssignaler
  STREAK_BROKEN = "STREAK_BROKEN",
  STREAK_MILESTONE = "STREAK_MILESTONE",
  LOW_COMPLIANCE = "LOW_COMPLIANCE",
  HIGH_COMPLIANCE = "HIGH_COMPLIANCE",
  PLAN_EXPIRING = "PLAN_EXPIRING",
  NO_PLAN_ACTIVE = "NO_PLAN_ACTIVE",

  // Prestasjonssignaler
  HCP_IMPROVING = "HCP_IMPROVING",
  HCP_DEGRADING = "HCP_DEGRADING",
  HCP_STAGNANT = "HCP_STAGNANT",
  SG_WEAKNESS_DETECTED = "SG_WEAKNESS_DETECTED",
  SG_IMPROVEMENT = "SG_IMPROVEMENT",
  CATEGORY_PROMOTION_READY = "CATEGORY_PROMOTION_READY",

  // Engagement-signaler
  INACTIVE_7_DAYS = "INACTIVE_7_DAYS",
  INACTIVE_14_DAYS = "INACTIVE_14_DAYS",
  INACTIVE_30_DAYS = "INACTIVE_30_DAYS",
  NO_SHOW_REPEATED = "NO_SHOW_REPEATED",
  SESSION_FEEDBACK_PENDING = "SESSION_FEEDBACK_PENDING",

  // Okonomiske signaler
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  CHURN_RISK_HIGH = "CHURN_RISK_HIGH",

  // Coaching-signaler
  VIDEO_SUBMITTED = "VIDEO_SUBMITTED",
  TEST_RESULT_READY = "TEST_RESULT_READY",
  DRILL_BENCHMARK_MET = "DRILL_BENCHMARK_MET",
}

export type SignalSeverity = "info" | "warning" | "urgent" | "critical";

export interface Signal {
  type: SignalType;
  severity: SignalSeverity;
  playerId: string;
  playerName: string;
  title: string;
  description: string;
  /** ISO timestamp */
  detectedAt: string;
  /** Valgfri data knyttet til signalet */
  metadata?: Record<string, unknown>;
  /** Om signalet er lest/behandlet */
  acknowledged: boolean;
}

export interface SignalFilter {
  types?: SignalType[];
  severities?: SignalSeverity[];
  playerId?: string;
  acknowledged?: boolean;
  since?: Date;
}
