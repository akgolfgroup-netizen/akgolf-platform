/**
 * Lokale typer for Individuell Teknisk Plan.
 * Erstatter @prisma/client-typer — brukes i hele featuren.
 */

export const TRAINING_AREA_VALUES = [
  "TEE_OFF_THE_TEE",
  "APPROACH_200_PLUS",
  "APPROACH_150_200",
  "APPROACH_100_150",
  "APPROACH_50_100",
  "CHIP_PITCH_10_50",
  "BUNKER",
  "PUTTING",
  "COURSE_MANAGEMENT",
  "MENTAL_GAME",
  "PHYSICAL",
] as const;

export type TrainingArea = (typeof TRAINING_AREA_VALUES)[number];

export const PHASE_STATUS_VALUES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "SKIPPED",
] as const;

export type PhaseStatus = (typeof PHASE_STATUS_VALUES)[number];

export const TECHNICAL_PLAN_STATUS_VALUES = [
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
] as const;

export type TechnicalPlanStatus = (typeof TECHNICAL_PLAN_STATUS_VALUES)[number];

// Labels for visning
export const TRAINING_AREA_LABELS: Record<TrainingArea, string> = {
  TEE_OFF_THE_TEE: "Utslag",
  APPROACH_200_PLUS: "Approach 200+",
  APPROACH_150_200: "Approach 150–200",
  APPROACH_100_150: "Approach 100–150",
  APPROACH_50_100: "Approach 50–100",
  CHIP_PITCH_10_50: "Chip/Pitch 10–50",
  BUNKER: "Bunker",
  PUTTING: "Putting",
  COURSE_MANAGEMENT: "Bane-management",
  MENTAL_GAME: "Mentalt spill",
  PHYSICAL: "Fysisk",
};

export const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  NOT_STARTED: "Ikke startet",
  IN_PROGRESS: "Pågår",
  COMPLETED: "Fullført",
  SKIPPED: "Hoppet over",
};

export const TECHNICAL_PLAN_STATUS_LABELS: Record<TechnicalPlanStatus, string> = {
  ACTIVE: "Aktiv",
  COMPLETED: "Fullført",
  ARCHIVED: "Arkivert",
};

export const ENVIRONMENT_LABELS: Record<string, string> = {
  M1: "M1 — Range/øvingsfelt",
  M2: "M2 — Simulator",
  M3: "M3 — Bane (trening)",
  M4: "M4 — Bane (konkurranse)",
};
