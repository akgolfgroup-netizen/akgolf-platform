/**
 * Volum-beregningsmotor for evidensbasert treningsplanlegging.
 *
 * Beregner:
 * - Ukentlig mål per spillerkategori
 * - Session-reps innenfor trygge grenser (diminishing returns)
 * - Progressjon over tid (økende volum ved mestring)
 */

import {
  VOLUME_LIMITS,
  DIMINISHING_RETURNS,
  SPACING_EFFECT,
  type PlayerCategory,
  type VolumeLimits,
} from "./constants";

export interface WeeklyVolumeTarget {
  category: PlayerCategory;
  minHours: number;
  targetHours: number;
  maxHours: number;
  sessionsPerWeek: number;
  sessionMinutes: number;
  repsPerBlock: number;
  restHoursBetweenSessions: number;
}

export interface VolumeAssessment {
  withinLimits: boolean;
  warning: string | null;
  recommendedReps: number;
  recommendedSessions: number;
}

/**
 * Hent ukentlig mål for en spillerkategori.
 */
export function getWeeklyTarget(category: PlayerCategory): WeeklyVolumeTarget {
  const limits = VOLUME_LIMITS[category];
  return {
    category,
    minHours: limits.minHours,
    targetHours: (limits.minHours + limits.maxHours) / 2,
    maxHours: limits.maxHours,
    sessionsPerWeek: limits.sessionsPerWeek,
    sessionMinutes: limits.sessionMinutes,
    repsPerBlock: limits.repsPerBlock,
    restHoursBetweenSessions: SPACING_EFFECT.optimalIntervalHours,
  };
}

/**
 * Vurder om en planlagt økt er innenfor trygge volum-grenser.
 */
export function assessSessionVolume(
  category: PlayerCategory,
  plannedReps: number,
  plannedMinutes: number
): VolumeAssessment {
  const limits = VOLUME_LIMITS[category];
  const warnings: string[] = [];

  if (plannedReps > DIMINISHING_RETURNS.repsPerSessionWarning) {
    warnings.push(
      `Over ${DIMINISHING_RETURNS.repsPerSessionWarning} reps — øktnytten avtar`
    );
  }

  if (plannedMinutes > limits.sessionMinutes * 1.5) {
    warnings.push("Økten er lang — vurder å dele i to");
  }

  if (plannedReps > DIMINISHING_RETURNS.repsPerSessionWarning * 1.5) {
    return {
      withinLimits: false,
      warning: "For mange reps — risiko for overtrening og dårlig teknikk",
      recommendedReps: limits.repsPerBlock,
      recommendedSessions: Math.ceil(plannedReps / limits.repsPerBlock),
    };
  }

  return {
    withinLimits: warnings.length === 0,
    warning: warnings.join("; ") || null,
    recommendedReps: Math.min(plannedReps, limits.repsPerBlock),
    recommendedSessions: 1,
  };
}

/**
 * Beregn progressivt volum basert på hvor lenge spilleren har trent.
 * Etter 4 uker med god gjennomføring: +10% volum.
 */
export function calculateProgressiveVolume(
  category: PlayerCategory,
  weeksCompleted: number,
  adherenceRate: number // 0.0–1.0
): WeeklyVolumeTarget {
  const base = getWeeklyTarget(category);

  if (weeksCompleted >= 4 && adherenceRate >= 0.8) {
    const multiplier = 1 + Math.min((weeksCompleted - 4) * 0.02, 0.15);
    return {
      ...base,
      targetHours: Math.round(base.targetHours * multiplier * 10) / 10,
      repsPerBlock: Math.round(base.repsPerBlock * multiplier),
    };
  }

  return base;
}

/**
 * Sjekk om økter er tilstrekkelig fordelt i uken (spacing effect).
 */
export function assessSpacing(
  sessionDates: Date[]
): { ok: boolean; gaps: number[]; warning: string | null } {
  if (sessionDates.length < 2) return { ok: true, gaps: [], warning: null };

  const sorted = [...sessionDates].sort((a, b) => a.getTime() - b.getTime());
  const gaps: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const hours =
      (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60);
    gaps.push(Math.round(hours));
  }

  const tooShort = gaps.filter((g) => g < SPACING_EFFECT.optimalIntervalHours);
  const tooLong = gaps.filter((g) => g > SPACING_EFFECT.warningIntervalHours);

  const warnings: string[] = [];
  if (tooShort.length > 0) {
    warnings.push(
      `${tooShort.length} økt(er) for tett — minst ${SPACING_EFFECT.optimalIntervalHours}t mellom økter`
    );
  }
  if (tooLong.length > 0) {
    warnings.push(
      `${tooLong.length} hull for langt — max ${SPACING_EFFECT.warningIntervalHours}t for optimal læring`
    );
  }

  return {
    ok: tooShort.length === 0 && tooLong.length === 0,
    gaps,
    warning: warnings.join("; ") || null,
  };
}
