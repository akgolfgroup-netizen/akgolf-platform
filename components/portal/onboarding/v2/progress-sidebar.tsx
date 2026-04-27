"use client";

import { Check } from "lucide-react";
import { ONBOARDING_STEPS } from "./types";

interface ProgressSidebarProps {
  currentStep: number;
}

export function OnboardingProgressSidebar({ currentStep }: ProgressSidebarProps) {
  const total = ONBOARDING_STEPS.length;
  const circumference = 2 * Math.PI * 26; // r=26
  const filled = (currentStep / total) * circumference;
  const offset = circumference - filled;

  return (
    <aside
      className="hidden md:flex flex-col gap-1.5 p-9 px-7 border-r"
      style={{
        background: "#0A1F18",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#D1F843"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div
            className="absolute inset-0 grid place-items-center font-mono text-[13px] font-bold"
            style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {currentStep}/{total}
          </div>
        </div>
        <div>
          <div
            className="text-[9px] font-mono uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Profil-oppsett
          </div>
          <div className="text-[16px] font-extrabold text-white tracking-tight mt-1">
            Steg {currentStep} av {total}
          </div>
        </div>
      </div>

      {ONBOARDING_STEPS.map((step) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;
        return (
          <div
            key={step.id}
            className="grid items-center gap-3.5 px-3 py-3 rounded-[10px] transition-all"
            style={{
              gridTemplateColumns: "28px 1fr",
              background: active ? "rgba(209,248,67,0.08)" : "transparent",
              border: active ? "1px solid rgba(209,248,67,0.20)" : "1px solid transparent",
              padding: active ? "11px" : "12px",
            }}
          >
            <div
              className="w-7 h-7 rounded-full grid place-items-center font-mono text-[11px] font-bold"
              style={{
                background: done
                  ? "rgba(118,193,156,0.20)"
                  : active
                    ? "#D1F843"
                    : "rgba(255,255,255,0.06)",
                color: done ? "#6FCBA1" : active ? "#0A1F18" : "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : step.id}
            </div>
            <div>
              <div
                className="text-[13px] font-semibold"
                style={{
                  color: done
                    ? "rgba(255,255,255,0.5)"
                    : active
                      ? "#fff"
                      : "rgba(255,255,255,0.7)",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {step.title}
              </div>
              <div
                className="text-[9px] font-mono uppercase tracking-[0.10em] mt-0.5"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {done ? "Fullført" : active ? "Nå" : step.subtitle}
              </div>
            </div>
          </div>
        );
      })}

      <div
        className="mt-auto pt-6 border-t font-mono text-[10px] tracking-[0.10em]"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        EST. {Math.max(1, (5 - currentStep) * 1)} MIN IGJEN
      </div>
    </aside>
  );
}
