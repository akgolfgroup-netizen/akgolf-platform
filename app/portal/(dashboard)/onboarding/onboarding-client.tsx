"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { OnboardingWizard, type OnboardingData } from "@/components/portal/onboarding/onboarding-wizard";
import { GlassPanel } from "@/components/portal/patterns";
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface">
        <GlassPanel variant="light" padding="lg" className="flex flex-col items-center gap-3 min-w-[200px]">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">Lagrer...</p>
        </GlassPanel>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <GlassPanel variant="light" padding="lg" className="max-w-2xl mx-auto">
        <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />
      </GlassPanel>
    </section>
  );
}
