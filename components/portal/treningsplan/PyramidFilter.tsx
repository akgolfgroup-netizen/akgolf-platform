"use client";

/**
 * PyramidFilter — brukes i treningsplan-v3 SidePanel (dark-theme).
 *
 * Design v3.1: Bruker data-viz-farger fra registry (sage, blue, amber, violet, coral)
 * og JetBrains Mono for nivå-etiketter.
 *
 * Merk: Full light-mode-konvertering av hele treningsplan-klienten (matcher plan.html)
 * er en større refactor som venter på egen fase. Denne komponenten er designet for
 * å fungere godt i eksisterende dark SidePanel.
 */

import { PyramidLevel } from "@/lib/portal/golf/ak-formula";
import { MonoLabel } from "@/components/portal/patterns";

interface PyramidFilterProps {
  selectedFilter: string | null;
  onFilterChange: (focus: string | null) => void;
}

// Farger matcher AKPyramide-komponenten (v3.1 data-viz)
const PYRAMID_CONFIG: {
  level: PyramidLevel;
  label: string;
  color: string;
}[] = [
  { level: "FYS", label: "Fysisk", color: "var(--color-data-sage)" },
  { level: "TEK", label: "Teknikk", color: "var(--color-data-blue)" },
  { level: "SLAG", label: "Slagtrening", color: "var(--color-data-amber)" },
  { level: "SPILL", label: "Spilltrening", color: "var(--color-data-violet)" },
  { level: "TURN", label: "Turnering", color: "var(--color-data-coral)" },
];

// TODO: Hent faktisk progress fra server (TrainingLog-aggregering)
const PROGRESS_PERCENT = 60;

export function PyramidFilter({
  selectedFilter,
  onFilterChange,
}: PyramidFilterProps) {
  const handleLevelClick = (level: string) => {
    onFilterChange(selectedFilter === level ? null : level);
  };

  return (
    <div className="space-y-3">
      <MonoLabel size="xs" uppercase className="text-slate-400 block">
        ◆ AK-Pyramiden · Uke 17
      </MonoLabel>

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
              aria-pressed={isSelected}
            >
              <div className="relative h-8 rounded-lg overflow-hidden bg-slate-800">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500"
                  style={{
                    width: `${PROGRESS_PERCENT}%`,
                    backgroundColor: color,
                    opacity: isSelected ? 1 : 0.7,
                    boxShadow: isSelected ? `0 0 12px ${color}` : "none",
                  }}
                />

                <div
                  className={`
                    absolute inset-0 transition-opacity duration-200
                    ${isSelected ? "bg-white/10" : "group-hover:bg-white/5"}
                  `}
                />

                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <MonoLabel
                      size="xs"
                      className="w-11 text-white font-bold"
                      uppercase
                    >
                      {level}
                    </MonoLabel>
                    <span
                      className={`
                        text-sm font-medium transition-colors
                        ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}
                      `}
                    >
                      {label}
                    </span>
                  </div>

                  <MonoLabel size="xs" className="text-slate-300">
                    {PROGRESS_PERCENT}%
                  </MonoLabel>
                </div>

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
