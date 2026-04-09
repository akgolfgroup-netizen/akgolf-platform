"use client";

import Link from "next/link";
import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: 1 | 2 | 3;
  serviceTypeId?: string;
  instructorId?: string;
  startTime?: string;
}

const steps = [
  { num: 1, label: "Coaching", href: "/booking/select-service" },
  { num: 2, label: "Tid", href: "/booking/date-time" },
  { num: 3, label: "Betal", href: "/booking/review-confirm" },
];

export function BookingProgress({ 
  currentStep, 
  serviceTypeId, 
  instructorId, 
  startTime 
}: BookingProgressProps) {
  const getHref = (step: typeof steps[0]) => {
    // Going back to step 1 is always possible
    if (step.num === 1) return step.href;
    // Going to step 2 requires serviceTypeId (for going back from step 3)
    if (step.num === 2 && serviceTypeId) return `${step.href}?serviceTypeId=${serviceTypeId}`;
    // Going to step 3 requires all params
    if (step.num === 3 && serviceTypeId && instructorId && startTime) {
      return `${step.href}?serviceTypeId=${serviceTypeId}&instructorId=${instructorId}&startTime=${encodeURIComponent(startTime)}`;
    }
    return undefined;
  };

  return (
    <div className="w-full bg-[#f7f3ea] py-4 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.num === currentStep;
            const isCompleted = step.num < currentStep;
            const href = getHref(step);

            const content = (
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isCompleted
                      ? "bg-[#154212] text-[#d2f000]"
                      : isActive
                      ? "bg-[#d2f000] text-[#154212] ring-2 ring-[#154212]"
                      : "bg-white text-[#154212]/40 border border-[#e6e2d9]"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className={`text-xs font-medium uppercase tracking-wider ${
                    isActive || isCompleted ? "text-[#154212]" : "text-[#154212]/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );

            if (href && !isActive) {
              return (
                <Link
                  key={step.num}
                  href={href}
                  className="flex-1 flex flex-col items-center"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={step.num}
                className={`flex-1 flex flex-col items-center ${isActive ? "" : "cursor-default"}`}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Progress line */}
        <div className="mt-4 relative h-1 bg-[#e6e2d9] rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#d2f000] transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
