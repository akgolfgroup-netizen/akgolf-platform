"use client";

import { cn } from "@/lib/portal/utils/cn";
import { getPeriodSummary } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * PeriodiseringWidget — viser navaerende treningsfase og periodisering.
 *
 * Data-kilde: PeriodizationPeriod via getPeriodSummary()
 * Brukes pa: P2 (Planlegger), AB08 (Kapasitet), AB14 (Treningsplan), N19
 */
export function PeriodiseringWidget() {
  const { data: phases, loading } = useWidgetData(getPeriodSummary, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-16 bg-surface-container animate-pulse rounded-xl" />
        <div className="h-2 bg-surface-container animate-pulse rounded-full" />
      </div>
    );
  }

  if (phases.length === 0) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen periodiseringsplan registrert.
      </p>
    );
  }

  const currentPhase = phases.find((p) => p.active);
  const totalWeeks = phases.reduce((sum, p) => sum + p.weeks, 0);
  const completedWeeks = phases
    .filter((p) => p.completed)
    .reduce((sum, p) => sum + p.weeks, 0);
  const overallProgress =
    totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  return (
    <div className="space-y-4">
      {currentPhase ? (
        <div className="rounded-xl bg-primary-soft p-3">
          <p className="text-[10px] text-primary font-medium uppercase tracking-wide">
            Navaerende fase
          </p>
          <p className="text-sm font-semibold text-text mt-0.5">
            {currentPhase.name}
          </p>
          <p className="text-xs text-muted">{currentPhase.weeks} uker</p>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Sesong-progress</span>
          <span className="font-medium text-text">{overallProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {phases.map((phase) => (
          <div key={phase.name} className="flex items-center gap-2">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                phase.active
                  ? "bg-primary"
                  : phase.completed
                    ? "bg-success"
                    : "bg-surface-variant",
              )}
            />
            <span
              className={cn(
                "text-xs flex-1",
                phase.active ? "font-medium text-text" : "text-muted",
              )}
            >
              {phase.name}
            </span>
            <span className="text-[10px] text-muted">
              {phase.weeks} uker
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
