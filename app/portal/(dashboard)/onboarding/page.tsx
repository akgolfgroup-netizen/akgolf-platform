import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { checkOnboardingStatus } from "./actions";
import { OnboardingPageClient } from "./onboarding-client";

export default async function OnboardingPage() {
  await requirePortalUser();

  const { completed } = await checkOnboardingStatus();

  // If already completed, redirect to dashboard
  if (completed) {
    redirect("/portal");
  }

  return <OnboardingPageClient />;
}
