"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UpgradeModal } from "@/components/portal/ui/upgrade-modal";
import type { SubscriptionTier } from "@prisma/client";

type UpgradeTrigger = "log_limit" | "ai_limit" | "feature" | "general" | "engagement" | "positive_analysis";

interface UpgradeContextValue {
  showUpgradeModal: (trigger: UpgradeTrigger) => void;
  trackFeatureClick: () => void;
  trackLogSession: () => void;
  trackPositiveAnalysis: () => void;
}

const UpgradeContext = createContext<UpgradeContextValue | null>(null);

const STORAGE_KEY_FEATURE_CLICKS = "ak_feature_clicks";

interface UpgradeProviderProps {
  children: ReactNode;
  currentTier: SubscriptionTier;
  logCount: number;
}

export function UpgradeProvider({ children, currentTier, logCount }: UpgradeProviderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [trigger, setTrigger] = useState<UpgradeTrigger>("general");

  // Only show upgrade prompts for free tier users
  const shouldShowUpgradePrompts = currentTier === "VISITOR" || currentTier === "ACADEMY";

  const showUpgradeModal = useCallback((newTrigger: UpgradeTrigger) => {
    if (!shouldShowUpgradePrompts) return;
    setTrigger(newTrigger);
    setModalOpen(true);
  }, [shouldShowUpgradePrompts]);

  const trackFeatureClick = useCallback(() => {
    if (!shouldShowUpgradePrompts) return;

    try {
      const clicks = parseInt(sessionStorage.getItem(STORAGE_KEY_FEATURE_CLICKS) || "0", 10);
      const newClicks = clicks + 1;
      sessionStorage.setItem(STORAGE_KEY_FEATURE_CLICKS, String(newClicks));

      // Show upgrade modal on 2nd click on locked feature
      if (newClicks >= 2) {
        showUpgradeModal("feature");
        sessionStorage.setItem(STORAGE_KEY_FEATURE_CLICKS, "0"); // Reset counter
      }
    } catch {
      // sessionStorage not available
    }
  }, [shouldShowUpgradePrompts, showUpgradeModal]);

  const trackLogSession = useCallback(() => {
    if (!shouldShowUpgradePrompts) return;

    // Show upgrade modal after 3rd logged session
    if (logCount >= 2) {
      // This is the 3rd log (0-indexed from server)
      showUpgradeModal("engagement");
    }
  }, [shouldShowUpgradePrompts, logCount, showUpgradeModal]);

  const trackPositiveAnalysis = useCallback(() => {
    if (!shouldShowUpgradePrompts) return;
    showUpgradeModal("positive_analysis");
  }, [shouldShowUpgradePrompts, showUpgradeModal]);

  return (
    <UpgradeContext.Provider
      value={{
        showUpgradeModal,
        trackFeatureClick,
        trackLogSession,
        trackPositiveAnalysis,
      }}
    >
      {children}
      <UpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentTier={currentTier}
        trigger={trigger === "engagement" || trigger === "positive_analysis" ? "general" : trigger}
      />
    </UpgradeContext.Provider>
  );
}

export function useUpgrade() {
  const context = useContext(UpgradeContext);
  if (!context) {
    throw new Error("useUpgrade must be used within an UpgradeProvider");
  }
  return context;
}
