"use client";

import { fonts, colors } from "../academy/pricing-tokens";
import { PRICING_HERO } from "./data";

export type BillingMode = "monthly" | "yearly";

interface BillingToggleProps {
  mode: BillingMode;
  onChange: (mode: BillingMode) => void;
}

export function BillingToggle({ mode, onChange }: BillingToggleProps) {
  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-1 rounded-full border bg-white p-1"
      style={{ borderColor: colors.line }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "monthly"}
        onClick={() => onChange("monthly")}
        className="inline-flex items-center gap-2 rounded-full px-[18px] py-2.5 text-[13px] font-semibold transition-colors"
        style={{
          background: mode === "monthly" ? colors.ink : "transparent",
          color: mode === "monthly" ? "#fff" : colors.muted,
          letterSpacing: "-0.005em",
        }}
      >
        {PRICING_HERO.toggleMonthly}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "yearly"}
        onClick={() => onChange("yearly")}
        className="inline-flex items-center gap-2 rounded-full px-[18px] py-2.5 text-[13px] font-semibold transition-colors"
        style={{
          background: mode === "yearly" ? colors.ink : "transparent",
          color: mode === "yearly" ? "#fff" : colors.muted,
          letterSpacing: "-0.005em",
        }}
      >
        {PRICING_HERO.toggleYearly}
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em]"
          style={{
            background: colors.accent,
            color: colors.ink,
            fontFamily: fonts.mono,
          }}
        >
          {PRICING_HERO.yearlySaveLabel}
        </span>
      </button>
    </div>
  );
}
