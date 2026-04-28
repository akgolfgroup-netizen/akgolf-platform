"use client";

import { Check } from "lucide-react";
import { ACADEMY_PRICING_V2 } from "@/lib/website-constants";
import { fonts, colors } from "./pricing-tokens";

export type Plan = (typeof ACADEMY_PRICING_V2.plans)[number];

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const isFeatured = "featured" in plan && plan.featured;
  const ribbon = "ribbon" in plan ? plan.ribbon : undefined;

  return (
    <article
      className={`relative flex flex-col rounded-[28px] border p-9 pt-9 pb-8 transition-all ${
        isFeatured ? "lg:-translate-y-3 lg:scale-[1.04]" : ""
      }`}
      style={{
        background: isFeatured ? colors.ink : "#fff",
        borderColor: isFeatured ? colors.ink : colors.line,
        color: isFeatured ? "#fff" : colors.text,
        boxShadow: isFeatured ? "0 30px 70px rgba(10,31,24,0.18)" : undefined,
      }}
    >
      {ribbon ? (
        <span
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{
            background: colors.accent,
            color: colors.ink,
            fontFamily: fonts.mono,
          }}
        >
          {ribbon}
        </span>
      ) : null}

      <div
        className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
        style={{
          fontFamily: fonts.mono,
          color: isFeatured ? colors.accent : colors.primary,
        }}
      >
        {plan.name}
      </div>
      <div
        className="mb-1 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em]"
        style={{
          fontFamily: fonts.display,
          color: isFeatured ? "#fff" : colors.ink,
        }}
      >
        {plan.tagline}
      </div>
      <p
        className="mb-7 min-h-[42px] text-[14px] leading-[1.5]"
        style={{ color: isFeatured ? "rgba(255,255,255,0.85)" : colors.text }}
      >
        {plan.description}
      </p>

      <div className="flex items-baseline gap-1">
        <span
          className="text-[18px] font-semibold"
          style={{
            color: isFeatured ? "rgba(255,255,255,0.55)" : colors.muted,
          }}
        >
          kr
        </span>
        <span
          className="text-[64px] leading-none tracking-[-0.03em]"
          style={{
            fontFamily: fonts.italic,
            fontStyle: "italic",
            fontWeight: 500,
            color: isFeatured ? "#fff" : colors.ink,
          }}
        >
          {plan.priceMonthly}
        </span>
        <span
          className="ml-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{
            fontFamily: fonts.mono,
            color: isFeatured ? "rgba(255,255,255,0.55)" : colors.muted,
          }}
        >
          {plan.period}
        </span>
      </div>
      <div
        className="mt-1 mb-7 text-[12px]"
        style={{ color: isFeatured ? "rgba(255,255,255,0.55)" : colors.muted }}
      >
        {plan.billed}
      </div>

      <a
        href={plan.href}
        className="mb-8 block rounded-full py-3.5 text-center text-[14px] font-bold transition-all hover:-translate-y-px"
        style={{
          background: isFeatured ? colors.accent : colors.surface,
          color: colors.ink,
          boxShadow: isFeatured ? undefined : "inset 0 0 0 1px " + colors.line,
        }}
      >
        {plan.cta}
      </a>

      <div
        className="mb-3.5 border-t pt-5 text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{
          fontFamily: fonts.mono,
          borderColor: isFeatured ? "rgba(255,255,255,0.15)" : colors.line,
          color: isFeatured ? "rgba(255,255,255,0.55)" : colors.muted,
        }}
      >
        {plan.sectionTitle}
      </div>
      <ul className="m-0 mb-2 flex list-none flex-col gap-[11px] p-0">
        {plan.features.map((f) => {
          const heavy = "heavy" in f && f.heavy;
          return (
            <li
              key={f.text}
              className="flex items-start gap-2.5 text-[14px] leading-[1.5]"
              style={{
                color: isFeatured
                  ? heavy
                    ? "#fff"
                    : "rgba(255,255,255,0.85)"
                  : heavy
                    ? colors.ink
                    : colors.text,
                fontWeight: heavy ? 600 : 400,
              }}
            >
              <Check
                className="mt-1 h-3.5 w-3.5 flex-shrink-0"
                strokeWidth={2.5}
                style={{ color: isFeatured ? colors.accent : colors.primary }}
              />
              {f.text}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
