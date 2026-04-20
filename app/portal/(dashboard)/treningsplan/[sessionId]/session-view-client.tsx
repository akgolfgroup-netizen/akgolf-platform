"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingSessionData, ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import { SessionView } from "@/components/portal/treningsplan";
import { saveSessionProgress } from "../actions";

interface Props {
  session: TrainingSessionData;
}

export function SessionViewClient({ session }: Props) {
  const router = useRouter();
  const [currentSession] = useState<TrainingSessionData>(session);

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

  return (
    <SessionView
      session={currentSession}
      onBack={handleBack}
      onSaveProgress={handleSaveProgress}
      editable
    />
  );
}
