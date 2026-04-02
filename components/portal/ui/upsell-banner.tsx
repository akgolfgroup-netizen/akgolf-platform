"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, X, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { PaywallModal } from "./paywall-modal";
import { SubscriptionTier } from "@prisma/client";

interface UpsellBannerProps {
  feature: string;
  description: string;
  requiredTier?: SubscriptionTier;
  variant?: "inline" | "card" | "floating";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function UpsellBanner({
  feature,
  description,
  requiredTier = "PRO",
  variant = "inline",
  dismissible = true,
  onDismiss,
}: UpsellBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const tierLabel = requiredTier === "ELITE" ? "Elite" : "Pro";

  if (variant === "floating") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          <div
            className="rounded-2xl p-4 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            }}
          >
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  {feature}
                </p>
                <p className="text-xs text-white/80 mb-3">{description}</p>
                <button
                  onClick={() => setShowPaywall(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-[#16a34a] hover:bg-white/90 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Oppgrader til {tierLabel}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          featureName={feature}
          requiredTier={requiredTier}
        />
      </>
    );
  }

  if (variant === "card") {
    return (
      <>
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)",
            border: "1px solid rgba(22, 163, 74, 0.2)",
          }}
        >
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[#16a34a]/10 transition-colors"
            >
              <X className="w-4 h-4 text-[var(--color-grey-400)]" />
            </button>
          )}
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(22, 163, 74, 0.15)" }}
            >
              <Sparkles className="w-6 h-6 text-[#16a34a]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-grey-900)] mb-1">
                {feature}
              </p>
              <p className="text-xs text-[var(--color-grey-600)] mb-3">
                {description}
              </p>
              <button
                onClick={() => setShowPaywall(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                style={{
                  background: "#16a34a",
                  color: "white",
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                Oppgrader til {tierLabel}
              </button>
            </div>
          </div>
        </div>

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          featureName={feature}
          requiredTier={requiredTier}
        />
      </>
    );
  }

  // Inline variant (default)
  return (
    <>
      <div
        className="flex items-center justify-between p-3 rounded-xl"
        style={{
          background: "linear-gradient(90deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)",
          border: "1px solid rgba(22, 163, 74, 0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(22, 163, 74, 0.15)" }}
          >
            <Sparkles className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-grey-900)]">
              {feature}
            </p>
            <p className="text-[10px] text-[var(--color-grey-500)]">
              {description}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPaywall(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all hover:scale-105"
          style={{
            background: "#16a34a",
            color: "white",
          }}
        >
          <Zap className="w-3 h-3" />
          Oppgrader
        </button>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 rounded-lg hover:bg-[#16a34a]/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-[var(--color-grey-400)]" />
          </button>
        )}
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName={feature}
        requiredTier={requiredTier}
      />
    </>
  );
}
