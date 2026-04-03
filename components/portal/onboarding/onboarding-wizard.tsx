"use client";

import { useState } from "react";
import { Target, Calendar, PenLine, ChevronRight, Check } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}

export interface OnboardingData {
  goals: string[];
  trainingFrequency: string;
}

const GOALS = [
  { id: "handicap", label: "Lavere handicap", icon: Target },
  { id: "consistency", label: "Mer konsistens", icon: Target },
  { id: "distance", label: "Lengre slag", icon: Target },
  { id: "short_game", label: "Bedre nærspill", icon: Target },
  { id: "putting", label: "Bedre putting", icon: Target },
  { id: "tournament", label: "Spille turneringer", icon: Target },
];

const FREQUENCIES = [
  { id: "1-2", label: "1-2 ganger i uken", description: "Hobbyspiller" },
  { id: "3-4", label: "3-4 ganger i uken", description: "Aktiv spiller" },
  { id: "5+", label: "5+ ganger i uken", description: "Dedikert spiller" },
];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<string>("");

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : prev.length < 3
          ? [...prev, goalId]
          : prev
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedGoals.length > 0) {
      setStep(2);
    } else if (step === 2 && frequency) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    onComplete({
      goals: selectedGoals,
      trainingFrequency: frequency,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                s === step ? "w-8" : "w-2"
              }`}
              style={{
                background:
                  s <= step ? "#16a34a" : "var(--color-grey-200)",
              }}
            />
          ))}
        </div>

        {/* Step 1: Goals */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--color-grey-100)" }}
              >
                <Target className="w-6 h-6 text-[var(--color-grey-700)]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-grey-900)] mb-2">
                Hva vil du oppnå?
              </h1>
              <p className="text-sm text-[var(--color-grey-500)]">
                Velg opptil 3 mål (du kan endre dette senere)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl text-left transition-[background-color,border-color] ${
                      isSelected ? "ring-2 ring-[#16a34a]" : ""
                    }`}
                    style={{
                      background: isSelected
                        ? "rgba(22, 163, 74, 0.05)"
                        : "var(--color-grey-50)",
                      border: `1px solid ${isSelected ? "#16a34a" : "var(--color-grey-200)"}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "#16a34a" }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ borderColor: "var(--color-grey-300)" }}
                        />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? "text-[#16a34a]"
                            : "text-[var(--color-grey-700)]"
                        }`}
                      >
                        {goal.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedGoals.length === 0}
              className="w-full py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-[background-color,color,opacity] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  selectedGoals.length > 0
                    ? "var(--color-grey-900)"
                    : "var(--color-grey-200)",
                color:
                  selectedGoals.length > 0
                    ? "white"
                    : "var(--color-grey-500)",
              }}
            >
              Neste
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Frequency */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--color-grey-100)" }}
              >
                <Calendar className="w-6 h-6 text-[var(--color-grey-700)]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-grey-900)] mb-2">
                Hvor ofte trener du?
              </h1>
              <p className="text-sm text-[var(--color-grey-500)]">
                Dette hjelper oss tilpasse anbefalingene
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {FREQUENCIES.map((freq) => {
                const isSelected = frequency === freq.id;
                return (
                  <button
                    key={freq.id}
                    onClick={() => setFrequency(freq.id)}
                    className={`w-full p-4 rounded-xl text-left transition-[background-color,border-color] ${
                      isSelected ? "ring-2 ring-[#16a34a]" : ""
                    }`}
                    style={{
                      background: isSelected
                        ? "rgba(22, 163, 74, 0.05)"
                        : "var(--color-grey-50)",
                      border: `1px solid ${isSelected ? "#16a34a" : "var(--color-grey-200)"}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-medium ${
                            isSelected
                              ? "text-[#16a34a]"
                              : "text-[var(--color-grey-900)]"
                          }`}
                        >
                          {freq.label}
                        </p>
                        <p className="text-xs text-[var(--color-grey-500)]">
                          {freq.description}
                        </p>
                      </div>
                      {isSelected ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "#16a34a" }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ borderColor: "var(--color-grey-300)" }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={!frequency}
              className="w-full py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-[background-color,color,opacity] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: frequency
                  ? "var(--color-grey-900)"
                  : "var(--color-grey-200)",
                color: frequency ? "white" : "var(--color-grey-500)",
              }}
            >
              Neste
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Ready to log */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(22, 163, 74, 0.1)" }}
              >
                <PenLine className="w-6 h-6 text-[#16a34a]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-grey-900)] mb-2">
                Du er klar!
              </h1>
              <p className="text-sm text-[var(--color-grey-500)]">
                Logg din første treningsøkt for å komme i gang
              </p>
            </div>

            <div
              className="rounded-xl p-5 mb-8"
              style={{
                background: "var(--color-grey-50)",
                border: "1px solid var(--color-grey-200)",
              }}
            >
              <h3 className="font-medium text-[var(--color-grey-900)] mb-3">
                Slik fungerer det:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[var(--color-grey-600)]">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                    style={{
                      background: "var(--color-grey-200)",
                      color: "var(--color-grey-700)",
                    }}
                  >
                    1
                  </span>
                  Logg hver treningsøkt med fokusområde og notater
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--color-grey-600)]">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                    style={{
                      background: "var(--color-grey-200)",
                      color: "var(--color-grey-700)",
                    }}
                  >
                    2
                  </span>
                  Se statistikk og trender over tid
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--color-grey-600)]">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                    style={{
                      background: "var(--color-grey-200)",
                      color: "var(--color-grey-700)",
                    }}
                  >
                    3
                  </span>
                  Få AI-analyse av dine styrker og svakheter
                </li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              style={{
                background: "#16a34a",
                color: "white",
              }}
            >
              <PenLine className="w-4 h-4" />
              Logg din første økt
            </button>

            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full mt-3 py-2 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
              >
                Utforsk først
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
