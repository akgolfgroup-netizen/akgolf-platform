"use client";

import { PYRAMID_LEVELS, type PyramidLevel } from "@/lib/portal/golf/ak-formula";
import { pyramidLabel } from "./types";

interface PyramidBar {
  code: PyramidLevel;
  label: string;
  color: string;
  plannedPct: number;
  actualPct: number;
  actualMinutes: number;
}

interface PyramidActualsProps {
  /** Planlagt fordeling fra TrainingPlan.pyramidDistribution (sum ≈ 100) */
  planned?: Record<string, number> | null;
  /** Faktiske økter med focus (pyramide-kode) og dur (minutter) */
  events: { focus: string; dur: number }[];
}

export function PyramidActuals({ planned, events }: PyramidActualsProps) {
  // Beregn faktisk fordeling basert på øktenes varighet
  const totalMinutes = events.reduce((sum, e) => sum + (e.dur ?? 0), 0);

  const codes: PyramidLevel[] = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

  const bars: PyramidBar[] = codes.map((code) => {
    const minutesForCode = events
      .filter((e) => e.focus === code)
      .reduce((sum, e) => sum + (e.dur ?? 0), 0);

    return {
      code,
      label: pyramidLabel(code),
      color: PYRAMID_LEVELS[code].color,
      plannedPct: planned?.[code] ?? 0,
      actualPct: totalMinutes > 0 ? Math.round((minutesForCode / totalMinutes) * 100) : 0,
      actualMinutes: minutesForCode,
    };
  });

  const hasPlan = bars.some((b) => b.plannedPct > 0);
  const hasActual = totalMinutes > 0;

  if (!hasPlan && !hasActual) return null;

  return (
    <div className="mb-6 rounded-2xl border border-sidebar-divider bg-sidebar-hover p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold uppercase tracking-[0.06em] text-white">
            Treningspyramiden
          </h3>
          <p className="mt-0.5 text-[11px] text-white/50">
            {hasPlan ? "Planlagt vs. faktisk fordeling denne uka" : "Faktisk fordeling denne uka"}
          </p>
        </div>
        {totalMinutes > 0 && (
          <div className="text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-white/50">
              Total
            </span>
            <div className="text-[14px] font-bold text-white">
              {Math.round(totalMinutes / 60)}t {totalMinutes % 60}m
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {bars.map((bar) => {
          const maxPct = Math.max(bar.plannedPct, bar.actualPct, 100);
          const plannedWidth = maxPct > 0 ? (bar.plannedPct / maxPct) * 100 : 0;
          const actualWidth = maxPct > 0 ? (bar.actualPct / maxPct) * 100 : 0;

          return (
            <div key={bar.code} className="group">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: bar.color }}
                  />
                  <span className="text-[12px] font-medium text-white/85">{bar.label}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  {hasPlan && (
                    <span className="text-white/40" title="Planlagt">
                      {bar.plannedPct}%
                    </span>
                  )}
                  <span className="font-bold text-white" title="Faktisk">
                    {bar.actualPct}%
                  </span>
                </div>
              </div>

              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                {/* Planlagt bar (svak, bakgrunn) */}
                {hasPlan && bar.plannedPct > 0 && (
                  <div
                    className="absolute top-0 left-0 h-full rounded-full opacity-25"
                    style={{
                      width: `${plannedWidth}%`,
                      backgroundColor: bar.color,
                    }}
                  />
                )}
                {/* Faktisk bar */}
                {bar.actualPct > 0 && (
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${actualWidth}%`,
                      backgroundColor: bar.color,
                    }}
                  />
                )}
              </div>

              {bar.actualMinutes > 0 && (
                <p className="mt-0.5 text-[10px] text-white/30">
                  {Math.round(bar.actualMinutes / 60)}t {bar.actualMinutes % 60}m
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {hasPlan && (
        <div className="mt-4 flex items-center gap-4 border-t border-sidebar-divider pt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-white/20" />
            <span className="text-[10px] text-white/40">Planlagt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-white/60" />
            <span className="text-[10px] text-white/40">Faktisk</span>
          </div>
        </div>
      )}
    </div>
  );
}
