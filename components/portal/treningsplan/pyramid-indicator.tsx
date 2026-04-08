"use client";

import { PYRAMID_LEVELS, type PyramidLevel } from "@/lib/portal/golf/ak-formula";

interface Props {
  level: PyramidLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PyramidIndicator({ level, showLabel = true, size = "md" }: Props) {
  const pyramid = PYRAMID_LEVELS[level];

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold text-white`}
        style={{ backgroundColor: pyramid.color }}
        title={pyramid.description}
      >
        {pyramid.id}
      </div>
      {showLabel && (
        <span className="text-sm text-[#6b7366]">{pyramid.name}</span>
      )}
    </div>
  );
}

// Full pyramide-visualisering
interface PyramidStackProps {
  activeLevel: PyramidLevel;
  compact?: boolean;
}

export function PyramidStack({ activeLevel, compact = false }: PyramidStackProps) {
  const levels: PyramidLevel[] = ["TURN", "SPILL", "SLAG", "TEK", "FYS"];
  const activeIndex = levels.indexOf(activeLevel);

  if (compact) {
    return (
      <div className="flex gap-0.5">
        {levels.map((level, idx) => {
          const pyramid = PYRAMID_LEVELS[level];
          const isActive = idx >= activeIndex;
          return (
            <div
              key={level}
              className="w-2 h-2 rounded-sm"
              style={{
                backgroundColor: isActive ? pyramid.color : "#c2c9bb",
                opacity: isActive ? 1 : 0.4,
              }}
              title={pyramid.name}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {levels.map((level, idx) => {
        const pyramid = PYRAMID_LEVELS[level];
        const isActive = level === activeLevel;
        const isBelow = idx > activeIndex;
        const width = 100 - idx * 15; // Pyramide-form

        return (
          <div
            key={level}
            className={`h-6 rounded flex items-center justify-center text-[10px] font-medium transition-[opacity,box-shadow] ${
              isActive
                ? "text-white ring-2 ring-[#d2f000]/50"
                : isBelow
                ? "text-white/90"
                : "text-white/50"
            }`}
            style={{
              width: `${width}%`,
              backgroundColor: isActive || isBelow ? pyramid.color : "#c2c9bb",
              opacity: isActive ? 1 : isBelow ? 0.7 : 0.4,
            }}
          >
            {pyramid.name}
          </div>
        );
      })}
    </div>
  );
}
