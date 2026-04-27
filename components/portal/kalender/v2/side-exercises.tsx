"use client";

import {
  Search,
  Sparkles,
  Clock,
  MapPin,
  Target,
  Repeat,
  Brain,
  GripVertical,
} from "lucide-react";
import {
  LEVEL_COLORS,
  LEVEL_LABELS,
  type ExerciseTemplate,
  type SessionLevel,
} from "./types";

interface SideExercisesProps {
  exercises: ExerciseTemplate[];
  onAcceptAi?: () => void;
  onDismissAi?: () => void;
  aiSuggestion?: { dateLabel: string; reason: string } | null;
}

export function SideExercises({
  exercises,
  onAcceptAi,
  onDismissAi,
  aiSuggestion,
}: SideExercisesProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          style={{ color: "rgba(255,255,255,0.4)" }}
        />
        <input
          placeholder="Søk øvelser, drills, baner …"
          className="w-full rounded-[10px] py-2.5 pl-9 pr-3 text-[13px] outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            fontFamily: "var(--font-inter)",
          }}
        />
      </div>

      {/* AI panel */}
      {aiSuggestion && (
        <div
          className="rounded-[12px] p-3.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(209,248,67,0.10), rgba(209,248,67,0.02))",
            border: "1px solid rgba(209,248,67,0.25)",
          }}
        >
          <div
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] mb-1.5"
            style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <Sparkles className="w-3 h-3" /> AI foreslår for {aiSuggestion.dateLabel}
          </div>
          <div
            className="text-[12px] leading-[1.5]"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            {aiSuggestion.reason}
          </div>
          <div className="flex gap-2 mt-2.5">
            <button
              type="button"
              onClick={onAcceptAi}
              className="flex-1 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{
                background: "#D1F843",
                color: "#0A1F18",
                border: "none",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              Legg inn
            </button>
            <button
              type="button"
              onClick={onDismissAi}
              className="flex-1 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "none",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              Forkast
            </button>
          </div>
        </div>
      )}

      <div
        className="flex justify-between items-center font-mono text-[9px] uppercase tracking-[0.10em]"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        <span>{exercises.length} øvelser · filter: alle</span>
        <button
          type="button"
          className="font-bold"
          style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          Nullstill
        </button>
      </div>

      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} />
      ))}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: ExerciseTemplate }) {
  const colors = LEVEL_COLORS[exercise.level];
  return (
    <div
      className="rounded-[10px] px-3.5 py-3 cursor-grab select-none transition-colors"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${colors.fg}`,
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <div
          className="text-[13px] font-bold leading-[1.3] tracking-[-0.01em] text-white"
        >
          {exercise.title}
        </div>
        <span
          className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded ml-2 shrink-0"
          style={{
            background: colors.bg,
            color: colors.fg,
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {LEVEL_LABELS[exercise.level]}
        </span>
      </div>
      <div
        className="font-mono text-[10px] flex gap-3 mt-1.5"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        <MetaSpan icon="clock" text={exercise.durationLabel} />
        <MetaSpan icon="pin" text={exercise.location} />
        <MetaSpan icon="target" text={exercise.detail} />
      </div>
      <div
        className="font-mono text-[9px] tracking-[0.06em] mt-1.5 flex items-center gap-1.5"
        style={{
          color: "rgba(255,255,255,0.30)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        <GripVertical className="w-2.5 h-2.5 opacity-80" />
        Dra til kalender
      </div>
    </div>
  );
}

function MetaSpan({
  icon,
  text,
}: {
  icon: "clock" | "pin" | "target" | "repeat" | "brain";
  text: string;
}) {
  const Icon =
    icon === "clock"
      ? Clock
      : icon === "pin"
        ? MapPin
        : icon === "repeat"
          ? Repeat
          : icon === "brain"
            ? Brain
            : Target;
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="w-2.5 h-2.5" />
      {text}
    </span>
  );
}

export type { SessionLevel };
