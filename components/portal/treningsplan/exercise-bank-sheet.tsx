"use client";

import { useState, useMemo, useEffect, useId } from "react";
import {
  X,
  Search,
  Plus,
  Star,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";
import type { ExerciseDefinition, ExerciseBankEntry } from "@/lib/portal/golf/exercise-types";
import { DRILL_LIBRARY, WARMUP_EXERCISES } from "@/lib/portal/golf/exercise-types";
import {
  PYRAMID_LEVELS,
  TRAINING_AREAS,
  type PyramidLevel,
  type TrainingArea,
} from "@/lib/portal/golf/ak-formula";
import { PyramidTag, AreaTag } from "./ak-formula-tags";

interface ExerciseBankSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseDefinition) => void;
  onCreateNew?: () => void;
  userBank?: ExerciseBankEntry[];
}

export function ExerciseBankSheet({
  isOpen,
  onClose,
  onSelectExercise,
  onCreateNew,
  userBank = [],
}: ExerciseBankSheetProps) {
  const titleId = useId();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Escape key to close sheet
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const [selectedPyramid, setSelectedPyramid] = useState<PyramidLevel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"FULL_SWING" | "SHORT_GAME" | "PUTTING" | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "recent">("all");

  // Combine all exercises
  const allExercises = useMemo(() => {
    return [...WARMUP_EXERCISES, ...DRILL_LIBRARY];
  }, []);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    let exercises = allExercises;

    // Tab filter
    if (activeTab === "favorites") {
      const favoriteIds = userBank.filter((e) => e.isFavorite).map((e) => e.exercise.id);
      exercises = exercises.filter((e) => favoriteIds.includes(e.id));
    } else if (activeTab === "recent") {
      const recentIds = userBank
        .filter((e) => e.lastUsedAt)
        .sort((a, b) => new Date(b.lastUsedAt!).getTime() - new Date(a.lastUsedAt!).getTime())
        .slice(0, 10)
        .map((e) => e.exercise.id);
      exercises = exercises.filter((e) => recentIds.includes(e.id));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      exercises = exercises.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query) ||
          e.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Pyramid filter
    if (selectedPyramid) {
      exercises = exercises.filter((e) => e.pyramid === selectedPyramid);
    }

    // Category filter
    if (selectedCategory) {
      exercises = exercises.filter((e) => {
        const areaData = TRAINING_AREAS[e.area as TrainingArea];
        return areaData?.category === selectedCategory;
      });
    }

    return exercises;
  }, [allExercises, searchQuery, selectedPyramid, selectedCategory, activeTab, userBank]);

  // Group by category
  const groupedExercises = useMemo(() => {
    const groups: Record<string, ExerciseDefinition[]> = {};
    filteredExercises.forEach((exercise) => {
      const areaData = TRAINING_AREAS[exercise.area as TrainingArea];
      const category = areaData?.category || "OTHER";
      if (!groups[category]) groups[category] = [];
      groups[category].push(exercise);
    });
    return groups;
  }, [filteredExercises]);

  const categoryLabels: Record<string, string> = {
    FULL_SWING: "Full Swing",
    SHORT_GAME: "Naerspill",
    PUTTING: "Putting",
    OTHER: "Andre",
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-[var(--color-grey-200)] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-grey-200)]">
          <h2 id={titleId} className="text-lg font-semibold text-[var(--color-grey-900)]">Ovelsebank</h2>
          <button
            onClick={onClose}
            aria-label="Lukk øvelsebank"
            className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--color-grey-200)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-500)]" aria-hidden="true" />
            <input
              type="text"
              placeholder="Sok etter ovelser..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] placeholder-[var(--color-grey-400)] focus:outline-none focus:border-[var(--color-grey-900)]"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-3">
            {(["all", "favorites", "recent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  activeTab === tab
                    ? "bg-[var(--color-grey-900)] text-white"
                    : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
                }`}
              >
                {tab === "all" ? "Alle" : tab === "favorites" ? "Favoritter" : "Nylige"}
              </button>
            ))}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mt-3 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filtrer
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 space-y-3">
              {/* Pyramid filter */}
              <div>
                <p className="text-[11px] text-[var(--color-grey-500)] uppercase mb-2">Pyramide-niva</p>
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(PYRAMID_LEVELS) as PyramidLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedPyramid(selectedPyramid === level ? null : level)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        selectedPyramid === level
                          ? "text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
                      }`}
                      style={{
                        backgroundColor:
                          selectedPyramid === level ? PYRAMID_LEVELS[level].color : undefined,
                      }}
                    >
                      {PYRAMID_LEVELS[level].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div>
                <p className="text-[11px] text-[var(--color-grey-500)] uppercase mb-2">Kategori</p>
                <div className="flex flex-wrap gap-1">
                  {(["FULL_SWING", "SHORT_GAME", "PUTTING"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        selectedCategory === cat
                          ? "bg-[var(--color-grey-900)] text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {Object.entries(groupedExercises).map(([category, exercises]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-[var(--color-grey-500)] uppercase mb-2">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-2">
                {exercises.map((exercise) => {
                  const bankEntry = userBank.find((e) => e.exercise.id === exercise.id);
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => onSelectExercise(exercise)}
                      className="w-full text-left p-3 rounded-lg bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] hover:border-[var(--color-grey-900)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[var(--color-grey-900)] truncate">
                              {exercise.name}
                            </span>
                            {bankEntry?.isFavorite && (
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--color-grey-500)] line-clamp-2 mb-2">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <PyramidTag level={exercise.pyramid as PyramidLevel} />
                            <AreaTag area={exercise.area as TrainingArea} />
                            <span className="text-[11px] text-[var(--color-grey-400)] flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              {exercise.minDurationMinutes}-{exercise.maxDurationMinutes} min
                            </span>
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-[var(--color-grey-500)] flex-shrink-0" aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--color-grey-500)]">Ingen ovelser funnet</p>
            </div>
          )}
        </div>

        {/* Create new button */}
        {onCreateNew && (
          <div className="p-4 border-t border-[var(--color-grey-200)]">
            <button
              onClick={onCreateNew}
              className="w-full py-3 rounded-lg border border-dashed border-[var(--color-grey-200)] text-[var(--color-grey-500)] hover:border-[var(--color-grey-900)] hover:text-[var(--color-grey-900)] transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Opprett ny ovelse
            </button>
          </div>
        )}
      </div>
    </>
  );
}
