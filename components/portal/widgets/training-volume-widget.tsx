"use client";

import { getTrainingVolume } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * TrainingVolumeWidget — treningstimer per pyramide-kategori.
 *
 * Data-kilde: TrainingLog aggregert via getTrainingVolume()
 * Brukes pa: P1 (Dashboard), PB09 (Dagbok), N01, N06
 */
export function TrainingVolumeWidget({
  period = "week",
}: {
  period?: "week" | "month";
}) {
  const { data: areas, loading } = useWidgetData(
    () => getTrainingVolume(period),
    [],
  );

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-6 bg-surface-container animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  const totalHours = areas.reduce((sum, a) => sum + a.hours, 0);
  const maxHours = Math.max(...areas.map((a) => a.hours), 0.1);
  const periodLabel = period === "week" ? "Siste 7 dager" : "Siste 30 dager";

  if (totalHours === 0) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen logget trening i {periodLabel.toLowerCase()}.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-text">
          {totalHours.toFixed(1)}t
        </span>
        <span className="text-xs text-muted">{periodLabel}</span>
      </div>

      <div className="space-y-2">
        {areas.map((area) => {
          const pct = Math.round((area.hours / maxHours) * 100);
          return (
            <div key={area.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">{area.name}</span>
                <span className="font-medium text-text">
                  {area.hours.toFixed(1)}t
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: area.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
