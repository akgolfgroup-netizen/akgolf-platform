"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
}

const STEP_NAMES = [
  "Tjeneste",
  "Trener",
  "Tid",
  "Detaljer",
  "Betaling",
];

export function ProgressBar({ currentStep, totalSteps, stepNames = STEP_NAMES }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-black">
            Steg {currentStep}
          </span>
          <span className="text-sm text-grey-500">
            av {totalSteps}
          </span>
        </div>
        <span className="text-sm text-grey-500 hidden sm:block">
          {stepNames[currentStep - 1] || ""}
        </span>
      </div>

      {/* Progress bar background */}
      <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className="h-full rounded-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Step indicators (dots) */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={stepNum}
              className="flex flex-col items-center gap-1.5"
            >
              <motion.div
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  isCompleted
                    ? "bg-[#2D6A4F]"
                    : isCurrent
                    ? "bg-black ring-2 ring-black/20"
                    : "bg-grey-200"
                }`}
                initial={isCurrent ? { scale: 0.8 } : { scale: 1 }}
                animate={isCurrent ? { scale: 1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span
                className={`text-[10px] uppercase tracking-wider hidden sm:block ${
                  isCompleted
                    ? "text-[#2D6A4F] font-medium"
                    : isCurrent
                    ? "text-black font-medium"
                    : "text-grey-500"
                }`}
              >
                {stepNames[i] || `Steg ${stepNum}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
