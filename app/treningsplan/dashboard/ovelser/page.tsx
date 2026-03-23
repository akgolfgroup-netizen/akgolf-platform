"use client";

import { useState, useMemo } from "react";
import { usePlan } from "@/components/dashboard/DashboardShell";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
import { ExerciseFilter } from "@/components/dashboard/ExerciseFilter";

export default function OvelserPage() {
  const { plan } = usePlan();
  const [level, setLevel] = useState("Alle");
  const [difficulty, setDifficulty] = useState("Alle");

  const filtered = useMemo(() => {
    return plan.exercises.filter((ex) => {
      if (level !== "Alle" && ex.pyramidLevel !== level) return false;
      if (difficulty !== "Alle" && ex.difficulty !== difficulty) return false;
      return true;
    });
  }, [plan.exercises, level, difficulty]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="w-heading-md mb-1">Ovelsesbibliotek</h1>
        <p className="text-sm text-ink-50">
          {plan.exercises.length} ovelser tilpasset din kategori og dine
          fasiliteter.
        </p>
      </div>

      <ExerciseFilter
        level={level}
        difficulty={difficulty}
        onLevelChange={setLevel}
        onDifficultyChange={setDifficulty}
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-50 text-center py-12">
          Ingen ovelser matcher filteret.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.name} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
