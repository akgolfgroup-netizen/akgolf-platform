"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { motion } from "framer-motion";


interface PricingTableProps {
  currentTier: "VISITOR" | "PRO" | "ELITE";
  onSelectPlan: (plan: "PRO" | "ELITE", interval: "month" | "year") => void;
  loading?: string | null;
}

const TIERS = {
  VISITOR: {
    name: "Gratis",
    description: "Kom i gang med grunnleggende funksjoner",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "Treningsdagbok", included: true },
      { name: "Grunnleggende statistikk", included: true },
      { name: "Maks 5 okter/mnd", included: true },
      { name: "AI-analyse", included: false },
      { name: "Treningsplan", included: false },
      { name: "Strokes Gained-data", included: false },
      { name: "Peer-sammenligning", included: false },
      { name: "Turneringsplanlegger", included: false },
    ],
    cta: null,
    highlight: false,
  },
  PRO: {
    name: "Pro",
    description: "Alt du trenger for seriøs forbedring",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      { name: "Treningsdagbok", included: true },
      { name: "Full statistikk", included: true },
      { name: "Ubegrenset logging", included: true },
      { name: "AI-analyse", included: true },
      { name: "Treningsplan", included: true },
      { name: "Strokes Gained-data", included: true },
      { name: "Peer-sammenligning", included: false },
      { name: "Turneringsplanlegger", included: false },
    ],
    cta: "Start 14-dagers gratis",
    highlight: true,
  },
  ELITE: {
    name: "Elite",
    description: "For konkurransegolfere og seriøse utøvere",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      { name: "Treningsdagbok", included: true },
      { name: "Full statistikk", included: true },
      { name: "Ubegrenset logging", included: true },
      { name: "AI-analyse", included: true },
      { name: "Personlig treningsplan", included: true },
      { name: "Avansert SG-analyse", included: true },
      { name: "Peer-sammenligning", included: true },
      { name: "Turneringsplanlegger", included: true },
    ],
    cta: "Start 14-dagers gratis",
    highlight: false,
  },
} as const;

export function PricingTable({
  currentTier,
  onSelectPlan,
  loading,
}: PricingTableProps) {
  const [interval, setInterval] = useState<"month" | "year">("month");

  const calculateSavings = (tier: "PRO" | "ELITE") => {
    const monthly = TIERS[tier].monthlyPrice * 12;
    const yearly = TIERS[tier].yearlyPrice;
    return Math.round(((monthly - yearly) / monthly) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Interval Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setInterval("month")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-[background-color,color] ${
            interval === "month"
              ? "bg-on-surface text-surface"
              : "bg-surface-container text-on-surface-variant/80 hover:bg-surface-variant"
          }`}
        >
          Manedlig
        </button>
        <button
          onClick={() => setInterval("year")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-[background-color,color] flex items-center gap-2 ${
            interval === "year"
              ? "bg-on-surface text-surface"
              : "bg-surface-container text-on-surface-variant/80 hover:bg-surface-variant"
          }`}
        >
          Arlig
          <span className="px-2 py-0.5 bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-xs rounded-full">
            Spar opptil 17%
          </span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["VISITOR", "PRO", "ELITE"] as const).map((tierKey) => {
          const tier = TIERS[tierKey];
          const isCurrentTier = currentTier === tierKey;
          const price =
            interval === "month" ? tier.monthlyPrice : tier.yearlyPrice;
          const savingsPercent =
            tierKey !== "VISITOR" ? calculateSavings(tierKey) : 0;

          return (
            <motion.div
              key={tierKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-2xl border p-6 ${
                tier.highlight
                  ? "border-black bg-surface-container-lowest shadow-lg scale-105"
                  : "border-outline-variant/30 bg-surface"
              }`}
            >
              {/* Badge */}
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-on-surface text-surface text-xs font-semibold rounded-full">
                    <Icon name="star" className="h-3 w-3" />
                    Mest populaer
                  </span>
                </div>
              )}

              {tierKey === "ELITE" && (
                <div className="absolute top-4 right-4">
                  <Icon name="workspace_premium" className="h-5 w-5 text-on-surface-variant" />
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-on-surface mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-on-surface-variant/80">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-on-surface">
                    {price === 0 ? "Gratis" : `${price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-on-surface-variant/80 text-sm">
                      kr/{interval === "month" ? "mnd" : "ar"}
                    </span>
                  )}
                </div>
                {interval === "year" && savingsPercent > 0 && (
                  <p className="text-xs text-[var(--color-brand)] mt-1">
                    Spar {savingsPercent}% vs. manedlig
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-center gap-2 text-sm ${
                      feature.included ? "text-on-surface-variant/90" : "text-on-surface-variant"
                    }`}
                  >
                    {feature.included ? (
                      <Icon name="check" className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0" />
                    ) : (
                      <Icon name="close" className="h-4 w-4 text-on-surface-variant/60 flex-shrink-0" />
                    )}
                    {feature.name}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrentTier ? (
                <div className="text-center py-3 bg-surface-container rounded-xl">
                  <span className="text-sm font-medium text-on-surface-variant/80">
                    Ditt navarende abonnement
                  </span>
                </div>
              ) : tier.cta ? (
                <button
                  onClick={() =>
                    onSelectPlan(tierKey as "PRO" | "ELITE", interval)
                  }
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-[background-color,color] flex items-center justify-center gap-2 ${
                    tier.highlight
                      ? "bg-on-surface text-surface hover:bg-inverse-surface"
                      : "bg-surface-variant text-on-surface hover:bg-outline-variant"
                  }`}
                >
                  {loading === tierKey ? (
                    <Icon name="progress_activity" className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Icon name="auto_awesome" className="h-4 w-4" />
                      {tier.cta}
                    </>
                  )}
                </button>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-outline-variant/30">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant/80">
          <Icon name="shield" className="h-4 w-4" />
          <span>Sikker betaling med Stripe</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant/80">
          <Icon name="check" className="h-4 w-4" />
          <span>14 dagers gratis proveperiode</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant/80">
          <Icon name="close" className="h-4 w-4" />
          <span>Ingen binding</span>
        </div>
      </div>
    </div>
  );
}
