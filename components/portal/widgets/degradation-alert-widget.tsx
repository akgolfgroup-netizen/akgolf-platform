"use client";

import { cn } from "@/lib/portal/utils/cn";
import { getDegradationAlerts } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

const STATUS_CONFIG = {
  good: {
    dot: "bg-success",
    text: "text-success",
    label: "Stabil",
  },
  warning: {
    dot: "bg-warning",
    text: "text-warning",
    label: "Nedgang",
  },
  alert: {
    dot: "bg-error",
    text: "text-error",
    label: "Kritisk",
  },
} as const;

/**
 * DegradationAlertWidget — viser nedgang i teknikk under press.
 *
 * Data-kilde: DegradationTracking via getDegradationAlerts()
 * Brukes pa: A1 (MC Dashboard), A4 (MC Elever), N17
 */
export function DegradationAlertWidget() {
  const { data: areas, loading } = useWidgetData(getDegradationAlerts, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-surface-container animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (areas.length === 0) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen nedgangs-varsler aktive.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {areas.map((area) => {
        const config = STATUS_CONFIG[area.status];
        return (
          <div
            key={area.name}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface"
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
                  area.change < 0 ? "text-error" : "text-success",
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
        Basert pa siste 10 okter per niva
      </div>
    </div>
  );
}
