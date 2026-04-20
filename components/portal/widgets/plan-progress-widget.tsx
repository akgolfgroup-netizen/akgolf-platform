"use client";

/**
 * PlanProgressWidget — viser progresjon på aktiv treningsplan.
 *
 * Data-kilde: TrainingPlan + TrainingLog
 * Brukes på: P1 (Dashboard), PB09 (Dagbok), N01 (Utvikling-progresjon)
 */
export function PlanProgressWidget() {
  // TODO: Koble til reelle data via server action
  const planName = "Sommerprogram 2026";
  const completed = 12;
  const total = 20;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-text">{percentage}%</span>
        <span className="text-xs text-muted">
          {completed} av {total} økter
        </span>
      </div>

      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Teknikk</span>
          <span className="font-medium text-text">80%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Fysikk</span>
          <span className="font-medium text-text">60%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Mental</span>
          <span className="font-medium text-text">45%</span>
        </div>
      </div>

      <p className="text-xs text-muted truncate">{planName}</p>
    </div>
  );
}
