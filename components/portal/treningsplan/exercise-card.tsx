"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

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
          ? "bg-success/5 border-success/30"
          : isActive
          ? "bg-white border-primary ring-1 ring-primary/20 shadow-sm"
          : "bg-white border-grey-200/50 hover:border-grey-200"
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
            <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center">
              <Icon name="check" className="w-4 h-4 text-success" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-sm font-medium text-grey-400">
              {index + 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-medium ${exercise.completed ? "text-grey-400" : "text-black"}`}>
              {exercise.name}
            </h4>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-grey-400">
            {exercise.sets && exercise.reps && (
              <span className="flex items-center gap-1">
                <Icon name="fitness_center" className="w-3 h-3" />
                {exercise.sets}x{exercise.reps}
              </span>
            )}
            {exercise.distance && (
              <span className="flex items-center gap-1">
                <Icon name="my_location" className="w-3 h-3" />
                {exercise.distance}{exercise.distanceUnit || "m"}
              </span>
            )}
            {exercise.restSeconds && (
              <span className="flex items-center gap-1">
                <Icon name="schedule" className="w-3 h-3" />
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
              className="p-2 rounded-lg bg-primary text-white hover:bg-primary-alt transition-colors"
            >
              <Icon name="play_arrow" className="w-4 h-4" />
            </button>
          )}
          {isExpanded ? (
            <Icon name="expand_less" className="w-4 h-4 text-grey-400" />
          ) : (
            <Icon name="expand_more" className="w-4 h-4 text-grey-400" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-grey-200/30 mt-0">
          <div className="pt-3 space-y-3">
            {/* AK-formelen */}
            <div>
              <p className="text-[11px] text-grey-400 uppercase mb-1.5">Kategorisering</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <SessionIdDisplay
                  pyramid={exercise.pyramid}
                  area={exercise.area}
                  lPhase={exercise.lPhase}
                  compact
                />
                <Icon name="sports_golf"SpeedTag cs={exercise.clubSpeed} />
                <EnvironmentTag env={exercise.environment} />
                <PressTag press={exercise.pressLevel} />
              </div>
            </div>

            {/* Description */}
            {exercise.description && (
              <div>
                <p className="text-[11px] text-grey-400 uppercase mb-1">Beskrivelse</p>
                <p className="text-sm text-text">{exercise.description}</p>
              </div>
            )}

            {/* Success criteria */}
            {exercise.successCriteria && (
              <div>
                <p className="text-[11px] text-grey-400 uppercase mb-1">Malkriterier</p>
                <p className="text-sm text-text">{exercise.successCriteria}</p>
              </div>
            )}

            {/* Tempo */}
            {exercise.tempo && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-grey-400 uppercase">Tempo:</span>
                <span className="text-sm text-black font-mono">{exercise.tempo}</span>
              </div>
            )}

            {/* Coach notes */}
            {exercise.coachNotes && (
              <div className="p-2 rounded-lg bg-surface border border-grey-200/30">
                <div className="flex items-center gap-1 mb-1">
                  <Icon name="chat" className="w-3 h-3 text-primary" />
                  <span className="text-[11px] text-primary uppercase">Coach-notat</span>
                </div>
                <p className="text-sm text-text">{exercise.coachNotes}</p>
              </div>
            )}

            {/* Editable completion */}
            {editable && !exercise.completed && (
              <div className="pt-2 border-t border-grey-200/30 space-y-3">
                {/* Actual reps */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-text">Faktiske reps</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActualReps(Math.max(0, actualReps - 1))}
                      className="w-8 h-8 rounded-lg bg-surface text-black hover:bg-grey-200 font-medium"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-black font-medium">{actualReps}</span>
                    <button
                      onClick={() => setActualReps(actualReps + 1)}
                      className="w-8 h-8 rounded-lg bg-surface text-black hover:bg-grey-200 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-text">Kvalitet</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRating(r as 1 | 2 | 3 | 4 | 5)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          r === rating
                            ? "bg-primary text-white"
                            : "bg-surface text-grey-400 hover:bg-grey-200"
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
                  className="w-full py-2 rounded-xl bg-success/10 text-success font-semibold hover:bg-success/20 transition-colors"
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
