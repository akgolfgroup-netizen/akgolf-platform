"use client";

import { Icon } from "@/components/ui/icon";
import { getSeasonPlan } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

const PHASE_COLORS: Record<string, string> = {
  Grunnlag: "bg-primary",
  Spesialisering: "bg-secondary-fixed",
  Konkurranse: "bg-success",
  Overgang: "bg-warning",
  Restitusjon: "bg-outline-variant",
  Ingen: "bg-outline-variant/40",
};

/**
 * SeasonPlanWidget — 12-maneders periodiseringsvisning.
 *
 * Data-kilde: PeriodizationPeriod via getSeasonPlan()
 * Brukes pa: P1 (Dashboard), P2 (Planlegger), N07 (Sesongplan)
 */
export function SeasonPlanWidget() {
  const { data: months, loading } = useWidgetData(getSeasonPlan, []);

  if (loading) {
    return (
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-surface-container animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (months.length === 0) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen sesongplan registrert.
      </p>
    );
  }

  const activePhase = months.find((m) => m.active)?.phase ?? "Ingen";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-md">
          {activePhase}
        </span>
        <button className="flex items-center gap-0.5 text-xs text-muted hover:text-text transition-colors">
          Detaljer <Icon name="chevron_right" className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {months.map((m) => (
          <div
            key={m.name}
            className={
              "text-center py-2 rounded-lg border transition-colors " +
              (m.active
                ? "border-primary bg-primary-soft"
                : "border-outline-variant/20 bg-surface")
            }
          >
            <p className="text-xs font-medium text-text">{m.name}</p>
            <div
              className={
                "mx-auto mt-1 h-1 w-4 rounded-full " +
                (PHASE_COLORS[m.phase] ?? "bg-outline-variant")
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(PHASE_COLORS)
          .filter(([phase]) => phase !== "Ingen")
          .map(([phase, color]) => (
            <div key={phase} className="flex items-center gap-1">
              <div className={"w-2 h-2 rounded-full " + color} />
              <span className="text-[10px] text-muted">{phase}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
