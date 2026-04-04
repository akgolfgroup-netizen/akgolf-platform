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
// PREDEFINERTE ØVELSER
// =============================================================================

export const WARMUP_EXERCISES: ExerciseDefinition[] = [
  {
    id: "warmup-chipping",
    name: "Oppvarming - Chipping",
    description: "Lett chipping for å varme opp kontakt og rytme",
    pyramid: "TEK",
    area: "CHIP",
    lPhase: "BALL",
    equipment: ["Wedge", "10-20 baller"],
    minDurationMinutes: 5,
    maxDurationMinutes: 10,
    difficulty: 1,
    isPublic: true,
    tags: ["oppvarming", "nærspill", "kontakt"],
  },
  {
    id: "warmup-putting-short",
    name: "Oppvarming - Korte putts",
    description: "Korte putts for å finne fart og linje",
    pyramid: "TEK",
    area: "PUTT0-3",
    lPhase: "BALL",
    equipment: ["Putter", "3 baller"],
    minDurationMinutes: 5,
    maxDurationMinutes: 10,
    difficulty: 1,
    isPublic: true,
    tags: ["oppvarming", "putting"],
  },
  {
    id: "warmup-half-swings",
    name: "Oppvarming - Halve sving",
    description: "Halve sving med wedge for å finne svingrytme",
    pyramid: "TEK",
    area: "INN50",
    lPhase: "KØLLE",
    equipment: ["Wedge", "10 baller"],
    minDurationMinutes: 5,
    maxDurationMinutes: 10,
    difficulty: 1,
    isPublic: true,
    tags: ["oppvarming", "teknikk", "rytme"],
  },
];

export const DRILL_LIBRARY: ExerciseDefinition[] = [
  // Putting drills
  {
    id: "gate-drill-putting",
    name: "Gate Drill - Putting",
    description: "Sett opp tees som porter for å trene linje",
    instructions: "Plasser to tees som en port litt bredere enn ballen. Putt gjennom porten 10 ganger.",
    pyramid: "TEK",
    area: "PUTT3-6",
    lPhase: "KØLLE",
    equipment: ["Putter", "3 baller", "4 tees"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    isPublic: true,
    tags: ["putting", "linje", "teknikk"],
  },
  {
    id: "clock-drill",
    name: "Klokke-drill",
    description: "Putts fra alle retninger rundt hullet",
    instructions: "Plasser baller i en sirkel rundt hullet. Start på 3 fot, treff alle før du går til 6 fot.",
    pyramid: "SLAG",
    area: "PUTT3-6",
    lPhase: "BALL",
    equipment: ["Putter", "8 baller"],
    minDurationMinutes: 10,
    maxDurationMinutes: 20,
    difficulty: 3,
    isPublic: true,
    tags: ["putting", "break", "press"],
  },
  {
    id: "ladder-drill",
    name: "Stige-drill",
    description: "Progressiv avstandskontroll",
    instructions: "Putt til 10, 20, 30, 40 fot. Mål: Stopp ballen innenfor 3 fot fra hvert mål.",
    pyramid: "SLAG",
    area: "PUTT20-40",
    lPhase: "BALL",
    equipment: ["Putter", "4 baller", "4 tees som markører"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    isPublic: true,
    tags: ["putting", "fartskontroll", "avstander"],
  },

  // Nærspill drills
  {
    id: "up-and-down-challenge",
    name: "Up-and-down Challenge",
    description: "10 forskjellige posisjoner rundt green",
    instructions: "Spill 10 baller fra forskjellige posisjoner. Mål: 6/10 opp og ned.",
    pyramid: "SPILL",
    area: "CHIP",
    lPhase: "AUTO",
    equipment: ["Wedges", "Putter", "10 baller"],
    minDurationMinutes: 15,
    maxDurationMinutes: 25,
    difficulty: 3,
    isPublic: true,
    tags: ["nærspill", "spill", "scoring"],
  },
  {
    id: "distance-control-pitching",
    name: "Avstandskontroll - Pitching",
    description: "Treff spesifikke avstander med pitch",
    instructions: "Sett opp mål på 30, 40, 50 meter. Treff 3 av 5 på hver avstand.",
    pyramid: "SLAG",
    area: "PITCH",
    lPhase: "BALL",
    equipment: ["Wedge", "15 baller", "Avstands-markører"],
    minDurationMinutes: 15,
    maxDurationMinutes: 20,
    difficulty: 3,
    isPublic: true,
    tags: ["nærspill", "avstandskontroll", "pitching"],
  },
  {
    id: "bunker-basics",
    name: "Bunker - Grunnleggende",
    description: "Fokus på å ta sand først",
    instructions: "Tegn en linje i sanden. Treff sanden FØR linjen. 10 slag med fokus på inngang.",
    pyramid: "TEK",
    area: "BUNKER",
    lPhase: "KROPP",
    equipment: ["Sand wedge", "10 baller"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    isPublic: true,
    tags: ["bunker", "teknikk", "sand"],
  },

  // Full swing drills
  {
    id: "alignment-station",
    name: "Alignment Station",
    description: "Sikter-drill med stikker",
    instructions: "Legg ned to stikker for føtter og mållinje. Fokus på square setup.",
    pyramid: "TEK",
    area: "INN150",
    lPhase: "KROPP",
    equipment: ["Jern", "10 baller", "2 alignment sticks"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    isPublic: true,
    tags: ["teknikk", "sikting", "setup"],
  },
  {
    id: "tempo-drill",
    name: "Tempo Drill 3-1",
    description: "Svingtempo med telling",
    instructions: "Tell 1-2-3 på baksving, pause, 1 på nedsving. Fokus på jevn rytme.",
    pyramid: "TEK",
    area: "TEE",
    lPhase: "ARM",
    equipment: ["Driver", "10 baller"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    isPublic: true,
    tags: ["teknikk", "tempo", "rytme", "driver"],
  },
  {
    id: "stock-shot-7iron",
    name: "Stock Shot - 7-jern",
    description: "Bygg konsistent standardslag",
    instructions: "Slå 20 baller med 7-jern. Fokus på samme ballflukt hver gang. Mål: 15/20 i målområdet.",
    pyramid: "SLAG",
    area: "INN150",
    lPhase: "BALL",
    equipment: ["7-jern", "20 baller"],
    minDurationMinutes: 15,
    maxDurationMinutes: 20,
    difficulty: 2,
    isPublic: true,
    tags: ["slag", "konsistens", "jern"],
  },
];

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
    color: "#2D6A4F",
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
