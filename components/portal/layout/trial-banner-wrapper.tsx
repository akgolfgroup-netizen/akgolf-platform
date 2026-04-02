"use client";

import { useState } from "react";
import { TrialBanner } from "@/components/portal/ui/trial-banner";
import { UpgradeModal } from "@/components/portal/ui/upgrade-modal";
import type { SubscriptionTier, SubscriptionStatus } from "@prisma/client";

interface TrialBannerWrapperProps {
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionTier: SubscriptionTier;
  trialEndsAt: Date | string | null;
}

export function TrialBannerWrapper({
  subscriptionStatus,
  subscriptionTier,
  trialEndsAt,
}: TrialBannerWrapperProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Only show for users with TRIALING status
  if (subscriptionStatus !== "TRIALING" || !trialEndsAt) {
    return null;
  }

  return (
    <>
      <TrialBanner
        trialEndsAt={trialEndsAt}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={subscriptionTier}
        trigger="general"
      />
    </>
  );
}
