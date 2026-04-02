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
      className={`relative flex items-center justify-between px-4 py-3 rounded-xl mb-4 ${
        isUrgent
          ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
          : "bg-gradient-to-r from-[var(--color-grey-100)] to-white border border-[var(--color-grey-200)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUrgent ? "bg-amber-100" : "bg-[var(--color-grey-200)]"
          }`}
        >
          {isUrgent ? (
            <Clock className="w-5 h-5 text-amber-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-[var(--color-grey-600)]" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-grey-900)]">
            {isExpired
              ? "Din proveperiode har utlopt"
              : `${timeLeft.days} ${timeLeft.days === 1 ? "dag" : "dager"} ${timeLeft.hours > 0 ? `og ${timeLeft.hours} timer` : ""} igjen av proveperioden`}
          </p>
          <p className="text-xs text-[var(--color-grey-500)]">
            {isExpired
              ? "Oppgrader na for a beholde tilgang til alle funksjoner"
              : "Oppgrader til Pro for ubegrenset tilgang"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUpgradeClick}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] ${
            isUrgent
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-[var(--color-grey-900)] text-white"
          }`}
        >
          Oppgrader na
        </button>
        {!isExpired && (
          <button
            onClick={() => setDismissed(true)}
            className="p-2 rounded-full hover:bg-[var(--color-grey-100)] transition-colors"
            aria-label="Lukk"
          >
            <X className="w-4 h-4 text-[var(--color-grey-400)]" />
          </button>
        )}
      </div>
    </div>
  );
}
