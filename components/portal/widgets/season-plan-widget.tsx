"use client";

import { ChevronRight } from "lucide-react";

/**
 * SeasonPlanWidget — 12-måneders periodiseringsvisning.
 *
 * Data-kilde: TrainingPlan måned-horisont
 * Brukes på: P1 (Dashboard), P2 (Planlegger), N07 (Sesongplan)
 */
export function SeasonPlanWidget() {
  // TODO: Koble til reelle data via server action
  const months = [
    { name: "Jan", phase: "Grunnlag", active: false },
    { name: "Feb", phase: "Grunnlag", active: false },
    { name: "Mar", phase: "Grunnlag", active: true },
    { name: "Apr", phase: "Spesialisering", active: true },
    { name: "Mai", phase: "Spesialisering", active: false },
    { name: "Jun", phase: "Konkurranse", active: false },
    { name: "Jul", phase: "Konkurranse", active: false },
    { name: "Aug", phase: "Konkurranse", active: false },
    { name: "Sep", phase: "Overgang", active: false },
    { name: "Okt", phase: "Overgang", active: false },
    { name: "Nov", phase: "Restitusjon", active: false },
    { name: "Des", phase: "Restitusjon", active: false },
  ];

  const phaseColors: Record<string, string> = {
    Grunnlag: "bg-primary",
    Spesialisering: "bg-accent-cta",
    Konkurranse: "bg-success",
    Overgang: "bg-warning",
    Restitusjon: "bg-grey-300",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-md">
          Spesialisering
        </span>
        <button className="flex items-center gap-0.5 text-xs text-muted hover:text-text transition-colors">
          Detaljer <ChevronRight className="w-3 h-3" />
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
                : "border-grey-100 bg-grey-50")
            }
          >
            <p className="text-xs font-medium text-text">{m.name}</p>
            <div
              className={
                "mx-auto mt-1 h-1 w-4 rounded-full " + (phaseColors[m.phase] ?? "bg-grey-300")
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(phaseColors).map(([phase, color]) => (
          <div key={phase} className="flex items-center gap-1">
            <div className={"w-2 h-2 rounded-full " + color} />
            <span className="text-[10px] text-muted">{phase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
