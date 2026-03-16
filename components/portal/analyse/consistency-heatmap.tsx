"use client";

import { useMemo } from "react";
import { subDays, format, startOfWeek, eachWeekOfInterval } from "date-fns";
import { nb } from "date-fns/locale";

interface ConsistencyHeatmapProps {
  trainedDates: string[]; // "yyyy-MM-dd" strings
}

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function ConsistencyHeatmap({ trainedDates }: ConsistencyHeatmapProps) {
  const trained = useMemo(() => new Set(trainedDates), [trainedDates]);

  const today = new Date();
  const from = subDays(today, 83); // 12 weeks

  const weeks = eachWeekOfInterval(
    { start: startOfWeek(from, { weekStartsOn: 1 }), end: today },
    { weekStartsOn: 1 }
  );

  // Calculate streak
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = format(subDays(today, i), "yyyy-MM-dd");
    if (trained.has(d)) streak++;
    else break;
  }

  // Weekly completion rate (last 8 weeks)
  const last8 = weeks.slice(-8);
  const weekRates = last8.map((weekStart) => {
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + d);
      if (format(day, "yyyy-MM-dd") <= format(today, "yyyy-MM-dd")) {
        if (trained.has(format(day, "yyyy-MM-dd"))) count++;
      }
    }
    return count;
  });
  const avgWeeklyRate = weekRates.reduce((s, r) => s + r, 0) / weekRates.length;

  return (
    <div>
      {/* Stats row */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-2xl font-bold text-[var(--color-gold)]">{streak}</p>
          <p className="text-[10px] text-[var(--color-gold-muted)] uppercase tracking-wider">
            Dager streak
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-gold)]">
            {Math.round(avgWeeklyRate * 10) / 10}
          </p>
          <p className="text-[10px] text-[var(--color-gold-muted)] uppercase tracking-wider">
            Snitt per uke
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-gold)]">
            {trainedDates.length}
          </p>
          <p className="text-[10px] text-[var(--color-gold-muted)] uppercase tracking-wider">
            Økter (12 uker)
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 pt-5">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-[9px] text-[var(--color-gold-dim)]/50 h-4 flex items-center"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((weekStart) => (
            <div key={weekStart.toISOString()} className="flex flex-col gap-1">
              <p className="text-[9px] text-[var(--color-gold-dim)]/40 h-4 text-center">
                {format(weekStart, "d/M", { locale: nb })}
              </p>
              {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                const day = new Date(weekStart);
                day.setDate(day.getDate() + dayOffset);
                const dateStr = format(day, "yyyy-MM-dd");
                const isFuture = day > today;
                const isTraining = !isFuture && trained.has(dateStr);

                return (
                  <div
                    key={dayOffset}
                    title={dateStr}
                    className="w-4 h-4 rounded-sm transition-colors"
                    style={{
                      background: isFuture
                        ? "transparent"
                        : isTraining
                        ? "var(--color-gold)"
                        : "rgba(15,41,80,0.5)",
                      opacity: isFuture ? 0.15 : 1,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
