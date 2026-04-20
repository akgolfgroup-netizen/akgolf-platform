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
                ? "w-6 bg-primary"
                : isDone
                ? "w-2 bg-secondary-fixed"
                : "w-2 bg-surface-variant"
            }`}
          />
        );
      })}
    </div>
  );
}
