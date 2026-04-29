/**
 * Session Exercise Types — Per-instance data for øvelser i treningsplan og dagbok.
 *
 * Lagres som JSON-array i:
 * - TrainingPlanSession.exercises (planlagte økter)
 * - TrainingLog.exercises (gjennomførte økter)
 *
 * Bygger på AK Golf Masterdokument v2.0 + brukerens feltkrav
 * (tid, reps m/ball, reps u/ball, fokus, kommentar, vurdering).
 *
 * Trygg for client-side import.
 */

import type {
  PyramideCode,
  TreningsomraadeCode,
  LFaseCode,
} from "./ak-taxonomy";

/**
 * Øvelse slik den planlegges eller gjennomføres innenfor en økt.
 *
 * `exerciseDefinitionId` er null for egendefinerte øvelser opprettet inline.
 * AK-formel-felter kopieres fra ExerciseDefinition ved seleksjon, eller
 * settes manuelt for egendefinerte.
 */
export interface SessionExercise {
  /** Stabil ID for drag-drop reordering og oppdatering. Genereres med nanoid. */
  id: string;

  /** Peker til ExerciseDefinition. Null = egendefinert / ad-hoc. */
  exerciseDefinitionId?: string | null;

  /** Navn — kopiert fra definition eller fritt valgt. */
  name: string;

  // ── AK-tagging (seksjon 3, 10.1, 10.2, 10.3, 10.4, 10.5, 4.1) ──

  pyramid?: PyramideCode;
  area?: TreningsomraadeCode;
  lPhase?: LFaseCode;

  /** CS-nivå ("CS50"–"CS100", min 50 % av maks). Optional for L-KROPP/L-ARM. */
  cs?: string;

  /** Miljø ("M0"–"M5") */
  milieu?: string;

  /** Press ("PR1"–"PR5") */
  press?: string;

  /** P-posisjon eller range ("P5.0-P7.0"). Valgfritt. */
  pPosition?: string;

  /** LIFE-kode ("LIFE-SELV" etc.). Valgfritt. */
  lifeCode?: string;

  // ── Per-instance data (brukerens krav) ──

  /** Tid avsatt eller brukt (minutter). */
  durationMinutes: number;

  /** Antall repetisjoner med ball (slag). */
  repsWithBall?: number;

  /** Antall repetisjoner uten ball (tørre svinger, øvelser). */
  repsWithoutBall?: number;

  /** Fokus-stikkord under økten (f.eks. "Sequence", "Impact", "Tempo"). */
  focus?: string;

  /** Fri kommentar (forberedelser, plan, coach-note). */
  notes?: string;

  // ── Etter-økten data (fylles ved logging i dagboken) ──

  /** Subjektiv vurdering 1–5 (1 = dårlig, 5 = perfekt). */
  rating?: number;

  /** ISO-dato for gjennomføring. Settes når TrainingLog opprettes. */
  completedAt?: string;

  /** Coach-tilbakemelding (valgfri, kan legges til etter økten). */
  coachFeedback?: string;

  // ── Test-kobling (Team Norway / AK Golf testbatteri) ──

  /** Referanse til TestDefinition.testNumber hvis øvelsen er en test. */
  testNumber?: number;

  /** Målverdi for testen (f.eks. target PEI, target proximity). */
  testTarget?: number;
}

/**
 * Plan-spesifikk utvidelse for øvelser i planlagte økter.
 * (Kun relevant der vi ønsker å skille mellom planlagt og gjennomført.)
 */
export interface PlannedExercise extends SessionExercise {
  /** Planlagt starttid i økten (minutter fra økt-start). */
  offsetMinutes?: number;

  /** Valgfritt sortering innen økten. */
  sortOrder?: number;
}

/**
 * Dagbok-spesifikk utvidelse for gjennomførte øvelser.
 * Tid, reps og vurdering er "actual", ikke "planned".
 */
export interface CompletedExercise extends SessionExercise {
  /** Planlagt tid (fra originalplanen) hvis øvelsen ble modifisert. */
  plannedDurationMinutes?: number;

  /** Brukeren hoppet over denne øvelsen. */
  skipped?: boolean;

  /** Begrunnelse for avvik fra plan. */
  deviationReason?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Validerer at en SessionExercise har minimum påkrevde felt.
 * Kaster ikke — returnerer liste med feilmeldinger.
 */
export function validateSessionExercise(e: Partial<SessionExercise>): string[] {
  const errors: string[] = [];
  if (!e.name || e.name.trim().length === 0) {
    errors.push("Øvelsen må ha et navn");
  }
  if (e.durationMinutes == null || e.durationMinutes <= 0) {
    errors.push("Varighet må være > 0 minutter");
  }
  if (e.rating != null && (e.rating < 1 || e.rating > 5)) {
    errors.push("Vurdering må være mellom 1 og 5");
  }
  return errors;
}

/**
 * Trygg parse fra ukjent JSON til SessionExercise[].
 * Filtrerer bort ugyldige oppføringer istedenfor å kaste.
 */
export function parseSessionExercises(json: unknown): SessionExercise[] {
  if (!Array.isArray(json)) return [];
  return json
    .filter((item): item is SessionExercise => {
      if (typeof item !== "object" || item === null) return false;
      const maybe = item as Partial<SessionExercise>;
      return (
        typeof maybe.id === "string" &&
        typeof maybe.name === "string" &&
        typeof maybe.durationMinutes === "number"
      );
    })
    .map((item) => ({
      ...item,
      durationMinutes: Math.max(0, item.durationMinutes),
    }));
}

/**
 * Summer total varighet for en liste med øvelser.
 */
export function sumExerciseDurations(exercises: SessionExercise[]): number {
  return exercises.reduce((sum, e) => sum + (e.durationMinutes ?? 0), 0);
}
