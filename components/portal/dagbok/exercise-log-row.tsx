"use client";

import { X } from "lucide-react";
import {
  L_PHASES,
  M_ENVIRONMENTS,
  PR_LEVELS,
  CS_LEVELS,
  type LPhase,
  type MEnvironment,
  type PRLevel,
} from "@/lib/portal/golf/ak-formula";

export interface ExerciseLogData {
  id: string;
  exerciseName: string;
  plannedSets?: number;
  plannedReps?: number;
  actualSets?: number;
  actualReps?: number;
  lPhase?: LPhase;
  mEnvironment?: MEnvironment;
  prLevel?: PRLevel;
  clubSpeed?: number;
  score?: number;
  notes?: string;
}

interface ExerciseLogRowProps {
  data: ExerciseLogData;
  onChange: (data: ExerciseLogData) => void;
  onRemove: () => void;
}

export function ExerciseLogRow({ data, onChange, onRemove }: ExerciseLogRowProps) {
  function updateField<K extends keyof ExerciseLogData>(
    field: K,
    value: ExerciseLogData[K]
  ) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{
        background: "var(--color-grey-100)",
        border: "1px solid var(--color-grey-200)",
      }}
    >
      {/* Header med navn og fjern-knapp */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-grey-900)]">
          {data.exerciseName}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[var(--color-grey-400)]/50 hover:text-[var(--color-grey-900)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Planlagt vs Faktisk */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
            Planlagt (sets/reps)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={data.plannedSets ?? ""}
              onChange={(e) =>
                updateField("plannedSets", e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Sets"
              min={1}
              max={99}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
              style={{ borderColor: "var(--color-grey-200)" }}
            />
            <input
              type="number"
              value={data.plannedReps ?? ""}
              onChange={(e) =>
                updateField("plannedReps", e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Reps"
              min={1}
              max={999}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
              style={{ borderColor: "var(--color-grey-200)" }}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
            Faktisk (sets/reps)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={data.actualSets ?? ""}
              onChange={(e) =>
                updateField("actualSets", e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Sets"
              min={1}
              max={99}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
              style={{ borderColor: "var(--color-grey-200)" }}
            />
            <input
              type="number"
              value={data.actualReps ?? ""}
              onChange={(e) =>
                updateField("actualReps", e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Reps"
              min={1}
              max={999}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
              style={{ borderColor: "var(--color-grey-200)" }}
            />
          </div>
        </div>
      </div>

      {/* L-fase selector */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
          L-fase (Laeringsfokus)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(L_PHASES) as LPhase[]).map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => updateField("lPhase", data.lPhase === phase ? undefined : phase)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: data.lPhase === phase ? "var(--color-grey-200)" : "white",
                borderColor: data.lPhase === phase ? "var(--color-grey-900)" : "var(--color-grey-200)",
                color: data.lPhase === phase ? "var(--color-grey-900)" : "var(--color-grey-500)",
              }}
            >
              {L_PHASES[phase].name}
            </button>
          ))}
        </div>
      </div>

      {/* M-miljo selector */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
          M-miljo (Treningskontekst)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(M_ENVIRONMENTS) as unknown as MEnvironment[]).map((envKey) => {
            const env = M_ENVIRONMENTS[envKey];
            return (
              <button
                key={envKey}
                type="button"
                onClick={() => updateField("mEnvironment", data.mEnvironment === envKey ? undefined : envKey)}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                style={{
                  background: data.mEnvironment === envKey ? "var(--color-grey-200)" : "white",
                  borderColor: data.mEnvironment === envKey ? "var(--color-grey-900)" : "var(--color-grey-200)",
                  color: data.mEnvironment === envKey ? "var(--color-grey-900)" : "var(--color-grey-500)",
                }}
              >
                {env.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PR-press selector */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
          PR-press (Stressniva)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(PR_LEVELS) as unknown as PRLevel[]).map((prKey) => {
            const pr = PR_LEVELS[prKey];
            return (
              <button
                key={prKey}
                type="button"
                onClick={() => updateField("prLevel", data.prLevel === prKey ? undefined : prKey)}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                style={{
                  background: data.prLevel === prKey ? "var(--color-grey-200)" : "white",
                  borderColor: data.prLevel === prKey ? "var(--color-grey-900)" : "var(--color-grey-200)",
                  color: data.prLevel === prKey ? "var(--color-grey-900)" : "var(--color-grey-500)",
                }}
              >
                {pr.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Club Speed selector */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
          Club Speed (CS)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CS_LEVELS.map((cs) => (
            <button
              key={cs.value}
              type="button"
              onClick={() => updateField("clubSpeed", data.clubSpeed === cs.value ? undefined : cs.value)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: data.clubSpeed === cs.value ? "var(--color-grey-200)" : "white",
                borderColor: data.clubSpeed === cs.value ? "var(--color-grey-900)" : "var(--color-grey-200)",
                color: data.clubSpeed === cs.value ? "var(--color-grey-900)" : "var(--color-grey-500)",
              }}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>

      {/* Score slider (1-10) */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
          Score ({data.score ?? "-"}/10)
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={data.score ?? 5}
          onChange={(e) => updateField("score", Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-grey-900) 0%, var(--color-grey-900) ${((data.score ?? 5) - 1) * 11.11}%, var(--color-grey-200) ${((data.score ?? 5) - 1) * 11.11}%, var(--color-grey-200) 100%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-[var(--color-grey-400)] mt-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* Notater */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
          Notater
        </label>
        <textarea
          value={data.notes ?? ""}
          onChange={(e) => updateField("notes", e.target.value || undefined)}
          rows={2}
          placeholder="Hva gikk bra? Hva kan forbedres?"
          className="w-full px-3 py-2 rounded-lg text-sm bg-white border outline-none resize-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
          style={{ borderColor: "var(--color-grey-200)" }}
        />
      </div>
    </div>
  );
}
