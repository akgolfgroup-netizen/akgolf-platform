"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect, useCallback, useRef } from "react";
import { Timer } from "lucide-react";
import type { PreShotRoutine } from "@/lib/portal/golf/decade-caddy";

interface PreShotGuideProps {
  routine: PreShotRoutine;
  onComplete: () => void;
  onClose: () => void;
}

export function PreShotGuide({ routine, onComplete, onClose }: PreShotGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(routine.durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  function handleStepComplete() {
    if (currentStep < routine.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
      clearTimer();
      setIsRunning(false);
    }
  }

  function handleDone() {
    clearTimer();
    onComplete();
  }

  const progress = ((routine.durationSeconds - timeLeft) / routine.durationSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-on-surface/40">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-grey-100)]">
          <div className="flex items-center gap-2">
            <Icon name="timer" className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
            <span className="text-sm font-semibold text-[var(--color-grey-900)]">
              Pre-shot rutine
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-grey-100)] text-[var(--color-grey-500)]">
              Niva {routine.level}
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[var(--color-grey-100)] transition-colors"
          >
            <Icon name="close" className="h-4 w-4 text-[var(--color-grey-500)]" />
          </button>
        </div>

        {/* Timer */}
        <div className="px-4 pt-4">
          <div className="relative h-1.5 rounded-full bg-[var(--color-grey-100)] overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                backgroundColor: isFinished ? "var(--color-success)" : "var(--color-ai)",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--color-grey-500)]">
              {routine.durationSeconds}s rutine
            </span>
            <span
              className="text-lg font-bold tabular-nums"
              style={{
                color: isFinished ? "var(--color-success)" : "var(--color-grey-900)",
              }}
            >
              {minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`}
            </span>
          </div>
        </div>

        {/* Steg-liste */}
        <div className="p-4 space-y-2">
          {routine.steps.map((step, i) => {
            const isDone = i < currentStep || isFinished;
            const isActive = i === currentStep && !isFinished;
            return (
              <button
                key={i}
                onClick={() => isActive && handleStepComplete()}
                disabled={!isActive}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-[var(--color-ai-light)] border border-[var(--color-ai)]/20"
                    : isDone
                      ? "bg-[var(--color-success-light)] opacity-70"
                      : "bg-[var(--color-grey-100)] opacity-50"
                }`}
              >
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isDone
                      ? "bg-[var(--color-success)] text-surface"
                      : isActive
                        ? "text-surface"
                        : "bg-[var(--color-grey-300)] text-surface"
                  }`}
                  style={isActive ? { backgroundColor: "var(--color-ai)" } : undefined}
                >
                  {isDone ? <Icon name="check" className="h-3 w-3" /> : i + 1}
                </div>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-[var(--color-ai-text)]"
                        : isDone
                          ? "text-[var(--color-success-text)]"
                          : "text-[var(--color-grey-500)]"
                    }`}
                  >
                    {step}
                  </div>
                  {isActive && (
                    <div className="text-xs text-[var(--color-grey-500)] mt-0.5">
                      Trykk for a fullfare
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Nokkelfokus */}
        <div className="px-4 pb-2">
          <div className="text-xs text-[var(--color-grey-500)] italic">
            {routine.keyFocus}
          </div>
        </div>

        {/* Knapper */}
        <div className="p-4 flex gap-3 border-t border-[var(--color-grey-100)]">
          {!isRunning && !isFinished && (
            <button
              onClick={startTimer}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-surface transition-colors"
              style={{ backgroundColor: "var(--color-ai)" }}
            >
              Start timer
            </button>
          )}
          {isFinished && (
            <button
              onClick={handleDone}
              className="flex-1 py-3 rounded-xl bg-[var(--color-success)] text-surface font-semibold text-sm transition-colors"
            >
              Ferdig
            </button>
          )}
          {isRunning && (
            <button
              onClick={handleDone}
              className="flex-1 py-3 rounded-xl bg-[var(--color-brand)] text-surface font-semibold text-sm transition-colors"
            >
              Ferdig
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
