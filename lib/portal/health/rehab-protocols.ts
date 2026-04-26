/**
 * Skade-historikk + rehab-protokoller.
 *
 * NB: HealthFlag-modellen i Prisma må migreres separat (Sprint 4.2).
 * Denne filen definerer protokollene som skal kjøres når en skade
 * registreres.
 *
 * Skadetype → fase-overgang → tidsestimater for retur.
 */

export type InjurySeverity = "MILD" | "MODERATE" | "SEVERE";
export type InjuryType =
  | "BACK"
  | "WRIST"
  | "ELBOW"
  | "SHOULDER"
  | "KNEE"
  | "OTHER";

export interface RehabPhase {
  name: string;
  durationDays: number;
  activities: string[];
  golfReturnLevel: "REST" | "LIGHT" | "MODERATE" | "FULL";
}

export interface RehabProtocol {
  injuryType: InjuryType;
  severity: InjurySeverity;
  totalDurationDays: number;
  phases: RehabPhase[];
  redFlagsForCoach: string[];
}

const PROTOCOLS: Record<string, RehabProtocol> = {
  "BACK_MILD": {
    injuryType: "BACK",
    severity: "MILD",
    totalDurationDays: 14,
    phases: [
      {
        name: "Akutt-fase",
        durationDays: 3,
        activities: ["Hvile", "Lett gange", "Is/varme veksling"],
        golfReturnLevel: "REST",
      },
      {
        name: "Mobilisering",
        durationDays: 5,
        activities: ["Mobilitetsøvelser daglig", "Gradvis aktivitet"],
        golfReturnLevel: "LIGHT",
      },
      {
        name: "Tilbakeføring",
        durationDays: 6,
        activities: ["Putting + chipping", "Lette jern fra matte"],
        golfReturnLevel: "MODERATE",
      },
    ],
    redFlagsForCoach: [
      "Smerte under ryggvridning ved sving",
      "Stivhet om morgenen som vedvarer > 30 min",
      "Utstråling til ben",
    ],
  },
  "WRIST_MILD": {
    injuryType: "WRIST",
    severity: "MILD",
    totalDurationDays: 10,
    phases: [
      {
        name: "Avlastning",
        durationDays: 3,
        activities: ["Hvile", "Tape/støttebandasje"],
        golfReturnLevel: "REST",
      },
      {
        name: "Lett aktivitet",
        durationDays: 4,
        activities: ["Putting kun", "Mobilitet håndledd"],
        golfReturnLevel: "LIGHT",
      },
      {
        name: "Tilbake",
        durationDays: 3,
        activities: ["Halvsving", "Korte jern"],
        golfReturnLevel: "MODERATE",
      },
    ],
    redFlagsForCoach: [
      "Smerte ved impact",
      "Hevelse vedvarer > 48t",
      "Nummenhet i fingre",
    ],
  },
};

/**
 * Hent rehab-protokoll for en skadetype + alvorlighetsgrad.
 */
export function getRehabProtocol(
  injuryType: InjuryType,
  severity: InjurySeverity,
): RehabProtocol | null {
  const key = `${injuryType}_${severity}`;
  const proto = PROTOCOLS[key];
  if (proto) return proto;

  // Fallback: bruk MILD-versjon hvis MODERATE/SEVERE ikke definert
  if (severity !== "MILD") {
    const fallback = PROTOCOLS[`${injuryType}_MILD`];
    if (fallback) {
      return {
        ...fallback,
        severity,
        totalDurationDays: severity === "MODERATE"
          ? fallback.totalDurationDays * 2
          : fallback.totalDurationDays * 4,
      };
    }
  }

  return null;
}

/**
 * Beregn estimert retur-til-spill dato.
 */
export function estimateReturnToPlay(
  injuryType: InjuryType,
  severity: InjurySeverity,
  injuredAt: Date,
): Date | null {
  const proto = getRehabProtocol(injuryType, severity);
  if (!proto) return null;
  const returnDate = new Date(injuredAt);
  returnDate.setDate(returnDate.getDate() + proto.totalDurationDays);
  return returnDate;
}
