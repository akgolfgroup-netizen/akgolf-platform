/**
 * Skill Types — AK Golf HQ
 * Definerer coaching-ferdigheter og treningsomrader.
 * Sprint 0: Kun typer. Logikk i Sprint 1.
 */

export type SkillArea =
  | "DRIVING"
  | "APPROACH"
  | "SHORT_GAME"
  | "PUTTING"
  | "COURSE_MANAGEMENT"
  | "MENTAL"
  | "FITNESS";

export type SkillLevel = "BEGINNER" | "DEVELOPING" | "COMPETENT" | "PROFICIENT" | "EXPERT";

export interface SkillAssessment {
  area: SkillArea;
  level: SkillLevel;
  /** Numerisk score 0-100 */
  score: number;
  /** Trend: positiv = forbedring, negativ = tilbakegang */
  trend: number;
  /** Sist oppdatert */
  updatedAt: string;
  /** Datakilde: "manual" | "trackman" | "round" | "drill" */
  source: string;
}

export interface SkillProfile {
  playerId: string;
  assessments: SkillAssessment[];
  /** Svakeste omrade (prioritert for trening) */
  weakestArea: SkillArea | null;
  /** Sterkeste omrade */
  strongestArea: SkillArea | null;
  /** Sist beregnet */
  computedAt: string;
}

export interface SkillGap {
  area: SkillArea;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  gapSize: number;
  /** Anbefalt treningsvolum (timer/uke) */
  recommendedVolume: number;
}
