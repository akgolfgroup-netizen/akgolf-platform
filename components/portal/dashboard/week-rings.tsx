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

interface WeekRingsProps {
  days: WeekDay[];
}

function formatTooltip(day: WeekDay) {
  const parts: string[] = [];
  if (day.hasCoaching) parts.push("1 coaching");
  else if (day.trained) parts.push("1 okt logget");
  if (day.isRest) parts.push("Hviledag");
  if (!parts.length) parts.push("Ingen aktivitet");
  return `${day.dayLabel} ${day.dateNumber} — ${parts.join(", ")}`;
}

function ActivityRing({ day }: { day: WeekDay }) {
  const size = 48;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (day.completionPercent / 100) * circumference;

  let strokeColor = "transparent";
  if (day.hasCoaching) strokeColor = "#0A1F18";
  else if (day.trained) strokeColor = "#005840";
  else if (day.isRest) strokeColor = "#D5DFDB";

  return (
    <div className="group relative flex flex-col items-center gap-1.5">
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity group-hover:block group-hover:opacity-100">
        {formatTooltip(day)}
      </div>

      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        {day.isToday && (
          <div className="absolute inset-0 rounded-full bg-accent-cta" />
        )}
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ECF0EF"
            strokeWidth={stroke}
          />
          {day.completionPercent > 0 && strokeColor !== "transparent" && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          )}
        </svg>
        <span
          className={`relative z-10 text-sm font-semibold ${
            day.isToday ? "text-accent-cta-text" : "text-black"
          }`}
        >
          {day.dateNumber}
        </span>
      </div>

      <span className="text-[10px] font-semibold uppercase tracking-wide text-grey-400">
        {day.dayLabel}
      </span>
    </div>
  );
}

export function WeekRings({ days }: WeekRingsProps) {
  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto rounded-2xl border border-grey-100 bg-white p-4 shadow-sm sm:justify-center sm:gap-6 sm:p-6">
      {days.map((day, i) => (
        <ActivityRing key={i} day={day} />
      ))}
    </div>
  );
}
