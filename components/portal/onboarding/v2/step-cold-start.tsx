"use client";


import { Target } from "lucide-react";
import { WEAKNESS_OPTIONS } from "./types";

interface StepColdStartProps {
  selectedWeakness: string | null;
  onSelect: (id: string) => void;
}

export function StepColdStart({ selectedWeakness, onSelect }: StepColdStartProps) {
  return (
    <div className="w-full max-w-xl flex flex-col gap-8">
      <div>
        <h2 className="text-[28px] font-bold tracking-tight text-white mb-1">
          Hva sliter du mest med?
        </h2>
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Vi bruker dette til å prioritere de første øvelsene
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {WEAKNESS_OPTIONS.map((w) => {
          const isSelected = selectedWeakness === w.id;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onSelect(w.id)}
              className="flex items-center gap-3 rounded-[12px] px-5 py-4 text-left transition-all"
              style={{
                background: isSelected ? "rgba(209,248,67,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isSelected ? "rgba(209,248,67,0.25)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full grid place-items-center shrink-0"
                style={{
                  background: isSelected ? "#D1F843" : "rgba(255,255,255,0.06)",
                }}
              >
                {isSelected && (
                  <Target className="w-3 h-3" style={{ color: "#0A1F18" }} />
                )}
              </div>
              <span
                className="text-[14px] font-medium"
                style={{ color: isSelected ? "#D1F843" : "rgba(255,255,255,0.85)" }}
              >
                {w.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
