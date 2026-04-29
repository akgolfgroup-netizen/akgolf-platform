"use client";

import { Calendar, Clock } from "lucide-react";
import { FREQUENCY_OPTIONS } from "./types";

interface StepFrequencyProps {
  frequency: string;
  onSelect: (id: string) => void;
}

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function StepFrequency({ frequency, onSelect }: StepFrequencyProps) {
  // Visual-only day picker (not persisted) — gives the design fidelity from mockup
  const recommended: Record<string, string[]> = {
    "1-2": ["Tir", "Lør"],
    "3-4": ["Man", "Ons", "Fre", "Lør"],
    "5+": ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
  };
  const activeDays = recommended[frequency] ?? [];

  return (
    <div className="w-full max-w-[720px]">
      <div
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        Steg 2 av 4 · Tid
      </div>
      <h1
        className="mt-2.5 mb-3.5 text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-white"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        Hvor ofte trener du?
      </h1>
      <p
        className="text-[15px] mb-8 max-w-[56ch]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Dette hjelper oss tilpasse anbefalingene og ukesplanen.
      </p>

      <div className="space-y-3 mb-8">
        {FREQUENCY_OPTIONS.map((opt) => {
          const selected = frequency === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className="w-full flex items-center justify-between rounded-[12px] px-5 py-4 text-left transition-colors border"
              style={{
                background: selected ? "rgba(209,248,67,0.06)" : "#0D2E23",
                borderColor: selected ? "rgba(209,248,67,0.40)" : "#1a4a3a",
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-9 h-9 rounded-[9px] grid place-items-center"
                  style={{
                    background: selected ? "#D1F843" : "rgba(255,255,255,0.05)",
                    color: selected ? "#0A1F18" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-semibold text-[14px]">{opt.label}</div>
                  <div
                    className="text-[12px] mt-0.5"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {opt.description}
                  </div>
                </div>
              </div>
              <div
                className="w-5 h-5 rounded-full grid place-items-center"
                style={{
                  background: selected ? "#D1F843" : "transparent",
                  border: selected ? "none" : "1px solid rgba(255,255,255,0.30)",
                }}
              >
                {selected && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#0A1F18" }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-[14px] p-6"
        style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar
            className="w-4 h-4"
            style={{ color: "rgba(255,255,255,0.5)" }}
          />
          <div
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            Foreslåtte treningsdager
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day) => {
            const active = activeDays.includes(day);
            return (
              <div
                key={day}
                className="text-center py-2.5 rounded-lg font-mono text-[11px] tracking-wider"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  background: active ? "#D1F843" : "rgba(255,255,255,0.03)",
                  color: active ? "#0A1F18" : "rgba(255,255,255,0.7)",
                  fontWeight: active ? 800 : 500,
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
