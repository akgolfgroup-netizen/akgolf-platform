"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function StepperProgress({ steps, currentStep, onStepClick, className }: StepperProgressProps) {
  return (
    <div className={cn(className)}>
      {/* Compact mobile view */}
      <div className="block sm:hidden">
        <p className="text-center text-[11px] font-medium text-[#0A1F18]">
          Steg {currentStep + 1} av {steps.length}
          {steps[currentStep] && <span className="text-[#5E5C57]"> — {steps[currentStep].label}</span>}
        </p>
      </div>

      {/* Full stepper on wider screens */}
      <div className="hidden items-center sm:flex">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          const isClickable = isCompleted && !!onStepClick;

          return (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(i)}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors",
                    isCompleted && "border-[#1A7D56] bg-[#1A7D56] text-white",
                    isActive && "border-[#D1F843] bg-[#D1F843] text-[#0A1F18]",
                    !isCompleted && !isActive && "border-[#EFEDE6] bg-[#EFEDE6] text-[#9C9990]",
                    isClickable && "cursor-pointer hover:opacity-80"
                  )}
                >
                  {isCompleted ? <Check size={16} strokeWidth={2.5} /> : i + 1}
                </button>
                <span
                  className={cn(
                    "max-w-[80px] truncate text-center text-[11px]",
                    isActive ? "font-semibold text-[#0A1F18]" : "text-[#9C9990]"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className="mx-2 mb-5 h-0.5 flex-1">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isCompleted ? "bg-[#1A7D56]" : "bg-[#EFEDE6]"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
