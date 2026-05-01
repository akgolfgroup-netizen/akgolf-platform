"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { OnboardingWizardV2 } from "@/components/portal/onboarding/v2/onboarding-wizard-v2";
import type { OnboardingV2Data } from "@/components/portal/onboarding/v2/types";
import { saveOnboardingData, skipOnboarding } from "./actions";

export function OnboardingPageClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleComplete = (data: OnboardingV2Data) => {
    startTransition(async () => {
      await saveOnboardingData({
        goals: data.goals,
        trainingFrequency: data.trainingFrequency,
        defaultView: data.defaultView,
        currentHandicap: data.handicap,
        age: data.age,
        weeklyHours: data.weeklyHours,
        homeCourseName: data.homeCourseName,
        coldStartWeakness: data.coldStartWeakness,
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "#0A1F18" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-9 h-9 border-2 rounded-full animate-spin"
            style={{
              borderColor: "rgba(209,248,67,0.25)",
              borderTopColor: "#D1F843",
            }}
          />
          <p
            className="font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            Lagrer …
          </p>
        </div>
      </div>
    );
  }

  return <OnboardingWizardV2 onComplete={handleComplete} onSkip={handleSkip} />;
}
