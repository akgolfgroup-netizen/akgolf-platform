"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingSessionData, ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import { SessionView, ExerciseBankSheet } from "@/components/portal/treningsplan";
import type { ExerciseDefinition } from "@/lib/portal/golf/exercise-types";

interface Props {
  session: TrainingSessionData;
}

export function SessionViewClient({ session }: Props) {
  const router = useRouter();
  const [showExerciseBank, setShowExerciseBank] = useState(false);

  const handleBack = () => {
    router.push("/portal/treningsplan");
  };

  const handleSaveProgress = async (exercises: ExerciseInstance[]) => {
    // TODO: Save to database
    console.log("Saving progress:", exercises);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleAddExercise = () => {
    setShowExerciseBank(true);
  };

  const handleSelectExercise = (exercise: ExerciseDefinition) => {
    // TODO: Add exercise to session
    console.log("Selected exercise:", exercise);
    setShowExerciseBank(false);
  };

  return (
    <>
      <SessionView
        session={session}
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
