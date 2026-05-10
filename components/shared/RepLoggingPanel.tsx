"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface RepLoggingPanelProps {
  exerciseName: string;
  currentReps: number;
  onIncrement: () => void;
  onDecrement: () => void;
  clubOptions?: string[];
  selectedClub?: string;
  onClubChange?: (club: string) => void;
  className?: string;
}

export function RepLoggingPanel({
  exerciseName,
  currentReps,
  onIncrement,
  onDecrement,
  clubOptions,
  selectedClub,
  onClubChange,
  className,
}: RepLoggingPanelProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Exercise name */}
      <h3
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontSize: "18px",
          fontWeight: 700,
          color: "#0A1F18",
          textAlign: "center",
          margin: 0,
        }}
      >
        {exerciseName}
      </h3>

      {/* Counter row */}
      <div className="flex items-center gap-6">
        {/* Minus button */}
        <button
          type="button"
          onClick={onDecrement}
          className="flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#EFEDE6",
            border: "none",
            cursor: "pointer",
            transition: "transform 120ms ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="Reduser antall"
        >
          <Minus size={32} strokeWidth={1.75} color="#5E5C57" />
        </button>

        {/* Current reps */}
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1,
            color: "#0A1F18",
            minWidth: "100px",
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {currentReps}
        </span>

        {/* Plus button */}
        <button
          type="button"
          onClick={onIncrement}
          className="flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#D1F843",
            border: "none",
            cursor: "pointer",
            transition: "transform 120ms ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="Legg til"
        >
          <Plus size={32} strokeWidth={1.75} color="#0A1F18" />
        </button>
      </div>

      {/* Club selection pills */}
      {clubOptions && clubOptions.length > 0 && onClubChange && (
        <div className="flex flex-wrap justify-center gap-2">
          {clubOptions.map((club) => {
            const isActive = selectedClub === club;
            return (
              <button
                key={club}
                type="button"
                onClick={() => onClubChange(club)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#005840" : "#EFEDE6",
                  color: isActive ? "#FFFFFF" : "#5E5C57",
                  transition: "background-color 120ms ease-out, color 120ms ease-out",
                }}
              >
                {club}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
