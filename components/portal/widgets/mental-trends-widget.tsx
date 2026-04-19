"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

/**
 * MentalTrendsWidget — viser mental profil og trender over tid.
 *
 * Data-kilde: MentalProfile + MentalScorecardEntry
 * Brukes på: P7 (Mental), A5 (Elev-detalj), N16, N22
 */
export function MentalTrendsWidget() {
  // TODO: Koble til reelle data via server action
  const metrics = [
    {
      label: "Fokus",
      value: 78,
      trend: 5,
      benchmark: 70,
    },
    {
      label: "Selvtillit",
      value: 82,
      trend: -2,
      benchmark: 75,
    },
    {
      label: "Press-toleranse",
      value: 65,
      trend: 8,
      benchmark: 68,
    },
    {
      label: "Commitment",
      value: 71,
      trend: 0,
      benchmark: 72,
    },
  ];

  return (
    <div className="space-y-4">
      {metrics.map((m) => {
        const isPositive = m.trend > 0;
        const isNeutral = m.trend === 0;
        const vsBenchmark = m.value >= m.benchmark ? "text-success" : "text-warning";

        return (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">{m.label}</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${vsBenchmark}`}>{m.value}%</span>
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-medium ${
                    isPositive ? "text-success" : isNeutral ? "text-grey-400" : "text-error"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : isNeutral ? (
                    <Minus className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(m.trend)}
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-grey-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="pt-2 flex items-center justify-between text-[10px] text-muted">
        <span>Siste 30 dager</span>
        <span>Benchmark: gjennomsnitt</span>
      </div>
    </div>
  );
}
