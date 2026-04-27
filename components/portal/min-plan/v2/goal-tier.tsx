"use client";

import { cn } from "@/lib/portal/utils/cn";
import { MonoCaps } from "./dark-card";

interface GoalTierProps {
  label: string;
  title: string;
  metaLeft: { label: string; value: string };
  metaRight: string;
  percent: number;
  rightLabel: string;
  highlighted?: boolean;
}

export function GoalTier({
  label,
  title,
  metaLeft,
  metaRight,
  percent,
  rightLabel,
  highlighted = false,
}: GoalTierProps) {
  return (
    <div
      className={cn("rounded-[16px] p-5")}
      style={{
        background: highlighted
          ? "linear-gradient(180deg, rgba(209,248,67,0.04), transparent 50%)"
          : "#0D2E23",
        border: highlighted
          ? "1px solid rgba(209,248,67,0.30)"
          : "1px solid #1A4A3A",
      }}
    >
      <MonoCaps className="!mb-2.5">{label}</MonoCaps>
      <div
        className="mb-3.5 text-[17px] font-bold leading-[1.25] tracking-[-0.02em] text-white"
        style={{ fontFamily: "var(--font-inter-tight, Inter)" }}
      >
        {title}
      </div>
      <div
        className="mb-3.5 flex items-center gap-2.5 text-xs"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        <span>
          {metaLeft.label}:{" "}
          <strong className="font-semibold text-white">{metaLeft.value}</strong>
        </span>
        <span
          className="inline-block h-1 w-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
        <span>{metaRight}</span>
      </div>
      <div
        className="mb-2 h-1.5 overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, Math.max(0, percent))}%`,
            background: "#D1F843",
          }}
        />
      </div>
      <div
        className="flex justify-between font-mono text-[10px]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        <span>{Math.round(percent)}%</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
