/**
 * Exercise/Drill typer for AK Golf treningsplan
 *
 * En øvelse har:
 * - Grunnleggende info (navn, beskrivelse, kategori)
 * - AK-formelen kategorisering
 * - Utførelses-parametere (reps, sets, tempo, hvile, mål)
 */

import {
  TRAINING_AREAS,
  type PyramidLevel,
  type TrainingArea,
  type LPhase,
  type MEnvironment,
  type PRLevel,
  type PPosition,
  type LifeDimension,
} from "./ak-formula";

// Re-export for convenience
export { TRAINING_AREAS };

// =============================================================================
// EXERCISE INTERFACE
// =============================================================================

export interface ExerciseDefinition {
  id: string;
  name: string;
  description: string;
  instructions?: string;
  videoUrl?: string;
  imageUrl?: string;

  // AK-formelen kategorisering
  pyramid: PyramidLevel;
  area: TrainingArea;
  lPhase?: LPhase;
  pPositionStart?: PPosition;
  pPositionEnd?: PPosition;

  // Utstyr og krav
  equipment: string[];
  minDurationMinutes: number;
  maxDurationMinutes: number;

  // Metadata
  difficulty: 1 | 2 | 3 | 4 | 5;
  isPublic: boolean;
  createdById?: string;
  tags: string[];
}

// =============================================================================
// EXERCISE INSTANCE (brukt i en økt)
// =============================================================================

export interface ExerciseInstance {
  id: string;
  exerciseId?: string; // Referanse til ExerciseDefinition hvis fra bank
  name: string;
  description?: string;

  // AK-formelen for denne spesifikke utførelsen
  pyramid: PyramidLevel;
  area: TrainingArea;
  lPhase: LPhase;
  clubSpeed: number; // CS 0-100
  environment: MEnvironment; // M 0-5
  pressLevel: PRLevel; // PR 1-5
  pPositionStart?: PPosition;
  pPositionEnd?: PPosition;
  lifeDimension?: LifeDimension;

  // Utførelses-parametere
  sets?: number;
  reps?: number;
  distance?: number; // meter
  distanceUnit?: "m" | "ft";
  tempo?: string; // f.eks. "3-1-2" (baksving-pause-nedsving)
  restSeconds?: number;

  // Mål og kriterier
  successCriteria?: string;
  targetScore?: number; // f.eks. "Treff 8/10"
  targetPercentage?: number;

  // Notater
  coachNotes?: string;
  playerNotes?: string;

  // Status (for logging)
  completed?: boolean;
  actualReps?: number;
  actualScore?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
}

// =============================================================================
// SESSION TYPER
// =============================================================================

export interface TrainingSessionData {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  intensity: "low" | "medium" | "high";

  // Målsetning
  objective: string;
  focusPoints: string[];

  // AK-formelen kategorisering for økten
  primaryPyramid: PyramidLevel;
  primaryArea: TrainingArea;
  secondaryAreas?: TrainingArea[];

  // Hjelpemidler
  equipment: string[];
  location?: string;

  // Øvelser
  warmup?: ExerciseInstance[];
  mainBlock: ExerciseInstance[];
  cooldown?: ExerciseInstance[];

  // Metadata
  sessionId?: string; // AK-formel ID
}

// =============================================================================
// EXERCISE BANK
// =============================================================================

export interface ExerciseBankEntry {
  id: string;
  exercise: ExerciseDefinition;
  addedAt: Date;
  usageCount: number;
  lastUsedAt?: Date;
  isFavorite: boolean;
  personalNotes?: string;
}

// =============================================================================
// PREDEFINERTE ØVELSER (ARKIVERT)
// =============================================================================
// Tidligere WARMUP_EXERCISES og DRILL_LIBRARY er flyttet til databasen
// som ExerciseDefinition (isSystemDrill=true).
// Se scripts/seed-exercise-definitions.ts for seed-data.
// Arkiverte filer ligger i _archived/.

// =============================================================================
// EQUIPMENT PRESETS
// =============================================================================

export const EQUIPMENT_PRESETS = {
  PUTTING: ["Putter", "3-5 baller", "Tees for markering"],
  SHORT_GAME: ["Wedges (PW, 52, 56, 60)", "Putter", "10-20 baller"],
  FULL_SWING: ["Full bag", "20-40 baller", "Alignment sticks"],
  INDOOR: ["Putter", "Putting mat", "Mirror"],
  TRACKMAN: ["Full bag", "Trackman/simulator", "Uendelig med baller"],
} as const;

// =============================================================================
// INTENSITY LEVELS
// =============================================================================

export const INTENSITY_LEVELS = {
  low: {
    name: "Lav",
    description: "Rolig tempo, fokus på teknikk",
    color: "#005840",
  },
  medium: {
    name: "Middels",
    description: "Moderat tempo, mix av teknikk og resultat",
    color: "#F59E0B",
  },
  high: {
    name: "Høy",
    description: "Høyt tempo, fokus på prestasjon",
    color: "#EF4444",
  },
} as const;

export type IntensityLevel = keyof typeof INTENSITY_LEVELS;
