"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Save, RotateCcw } from "lucide-react";
import type { TrainingSessionData, ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import { SessionHeader } from "./session-header";
import { ExerciseCard } from "./exercise-card";

interface SessionViewProps {
  session: TrainingSessionData;
  onBack?: () => void;
  onSaveProgress?: (exercises: ExerciseInstance[]) => Promise<void>;
  onAddExercise?: () => void;
  editable?: boolean;
}

export function SessionView({
  session,
  onBack,
  onSaveProgress,
  onAddExercise,
  editable = false,
}: SessionViewProps) {
  const [isActive, setIsActive] = useState(false);
  const [exercises, setExercises] = useState<ExerciseInstance[]>([
    ...(session.warmup || []),
    ...session.mainBlock,
    ...(session.cooldown || []),
  ]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const completedCount = exercises.filter((e) => e.completed).length;
  const totalExercises = exercises.length;

  const handleStartSession = () => {
    setIsActive(true);
    setActiveExerciseIndex(0);
  };

  const handleCompleteExercise = async (
    exerciseId: string,
    data: { actualReps?: number; rating?: number }
  ) => {
    const rating = data.rating as 1 | 2 | 3 | 4 | 5 | undefined;
    const updatedExercises = exercises.map((e): ExerciseInstance =>
      e.id === exerciseId
        ? { ...e, completed: true, actualReps: data.actualReps, rating }
        : e
    );
    setExercises(updatedExercises);

    // Move to next exercise
    const currentIndex = exercises.findIndex((e) => e.id === exerciseId);
    if (currentIndex < exercises.length - 1) {
      setActiveExerciseIndex(currentIndex + 1);
    }

    // Auto-save progress
    if (onSaveProgress) {
      setIsSaving(true);
      try {
        await onSaveProgress(updatedExercises);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleResetSession = () => {
    setExercises(
      exercises.map((e): ExerciseInstance => ({
        ...e,
        completed: false,
        actualReps: undefined,
        rating: undefined,
      }))
    );
    setActiveExerciseIndex(0);
    setIsActive(false);
  };

  // Separate exercises by type
  const warmupExercises = session.warmup || [];
  const mainExercises = session.mainBlock;
  const cooldownExercises = session.cooldown || [];

  const getExerciseState = (exercise: ExerciseInstance) => {
    const updatedExercise = exercises.find((e) => e.id === exercise.id);
    return {
      ...exercise,
      ...updatedExercise,
    };
  };

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til treningsplan
        </button>
      )}

      {/* Session header */}
      <SessionHeader
        session={session}
        onStartSession={handleStartSession}
        isActive={isActive}
        completedCount={completedCount}
        totalExercises={totalExercises}
      />

      {/* Exercise sections */}
      <div className="space-y-6">
        {/* Warmup */}
        {warmupExercises.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#737373] uppercase">Oppvarming</h3>
              <span className="text-xs text-[#525252]">{warmupExercises.length} ovelser</span>
            </div>
            <div className="space-y-2">
              {warmupExercises.map((exercise) => {
                const idx = globalIndex++;
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={getExerciseState(exercise)}
                    index={idx}
                    isActive={isActive && idx === activeExerciseIndex}
                    onComplete={handleCompleteExercise}
                    editable={editable && isActive}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Main block */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#737373] uppercase">Hovedblokk</h3>
            <span className="text-xs text-[#525252]">{mainExercises.length} ovelser</span>
          </div>
          <div className="space-y-2">
            {mainExercises.map((exercise) => {
              const idx = globalIndex++;
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={getExerciseState(exercise)}
                  index={idx}
                  isActive={isActive && idx === activeExerciseIndex}
                  onComplete={handleCompleteExercise}
                  editable={editable && isActive}
                />
              );
            })}
          </div>

          {/* Add exercise button */}
          {editable && onAddExercise && (
            <button
              onClick={onAddExercise}
              className="mt-3 w-full py-3 rounded-lg border border-dashed border-[#333] text-[#737373] hover:border-[var(--color-grey-900)] hover:text-[var(--color-grey-900)] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Legg til ovelse
            </button>
          )}
        </div>

        {/* Cooldown */}
        {cooldownExercises.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#737373] uppercase">Avslutning</h3>
              <span className="text-xs text-[#525252]">{cooldownExercises.length} ovelser</span>
            </div>
            <div className="space-y-2">
              {cooldownExercises.map((exercise) => {
                const idx = globalIndex++;
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={getExerciseState(exercise)}
                    index={idx}
                    isActive={isActive && idx === activeExerciseIndex}
                    onComplete={handleCompleteExercise}
                    editable={editable && isActive}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {isActive && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a] border border-[#333]">
          <button
            onClick={handleResetSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#737373] hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Nullstill
          </button>

          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-sm text-[#737373]">Lagrer...</span>
            )}

            {completedCount === totalExercises && (
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-sm font-medium">Okt fullfort!</span>
              </div>
            )}

            {onSaveProgress && (
              <button
                onClick={() => onSaveProgress(exercises)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-black)] text-white font-medium hover:bg-[var(--color-grey-900)] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Lagre
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
