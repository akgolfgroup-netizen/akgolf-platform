"use client";


interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

interface WeekCalendarProps {
  days: WeekDay[];
}

export function WeekCalendar({ days }: WeekCalendarProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-around gap-2 overflow-x-auto px-2">
        {days.map((day, i) => {
          const isActive = day.trained || day.hasCoaching;
          return (
            <div
              key={i}
              className={`flex min-w-[52px] flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors ${
                day.isToday
                  ? "bg-on-surface text-surface"
                  : isActive
                    ? "bg-surface text-on-surface"
                    : "text-on-surface-variant"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {day.dayLabel}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  day.isToday
                    ? "bg-secondary-fixed text-secondary-fixed-text"
                    : day.hasCoaching
                      ? "bg-primary text-surface"
                      : day.trained
                        ? "bg-success text-surface"
                        : day.isRest
                          ? "bg-surface-container text-on-surface-variant"
                          : "bg-transparent text-on-surface-variant"
                }`}
              >
                {day.dateNumber}
              </span>
              {day.isToday ? (
                <span className="text-[9px] font-bold text-secondary-fixed">I dag</span>
              ) : day.hasCoaching ? (
                <span className="text-[9px] font-bold text-primary">Coach</span>
              ) : day.trained ? (
                <span className="text-[9px] font-bold text-success">Done</span>
              ) : day.isRest ? (
                <span className="text-[9px] font-bold text-on-surface-variant">Hvile</span>
              ) : (
                <span className="text-[9px] font-bold text-on-surface-variant/60">—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
