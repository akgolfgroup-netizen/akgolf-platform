"use client";

import { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
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
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-[#333] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-lg font-semibold text-white">Ovelsebank</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#262626] text-[#737373] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#333]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              type="text"
              placeholder="Sok etter ovelser..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white placeholder-[#525252] focus:outline-none focus:border-[#B07D4F]"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-3">
            {(["all", "favorites", "recent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#B07D4F] text-white"
                    : "bg-[#1a1a1a] text-[#737373] hover:text-white"
                }`}
              >
                {tab === "all" ? "Alle" : tab === "favorites" ? "Favoritter" : "Nylige"}
              </button>
            ))}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mt-3 text-sm text-[#737373] hover:text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtrer
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 space-y-3">
              {/* Pyramid filter */}
              <div>
                <p className="text-[11px] text-[#737373] uppercase mb-2">Pyramide-niva</p>
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(PYRAMID_LEVELS) as PyramidLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedPyramid(selectedPyramid === level ? null : level)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedPyramid === level
                          ? "text-white"
                          : "bg-[#262626] text-[#737373] hover:text-white"
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
                <p className="text-[11px] text-[#737373] uppercase mb-2">Kategori</p>
                <div className="flex flex-wrap gap-1">
                  {(["FULL_SWING", "SHORT_GAME", "PUTTING"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#B07D4F] text-white"
                          : "bg-[#262626] text-[#737373] hover:text-white"
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
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedExercises).map(([category, exercises]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-[#737373] uppercase mb-2">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-2">
                {exercises.map((exercise) => {
                  const bankEntry = userBank.find((e) => e.exercise.id === exercise.id);
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => onSelectExercise(exercise)}
                      className="w-full text-left p-3 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#B07D4F] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white truncate">
                              {exercise.name}
                            </span>
                            {bankEntry?.isFavorite && (
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            )}
                          </div>
                          <p className="text-xs text-[#737373] line-clamp-2 mb-2">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <PyramidTag level={exercise.pyramid as PyramidLevel} />
                            <AreaTag area={exercise.area as TrainingArea} />
                            <span className="text-[11px] text-[#525252] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exercise.minDurationMinutes}-{exercise.maxDurationMinutes} min
                            </span>
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-[#737373] flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[#737373]">Ingen ovelser funnet</p>
            </div>
          )}
        </div>

        {/* Create new button */}
        {onCreateNew && (
          <div className="p-4 border-t border-[#333]">
            <button
              onClick={onCreateNew}
              className="w-full py-3 rounded-lg border border-dashed border-[#333] text-[#737373] hover:border-[#B07D4F] hover:text-[#B07D4F] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Opprett ny ovelse
            </button>
          </div>
        )}
      </div>
    </>
  );
}
