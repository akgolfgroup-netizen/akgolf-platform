"use client";

import { getPlanProgress } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * PlanProgressWidget — viser progresjon pa aktiv treningsplan.
 *
 * Data-kilde: TrainingPlan + TrainingPlanSession + TrainingLog
 * Brukes pa: P1 (Dashboard), PB09 (Dagbok), N01 (Utvikling-progresjon)
 */
export function PlanProgressWidget() {
  const { data, loading } = useWidgetData(getPlanProgress, null);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-surface-container animate-pulse rounded" />
        <div className="h-2 bg-surface-container animate-pulse rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen aktiv treningsplan.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-text">{data.percentage}%</span>
        <span className="text-xs text-muted">
          {data.completed} av {data.total} okter
        </span>
      </div>

      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${data.percentage}%` }}
        />
      </div>

      <p className="text-xs text-muted truncate">{data.planName}</p>
    </div>
  );
}
