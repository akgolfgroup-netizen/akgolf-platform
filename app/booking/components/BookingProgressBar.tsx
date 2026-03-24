"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  currentStep: number;
}

const STEPS = [
  { num: 1, label: "Tjeneste" },
  { num: 2, label: "Instruktor" },
  { num: 3, label: "Tid" },
  { num: 4, label: "Opplysninger" },
  { num: 5, label: "Betaling" },
  { num: 6, label: "Bekreftelse" },
];

export function BookingProgressBar({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-between bg-white border border-ink-10 rounded-xl p-4 mb-6">
      {STEPS.map((step, index) => {
        const isCompleted = step.num < currentStep;
        const isCurrent = step.num === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? "#10B981"
                    : isCurrent
                    ? "#171717"
                    : "#F5F5F5",
                  borderColor: isCompleted
                    ? "#10B981"
                    : isCurrent
                    ? "#171717"
                    : "#E5E5E5",
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2"
                style={{
                  color: isCompleted || isCurrent ? "#FFFFFF" : "#737373",
                }}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  step.num
                )}
              </motion.div>
              <span
                className={`text-sm hidden md:block ${
                  isCurrent ? "font-medium text-ink-90" : "text-ink-50"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 mx-3 h-0.5 hidden sm:block">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ backgroundColor: "#E5E5E5" }}
                  animate={{
                    backgroundColor: isCompleted ? "#10B981" : "#E5E5E5",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
