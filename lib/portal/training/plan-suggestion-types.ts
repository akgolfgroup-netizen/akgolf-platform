/**
 * Felles typer for PlanSuggestion (Sprint 2 — forslags-modus).
 *
 * Trygg for client-side import (ingen server-avhengigheter).
 */

export type SuggestionStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type SuggestionTargetType = "session" | "week" | "plan" | "distribution";

/**
 * Felter som kan endres på en TrainingPlanSession via et forslag.
 */
export interface SessionEditDiff {
  title?: string;
  description?: string;
  durationMinutes?: number;
  focusArea?: string;
  facilityId?: string | null;
  dayOfWeek?: number;
}

/**
 * Felter som kan endres på TrainingPlan via et forslag.
 */
export interface PlanEditDiff {
  title?: string;
  description?: string;
  goals?: string;
  pyramidDistribution?: {
    FYS: number;
    TEK: number;
    SLAG: number;
    SPILL: number;
    TURN: number;
  };
}

/**
 * Diff-payload lagret i PlanSuggestion.diffJson.
 * `before` reflekterer verdier på forslagets opprettelsestidspunkt
 * (snapshot — sjekkes mot nåtiden ved aksept for å oppdage konflikter).
 */
export interface SuggestionDiff<TBefore, TAfter = TBefore> {
  before: TBefore;
  after: TAfter;
}

export interface SessionSuggestionPayload {
  before: SessionEditDiff;
  after: SessionEditDiff;
}

export interface PlanSuggestionPayload {
  before: PlanEditDiff;
  after: PlanEditDiff;
}

/**
 * Forslag som vises i UI — inkluderer hvem som foreslo og når.
 */
export interface PlanSuggestionView {
  id: string;
  planId: string;
  targetType: SuggestionTargetType;
  targetId: string | null;
  status: SuggestionStatus;
  rationale: string | null;
  createdAt: string;
  resolvedAt: string | null;
  rejectionReason: string | null;
  proposedBy: {
    id: string;
    name: string | null;
  };
  /** Subject / title på targeted entity (økt-tittel, uke-nummer, etc.). */
  targetLabel: string;
  diff: SessionSuggestionPayload | PlanSuggestionPayload;
}
