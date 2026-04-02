"use client";

import { ReactNode } from "react";
import { UpgradeProvider } from "@/components/portal/context/upgrade-context";
import { AchievementProvider } from "@/components/portal/context/achievement-context";
import type { SubscriptionTier } from "@prisma/client";

interface DashboardProvidersProps {
  children: ReactNode;
  currentTier: SubscriptionTier;
  logCount: number;
}

export function DashboardProviders({
  children,
  currentTier,
  logCount,
}: DashboardProvidersProps) {
  return (
    <AchievementProvider>
      <UpgradeProvider currentTier={currentTier} logCount={logCount}>
        {children}
      </UpgradeProvider>
    </AchievementProvider>
  );
}
