"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";

export interface AdjustmentSuggestion {
  adherencePct: number;
  recommendation: "reduce" | "increase" | "adjust" | "none";
  message: string;
  detailMessage: string;
}

interface PlanAdjustmentBannerProps {
  suggestion: AdjustmentSuggestion | null;
  onDismiss: () => void;
}

export function PlanAdjustmentBanner({ suggestion, onDismiss }: PlanAdjustmentBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!suggestion || dismissed || suggestion.recommendation === "none") return null;

  const isNegative = suggestion.recommendation === "reduce";
  const isPositive = suggestion.recommendation === "increase";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 mb-6 transition-colors",
        isNegative
          ? "bg-error/5 border-error/20"
          : isPositive
            ? "bg-warning/5 border-warning/20"
            : "bg-info/5 border-info/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
            isNegative
              ? "bg-error/10 text-error"
              : isPositive
                ? "bg-warning/10 text-warning"
                : "bg-info/10 text-info"
          )}
        >
          <Icon
            name={isNegative ? "trending_down" : isPositive ? "trending_up" : "info"}
            className="w-5 h-5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {suggestion.message}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {suggestion.detailMessage}
              </p>
            </div>
            <button
              onClick={() => {
                setDismissed(true);
                onDismiss();
              }}
              className="p-1 rounded-lg hover:bg-surface-container transition-colors shrink-0"
            >
              <Icon name="close" className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Link
              href="/portal/dagbok"
              className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center gap-1"
            >
              <Icon name="menu_book" className="w-3.5 h-3.5" />
              Se dagbok
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
