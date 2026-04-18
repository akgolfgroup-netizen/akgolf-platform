"use client";

import { cn } from "@/lib/portal/utils/cn";

/**
 * TrainingVolumeWidget — treningstimer per NGF-område.
 *
 * Data-kilde: TrainingLog aggregert
 * Brukes på: P1 (Dashboard), PB09 (Dagbok), N01, N06
 */
export function TrainingVolumeWidget() {
  // TODO: Koble til reelle data via server action
  const areas = [
    { name: "Teknikk", hours: 8.5, color: "bg-primary" },
    { name: "Fysikk", hours: 4.0, color: "bg-accent-cta" },
    { name: "Slag", hours: 6.0, color: "bg-success" },
    { name: "Spill", hours: 3.5, color: "bg-info" },
    { name: "Turnering", hours: 2.0, color: "bg-ai" },
  ];

  const maxHours = Math.max(...areas.map((a) => a.hours));
  const totalHours = areas.reduce((sum, a) => sum + a.hours, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-text">{totalHours}t</span>
        <span className="text-xs text-muted">Siste 7 dager</span>
      </div>

      <div className="space-y-2">
        {areas.map((area) => {
          const pct = Math.round((area.hours / maxHours) * 100);
          return (
            <div key={area.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">{area.name}</span>
                <span className="font-medium text-text">{area.hours}t</span>
              </div>
              <div className="h-1.5 rounded-full bg-grey-100 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", area.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

