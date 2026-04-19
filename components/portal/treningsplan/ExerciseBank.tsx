"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { StandardTemplate } from "./types";
import { PyramidLevel } from "@/lib/portal/golf/ak-formula";

interface ExerciseBankProps {
  selectedFilter: string | null;
  onAddSession: (template: StandardTemplate) => void;
}

interface Exercise {
  id: string;
  name: string;
  pyramid: PyramidLevel;
  area: string;
  duration: number;
  description?: string;
  isFavorite?: boolean;
}

// Sample exercise data
const EXERCISES: Exercise[] = [
  // FYS - Fysisk
  { id: "ex-fys-1", name: "Kjerneaktivering", pyramid: "FYS", area: "Styrke", duration: 10, description: "Planken, sideplank, bird-dog" },
  { id: "ex-fys-2", name: "Rotasjonsstyrke", pyramid: "FYS", area: "Styrke", duration: 15, description: "Medicine ball kast, roterende plank" },
  { id: "ex-fys-3", name: "Hoftemobilitet", pyramid: "FYS", area: "Mobilitet", duration: 10, description: "90/90 stretch, hip circles" },
  { id: "ex-fys-4", name: "Skulderstabilitet", pyramid: "FYS", area: "Styrke", duration: 8, description: "Resistance band øvelser" },
  { id: "ex-fys-5", name: "Kondisjon", pyramid: "FYS", area: "Kondisjon", duration: 20, description: "Intervalltrening eller langkjøring" },

  // TEK - Teknikk
  { id: "ex-tek-1", name: "Set-up rutine", pyramid: "TEK", area: "Grunnposisjon", duration: 5, description: "Gjenta set-up 20 ganger" },
  { id: "ex-tek-2", name: "Mirror drill", pyramid: "TEK", area: "Svingbane", duration: 15, description: "Sving foran speil uten ball" },
  { id: "ex-tek-3", name: "Pause-drill", pyramid: "TEK", area: "Nedsving", duration: 10, description: "Pause i P6-posisjon" },
  { id: "ex-tek-4", name: "Foot spray analyse", pyramid: "TEK", area: "Treff", duration: 10, description: "Analyser treffpunkt med foot spray" },
  { id: "ex-tek-5", name: "Slow-motion sving", pyramid: "TEK", area: "Tempo", duration: 15, description: "Sving i 20% hastighet" },

  // SLAG - Slagtrening
  { id: "ex-slag-1", name: "Driver treff", pyramid: "SLAG", area: "Tee", duration: 15, description: "Fokus på midttreff" },
  { id: "ex-slag-2", name: "6-jern sekvens", pyramid: "SLAG", area: "Innspill", duration: 20, description: "Systematisk trening med 6-jern" },
  { id: "ex-slag-3", name: "Distansetreff", pyramid: "SLAG", area: "Avstand", duration: 15, description: "Treff 100, 125, 150 meter" },
  { id: "ex-slag-4", name: "Draw/Fade kontroll", pyramid: "SLAG", area: "Ballflykt", duration: 20, description: "Øv på begge ballflykter" },
  { id: "ex-slag-5", name: "Chipping rutine", pyramid: "SLAG", area: "Nærspill", duration: 15, description: "3 ulike slag rundt green" },
  { id: "ex-slag-6", name: "Bunker teknikk", pyramid: "SLAG", area: "Sand", duration: 20, description: "Grunnleggende bunker-slag" },

  // SPILL - Spilltrening
  { id: "ex-spill-1", name: "9-hull simulering", pyramid: "SPILL", area: "Banemanagement", duration: 45, description: "Spill hull på range" },
  { id: "ex-spill-2", name: "Up-and-down", pyramid: "SPILL", area: "Scoring", duration: 30, description: "Scramble fra 9 posisjoner" },
  { id: "ex-spill-3", name: "Tee-strategi", pyramid: "SPILL", area: "Strategi", duration: 20, description: "Planlegg og utfør tee-slag" },
  { id: "ex-spill-4", name: "Lagetrekning", pyramid: "SPILL", area: "Presisjon", duration: 25, description: "Treff bestemte mål på range" },

  // TURN - Turnering
  { id: "ex-turn-1", name: "Pre-shot rutine", pyramid: "TURN", area: "Mental", duration: 15, description: "Systematisk rutine før hvert slag" },
  { id: "ex-turn-2", name: "Pusteteknikk", pyramid: "TURN", area: "Mental", duration: 10, description: "Pusteøvelser under press" },
  { id: "ex-turn-3", name: "Pressure putting", pyramid: "TURN", area: "Konkurranse", duration: 20, description: "Putt med konsekvenser" },
  { id: "ex-turn-4", name: "Scenariospill", pyramid: "TURN", area: "Konkurranse", duration: 30, description: "Simulerte turneringsscenarier" },
];

const FOCUS_COLORS: Record<string, string> = {
  FYS: "#3B82F6",
  TEK: "#16A34A",
  SLAG: "#D4AF37",
  SPILL: "#F97316",
  TURN: "#EF4444",
};

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  FYS: <Icon name="fitness_center" className="w-3 h-3" />,
  TEK: <Icon name="my_location" className="w-3 h-3" />,
  SLAG: <Icon name="sports_golf" className="w-3 h-3" />,
  SPILL: <Icon name="monitoring" className="w-3 h-3" />,
  TURN: <Icon name="emoji_events" className="w-3 h-3" />,
};

