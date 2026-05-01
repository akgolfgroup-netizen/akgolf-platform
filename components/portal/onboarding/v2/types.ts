import type { ViewId } from "@/lib/portal/views/registry";

export interface OnboardingV2Data {
  goals: string[];
  trainingFrequency: string;
  defaultView: ViewId;
  handicap?: number;
  age?: number;
  weeklyHours?: number;
  homeCourseName?: string;
  coldStartWeakness?: string;
}

export interface StepDef {
  id: number;
  title: string;
  subtitle: string;
  eyebrow: string;
}

export const ONBOARDING_STEPS: StepDef[] = [
  { id: 1, title: "Profil", subtitle: "Din bakgrunn", eyebrow: "Steg 1 av 7 · Profil" },
  { id: 2, title: "Mål", subtitle: "Hva vil du oppnå", eyebrow: "Steg 2 av 7 · Mål" },
  { id: 3, title: "Tid per uke", subtitle: "Volum + dager", eyebrow: "Steg 3 av 7 · Tid" },
  { id: 4, title: "Hjemmebane", subtitle: "Hvor spiller du", eyebrow: "Steg 4 av 7 · Bane" },
  { id: 5, title: "Standardvisning", subtitle: "Velg layout", eyebrow: "Steg 5 av 7 · Visning" },
  { id: 6, title: "Hva sliter du med", subtitle: "En rask analyse", eyebrow: "Steg 6 av 7 · Start" },
  { id: 7, title: "Klar", subtitle: "Sett i gang", eyebrow: "Steg 7 av 7 · Ferdig" },
];

export const GOAL_CHIPS = [
  { id: "putting", label: "Putting", icon: "circle-dot" as const },
  { id: "iron", label: "Iron 100–150m", icon: "target" as const },
  { id: "distance", label: "Driver / lengde", icon: "zap" as const },
  { id: "short_game", label: "Short game", icon: "flag-triangle-right" as const },
  { id: "mental", label: "Mental / pre-shot", icon: "brain" as const },
  { id: "score", label: "Score / SG", icon: "trending-up" as const },
  { id: "fysisk", label: "Fysisk / mobilitet", icon: "dumbbell" as const },
];

export const FREQUENCY_OPTIONS = [
  { id: "1-2", label: "1–2 ganger i uken", description: "Hobbyspiller" },
  { id: "3-4", label: "3–4 ganger i uken", description: "Aktiv spiller" },
  { id: "5+", label: "5+ ganger i uken", description: "Dedikert spiller" },
];

export const WEAKNESS_OPTIONS = [
  { id: "putting", label: "Putting" },
  { id: "shortgame", label: "Chip & pitch rundt green" },
  { id: "iron", label: "Iron-spill (100-150m)" },
  { id: "driver", label: "Driver / lengde" },
  { id: "mental", label: "Mental game / pre-shot" },
  { id: "course", label: "Banestrategi / beslutninger" },
];
