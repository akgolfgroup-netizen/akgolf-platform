"use client";

import { motion } from "framer-motion";

interface AreaData {
  area: string;
  minutes: number;
  sessions: number;
}

interface TrainingAreaBreakdownProps {
  data: AreaData[];
}

const AREA_LABELS: Record<string, string> = {
  range: "Range",
  naerspill: "Nærspill",
  putting: "Putting",
  bane: "Bane",
  styrke: "Styrke",
  restitusjon: "Restitusjon",
  teknikk: "Teknikk",
  mental: "Mental",
};

const AREA_COLORS: Record<string, string> = {
  range: "#38BDF8",
  naerspill: "#10B981",
  putting: "#F59E0B",
  bane: "#8B5CF6",
  styrke: "#EF4444",
  restitusjon: "#06B6D4",
  teknikk: "#A3A3A3",
  mental: "#EC4899",
};

export function TrainingAreaBreakdown({ data }: TrainingAreaBreakdownProps) {
  if (data.length === 0) {
    return (
      <p className="text-xs text-[var(--color-grey-500)] text-center py-4">
        Ingen treningsdata ennå
      </p>
    );
  }

  const totalMinutes = data.reduce((s, d) => s + d.minutes, 0);
  const sorted = [...data].sort((a, b) => b.minutes - a.minutes);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-[var(--color-grey-400)]/50 uppercase tracking-widest">
        Treningsfordeling
      </p>
      <div className="space-y-2">
        {sorted.map((item) => {
          const pct = totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0;
          const color = AREA_COLORS[item.area] ?? "#A3A3A3";
          const label = AREA_LABELS[item.area] ?? item.area;

          return (
            <div key={item.area} className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-grey-500)] w-20 flex-shrink-0 truncate">
                {label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[var(--color-grey-200)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="h-2 rounded-full"
                  style={{ background: color }}
                />
              </div>
              <span className="text-[10px] text-[var(--color-grey-500)] w-12 text-right flex-shrink-0">
                {pct}% · {item.sessions}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-[var(--color-grey-500)]/50 text-right">
        Totalt: {Math.round(totalMinutes / 60)}t {totalMinutes % 60}min
      </p>
    </div>
  );
}