export function ExerciseBank({
  selectedFilter,
  onAddSession,
}: ExerciseBankProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Filter exercises based on search and selected pyramid level
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((exercise) => {
      const matchesSearch =
        searchQuery === "" ||
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.area.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        selectedFilter === null || exercise.pyramid === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  // Group exercises by pyramid level
  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {
      FYS: [],
      TEK: [],
      SLAG: [],
      SPILL: [],
      TURN: [],
    };

    filteredExercises.forEach((ex) => {
      groups[ex.pyramid].push(ex);
    });

    return groups;
  }, [filteredExercises]);

  // Favorite exercises
  const favoriteExercises = useMemo(() => {
    return EXERCISES.filter((ex) => favorites.has(ex.id));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, exercise: Exercise) => {
    setDraggedItem(exercise.id);

    // Create a template from the exercise
    const template: StandardTemplate = {
      id: `ex-${exercise.id}`,
      title: exercise.name,
      duration: exercise.duration,
      focus: exercise.pyramid,
      exercises: [{
        id: exercise.id,
        name: exercise.name,
        pyramid: exercise.pyramid,
        area: exercise.area,
      }],
    };

    e.dataTransfer.setData("application/json", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleAddExercise = (exercise: Exercise) => {
    const template: StandardTemplate = {
      id: `ex-${exercise.id}`,
      title: exercise.name,
      duration: exercise.duration,
      focus: exercise.pyramid,
      exercises: [{
        id: exercise.id,
        name: exercise.name,
        pyramid: exercise.pyramid,
        area: exercise.area,
      }],
    };
    onAddSession(template);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Øvelsesbank
      </h3>

      {/* Search */}
      <div className="relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Søk øvelser..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors"
        />
      </div>

      {/* Favorites section */}
      {favoriteExercises.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
            <Icon name="star" className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            Favoritter
          </h4>
          <div className="space-y-1">
            {favoriteExercises.map((exercise) => (
              <ExerciseItem
                key={`fav-${exercise.id}`}
                exercise={exercise}
                isFavorite={true}
                isDragging={draggedItem === exercise.id}
                onToggleFavorite={() => toggleFavorite(exercise.id)}
                onDragStart={(e) => handleDragStart(e, exercise)}
                onDragEnd={handleDragEnd}
                onAdd={() => handleAddExercise(exercise)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filtered exercises by level */}
      {selectedFilter ? (
        // Show single group when filtered
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-500 uppercase">
            {selectedFilter} - {filteredExercises.length} øvelser
          </h4>
          <div className="space-y-1">
            {filteredExercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                isFavorite={favorites.has(exercise.id)}
                isDragging={draggedItem === exercise.id}
                onToggleFavorite={() => toggleFavorite(exercise.id)}
                onDragStart={(e) => handleDragStart(e, exercise)}
                onDragEnd={handleDragEnd}
                onAdd={() => handleAddExercise(exercise)}
              />
            ))}
          </div>
        </div>
      ) : (
        // Show all groups when not filtered
        Object.entries(groupedExercises).map(([level, exercises]) => {
          if (exercises.length === 0) return null;

          return (
            <div key={level} className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: FOCUS_COLORS[level] }}
                />
                {level} ({exercises.length})
              </h4>
              <div className="space-y-1">
                {exercises.map((exercise) => (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    isFavorite={favorites.has(exercise.id)}
                    isDragging={draggedItem === exercise.id}
                    onToggleFavorite={() => toggleFavorite(exercise.id)}
                    onDragStart={(e) => handleDragStart(e, exercise)}
                    onDragEnd={handleDragEnd}
                    onAdd={() => handleAddExercise(exercise)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-4 text-slate-500 text-sm">
          Ingen øvelser funnet
        </div>
      )}
    </div>
  );
}

// Exercise item component
interface ExerciseItemProps {
  exercise: Exercise;
  isFavorite: boolean;
  isDragging: boolean;
  onToggleFavorite: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onAdd: () => void;
}

function ExerciseItem({
  exercise,
  isFavorite,
  isDragging,
  onToggleFavorite,
  onDragStart,
  onDragEnd,
  onAdd,
}: ExerciseItemProps) {
  const color = FOCUS_COLORS[exercise.pyramid];
  const icon = FOCUS_ICONS[exercise.pyramid];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        group relative flex items-center gap-2 p-2 rounded-lg
        cursor-move transition-all duration-200
        ${isDragging
          ? "opacity-50 bg-slate-800/30"
          : "hover:bg-slate-800/50"
        }
      `}
    >
      {/* Drag handle */}
      <Icon name="drag_indicator" className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span style={{ color }}>{icon}</span>
          <span className="text-sm text-slate-300 group-hover:text-slate-200 truncate">
            {exercise.name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-0.5">
            <Icon name="schedule" className="w-3 h-3" />
            {exercise.duration}min
          </span>
          <span>•</span>
          <span>{exercise.area}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`
            p-1 rounded transition-colors
            ${isFavorite
              ? "text-yellow-500 hover:text-yellow-400"
              : "text-slate-600 hover:text-slate-400"
            }
          `}
          aria-label={isFavorite ? "Fjern fra favoritter" : "Legg til favoritter"}
        >
          <Icon name="star" className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="p-1 text-slate-600 hover:text-blue-400 transition-colors"
          aria-label="Legg til økt"
        >
          <Icon name="add" className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Color indicator */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
