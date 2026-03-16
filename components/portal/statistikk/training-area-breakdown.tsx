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
  range: "#3B82F6",
  naerspill: "#10B981",
  putting: "#F59E0B",
  bane: "#8B5CF6",
  styrke: "#EF4444",
  restitusjon: "#06B6D4",
  teknikk: "#B8975C",
  mental: "#EC4899",
};

export function TrainingAreaBreakdown({ data }: TrainingAreaBreakdownProps) {
  if (data.length === 0) {
    return (
      <p className="text-xs text-[var(--color-gold-muted)] text-center py-4">
        Ingen treningsdata ennå
      </p>
    );
  }

  const totalMinutes = data.reduce((s, d) => s + d.minutes, 0);
  const sorted = [...data].sort((a, b) => b.minutes - a.minutes);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest">
        Treningsfordeling
      </p>
      <div className="space-y-2">
        {sorted.map((item) => {
          const pct = totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0;
          const color = AREA_COLORS[item.area] ?? "#B8975C";
          const label = AREA_LABELS[item.area] ?? item.area;

          return (
            <div key={item.area} className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-gold-muted)] w-20 flex-shrink-0 truncate">
                {label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="h-2 rounded-full"
                  style={{ background: color }}
                />
              </div>
              <span className="text-[10px] text-[var(--color-gold-muted)] w-12 text-right flex-shrink-0">
                {pct}% · {item.sessions}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-[var(--color-gold-muted)]/50 text-right">
        Totalt: {Math.round(totalMinutes / 60)}t {totalMinutes % 60}min
      </p>
    </div>
  );
}
