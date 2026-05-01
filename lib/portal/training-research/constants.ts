/**
 * Evidensbaserte treningsvolum-parametere
 * Basert på forskning om deliberate practice, myelin-dannelse og motorisk læring.
 *
 * Kilder:
 * - BreakXGolf tracking data (raskt avtagende nytte >2.5 økter/uke)
 * - Myelin-degenerasjonsstudier: 30 dager = kritisk terskel
 * - Spacing effect: 48-72t optimal intervall
 * - Diminishing returns: >60 reps/økt = overtrening
 */

// ─── Spillerkategorier ───────────────────────────────────────────────

export const PLAYER_CATEGORIES = [
  "BEGINNER",
  "CLUB",
  "SEMI_ELITE",
  "ELITE_JUNIOR",
  "PRO",
] as const;

export type PlayerCategory = (typeof PLAYER_CATEGORIES)[number];

// ─── Volumgrenser per kategori ──────────────────────────────────────

export interface VolumeLimits {
  minHours: number;
  maxHours: number;
  sessionsPerWeek: number;
  sessionMinutes: number;
  focusLimitMinutes: number;
  repsPerBlock: number;
}

export const VOLUME_LIMITS: Record<PlayerCategory, VolumeLimits> = {
  BEGINNER: {
    minHours: 2,
    maxHours: 4,
    sessionsPerWeek: 2,
    sessionMinutes: 45,
    focusLimitMinutes: 45,
    repsPerBlock: 20,
  },
  CLUB: {
    minHours: 3,
    maxHours: 6,
    sessionsPerWeek: 3,
    sessionMinutes: 75,
    focusLimitMinutes: 60,
    repsPerBlock: 20,
  },
  SEMI_ELITE: {
    minHours: 8,
    maxHours: 12,
    sessionsPerWeek: 4,
    sessionMinutes: 120,
    focusLimitMinutes: 60,
    repsPerBlock: 25,
  },
  ELITE_JUNIOR: {
    minHours: 10,
    maxHours: 15,
    sessionsPerWeek: 5,
    sessionMinutes: 120,
    focusLimitMinutes: 90,
    repsPerBlock: 30,
  },
  PRO: {
    minHours: 35,
    maxHours: 45,
    sessionsPerWeek: 6,
    sessionMinutes: 300,
    focusLimitMinutes: 120,
    repsPerBlock: 30,
  },
};

// ─── Deliberate practice-ratio ──────────────────────────────────────

export interface PracticeRatio {
  practice: number; // 0-1, drill/teknikk
  play: number;     // 0-1, baneplay/konkurranse
}

export const DELIBERATE_PRACTICE_RATIO: Record<PlayerCategory, PracticeRatio> = {
  BEGINNER:     { practice: 0.30, play: 0.70 },
  CLUB:         { practice: 0.50, play: 0.50 },
  SEMI_ELITE:   { practice: 0.65, play: 0.35 },
  ELITE_JUNIOR: { practice: 0.75, play: 0.25 },
  PRO:          { practice: 0.85, play: 0.15 },
};

// ─── Spacing effect ─────────────────────────────────────────────────

export const SPACING_EFFECT = {
  optimalIntervalHours: 48,   // 48-72 timer mellom økter = grønt
  warningIntervalHours: 168,  // 7 dager = gul advarsel
  dangerIntervalHours: 504,   // 21 dager = rød advarsel
  myelinDecayDays: 30,        // 30 dager = kritisk myelin-forfall
} as const;

// ─── Diminishing returns ────────────────────────────────────────────

export const DIMINISHING_RETURNS = {
  repsPerSessionWarning: 60,   // >60 reps i én økt = advarsel
  hoursPerDayWarning: 1.0,     // >1 time på samme fase = fokusgrense
  sessionsPerWeekOptimal: 2.5, // BreakXGolf-data: avtagende nytte over 2.5
} as const;

// ─── Data Quality-nivåer ────────────────────────────────────────────

export const DATA_QUALITY_LEVELS = [
  "TRACKMAN_VERIFIED",
  "GPS_CALCULATED",
  "HYBRID_ESTIMATED",
  "SELF_REPORTED",
] as const;

export type DataQualityLevel = (typeof DATA_QUALITY_LEVELS)[number];

/** Høyere tall = bedre kvalitet */
export const DATA_QUALITY_SCORE: Record<DataQualityLevel, number> = {
  TRACKMAN_VERIFIED: 4,
  GPS_CALCULATED: 3,
  HYBRID_ESTIMATED: 2,
  SELF_REPORTED: 1,
};

// ─── Hjelpefunksjoner ───────────────────────────────────────────────

export function getPlayerCategory(handicap?: number | null): PlayerCategory {
  if (handicap === null || handicap === undefined) return "BEGINNER";
  if (handicap > 36) return "BEGINNER";
  if (handicap > 18) return "CLUB";
  if (handicap > 8) return "SEMI_ELITE";
  if (handicap > 3) return "ELITE_JUNIOR";
  return "PRO";
}

export function getCategoryLabel(cat: PlayerCategory): string {
  const labels: Record<PlayerCategory, string> = {
    BEGINNER: "Nybegynner",
    CLUB: "Klubbspiller",
    SEMI_ELITE: "Semi-elite",
    ELITE_JUNIOR: "Elite junior",
    PRO: "Proff",
  };
  return labels[cat];
}

export function getVolumeStatus(
  category: PlayerCategory,
  hoursThisWeek: number
): "under" | "optimal" | "over" {
  const limits = VOLUME_LIMITS[category];
  if (hoursThisWeek < limits.minHours) return "under";
  if (hoursThisWeek > limits.maxHours) return "over";
  return "optimal";
}

export function getSpacingStatus(
  hoursSinceLastSession: number
): "optimal" | "warning" | "danger" | "critical" {
  const { optimalIntervalHours, warningIntervalHours, dangerIntervalHours, myelinDecayDays } =
    SPACING_EFFECT;

  if (hoursSinceLastSession <= optimalIntervalHours + 24) return "optimal"; // 48-72t
  if (hoursSinceLastSession <= warningIntervalHours) return "warning";      // <7 dager
  if (hoursSinceLastSession <= dangerIntervalHours) return "danger";        // <21 dager
  if (hoursSinceLastSession <= myelinDecayDays * 24) return "critical";     // <30 dager
  return "critical";
}

export function getRepsStatus(
  category: PlayerCategory,
  repsInSession: number
): "optimal" | "warning" | "danger" {
  const limit = VOLUME_LIMITS[category].repsPerBlock;
  if (repsInSession <= limit) return "optimal";
  if (repsInSession <= DIMINISHING_RETURNS.repsPerSessionWarning) return "warning";
  return "danger";
}

export function getFocusTimeStatus(
  category: PlayerCategory,
  minutesOnPhase: number
): "optimal" | "warning" | "danger" {
  const limit = VOLUME_LIMITS[category].focusLimitMinutes;
  if (minutesOnPhase <= limit) return "optimal";
  if (minutesOnPhase <= limit * 1.5) return "warning";
  return "danger";
}
