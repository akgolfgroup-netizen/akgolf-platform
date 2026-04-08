"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  Target,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Play,
  MessageSquare,
} from "lucide-react";
import type { ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import { SessionIdDisplay, ClubSpeedTag, EnvironmentTag, PressTag } from "./ak-formula-tags";

interface ExerciseCardProps {
  exercise: ExerciseInstance;
  index: number;
  isActive?: boolean;
  onComplete?: (exerciseId: string, data: { actualReps?: number; rating?: number }) => void;
  onStart?: (exerciseId: string) => void;
  editable?: boolean;
}

export function ExerciseCard({
  exercise,
  index,
  isActive = false,
  onComplete,
  onStart,
  editable = false,
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const [actualReps, setActualReps] = useState(exercise.actualReps ?? exercise.reps ?? 0);
  const [rating, setRating] = useState(exercise.rating ?? 3);

  const handleComplete = () => {
    onComplete?.(exercise.id, { actualReps, rating });
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        exercise.completed
          ? "bg-[#22c55e]/5 border-[#22c55e]/30"
          : isActive
          ? "bg-white border-[#154212] ring-1 ring-[#154212]/20 shadow-sm"
          : "bg-white border-[#c2c9bb]/50 hover:border-[#c2c9bb]"
      }`}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Index / Checkbox */}
        <div className="flex-shrink-0">
          {exercise.completed ? (
            <div className="w-7 h-7 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-[#22c55e]" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#f7f3ea] flex items-center justify-center text-sm font-medium text-[#6b7366]">
              {index + 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-medium ${exercise.completed ? "text-[#6b7366]" : "text-[#1c1c16]"}`}>
              {exercise.name}
            </h4>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6b7366]">
            {exercise.sets && exercise.reps && (
              <span className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                {exercise.sets}x{exercise.reps}
              </span>
            )}
            {exercise.distance && (
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {exercise.distance}{exercise.distanceUnit || "m"}
              </span>
            )}
            {exercise.restSeconds && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {exercise.restSeconds}s hvile
              </span>
            )}
          </div>
        </div>

        {/* Action / Expand */}
        <div className="flex items-center gap-2">
          {isActive && !exercise.completed && onStart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart(exercise.id);
              }}
              className="p-2 rounded-lg bg-[#154212] text-white hover:bg-[#0d2e0c] transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#6b7366]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6b7366]" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-[#c2c9bb]/30 mt-0">
          <div className="pt-3 space-y-3">
            {/* AK-formelen */}
            <div>
              <p className="text-[11px] text-[#6b7366] uppercase mb-1.5">Kategorisering</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <SessionIdDisplay
                  pyramid={exercise.pyramid}
                  area={exercise.area}
                  lPhase={exercise.lPhase}
                  compact
                />
                <ClubSpeedTag cs={exercise.clubSpeed} />
                <EnvironmentTag env={exercise.environment} />
                <PressTag press={exercise.pressLevel} />
              </div>
            </div>

            {/* Description */}
            {exercise.description && (
              <div>
                <p className="text-[11px] text-[#6b7366] uppercase mb-1">Beskrivelse</p>
                <p className="text-sm text-[#42493e]">{exercise.description}</p>
              </div>
            )}

            {/* Success criteria */}
            {exercise.successCriteria && (
              <div>
                <p className="text-[11px] text-[#6b7366] uppercase mb-1">Malkriterier</p>
                <p className="text-sm text-[#42493e]">{exercise.successCriteria}</p>
              </div>
            )}

            {/* Tempo */}
            {exercise.tempo && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#6b7366] uppercase">Tempo:</span>
                <span className="text-sm text-[#1c1c16] font-mono">{exercise.tempo}</span>
              </div>
            )}

            {/* Coach notes */}
            {exercise.coachNotes && (
              <div className="p-2 rounded-lg bg-[#f7f3ea] border border-[#c2c9bb]/30">
                <div className="flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3 h-3 text-[#154212]" />
                  <span className="text-[11px] text-[#154212] uppercase">Coach-notat</span>
                </div>
                <p className="text-sm text-[#42493e]">{exercise.coachNotes}</p>
              </div>
            )}

            {/* Editable completion */}
            {editable && !exercise.completed && (
              <div className="pt-2 border-t border-[#c2c9bb]/30 space-y-3">
                {/* Actual reps */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#42493e]">Faktiske reps</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActualReps(Math.max(0, actualReps - 1))}
                      className="w-8 h-8 rounded-lg bg-[#f7f3ea] text-[#1c1c16] hover:bg-[#e8e4db] font-medium"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-[#1c1c16] font-medium">{actualReps}</span>
                    <button
                      onClick={() => setActualReps(actualReps + 1)}
                      className="w-8 h-8 rounded-lg bg-[#f7f3ea] text-[#1c1c16] hover:bg-[#e8e4db] font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#42493e]">Kvalitet</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRating(r as 1 | 2 | 3 | 4 | 5)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          r === rating
                            ? "bg-[#154212] text-white"
                            : "bg-[#f7f3ea] text-[#6b7366] hover:bg-[#e8e4db]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complete button */}
                <button
                  onClick={handleComplete}
                  className="w-full py-2 rounded-xl bg-[#22c55e]/10 text-[#22c55e] font-semibold hover:bg-[#22c55e]/20 transition-colors"
                >
                  Marker som fullfort
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
