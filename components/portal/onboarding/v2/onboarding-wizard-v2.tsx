"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { ViewId } from "@/lib/portal/views/registry";
import { OnboardingProgressSidebar } from "./progress-sidebar";
import { StepGoals } from "./step-goals";
import { StepFrequency } from "./step-frequency";
import { StepView } from "./step-view";
import { StepReady } from "./step-ready";
import type { OnboardingV2Data } from "./types";

interface OnboardingWizardV2Props {
  onComplete: (data: OnboardingV2Data) => void;
  onSkip?: () => void;
}

export function OnboardingWizardV2({ onComplete, onSkip }: OnboardingWizardV2Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [goals, setGoals] = useState<string[]>([]);
  const [playerType, setPlayerType] = useState<"performance" | "leisure" | null>(null);
  const [frequency, setFrequency] = useState<string>("");
  const [defaultView, setDefaultView] = useState<ViewId | null>(null);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const canAdvance =
    (step === 1 && goals.length > 0 && playerType !== null) ||
    (step === 2 && frequency !== "") ||
    (step === 3 && defaultView !== null) ||
    step === 4;

  const onNext = () => {
    if (!canAdvance) return;
    if (step === 4) {
      onComplete({
        goals: playerType ? [...goals, playerType] : goals,
        trainingFrequency: frequency,
        defaultView: (defaultView ?? "opt1") as ViewId,
      });
      return;
    }
    setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  };

  const onBack = () => {
    if (step === 1) return;
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid"
      style={{
        background: "#0A1F18",
        gridTemplateRows: "80px 1fr 88px",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Top */}
      <header
        className="flex items-center justify-between px-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg grid place-items-center font-extrabold text-[13px]"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            AK
          </div>
          <div className="text-white font-bold tracking-tight">
            AK Golf · Velkommen
          </div>
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-[13px] transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Hopp over og fyll inn senere →
          </button>
        )}
      </header>

      {/* Main */}
      <div
        className="grid overflow-hidden"
        style={{ gridTemplateColumns: "minmax(0,280px) 1fr" }}
      >
        <OnboardingProgressSidebar currentStep={step} />
        <main
          className="overflow-y-auto flex flex-col items-center"
          style={{ padding: "56px 64px" }}
        >
          {step === 1 && (
            <StepGoals
              selectedGoals={goals}
              onToggleGoal={toggleGoal}
              playerType={playerType}
              onSetPlayerType={setPlayerType}
            />
          )}
          {step === 2 && <StepFrequency frequency={frequency} onSelect={setFrequency} />}
          {step === 3 && <StepView defaultView={defaultView} onSelect={setDefaultView} />}
          {step === 4 && <StepReady />}
        </main>
      </div>

      {/* Bottom */}
      <footer
        className="flex items-center justify-between border-t px-16"
        style={{
          background: "#0A1F18",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold transition-opacity"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.85)",
            opacity: step === 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake
        </button>

        <div
          className="font-mono text-[10px] uppercase tracking-[0.10em]"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          STEG {step} / 4 · TRYKK ENTER FOR NESTE
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className="inline-flex items-center gap-1.5 rounded-[10px] px-6 py-3 text-[13px] font-extrabold transition-opacity"
          style={{
            background: "#D1F843",
            color: "#0A1F18",
            opacity: canAdvance ? 1 : 0.4,
            cursor: canAdvance ? "pointer" : "not-allowed",
          }}
        >
          {step === 4 ? (
            <>
              <Check className="w-4 h-4" />
              Fullfør
            </>
          ) : (
            <>
              Neste
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
