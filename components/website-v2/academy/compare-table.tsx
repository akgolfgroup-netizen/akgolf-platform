"use client";

import { Check, X } from "lucide-react";
import { ACADEMY_PRICING_V2 } from "@/lib/website-constants";
import { fonts, colors } from "./pricing-tokens";
import type { Plan } from "./plan-card";

type CompareRow = (typeof ACADEMY_PRICING_V2.compare.rows)[number];

interface CompareTableProps {
  rows: readonly CompareRow[];
  plans: readonly Plan[];
}

export function CompareTable({ rows, plans }: CompareTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th
            className="border-b-[1.5px] px-[18px] py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              fontFamily: fonts.mono,
              color: colors.muted,
              borderColor: colors.line,
            }}
          >
            Funksjon
          </th>
          {plans.map((plan) => {
            const isFeatured = "featured" in plan && plan.featured;
            return (
              <th
                key={plan.id}
                className="border-b-[1.5px] px-[18px] py-4 text-center"
                style={{ borderColor: colors.line }}
              >
                <strong
                  className="block text-[18px] font-extrabold tracking-[-0.01em]"
                  style={{
                    fontFamily: fonts.body,
                    color: isFeatured ? colors.primary : colors.ink,
                  }}
                >
                  {plan.name.replace(" · ", " — ")}
                </strong>
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.12em]"
                  style={{ fontFamily: fonts.mono, color: colors.muted }}
                >
                  {plan.priceMonthly} kr/mnd
                </span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          if ("group" in row && row.group !== undefined) {
            return (
              <tr key={`g-${i}`} style={{ background: colors.surface }}>
                <td
                  colSpan={plans.length + 1}
                  className="px-[18px] py-3.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ fontFamily: fonts.mono, color: colors.primary }}
                >
                  {row.group}
                </td>
              </tr>
            );
          }
          if (!("feature" in row) || !row.values) return null;
          return (
            <tr
              key={`r-${i}`}
              className="border-b transition-colors hover:bg-[var(--akgolf-surface,#F4F6F4)]"
              style={{ borderColor: colors.line }}
            >
              <td
                className="px-[18px] py-[18px] text-[14px] font-semibold"
                style={{ color: colors.ink }}
              >
                {row.feature}
              </td>
              {row.values.map((v, j) => (
                <td
                  key={j}
                  className="px-[18px] py-[18px] text-center text-[14px]"
                  style={{ color: colors.text }}
                >
                  {typeof v === "boolean" ? (
                    v ? (
                      <Check
                        className="inline h-4 w-4"
                        strokeWidth={2.5}
                        style={{ color: colors.primary }}
                      />
                    ) : (
                      <X
                        className="inline h-4 w-4"
                        strokeWidth={2}
                        style={{ color: colors.line }}
                      />
                    )
                  ) : (
                    v
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
