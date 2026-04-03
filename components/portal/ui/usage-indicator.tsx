"use client";

import { SubscriptionTier } from "@prisma/client";
import { isFreeTier } from "@/lib/portal/tier-utils";

interface UsageIndicatorProps {
  tier: SubscriptionTier;
  logCount: number;
  logLimit: number;
  aiCount: number;
  aiLimit: number;
  onUpgradeClick?: () => void;
}

export function UsageIndicator({
  tier,
  logCount,
  logLimit,
  aiCount,
  aiLimit,
  onUpgradeClick,
}: UsageIndicatorProps) {
  // Don't show for paid users
  if (!isFreeTier(tier)) {
    return null;
  }

  const logPercentage = Math.min(100, (logCount / logLimit) * 100);
  const aiPercentage = Math.min(100, (aiCount / aiLimit) * 100);

  const isLogNearLimit = logCount >= logLimit - 1;
  const isAiNearLimit = aiCount >= aiLimit;

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{
        background: "var(--color-grey-50)",
        border: "1px solid var(--color-grey-200)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[var(--color-grey-700)]">
          Gratis-konto
        </span>
        {onUpgradeClick && (
          <button
            onClick={onUpgradeClick}
            className="text-xs font-medium text-[#16a34a] hover:underline"
          >
            Oppgrader
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Log usage */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--color-grey-500)]">Treningslogger</span>
            <span
              className={
                isLogNearLimit
                  ? "text-[#FF9500] font-medium"
                  : "text-[var(--color-grey-600)]"
              }
            >
              {logCount} av {logLimit}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--color-grey-200)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${logPercentage}%`,
                background: isLogNearLimit ? "#FF9500" : "#16a34a",
              }}
            />
          </div>
        </div>

        {/* AI usage */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--color-grey-500)]">AI-analyser</span>
            <span
              className={
                isAiNearLimit
                  ? "text-[#FF9500] font-medium"
                  : "text-[var(--color-grey-600)]"
              }
            >
              {aiCount} av {aiLimit}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--color-grey-200)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${aiPercentage}%`,
                background: isAiNearLimit ? "#FF9500" : "#16a34a",
              }}
            />
          </div>
        </div>
      </div>

      {(isLogNearLimit || isAiNearLimit) && (
        <p className="text-xs text-[var(--color-grey-500)] mt-3">
          {isLogNearLimit && logCount >= logLimit
            ? "Du har nådd grensen for logging denne måneden."
            : isLogNearLimit
              ? "Du nærmer deg grensen for logging."
              : ""}
          {isAiNearLimit
            ? " Du har brukt din månedlige AI-analyse."
            : ""}
        </p>
      )}
    </div>
  );
}
