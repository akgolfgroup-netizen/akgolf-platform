"use client";

import { cn } from "@/lib/portal/utils/cn";

/**
 * PeriodiseringWidget — viser nåværende treningsfase og periodisering.
 *
 * Data-kilde: PeriodizationPeriod + TrainingPhase
 * Brukes på: P2 (Planlegger), AB08 (Kapasitet), AB14 (Treningsplan), N19
 */
export function PeriodiseringWidget() {
  // TODO: Koble til reelle data via server action
  const phases = [
    { name: "Grunnlag", weeks: 8, completed: 8, active: false },
    { name: "Spesialisering", weeks: 6, completed: 4, active: true },
    { name: "Konkurranse", weeks: 10, completed: 0, active: false },
    { name: "Overgang", weeks: 4, completed: 0, active: false },
    { name: "Restitusjon", weeks: 4, completed: 0, active: false },
  ];

  const currentPhase = phases.find((p) => p.active);
  const totalWeeks = phases.reduce((sum, p) => sum + p.weeks, 0);
  const completedWeeks = phases.reduce((sum, p) => sum + p.completed, 0);
  const overallProgress = Math.round((completedWeeks / totalWeeks) * 100);

  return (
    <div className="space-y-4">
      {/* Nåværende fase */}
      {currentPhase && (
        <div className="rounded-xl bg-primary-soft p-3">
          <p className="text-[10px] text-primary font-medium uppercase tracking-wide">
            Nåværende fase
          </p>
          <p className="text-sm font-semibold text-text mt-0.5">
            {currentPhase.name}
          </p>
          <p className="text-xs text-muted">
            Uke {currentPhase.completed + 1} av {currentPhase.weeks}
          </p>
        </div>
      )}

      {/* Progress-bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Sesong-progress</span>
          <span className="font-medium text-text">{overallProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-grey-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Fase-liste */}
      <div className="space-y-1.5">
        {phases.map((phase) => {
          const phaseProgress = phase.weeks > 0 ? Math.round((phase.completed / phase.weeks) * 100) : 0;
          return (
            <div key={phase.name} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  phase.active ? "bg-primary" : phaseProgress === 100 ? "bg-success" : "bg-grey-200"
                )}
              />
              <span
                className={cn(
                  "text-xs flex-1",
                  phase.active ? "font-medium text-text" : "text-muted"
                )}
              >
                {phase.name}
              </span>
              <span className="text-[10px] text-muted">
                {phase.completed}/{phase.weeks} uker
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
