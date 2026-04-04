"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Zap,
  BarChart3,
  Target,
  Calendar,
  Brain,
  Video,
  Crown,
} from "lucide-react";
import { SubscriptionTier } from "@prisma/client";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  requiredTier?: SubscriptionTier;
  onUpgrade?: (tier: SubscriptionTier) => void;
}

const TIERS = [
  {
    tier: "VISITOR" as SubscriptionTier,
    name: "Gratis",
    price: "0 kr",
    period: "for alltid",
    features: [
      { text: "4 logginger per maned", included: true },
      { text: "1 AI-analyse per maned", included: true },
      { text: "30 dagers historikk", included: true },
      { text: "Alle SLAG-kategorier", included: false },
      { text: "AI treningsplan", included: false },
      { text: "Videoanalyse", included: false },
    ],
    cta: "Navaerende plan",
    disabled: true,
  },
  {
    tier: "PRO" as SubscriptionTier,
    name: "Pro",
    price: "199 kr",
    period: "per maned",
    popular: true,
    features: [
      { text: "Ubegrenset logging", included: true },
      { text: "Ubegrenset AI-analyser", included: true },
      { text: "Full historikk", included: true },
      { text: "Alle SLAG-kategorier", included: true },
      { text: "AI treningsplan", included: true },
      { text: "Videoanalyse", included: false },
    ],
    cta: "Start 14-dagers provperiode",
    highlight: true,
  },
  {
    tier: "ELITE" as SubscriptionTier,
    name: "Elite",
    price: "299 kr",
    period: "per maned",
    features: [
      { text: "Alt i Pro", included: true },
      { text: "TrackMan-import", included: true },
      { text: "Videoanalyse", included: true },
      { text: "Coach-deling", included: true },
      { text: "Prioritert support", included: true },
      { text: "Eksklusive features", included: true },
    ],
    cta: "Start 14-dagers provperiode",
  },
];

const FEATURE_ICONS: Record<string, typeof Check> = {
  logging: BarChart3,
  analyse: Brain,
  historikk: Calendar,
  slag: Target,
  treningsplan: Calendar,
  video: Video,
};

export function PaywallModal({
  isOpen,
  onClose,
  featureName,
  requiredTier = "PRO",
  onUpgrade,
}: PaywallModalProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(requiredTier);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleUpgrade = () => {
    onUpgrade?.(selectedTier);
    // Redirect to checkout
    window.location.href = `/portal/apper?upgrade=${selectedTier.toLowerCase()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            role="presentation"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl p-6 pointer-events-auto"
              style={{
                background: "white",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Lukk dialog"
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X className="w-5 h-5 text-[var(--color-grey-500)]" aria-hidden="true" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(22, 163, 74, 0.1)" }}
                >
                  <Crown className="w-6 h-6 text-[#2D6A4F]" aria-hidden="true" />
                </div>
                <h2 id={titleId} className="text-2xl font-bold text-[var(--color-grey-900)] mb-2">
                  {featureName
                    ? `${featureName} krever oppgradering`
                    : "Velg din plan"}
                </h2>
                <p className="text-sm text-[var(--color-grey-500)]">
                  Start med 14 dagers gratis provperiode. Avbryt nar som helst.
                </p>
              </div>

              {/* Pricing cards */}
              <div className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
                {TIERS.map((tier) => (
                  <motion.div
                    key={tier.tier}
                    whileHover={{ scale: tier.disabled ? 1 : 1.02 }}
                    onClick={() => !tier.disabled && setSelectedTier(tier.tier)}
                    className={`relative rounded-xl p-5 cursor-pointer transition-[opacity,box-shadow] ${
                      tier.disabled ? "opacity-60 cursor-not-allowed" : ""
                    } ${
                      selectedTier === tier.tier && !tier.disabled
                        ? "ring-2 ring-[#2D6A4F]"
                        : ""
                    }`}
                    style={{
                      background: tier.highlight
                        ? "linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)"
                        : "var(--color-grey-50)",
                      border: `1px solid ${
                        selectedTier === tier.tier && !tier.disabled
                          ? "#2D6A4F"
                          : "var(--color-grey-200)"
                      }`,
                    }}
                  >
                    {tier.popular && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: "#2D6A4F",
                          color: "white",
                        }}
                      >
                        Mest populaer
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-[var(--color-grey-900)]">
                        {tier.name}
                      </h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-[var(--color-grey-900)]">
                          {tier.price}
                        </span>
                        <span className="text-sm text-[var(--color-grey-500)]">
                          {" "}
                          {tier.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {tier.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          {feature.included ? (
                            <Check className="w-4 h-4 text-[#2D6A4F] flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <X className="w-4 h-4 text-[var(--color-grey-300)] flex-shrink-0" aria-hidden="true" />
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-[var(--color-grey-700)]"
                                : "text-[var(--color-grey-400)]"
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={tier.disabled}
                      className={`w-full py-2.5 rounded-full text-sm font-semibold transition-[background-color] focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        tier.disabled
                          ? "bg-[var(--color-grey-200)] text-[var(--color-grey-500)] cursor-not-allowed"
                          : tier.highlight
                            ? "bg-[#2D6A4F] text-white hover:bg-[#1B4332]"
                            : "bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)]"
                      }`}
                    >
                      {tier.cta}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-[var(--color-grey-200)]">
                <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                  <Check className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                  14 dagers gratis provperiode
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                  <Check className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                  Avbryt nar som helst
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                  <Check className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                  Sikker betaling med Stripe
                </div>
              </div>

              {/* CTA */}
              {selectedTier !== "VISITOR" && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleUpgrade}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      background: "#2D6A4F",
                      color: "white",
                    }}
                  >
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    Start gratis provperiode
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
