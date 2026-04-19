"use client";

import { cn } from "@/lib/portal/utils/cn";

/**
 * DegradationAlertWidget — viser nedgang i teknikk under press.
 *
 * Data-kilde: DegradationTracking
 * Brukes på: A1 (MC Dashboard), A4 (MC Elever), N17
 */
export function DegradationAlertWidget() {
  // TODO: Koble til reelle data via server action
  const areas = [
    { name: "Teknikk", status: "good" as const, score: 8.2, change: 0.3 },
    { name: "Slag", status: "warning" as const, score: 6.8, change: -1.2 },
    { name: "Spill", status: "good" as const, score: 7.5, change: 0.1 },
    { name: "Turnering", status: "alert" as const, score: 5.1, change: -2.4 },
  ];

  const statusConfig = {
    good: {
      dot: "bg-success",
      text: "text-success",
      bg: "bg-success/10",
      label: "Stabil",
    },
    warning: {
      dot: "bg-warning",
      text: "text-warning",
      bg: "bg-warning/10",
      label: "Nedgang",
    },
    alert: {
      dot: "bg-error",
      text: "text-error",
      bg: "bg-error/10",
      label: "Kritisk",
    },
  };

  return (
    <div className="space-y-3">
      {areas.map((area) => {
        const config = statusConfig[area.status];
        return (
          <div
            key={area.name}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-grey-50"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-2.5 h-2.5 rounded-full", config.dot)} />
              <div>
                <p className="text-xs font-medium text-text">{area.name}</p>
                <p className={cn("text-[10px] font-medium", config.text)}>
                  {config.label}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-text">{area.score}</p>
              <p
                className={cn(
                  "text-[10px] font-medium",
                  area.change < 0 ? "text-error" : "text-success"
                )}
              >
                {area.change > 0 ? "+" : ""}
                {area.change}
              </p>
            </div>
          </div>
        );
      })}

      <div className="pt-1 text-[10px] text-muted">
        Basert på siste 10 økter per nivå
      </div>
    </div>
  );
}
