"use client";

import { useState } from "react";
import { Search, X, Check, Plus } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import type { DrillOption, ManualPlanExercise } from "../actions";

const PYRAMID_LEVELS = [
  { value: "", label: "Alle" },
  { value: "FYS", label: "FYS" },
  { value: "TEK", label: "TEK" },
  { value: "SLAG", label: "SLAG" },
  { value: "SPILL", label: "SPILL" },
  { value: "TURN", label: "TURN" },
] as const;

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Lett",
  2: "Middels",
  3: "Vanskelig",
  4: "Avansert",
  5: "Ekspert",
};

interface DrillPickerProps {
  drills: DrillOption[];
  onSelect: (exercises: ManualPlanExercise[]) => void;
  onClose: () => void;
}

export function DrillPicker({ drills, onSelect, onClose }: DrillPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pyramidFilter, setPyramidFilter] = useState("");
  const [selected, setSelected] = useState<Map<string, ManualPlanExercise>>(new Map());

  const filteredDrills = drills.filter((d) => {
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPyramid = !pyramidFilter || d.pyramid === pyramidFilter;

    return matchesSearch && matchesPyramid;
  });

  function toggleDrill(drill: DrillOption) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(drill.id)) {
        next.delete(drill.id);
      } else {
        next.set(drill.id, {
          drillId: drill.id,
          name: drill.name,
          durationMinutes: drill.minDurationMinutes,
        });
      }
      return next;
    });
  }

  function handleConfirm() {
    onSelect(Array.from(selected.values()));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-grey-200)]">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              Velg ovelser
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              {selected.size} valgt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[var(--color-muted)]" />
          </button>
        </div>

        {/* Search & filters */}
        <div className="px-5 py-3 border-b border-[var(--color-grey-200)] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Sok etter ovelse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PYRAMID_LEVELS.map((pl) => (
              <button
                key={pl.value}
                onClick={() => setPyramidFilter(pl.value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  pyramidFilter === pl.value
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:bg-[var(--color-grey-200)]"
                )}
              >
                {pl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drill list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredDrills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--color-muted)]">Ingen ovelser funnet</p>
            </div>
          ) : (
            filteredDrills.map((drill) => {
              const isSelected = selected.has(drill.id);
              return (
                <button
                  key={drill.id}
                  onClick={() => toggleDrill(drill)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer",
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      : "border-transparent hover:bg-[var(--color-grey-100)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--color-text)] truncate">
                          {drill.name}
                        </p>
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-grey-100)] text-[var(--color-muted)]">
                          {drill.pyramid}
                        </span>
                      </div>
                      {drill.description && (
                        <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-1">
                          {drill.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-muted)]">
                        <span>{drill.area}</span>
                        <span>{drill.minDurationMinutes}-{drill.maxDurationMinutes} min</span>
                        <span>{DIFFICULTY_LABELS[drill.difficulty] ?? `Nivå ${drill.difficulty}`}</span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5",
                        isSelected
                          ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                          : "border-[var(--color-grey-300)]"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-grey-200)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--color-grey-200)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          >
            Avbryt
          </button>
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              selected.size > 0
                ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                : "bg-[var(--color-grey-200)] text-[var(--color-muted)] cursor-not-allowed"
            )}
          >
            <Plus className="w-4 h-4" />
            Legg til {selected.size > 0 ? `(${selected.size})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
