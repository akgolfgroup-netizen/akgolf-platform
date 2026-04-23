"use client";

import { useMemo } from "react";
import { getHours } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AdminHeatmap } from "@/components/portal/coach-hq/ui";
import type { AdminHeatmapCell } from "@/components/portal/coach-hq/ui";
import type { CalendarBooking } from "./actions";

const HEATMAP_ROWS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const HEATMAP_COLS = Array.from({ length: 13 }, (_, i) => `${i + 8}`);

interface KalenderHeatmapProps {
  bookings: CalendarBooking[];
}

export default function KalenderHeatmap({ bookings }: KalenderHeatmapProps) {
  const data = useMemo<AdminHeatmapCell[]>(() => {
    const counts = new Map<string, number>();
    for (const b of bookings) {
      const d = new Date(b.startTime);
      const dow = (d.getDay() + 6) % 7;
      const rowLabel = HEATMAP_ROWS[dow];
      const hour = getHours(d);
      if (hour < 8 || hour > 20) continue;
      const key = `${rowLabel}|${hour}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const cells: AdminHeatmapCell[] = [];
    for (const row of HEATMAP_ROWS) {
      for (const col of HEATMAP_COLS) {
        cells.push({
          row,
          col,
          value: counts.get(`${row}|${col}`) ?? 0,
        });
      }
    }
    return cells;
  }, [bookings]);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-on-surface">Aktivitet</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Antall bookinger per ukedag og klokkeslett
          </p>
        </div>
        <Badge variant="info">{bookings.length} totalt</Badge>
      </div>
      <div className="overflow-x-auto">
        <AdminHeatmap
          data={data}
          rows={HEATMAP_ROWS}
          cols={HEATMAP_COLS}
          formatTooltip={(cell) =>
            `${cell.row} kl ${cell.col}:00 — ${cell.value} booking${
              cell.value === 1 ? "" : "er"
            }`
          }
        />
      </div>
    </div>
  );
}
