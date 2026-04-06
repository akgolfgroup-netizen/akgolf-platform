"use client";

import { useState, useEffect, useId } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const handleUpgrade = async (tier: "PRO" | "ELITE") => {
    setIsLoading(true);
    try {
      const moduleSlug = tier === "PRO" ? "pro" : "elite";
      const interval = billingPeriod === "annual" ? "year" : "month";

      const res = await fetch("/api/portal/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, interval }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl rounded-2xl p-6 md:p-8 overscroll-contain"
        style={{
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Lukk dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-grey-100)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)]"
        >
          <X className="w-5 h-5 text-[var(--color-grey-500)]" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 id={titleId} className="text-xl md:text-2xl font-bold text-[var(--color-grey-900)] mb-1">
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)] ${
                billingPeriod === "monthly"
                  ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                  : "text-[var(--color-grey-500)]"
              }`}
            >
              Månedlig
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)] ${
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
              <Zap className="w-5 h-5 text-[var(--color-brand)]" aria-hidden="true" />
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
                <p className="text-xs text-[var(--color-brand)] mt-1">
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
                  <Check className="w-4 h-4 text-[var(--color-brand)] mt-0.5 shrink-0" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade("PRO")}
              disabled={isLoading}
              className="w-full py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)] disabled:opacity-50"
              style={{
                background: "var(--color-grey-900)",
                color: "white",
              }}
            >
              {isLoading ? "Laster..." : "Velg Pro"}
            </button>
          </div>

          {/* Pro+ */}
          <div
            className="rounded-xl p-5 border-2 relative"
            style={{ borderColor: "var(--color-brand)" }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "var(--color-brand)", color: "white" }}
            >
              Mest populær
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-[var(--color-brand)]" aria-hidden="true" />
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
                <p className="text-xs text-[var(--color-brand)] mt-1">
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
                  <Check className="w-4 h-4 text-[var(--color-brand)] mt-0.5 shrink-0" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade("ELITE")}
              disabled={isLoading}
              className="w-full py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)] disabled:opacity-50"
              style={{
                background: "var(--color-brand)",
                color: "white",
              }}
            >
              {isLoading ? "Laster..." : "Velg Pro+"}
            </button>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[var(--color-grey-200)]">
          <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
            <Users className="w-4 h-4 text-[var(--color-brand)]" aria-hidden="true" />
            <span>127 spillere oppgraderte denne maneden</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
            <TrendingDown className="w-4 h-4 text-[var(--color-brand)]" aria-hidden="true" />
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
