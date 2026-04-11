"use client";

import { AdminProgressRing } from "@/components/portal/mission-control/ui";
import { cn } from "@/lib/utils";

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

interface WeekRingsGridProps {
  days: WeekDay[];
  weekStart: string;
}

export function WeekRingsGrid({ days, weekStart }: WeekRingsGridProps) {
  const completed = days.filter((d) => d.trained).length;
  const total = days.length;

  return (
    <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
            Ukens aktivitet
          </h3>
          <p className="text-[11px] text-[var(--color-muted)]">{weekStart}</p>
        </div>
        <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary)] tabular-nums">
          {completed}/{total} dager
        </span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const color = day.trained
            ? "var(--color-primary)"
            : day.isRest
              ? "var(--color-muted)"
              : "var(--color-grey-200)";
          return (
            <div
              key={`${day.dayLabel}-${day.dateNumber}`}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2 transition-colors",
                day.isToday
                  ? "border-[var(--color-accent-cta)] bg-[var(--color-accent-cta)]/10"
                  : "border-transparent",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                {day.dayLabel}
              </span>
              <AdminProgressRing
                value={day.completionPercent}
                max={100}
                size={48}
                strokeWidth={5}
                color={color}
                showValue={false}
              />
              <span
                className={cn(
                  "text-[11px] font-semibold tabular-nums",
                  day.isToday
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-grey-900)]",
                )}
              >
                {day.dateNumber}
              </span>
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  day.hasCoaching
                    ? "bg-[var(--color-primary)]"
                    : "bg-transparent",
                )}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
