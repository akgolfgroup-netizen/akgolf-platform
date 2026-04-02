"use client";

import { useState } from "react";
import { X, Check, Zap, Crown, Users, TrendingDown } from "lucide-react";
import { SubscriptionTier } from "@prisma/client";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  trigger: "log_limit" | "ai_limit" | "feature" | "general";
  currentUsage?: {
    logCount?: number;
    aiCount?: number;
  };
}

const TRIGGER_MESSAGES = {
  log_limit: {
    title: "Du har nådd grensen",
    subtitle: "Du har logget 4 økter denne måneden",
  },
  ai_limit: {
    title: "Du har brukt din AI-analyse",
    subtitle: "Gratis brukere får 1 analyse per måned",
  },
  feature: {
    title: "Oppgrader for å låse opp",
    subtitle: "Denne funksjonen krever et betalt abonnement",
  },
  general: {
    title: "Få mer ut av treningen",
    subtitle: "Oppgrader for ubegrenset tilgang",
  },
};

const PRO_FEATURES = [
  "Ubegrenset logging av økter",
  "Full treningshistorikk",
  "Ubegrenset AI-analyse",
  "AI treningsplan",
  "Alle SLAG-kategorier",
  "Eksport til PDF/CSV",
];

const PRO_PLUS_FEATURES = [
  "Alt i Pro",
  "TrackMan-import",
  "Videoanalyse",
  "Del med trener",
];

export function UpgradeModal({
  isOpen,
  onClose,
  currentTier,
  trigger,
  currentUsage,
}: UpgradeModalProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  if (!isOpen) return null;

  const message = TRIGGER_MESSAGES[trigger];

  const proPrices = {
    monthly: { price: 199, period: "/mnd" },
    annual: { price: 149, period: "/mnd", total: 1788, savings: 600 },
  };

  const proPlusPrices = {
    monthly: { price: 299, period: "/mnd" },
    annual: { price: 219, period: "/mnd", total: 2628, savings: 960 },
  };

  const handleUpgrade = (tier: "PRO" | "ELITE") => {
    // TODO: Redirect to Stripe checkout
    const checkoutUrl = `/api/portal/subscription/checkout?tier=${tier}&period=${billingPeriod}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl p-6 md:p-8"
        style={{
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-grey-100)] transition-colors"
        >
          <X className="w-5 h-5 text-[var(--color-grey-500)]" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-grey-900)] mb-1">
            {message.title}
          </h2>
          <p className="text-sm text-[var(--color-grey-500)]">
            {message.subtitle}
          </p>
          {currentUsage && trigger === "log_limit" && (
            <p className="text-xs text-[var(--color-grey-400)] mt-1">
              {currentUsage.logCount} av 4 økter brukt denne måneden
            </p>
          )}
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex rounded-full p-1"
            style={{ background: "var(--color-grey-100)" }}
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                  : "text-[var(--color-grey-500)]"
              }`}
            >
              Månedlig
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "annual"
                  ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                  : "text-[var(--color-grey-500)]"
              }`}
            >
              Årlig (spar 25%)
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Pro */}
          <div
            className="rounded-xl p-5 border"
            style={{ borderColor: "var(--color-grey-200)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-[#16a34a]" />
              <h3 className="font-semibold text-[var(--color-grey-900)]">Pro</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-[var(--color-grey-900)]">
                {billingPeriod === "monthly"
                  ? proPrices.monthly.price
                  : proPrices.annual.price}{" "}
                kr
              </span>
              <span className="text-[var(--color-grey-500)]">
                {billingPeriod === "monthly"
                  ? proPrices.monthly.period
                  : proPrices.annual.period}
              </span>
              {billingPeriod === "annual" && (
                <p className="text-xs text-[#16a34a] mt-1">
                  Spar {proPrices.annual.savings} kr/år
                </p>
              )}
            </div>
            <ul className="space-y-2 mb-5">
              {PRO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-[var(--color-grey-600)]"
                >
                  <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade("PRO")}
              className="w-full py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                background: "var(--color-grey-900)",
                color: "white",
              }}
            >
              Velg Pro
            </button>
          </div>

          {/* Pro+ */}
          <div
            className="rounded-xl p-5 border-2 relative"
            style={{ borderColor: "#16a34a" }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "#16a34a", color: "white" }}
            >
              Mest populær
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-[#16a34a]" />
              <h3 className="font-semibold text-[var(--color-grey-900)]">
                Pro+
              </h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-[var(--color-grey-900)]">
                {billingPeriod === "monthly"
                  ? proPlusPrices.monthly.price
                  : proPlusPrices.annual.price}{" "}
                kr
              </span>
              <span className="text-[var(--color-grey-500)]">
                {billingPeriod === "monthly"
                  ? proPlusPrices.monthly.period
                  : proPlusPrices.annual.period}
              </span>
              {billingPeriod === "annual" && (
                <p className="text-xs text-[#16a34a] mt-1">
                  Spar {proPlusPrices.annual.savings} kr/år
                </p>
              )}
            </div>
            <ul className="space-y-2 mb-5">
              {PRO_PLUS_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-[var(--color-grey-600)]"
                >
                  <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade("ELITE")}
              className="w-full py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                background: "#16a34a",
                color: "white",
              }}
            >
              Velg Pro+
            </button>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[var(--color-grey-200)]">
          <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
            <Users className="w-4 h-4 text-[#16a34a]" />
            <span>127 spillere oppgraderte denne maneden</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
            <TrendingDown className="w-4 h-4 text-[#16a34a]" />
            <span>Snitt HCP-forbedring: 2.3 slag</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-grey-400)] mt-4">
          Ingen binding. Avslutt nar som helst.
        </p>
      </div>
    </div>
  );
}
