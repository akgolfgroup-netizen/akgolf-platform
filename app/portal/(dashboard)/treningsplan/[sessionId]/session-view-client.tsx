"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingSessionData, ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import { SessionView, ExerciseBankSheet } from "@/components/portal/treningsplan";
import type { ExerciseDefinition } from "@/lib/portal/golf/exercise-types";
import { saveSessionProgress, addExerciseToSession } from "../actions";

interface Props {
  session: TrainingSessionData;
}

export function SessionViewClient({ session }: Props) {
  const router = useRouter();
  const [showExerciseBank, setShowExerciseBank] = useState(false);
  const [currentSession, setCurrentSession] = useState<TrainingSessionData>(session);

  const handleBack = () => {
    router.push("/portal/treningsplan");
  };

  const handleSaveProgress = async (exercises: ExerciseInstance[]) => {
    await saveSessionProgress(
      session.id,
      exercises.map((e) => ({
        id: e.id,
        exerciseId: e.exerciseId,
        name: e.name,
        completed: e.completed,
        actualReps: e.actualReps,
        actualScore: e.actualScore,
        rating: e.rating,
        sets: e.sets,
        reps: e.reps,
        lPhase: e.lPhase,
        clubSpeed: e.clubSpeed,
        environment: e.environment,
        pressLevel: e.pressLevel,
        playerNotes: e.playerNotes,
      }))
    );
  };

  const handleAddExercise = () => {
    setShowExerciseBank(true);
  };

  const handleSelectExercise = async (exercise: ExerciseDefinition) => {
    setShowExerciseBank(false);

    // Add to database
    await addExerciseToSession(session.id, {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      pyramid: exercise.pyramid,
      area: exercise.area,
      lPhase: exercise.lPhase,
    });

    // Add to local state so UI updates immediately
    const newInstance: ExerciseInstance = {
      id: `exercise-${Date.now()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      description: exercise.description,
      pyramid: exercise.pyramid,
      area: exercise.area,
      lPhase: exercise.lPhase ?? "BALL",
      clubSpeed: 50,
      environment: 2 as const,
      pressLevel: 2 as const,
      completed: false,
    };

    setCurrentSession((prev) => ({
      ...prev,
      mainBlock: [...prev.mainBlock, newInstance],
    }));
  };

  return (
    <>
      <SessionView
        session={currentSession}
        onBack={handleBack}
        onSaveProgress={handleSaveProgress}
        onAddExercise={handleAddExercise}
        editable
      />

      <ExerciseBankSheet
        isOpen={showExerciseBank}
        onClose={() => setShowExerciseBank(false)}
        onSelectExercise={handleSelectExercise}
      />
    </>
  );
}
