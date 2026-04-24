/**
 * Standard treningsmaler — hardkodede pre-fylte planer som spilleren kan velge
 * fra wizardens "Standard"-valg. Genererer uker + økter klare til å settes inn
 * via createManualPlan(). For v2 kan disse migreres til database-tabell.
 *
 * Skala: 1, 4, 8, eller 12 uker. Mal definerer ukesmønster som repeteres.
 */

// focusArea er fri tekst på TrainingPlanSession — bruker AK-områder direkte.
const FOCUS = {
  PUTTING: "PUTTING",
  CHIPPING: "CHIPPING",
  PITCHING: "PITCHING",
  JERN: "JERN",
  DRIVE: "DRIVE",
  SPILL: "SPILL",
  FYS: "FYS",
} as const;

export type TemplateId =
  | "putting-fokus"
  | "short-game"
  | "allround"
  | "konkurranse-prep"
  | "off-season-styrke";

export interface TemplateSession {
  /** 1=mandag, 7=søndag */
  dayOfWeek: number;
  title: string;
  durationMinutes: number;
  focusArea: string; // f.eks. "PUTTING", "CHIPPING"
  description?: string;
}

export interface StandardTemplate {
  id: TemplateId;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  periodType: "PREPARATION" | "COMPETITION" | "RECOVERY" | "OFF_SEASON";
  /** Ukesmønster som repeteres for hele varigheten */
  weekPattern: TemplateSession[];
  /** Default fokus-tekst per uke (kan inneholde {n} for ukenummer) */
  weeklyFocusTemplate: string;
}

export const STANDARD_TEMPLATES: StandardTemplate[] = [
  {
    id: "putting-fokus",
    title: "Putting-fokus",
    description: "4 økter per uke med tung vekt på putting og lagdeling i kort spill.",
    iconName: "sports_golf",
    badge: "POPULÆR",
    periodType: "PREPARATION",
    weeklyFocusTemplate: "Putting + dosering — uke {n}",
    weekPattern: [
      { dayOfWeek: 1, title: "Putting under 3 m", durationMinutes: 30, focusArea: FOCUS.PUTTING },
      { dayOfWeek: 3, title: "Lag-putting 6–15 m", durationMinutes: 45, focusArea: FOCUS.PUTTING },
      { dayOfWeek: 5, title: "Chip + putt-rute", durationMinutes: 40, focusArea: FOCUS.CHIPPING },
      { dayOfWeek: 6, title: "Spill 9 hull (putts <30)", durationMinutes: 120, focusArea: FOCUS.SPILL },
    ],
  },
  {
    id: "short-game",
    title: "Kort spill",
    description: "Chip, pitch og bunker — 4 økter per uke, hovedsakelig under 50 m.",
    iconName: "golf_course",
    periodType: "PREPARATION",
    weeklyFocusTemplate: "Kort spill — uke {n}",
    weekPattern: [
      { dayOfWeek: 1, title: "Chip 5–25 m", durationMinutes: 45, focusArea: FOCUS.CHIPPING },
      { dayOfWeek: 3, title: "Pitch 25–60 m", durationMinutes: 50, focusArea: FOCUS.PITCHING },
      { dayOfWeek: 5, title: "Bunker + greenside", durationMinutes: 40, focusArea: FOCUS.CHIPPING },
      { dayOfWeek: 6, title: "Spill 9 hull (kort spill-test)", durationMinutes: 120, focusArea: FOCUS.SPILL },
    ],
  },
  {
    id: "allround",
    title: "Allround basis",
    description: "Balansert plan med alle slagtyper. Fin start hvis du er usikker.",
    iconName: "fitness_center",
    badge: "ANBEFALT FOR NYE",
    periodType: "PREPARATION",
    weeklyFocusTemplate: "Allround basis — uke {n}",
    weekPattern: [
      { dayOfWeek: 1, title: "Driving range — fullsving", durationMinutes: 60, focusArea: FOCUS.JERN },
      { dayOfWeek: 3, title: "Kort spill", durationMinutes: 45, focusArea: FOCUS.CHIPPING },
      { dayOfWeek: 4, title: "Putting", durationMinutes: 30, focusArea: FOCUS.PUTTING },
      { dayOfWeek: 5, title: "Styrke + mobilitet", durationMinutes: 50, focusArea: FOCUS.FYS },
      { dayOfWeek: 6, title: "Spill 18 hull", durationMinutes: 240, focusArea: FOCUS.SPILL },
    ],
  },
  {
    id: "konkurranse-prep",
    title: "Konkurranseforberedelse",
    description: "Spillsentrert med pre-shot rutiner og turneringssimulering.",
    iconName: "emoji_events",
    periodType: "COMPETITION",
    weeklyFocusTemplate: "Konkurranseforberedelse — uke {n}",
    weekPattern: [
      { dayOfWeek: 1, title: "Putting + rutine", durationMinutes: 40, focusArea: FOCUS.PUTTING },
      { dayOfWeek: 3, title: "Range med pre-shot", durationMinutes: 60, focusArea: FOCUS.JERN },
      { dayOfWeek: 4, title: "Skill-test 9 hull", durationMinutes: 120, focusArea: FOCUS.SPILL },
      { dayOfWeek: 6, title: "Turneringssimulering 18 hull", durationMinutes: 240, focusArea: FOCUS.SPILL },
    ],
  },
  {
    id: "off-season-styrke",
    title: "Off-season styrke",
    description: "3 styrkeøkter + 2 simulator/innendørs per uke. Bygger fysisk base.",
    iconName: "exercise",
    periodType: "OFF_SEASON",
    weeklyFocusTemplate: "Off-season styrke — uke {n}",
    weekPattern: [
      { dayOfWeek: 1, title: "Styrke A — bein/rotasjon", durationMinutes: 60, focusArea: FOCUS.FYS },
      { dayOfWeek: 2, title: "Simulator — fullsving", durationMinutes: 60, focusArea: FOCUS.JERN },
      { dayOfWeek: 3, title: "Styrke B — over­kropp/core", durationMinutes: 60, focusArea: FOCUS.FYS },
      { dayOfWeek: 5, title: "Styrke C — eksplosivitet", durationMinutes: 50, focusArea: FOCUS.FYS },
      { dayOfWeek: 6, title: "Simulator — short game", durationMinutes: 45, focusArea: FOCUS.CHIPPING },
    ],
  },
];

export const DURATION_OPTIONS = [
  { value: "1", label: "1 uke" },
  { value: "4", label: "4 uker" },
  { value: "8", label: "8 uker" },
  { value: "12", label: "12 uker" },
];

export function getTemplate(id: TemplateId): StandardTemplate | undefined {
  return STANDARD_TEMPLATES.find((t) => t.id === id);
}
