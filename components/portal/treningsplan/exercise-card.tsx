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
      className={`rounded-lg border transition-all ${
        exercise.completed
          ? "bg-green-500/5 border-green-500/30"
          : isActive
          ? "bg-[var(--color-grey-900)]/5 border-[var(--color-grey-900)]/50 ring-1 ring-[var(--color-grey-900)]/30"
          : "bg-[#1a1a1a] border-[#333] hover:border-[#444]"
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
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-400" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center text-sm font-medium text-[#737373]">
              {index + 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-medium ${exercise.completed ? "text-[#737373]" : "text-white"}`}>
              {exercise.name}
            </h4>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#737373]">
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
              className="p-2 rounded-lg bg-[var(--color-black)] text-white hover:bg-[var(--color-grey-900)] transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#737373]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#737373]" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-[#333] mt-0">
          <div className="pt-3 space-y-3">
            {/* AK-formelen */}
            <div>
              <p className="text-[11px] text-[#737373] uppercase mb-1.5">Kategorisering</p>
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
                <p className="text-[11px] text-[#737373] uppercase mb-1">Beskrivelse</p>
                <p className="text-sm text-[#A3A3A3]">{exercise.description}</p>
              </div>
            )}

            {/* Success criteria */}
            {exercise.successCriteria && (
              <div>
                <p className="text-[11px] text-[#737373] uppercase mb-1">Malkriterier</p>
                <p className="text-sm text-[#A3A3A3]">{exercise.successCriteria}</p>
              </div>
            )}

            {/* Tempo */}
            {exercise.tempo && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#737373] uppercase">Tempo:</span>
                <span className="text-sm text-white font-mono">{exercise.tempo}</span>
              </div>
            )}

            {/* Coach notes */}
            {exercise.coachNotes && (
              <div className="p-2 rounded-lg bg-[#262626] border border-[#333]">
                <div className="flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3 h-3 text-[var(--color-grey-900)]" />
                  <span className="text-[11px] text-[var(--color-grey-900)] uppercase">Coach-notat</span>
                </div>
                <p className="text-sm text-[#A3A3A3]">{exercise.coachNotes}</p>
              </div>
            )}

            {/* Editable completion */}
            {editable && !exercise.completed && (
              <div className="pt-2 border-t border-[#333] space-y-3">
                {/* Actual reps */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#A3A3A3]">Faktiske reps</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActualReps(Math.max(0, actualReps - 1))}
                      className="w-8 h-8 rounded bg-[#262626] text-white hover:bg-[#333]"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-white font-medium">{actualReps}</span>
                    <button
                      onClick={() => setActualReps(actualReps + 1)}
                      className="w-8 h-8 rounded bg-[#262626] text-white hover:bg-[#333]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#A3A3A3]">Kvalitet</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRating(r as 1 | 2 | 3 | 4 | 5)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          r === rating
                            ? "bg-[var(--color-grey-900)] text-white"
                            : "bg-[#262626] text-[#737373] hover:bg-[#333]"
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
                  className="w-full py-2 rounded-lg bg-green-500/20 text-green-400 font-medium hover:bg-green-500/30 transition-colors"
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
