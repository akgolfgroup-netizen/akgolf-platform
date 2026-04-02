"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { OnboardingWizard, type OnboardingData } from "@/components/portal/onboarding/onboarding-wizard";
import { saveOnboardingData, skipOnboarding } from "./actions";

export function OnboardingPageClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleComplete = (data: OnboardingData) => {
    startTransition(async () => {
      await saveOnboardingData({
        goals: data.goals,
        trainingFrequency: data.trainingFrequency,
      });
      router.push("/portal/dagbok");
    });
  };

  const handleSkip = () => {
    startTransition(async () => {
      await skipOnboarding();
      router.push("/portal");
    });
  };

  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="animate-pulse text-[var(--color-grey-500)]">
          Lagrer...
        </div>
      </div>
    );
  }

  return <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />;
}
