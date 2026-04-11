"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Clock } from "lucide-react";
import { differenceInDays, differenceInHours } from "date-fns";

interface TrialBannerProps {
  trialEndsAt: Date | string;
  onUpgradeClick: () => void;
}

export function TrialBanner({ trialEndsAt, onUpgradeClick }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number }>({
    days: 0,
    hours: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(trialEndsAt);
      const now = new Date();
      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      setTimeLeft({ days: Math.max(0, days), hours: Math.max(0, hours) });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [trialEndsAt]);

  if (dismissed) return null;

  const isUrgent = timeLeft.days <= 2;
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0;

  return (
    <div
      className={`relative flex items-center justify-between px-4 py-3 rounded-xl mb-4 overflow-hidden ${
        isUrgent
          ? "bg-[color-mix(in_srgb,var(--color-warning)_12%,white)] border border-[color-mix(in_srgb,var(--color-warning)_35%,transparent)]"
          : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] border border-[var(--color-primary-alt)] shadow-sm"
      }`}
    >
      {!isUrgent && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1 bg-[var(--color-accent-cta)]"
        />
      )}
      <div className="relative flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUrgent
              ? "bg-[color-mix(in_srgb,var(--color-warning)_25%,white)]"
              : "bg-[color-mix(in_srgb,var(--color-accent-cta)_20%,transparent)] ring-1 ring-[var(--color-accent-cta)]/40"
          }`}
        >
          {isUrgent ? (
            <Clock className="w-5 h-5 text-[var(--color-warning)]" />
          ) : (
            <Sparkles className="w-5 h-5 text-[var(--color-accent-cta)]" />
          )}
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${
              isUrgent
                ? "text-[var(--color-grey-900)]"
                : "text-white"
            }`}
          >
            {isExpired
              ? "Din proveperiode har utlopt"
              : `${timeLeft.days} ${timeLeft.days === 1 ? "dag" : "dager"} ${timeLeft.hours > 0 ? `og ${timeLeft.hours} timer` : ""} igjen av proveperioden`}
          </p>
          <p
            className={`text-xs ${
              isUrgent
                ? "text-[var(--color-grey-600)]"
                : "text-white/75"
            }`}
          >
            {isExpired
              ? "Oppgrader na for a beholde tilgang til alle funksjoner"
              : "Oppgrader til Pro for ubegrenset tilgang"}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <button
          onClick={onUpgradeClick}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] ${
            isUrgent
              ? "bg-[var(--color-warning)] text-white hover:brightness-110"
              : "bg-[var(--color-accent-cta)] text-[var(--color-accent-cta-text)] hover:brightness-[1.03]"
          }`}
        >
          Oppgrader na
        </button>
        {!isExpired && (
          <button
            onClick={() => setDismissed(true)}
            className={`p-2 rounded-full transition-colors ${
              isUrgent
                ? "hover:bg-[color-mix(in_srgb,var(--color-warning)_20%,transparent)]"
                : "hover:bg-white/10"
            }`}
            aria-label="Lukk"
          >
            <X
              className={`w-4 h-4 ${
                isUrgent ? "text-[var(--color-grey-500)]" : "text-white/80"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
