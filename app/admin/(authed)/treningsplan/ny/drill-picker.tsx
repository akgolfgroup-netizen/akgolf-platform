"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { AdminInput } from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DrillOption, ManualPlanExercise } from "../actions";

type PyramidLevel = "" | "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

const PYRAMID_LEVELS: Array<{ value: PyramidLevel; label: string }> = [
  { value: "", label: "Alle" },
  { value: "FYS", label: "FYS" },
  { value: "TEK", label: "TEK" },
  { value: "SLAG", label: "SLAG" },
  { value: "SPILL", label: "SPILL" },
  { value: "TURN", label: "TURN" },
];

const PYRAMID_VARIANT: Record<
  Exclude<PyramidLevel, "">,
  "info" | "success" | "warning" | "error" | "muted"
> = {
  FYS: "info",
  TEK: "success",
  SLAG: "warning",
  SPILL: "error",
  TURN: "muted",
};

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
  const [pyramidFilter, setPyramidFilter] = useState<PyramidLevel>("");
  const [selected, setSelected] = useState<Map<string, ManualPlanExercise>>(
    new Map(),
  );

  const filteredDrills = drills.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(q) ||
      d.area.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="admin-card w-full max-w-xl max-h-[80vh] flex flex-col shadow-xl p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-grey-200">
          <div>
            <h3 className="text-base font-semibold text-black">
              Velg øvelser
            </h3>
            <p className="text-xs text-grey-400">
              {selected.size} valgt
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-grey-100 transition-colors"
            aria-label="Lukk"
          >
            <Icon name="close" className="w-5 h-5 text-grey-400" />
          </button>
        </div>

        {/* Search & filters */}
        <div className="px-5 py-3 border-b border-grey-200 space-y-3">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
            <AdminInput
              type="text"
              placeholder="Søk etter øvelse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PYRAMID_LEVELS.map((pl) => (
              <button
                key={pl.value}
                type="button"
                onClick={() => setPyramidFilter(pl.value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors border",
                  pyramidFilter === pl.value
                    ? "bg-black text-white border-black"
                    : "bg-white border-grey-200 text-black hover:bg-grey-100",
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
              <p className="text-sm text-grey-400">
                Ingen øvelser funnet
              </p>
            </div>
          ) : (
            filteredDrills.map((drill) => {
              const isSelected = selected.has(drill.id);
              const pyramidKey = drill.pyramid as Exclude<PyramidLevel, "">;
              const variant = PYRAMID_VARIANT[pyramidKey] ?? "muted";
              return (
                <button
                  key={drill.id}
                  type="button"
                  onClick={() => toggleDrill(drill)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border transition-colors",
                    isSelected
                      ? "border-black bg-black/5"
                      : "border-transparent hover:bg-grey-100",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-black truncate">
                          {drill.name}
                        </p>
                        <Badge variant={variant}>{drill.pyramid}</Badge>
                      </div>
                      {drill.description && (
                        <p className="text-xs text-grey-400 mt-0.5 line-clamp-1">
                          {drill.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-grey-400">
                        <span>{drill.area}</span>
                        <span>
                          {drill.minDurationMinutes}-{drill.maxDurationMinutes} min
                        </span>
                        <span>
                          {DIFFICULTY_LABELS[drill.difficulty] ??
                            `Nivå ${drill.difficulty}`}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5",
                        isSelected
                          ? "bg-black border-black"
                          : "border-grey-300",
                      )}
                    >
                      {isSelected && <Icon name="check" className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-grey-200">
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            variant="accent"
            onClick={handleConfirm}
            disabled={selected.size === 0}
          >
            <Icon name="add" className="w-4 h-4 mr-2" />
            Legg til {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
