/**
 * Myelin-forfalls-tracker
 *
 * Basert på forskning om myelin-degenerasjon:
 * - 30 dager uten trening på en fase = kritisk terskel
 * - Rask degradering etter 14 dager
 * - Full gjenoppbygging krever 2-3x originalt volum
 *
 * Brukes til å varsle coach og spiller om hvilke faser som trenger vedlikehold.
 */

import { SPACING_EFFECT } from "./constants";

export type MyelinPhaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

export interface MyelinStatus {
  phaseId: string;
  phaseTitle: string;
  daysSinceLastSession: number;
  status: "healthy" | "warning" | "critical" | "decayed";
  progressRetention: number; // 0.0–1.0
  recommendedAction: string;
}

const RETENTION_RATES: Record<string, number> = {
  healthy: 1.0,
  warning: 0.85,
  critical: 0.6,
  decayed: 0.35,
};

/** Dager før hvert nivå */
const DECAY_THRESHOLDS = {
  warning: 7,
  critical: 14,
  decayed: SPACING_EFFECT.myelinDecayDays, // 30
};

/**
 * Beregn myelin-status for en fase basert på dager siden siste økt.
 */
export function calculateMyelinStatus(
  phaseId: string,
  phaseTitle: string,
  lastSessionAt: Date | string | null,
  phaseStatus: MyelinPhaseStatus
): MyelinStatus {
  if (!lastSessionAt || phaseStatus === "NOT_STARTED") {
    return {
      phaseId,
      phaseTitle,
      daysSinceLastSession: Infinity,
      status: "decayed",
      progressRetention: 0,
      recommendedAction: "Start fasen med grunnleggende øvelser",
    };
  }

  const last = typeof lastSessionAt === "string" ? new Date(lastSessionAt) : lastSessionAt;
  const days = Math.floor(
    (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days < DECAY_THRESHOLDS.warning) {
    return {
      phaseId,
      phaseTitle,
      daysSinceLastSession: days,
      status: "healthy",
      progressRetention: RETENTION_RATES.healthy,
      recommendedAction: "Fortsett som planlagt",
    };
  }

  if (days < DECAY_THRESHOLDS.critical) {
    return {
      phaseId,
      phaseTitle,
      daysSinceLastSession: days,
      status: "warning",
      progressRetention: RETENTION_RATES.warning,
      recommendedAction: `Siste økt for ${days} dager siden — planlegg ny økt innen få dager`,
    };
  }

  if (days < DECAY_THRESHOLDS.decayed) {
    return {
      phaseId,
      phaseTitle,
      daysSinceLastSession: days,
      status: "critical",
      progressRetention: RETENTION_RATES.critical,
      recommendedAction: `Kritisk: ${days} dager uten trening. Dobbel opp på reps neste økt`,
    };
  }

  return {
    phaseId,
    phaseTitle,
    daysSinceLastSession: days,
    status: "decayed",
    progressRetention: RETENTION_RATES.decayed,
    recommendedAction: `Myelin-forfall. Gjenoppta med 2-3x volum før tilbake til normal plan`,
  };
}

/**
 * Sjekk alle faser i en plan og returner de som trenger oppmerksomhet.
 */
export function checkPlanMyelinStatus(
  phases: Array<{
    id: string;
    title: string;
    lastSessionAt: string | null;
    status: MyelinPhaseStatus;
  }>
): MyelinStatus[] {
  return phases
    .map((p) =>
      calculateMyelinStatus(p.id, p.title, p.lastSessionAt, p.status)
    )
    .filter((s) => s.status !== "healthy")
    .sort((a, b) => b.daysSinceLastSession - a.daysSinceLastSession);
}

/**
 * Formater dager siden siste økt til lesbar streng.
 */
export function formatDaysSince(days: number): string {
  if (days === Infinity) return "Aldri";
  if (days === 0) return "I dag";
  if (days === 1) return "1 dag";
  if (days < 7) return `${days} dager`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} uke${weeks > 1 ? "r" : ""}`;
  const months = Math.floor(days / 30);
  return `${months} måned${months > 1 ? "er" : ""}`;
}
