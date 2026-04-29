"use client";

import { Icon } from "@/components/ui/icon";
import { getMentalTrends } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * MentalTrendsWidget — viser mental profil og trender over tid.
 *
 * Data-kilde: MentalProfile + MentalScorecardEntry via getMentalTrends()
 * Brukes pa: P7 (Mental), A5 (Elev-detalj), N16, N22
 */
export function MentalTrendsWidget() {
  const { data: metrics, loading } = useWidgetData(getMentalTrends, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-surface-container animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen mental-data registrert ennå.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {metrics.map((m) => {
        const isPositive = m.trend > 0;
        const isNeutral = m.trend === 0;
        const vsBenchmark =
          m.value >= m.benchmark ? "text-success" : "text-warning";

        return (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">{m.label}</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${vsBenchmark}`}>
                  {m.value.toFixed(1)}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-medium ${
                    isPositive
                      ? "text-success"
                      : isNeutral
                        ? "text-on-surface-variant"
                        : "text-error"
                  }`}
                >
                  {isPositive ? (
                    <Icon name="arrow_outward" className="w-3 h-3" />
                  ) : isNeutral ? (
                    <Icon name="remove" className="w-3 h-3" />
                  ) : (
                    <Icon name="south_east" className="w-3 h-3" />
                  )}
                  {Math.abs(m.trend).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (m.value / 10) * 100)}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="pt-2 flex items-center justify-between text-[10px] text-muted">
        <span>Siste 5 okter</span>
        <span>Benchmark: profil-baseline</span>
      </div>
    </div>
  );
}
