"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

const UPGRADE_OPTIONS = [
  {
    tier: "ACADEMY",
    label: "Gruppe",
    price: "900 kr/mnd",
    desc: "2 x 60 min gruppeøkt",
    recommended: false,
  },
  {
    tier: "STARTER",
    label: "Performance",
    price: "1 600 kr/mnd",
    desc: "2 x 20 min per uke",
    recommended: true,
  },
  {
    tier: "PRO",
    label: "Performance Pro",
    price: "2 000 kr/mnd",
    desc: "4 x 20 min per uke",
    recommended: false,
  },
];

interface UpgradeOptionsProps {
  currentTier: string;
  onUpgrade: () => void;
  isPending: boolean;
}

export function UpgradeOptions({
  currentTier,
  onUpgrade,
  isPending,
}: UpgradeOptionsProps) {
  if (currentTier === "PRO" || currentTier === "ELITE") return null;

  return (
    <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-surface">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-primary" />
          Tilgjengelige oppgraderinger
        </h3>
      </div>
      <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {UPGRADE_OPTIONS.filter((opt) => opt.tier !== currentTier).map(
          (plan) => (
            <div
              key={plan.tier}
              className={cn(
                "text-center p-4 rounded-xl border transition-colors",
                plan.recommended
                  ? "border-primary bg-primary/5"
                  : "border-grey-200 bg-surface"
              )}
            >
              {plan.recommended && (
                <span className="inline-block px-2 py-0.5 mb-2 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                  Anbefalt
                </span>
              )}
              <p className="text-sm font-semibold text-text">{plan.label}</p>
              <p className="text-base font-bold text-primary mt-1">
                {plan.price}
              </p>
              <p className="text-xs text-muted mt-0.5">{plan.desc}</p>
              <button
                onClick={onUpgrade}
                disabled={isPending}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[20px] text-xs font-semibold transition-all",
                  plan.recommended
                    ? "bg-accent-cta text-accent-cta-text hover:brightness-95"
                    : "bg-white border border-grey-200 text-text hover:bg-grey-50"
                )}
              >
                Velg
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
