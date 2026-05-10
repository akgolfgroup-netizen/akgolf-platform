"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface PeriodBlock {
  id: string;
  label: string;
  type: "preparation" | "competition" | "rest" | "transition";
  startDate: string;
  endDate: string;
}

interface PeriodizationTimelineProps {
  periods: PeriodBlock[];
  year: number;
  currentDate?: Date;
  className?: string;
}

const TYPE_COLORS: Record<PeriodBlock["type"], string> = {
  preparation: "#005840",
  competition: "#D1F843",
  rest: "#EFEDE6",
  transition: "#B8852A",
};

const TYPE_TEXT_COLORS: Record<PeriodBlock["type"], string> = {
  preparation: "#FFFFFF",
  competition: "#0A1F18",
  rest: "#5E5C57",
  transition: "#FFFFFF",
};

const TYPE_LABELS: Record<PeriodBlock["type"], string> = {
  preparation: "Forberedelse",
  competition: "Konkurranse",
  rest: "Hvile",
  transition: "Overgang",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function PeriodizationTimeline({
  periods,
  year,
  currentDate,
  className,
}: PeriodizationTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year + 1, 0, 1).getTime();
  const totalMs = yearEnd - yearStart;

  const now = currentDate ?? new Date();
  const nowPercent = useMemo(() => {
    const t = now.getTime();
    if (t < yearStart || t > yearEnd) return null;
    return ((t - yearStart) / totalMs) * 100;
  }, [now, yearStart, yearEnd, totalMs]);

  const blocks = useMemo(
    () =>
      periods.map((p) => {
        const start = Math.max(new Date(p.startDate).getTime(), yearStart);
        const end = Math.min(new Date(p.endDate).getTime(), yearEnd);
        const leftPct = ((start - yearStart) / totalMs) * 100;
        const widthPct = ((end - start) / totalMs) * 100;
        return { ...p, leftPct, widthPct };
      }),
    [periods, yearStart, yearEnd, totalMs]
  );

  return (
    <div className={cn("w-full", className)}>
      {/* Month labels */}
      <div className="relative h-5 mb-2">
        {MONTHS.map((m, i) => {
          const left = (i / 12) * 100;
          return (
            <span
              key={m}
              className="absolute"
              style={{
                left: `${left}%`,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "#9C9990",
              }}
            >
              {m}
            </span>
          );
        })}
      </div>

      {/* Timeline track */}
      <div
        className="relative w-full"
        style={{
          height: "40px",
          backgroundColor: "#F5F2EA",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {blocks.map((block) => {
          const isWide = block.widthPct > 8;
          const isHovered = hoveredId === block.id;

          return (
            <div
              key={block.id}
              className="absolute top-0 h-full flex items-center justify-center cursor-default transition-opacity"
              style={{
                left: `${block.leftPct}%`,
                width: `${block.widthPct}%`,
                backgroundColor: TYPE_COLORS[block.type],
                opacity: isHovered ? 0.85 : 1,
              }}
              onMouseEnter={() => setHoveredId(block.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={`${block.label} (${TYPE_LABELS[block.type]})`}
            >
              {isWide && (
                <span
                  className="truncate px-2"
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: TYPE_TEXT_COLORS[block.type],
                  }}
                >
                  {block.label}
                </span>
              )}
            </div>
          );
        })}

        {/* Current date marker */}
        {nowPercent !== null && (
          <div
            className="absolute top-0 h-full"
            style={{
              left: `${nowPercent}%`,
              width: "2px",
              backgroundColor: "#A32D2D",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Tooltip for narrow blocks */}
      {hoveredId && (() => {
        const block = blocks.find((b) => b.id === hoveredId);
        if (!block || block.widthPct > 8) return null;
        return (
          <div
            className="absolute mt-1 px-2 py-1 rounded-lg"
            style={{
              left: `${block.leftPct}%`,
              backgroundColor: "#0A1F18",
              color: "#FFFFFF",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "11px",
              whiteSpace: "nowrap",
              zIndex: 20,
            }}
          >
            {block.label}
          </div>
        );
      })()}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3">
        {(
          Object.keys(TYPE_COLORS) as Array<PeriodBlock["type"]>
        ).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: "12px",
                color: "#5E5C57",
              }}
            >
              {TYPE_LABELS[type]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
