"use client";

import { useMemo } from "react";

interface HeatmapEntry {
  date: string;
  minutes: number;
}

interface Heatmap90dProps {
  entries: HeatmapEntry[];
}

const DAY_LABELS = ["MAN", "TIR", "ONS", "TOR", "FRE", "LØR", "SØN"];

function levelClass(minutes: number): string {
  if (minutes <= 0) return "bg-surface-soft";
  if (minutes < 30) return "bg-primary-soft";
  if (minutes < 60) return "bg-[#A5CDB1]";
  if (minutes < 120) return "bg-[#5B9B72]";
  return "bg-success";
}

export function Heatmap90d({ entries }: Heatmap90dProps) {
  const cells = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      map.set(e.date, (map.get(e.date) ?? 0) + e.minutes);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeks = 14;
    const dayMs = 24 * 60 * 60 * 1000;
    const totalDays = weeks * 7;
    const start = new Date(today.getTime() - (totalDays - 1) * dayMs);
    const dayOfWeek = (start.getDay() + 6) % 7;
    start.setTime(start.getTime() - dayOfWeek * dayMs);

    const rows: { date: Date; minutes: number }[][] = Array.from({ length: 7 }, () => []);

    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * dayMs);
        const key = date.toISOString().slice(0, 10);
        rows[d].push({ date, minutes: map.get(key) ?? 0 });
      }
    }
    return rows;
  }, [entries]);

  return (
    <div className="bg-card border border-line rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="m-0 text-sm font-bold text-ink">Heatmap · 90 dager</h3>
          <div className="font-mono text-[10px] text-ink-subtle tracking-wider mt-0.5 uppercase">
            min 0 timer · maks 4.5 timer
          </div>
        </div>
        <div className="flex gap-1 items-center text-[11px] text-ink-muted">
          <span>Mindre</span>
          {[0, 15, 45, 90, 150].map((m, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${levelClass(m)}`} />
          ))}
          <span>Mer</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-0.5 font-mono text-[9px] text-ink-subtle">
          {DAY_LABELS.map((d) => (
            <div key={d} className="h-3 leading-3">
              {d}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          {cells.map((row, di) => (
            <div key={di} className="flex gap-0.5">
              {row.map((cell, wi) => (
                <div
                  key={wi}
                  title={`${cell.date.toLocaleDateString("nb-NO")} · ${cell.minutes} min`}
                  className={`w-3 h-3 rounded-sm ${levelClass(cell.minutes)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
