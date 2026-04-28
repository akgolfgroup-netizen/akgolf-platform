import type { ViewId } from "@/lib/portal/views/registry";

export interface OnboardingV2Data {
  goals: string[];
  trainingFrequency: string;
  defaultView: ViewId;
}

export interface StepDef {
  id: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  eyebrow: string;
}

export const ONBOARDING_STEPS: StepDef[] = [
  { id: 1, title: "Mål", subtitle: "Hva vil du oppnå", eyebrow: "Steg 1 av 4 · Mål" },
  { id: 2, title: "Tid per uke", subtitle: "Volum + dager", eyebrow: "Steg 2 av 4 · Tid" },
  { id: 3, title: "Standardvisning", subtitle: "Velg layout", eyebrow: "Steg 3 av 4 · Visning" },
  { id: 4, title: "Klar", subtitle: "Sett i gang", eyebrow: "Steg 4 av 4 · Start" },
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
