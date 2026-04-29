"use client";

import {
  ArrowRight,
  Check,
  Sprout,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { fonts, colors } from "../academy/pricing-tokens";
import type { BillingMode } from "./billing-toggle";
import type { MainPlan, PlanIcon } from "./data";

const ICON_MAP: Record<PlanIcon, LucideIcon> = {
  Target,
  TrendingUp,
  Users,
  Sprout,
};

interface MainPlanCardProps {
  plan: MainPlan;
  billing: BillingMode;
}

export function MainPlanCard({ plan, billing }: MainPlanCardProps) {
  const isFeatured = plan.featured === true;
  const Icon = ICON_MAP[plan.icon];

  const amount = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const sub = billing === "yearly" ? plan.subYearly : plan.subMonthly;

  return (
    <article
      className={`group relative flex flex-col rounded-[24px] border p-8 pt-8 pb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,31,24,0.10)] ${
        isFeatured ? "lg:-translate-y-2 hover:lg:-translate-y-3" : ""
      }`}
      style={{
        background: isFeatured ? colors.ink : "#fff",
        borderColor: isFeatured ? colors.ink : colors.line,
        color: isFeatured ? "#fff" : colors.text,
      }}
    >
      {plan.badge ? (
        <span
          className="absolute -top-2.5 left-6 rounded-full px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em]"
          style={{
            background: colors.accent,
            color: colors.ink,
            fontFamily: fonts.mono,
          }}
        >
          {plan.badge}
        </span>
      ) : null}

      <div
        className="mb-[18px] grid h-11 w-11 place-items-center rounded-xl"
        style={{
          background: isFeatured ? "rgba(209,248,67,0.18)" : "rgba(0,88,64,0.10)",
          color: isFeatured ? colors.accent : colors.primary,
        }}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
      </div>

      <div
        className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{
          fontFamily: fonts.mono,
          color: isFeatured ? colors.accent : colors.primary,
        }}
      >
        {plan.name}
      </div>

      <h3
        className="mb-1.5 text-[24px] font-extrabold tracking-[-0.025em]"
        style={{
          fontFamily: fonts.display,
          color: isFeatured ? "#fff" : colors.ink,
        }}
      >
        {plan.title}
      </h3>

      <p
        className="mb-5 text-[13px] leading-[1.5]"
        style={{ color: isFeatured ? "rgba(255,255,255,0.7)" : colors.text }}
      >
        {plan.tagline}
      </p>

      <div
        className="flex items-baseline gap-1.5 border-t pt-[18px]"
        style={{
          borderColor: isFeatured ? "rgba(255,255,255,0.10)" : colors.line,
        }}
      >
        <span
          className="text-[38px] font-extrabold tracking-[-0.035em] tabular-nums"
          style={{
            fontFamily: fonts.body,
            color: isFeatured ? "#fff" : colors.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {amount}
        </span>
        <span
          className="text-[10px] font-semibold tracking-[0.10em]"
          style={{
            fontFamily: fonts.mono,
            color: isFeatured ? "rgba(255,255,255,0.55)" : colors.muted,
          }}
        >
          {plan.unit}
        </span>
      </div>

      <div
        className="mt-1.5 mb-[22px] text-[12px]"
        style={{ color: isFeatured ? "rgba(255,255,255,0.55)" : colors.muted }}
      >
        {sub}
      </div>

      <ul className="m-0 mb-6 flex flex-1 list-none flex-col gap-2.5 p-0">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-[13px] leading-[1.5]"
            style={{
              color: isFeatured ? "rgba(255,255,255,0.85)" : colors.text,
            }}
          >
            <Check
              className="mt-[3px] h-3.5 w-3.5 flex-shrink-0"
              strokeWidth={2.4}
              style={{ color: isFeatured ? colors.accent : colors.primary }}
            />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={plan.href}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold transition-transform hover:-translate-y-px"
        style={{
          background: isFeatured ? colors.accent : colors.ink,
          color: isFeatured ? colors.ink : "#fff",
          fontFamily: fonts.body,
        }}
      >
        {plan.cta}
        <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
      </a>
    </article>
  );
}
