"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface MilestoneCardProps {
  quarter: string;
  title: string;
  target: string;
  description: string;
  state: "done" | "now" | "upcoming";
}

export function MilestoneCard({
  quarter,
  title,
  target,
  description,
  state,
}: MilestoneCardProps) {
  const isDone = state === "done";
  const isNow = state === "now";

  return (
    <div
      className={cn("relative rounded-[12px] p-4")}
      style={{
        background: isDone
          ? "rgba(209,248,67,0.05)"
          : "#0D2E23",
        border: isDone
          ? "1px solid rgba(209,248,67,0.25)"
          : isNow
            ? "1px solid rgba(209,248,67,0.40)"
            : "1px solid #1A4A3A",
        boxShadow: isNow ? "0 0 0 3px rgba(209,248,67,0.05)" : undefined,
      }}
    >
      {isDone ? (
        <div
          className="float-right"
          style={{ color: "#6FCBA1" }}
        >
          <CheckCircle2 className="h-4 w-4" />
        </div>
      ) : null}
      {isNow ? (
        <div
          className="absolute right-2.5 top-2 font-mono text-[9px] font-semibold"
          style={{ color: "#D1F843", letterSpacing: "0.1em" }}
        >
          NÅ
        </div>
      ) : null}
      <div
        className="font-mono text-[9px] uppercase"
        style={{
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.14em",
        }}
      >
        {quarter}
      </div>
      <div className="my-1.5 text-sm font-bold text-white">{title}</div>
      <div
        className="text-[24px] font-bold leading-none tracking-[-0.02em] tabular-nums"
        style={{
          color: isDone ? "#6FCBA1" : "#D1F843",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {target}
      </div>
      <div
        className="mt-1.5 text-[11px] leading-[1.4]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {description}
      </div>
    </div>
  );
}
