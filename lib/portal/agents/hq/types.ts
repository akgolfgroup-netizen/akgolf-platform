/**
 * HQ Agent Types — AK Golf HQ
 * AI-agenter som genererer handlingsforslag (PlanActions).
 * Sprint 0: Kun typer. Logikk i Sprint 1.
 *
 * NB: Eksisterende agents/ inneholder event-baserte agenter
 * (transcription, booking, USI, degradation). Denne filen er
 * for det nye HQ-systemet med PlanAction-workflow.
 */

export type AgentId =
  | "plan-generator"
  | "periodization"
  | "drill-recommender"
  | "compliance-monitor"
  | "churn-predictor"
  | "session-preparer"
  | "video-analyzer"
  | "round-analyzer";

export type ActionUrgency = "low" | "medium" | "high" | "critical";

export type ActionStatus = "pending" | "approved" | "rejected" | "executed" | "expired";

export interface PlanAction {
  id: string;
  agentId: AgentId;
  playerId: string;
  title: string;
  description: string;
  proposedChange: Record<string, unknown>;
  urgency: ActionUrgency;
  status: ActionStatus;
  rationale: string;
  confidence: number;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  rejectionReason?: string;
}

export interface AgentResult {
  agentId: AgentId;
  playerId: string;
  actions: PlanAction[];
  durationMs: number;
  error?: string;
}

export interface AgentConfig {
  agentId: AgentId;
  enabled: boolean;
  minConfidence: number;
  maxActionsPerRun: number;
}
