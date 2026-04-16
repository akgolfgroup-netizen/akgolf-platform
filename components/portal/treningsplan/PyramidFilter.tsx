"use client";

import { PyramidLevel } from "@/lib/portal/golf/ak-formula";

interface PyramidFilterProps {
  selectedFilter: string | null;
  onFilterChange: (focus: string | null) => void;
}

const PYRAMID_CONFIG: { level: PyramidLevel; label: string; color: string }[] = [
  { level: "FYS", label: "Fysisk", color: "#3B82F6" },
  { level: "TEK", label: "Teknikk", color: "#16A34A" },
  { level: "SLAG", label: "Slagtrening", color: "#D4AF37" },
  { level: "SPILL", label: "Spilltrening", color: "#F97316" },
  { level: "TURN", label: "Turnering", color: "#EF4444" },
];

// Hardcoded 60% progress for now
const PROGRESS_PERCENT = 60;

export function PyramidFilter({
  selectedFilter,
  onFilterChange,
}: PyramidFilterProps) {
  const handleLevelClick = (level: string) => {
    if (selectedFilter === level) {
      onFilterChange(null); // Toggle off
    } else {
      onFilterChange(level);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Treningspyramide
      </h3>

      <div className="space-y-2">
        {PYRAMID_CONFIG.map(({ level, label, color }) => {
          const isSelected = selectedFilter === level;
          const isDimmed = selectedFilter !== null && !isSelected;

          return (
            <button
              key={level}
              onClick={() => handleLevelClick(level)}
              className={`
                w-full group transition-all duration-200
                ${isDimmed ? "opacity-40" : "opacity-100"}
              `}
            >
              {/* Bar container */}
              <div className="relative h-8 rounded-lg overflow-hidden bg-slate-800">
                {/* Progress bar */}
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-300"
                  style={{
                    width: `${PROGRESS_PERCENT}%`,
                    backgroundColor: color,
                    opacity: isSelected ? 1 : 0.7,
                  }}
                />

                {/* Hover overlay */}
                <div
                  className={`
                    absolute inset-0 transition-opacity duration-200
                    ${isSelected ? "bg-white/10" : "group-hover:bg-white/5"}
                  `}
                />

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    {/* Level badge */}
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {level}
                    </span>
                    <span
                      className={`
                        text-sm font-medium transition-colors
                        ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}
                      `}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Progress indicator */}
                  <span className="text-xs text-slate-400">
                    {PROGRESS_PERCENT}%
                  </span>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div
                    className="absolute inset-y-0 right-0 w-1"
                    style={{ backgroundColor: color }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Clear filter button */}
      {selectedFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          Vis alle nivåer
        </button>
      )}
    </div>
  );
}
