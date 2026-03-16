import type { GoalType, PlanLevel, TournamentLevel } from "./types";

export const GOAL_TYPE_CONFIG: Record<
  GoalType,
  { color: string; label: string; tooltip: string }
> = {
  prestasjon: {
    color: "#B8975C",
    label: "Prestasjon",
    tooltip:
      "Beste mulige resultat. Full konkurransemodus. Ikke tid for eksperimentering.",
  },
  utvikling: {
    color: "#3B82F6",
    label: "Utvikling",
    tooltip:
      "Test nye teknikker under press. Tør å flytte tekniske oppgaver ut på banen.",
  },
  trening: {
    color: "#22C55E",
    label: "Trening",
    tooltip:
      "Resultat er ikke viktig. Bruk konkurransen som treningsarena.",
  },
} as const;

export const PLAN_LEVEL_CONFIG: Record<
  PlanLevel,
  { label: string; description: string }
> = {
  A: { label: "Plan A", description: "Spiller uansett hva" },
  B: { label: "Plan B", description: "Backup — om annen plan faller bort" },
  C: { label: "Plan C", description: "Tertiær backup" },
} as const;

export const TOURNAMENT_LEVEL_CONFIG: Record<
  TournamentLevel,
  { label: string }
> = {
  nasjonal: { label: "Nasjonal" },
  regional: { label: "Regional" },
  lokal: { label: "Lokal" },
  internasjonal: { label: "Internasjonal" },
} as const;

export const PERIOD_TO_GOAL_SUGGESTION: Record<string, GoalType> = {
  turneringsperiode: "prestasjon",
  grunnperiode: "trening",
  spesialiseringsperiode: "utvikling",
};

export const PERIOD_LABELS: Record<string, string> = {
  turneringsperiode: "Turneringsperiode",
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialiseringsperiode",
};

export function findPeriodForDate(
  periods: { periodType: string; startDate: Date; endDate: Date }[],
  date: Date
): { periodType: string; suggestedGoalType: GoalType; label: string } | null {
  const d = new Date(date);
  for (const p of periods) {
    if (d >= new Date(p.startDate) && d <= new Date(p.endDate)) {
      return {
        periodType: p.periodType,
        suggestedGoalType: PERIOD_TO_GOAL_SUGGESTION[p.periodType] ?? "prestasjon",
        label: PERIOD_LABELS[p.periodType] ?? p.periodType,
      };
    }
  }
  return null;
}
