"use client";

interface StepIndicatorProps {
  currentStep: 0 | 1 | 2 | 3 | 4;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [0, 1, 2, 3, 4];

  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((step) => {
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-400 ${
              isActive
                ? "w-6 bg-[#005840]"
                : isDone
                ? "w-2 bg-[#D1F843]"
                : "w-2 bg-[#D5DFDB]"
            }`}
          />
        );
      })}
    </div>
  );
}
