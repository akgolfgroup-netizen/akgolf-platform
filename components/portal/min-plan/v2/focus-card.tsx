"use client";

import type { LucideIcon } from "lucide-react";

export type FocusTone = "putt" | "iron" | "short" | "driver";

const TONE_BG: Record<FocusTone, { bg: string; color: string }> = {
  putt: { bg: "rgba(118,193,156,0.18)", color: "#6FCBA1" },
  iron: { bg: "rgba(126,158,255,0.20)", color: "#8AA8FF" },
  short: { bg: "rgba(232,185,103,0.20)", color: "#E8B967" },
  driver: { bg: "rgba(244,146,131,0.20)", color: "#F49283" },
};

interface FocusCardProps {
  tone: FocusTone;
  priority: string;
  name: string;
  sgValue: string;
  sgUnit?: string;
  description: string;
  nextSession: string;
  frequency: string;
  Icon: LucideIcon;
}

export function FocusCard({
  tone,
  priority,
  name,
  sgValue,
  sgUnit = "SG/runde",
  description,
  nextSession,
  frequency,
  Icon,
}: FocusCardProps) {
  const palette = TONE_BG[tone];
  return (
    <div
      className="flex flex-col gap-2.5 rounded-[14px] px-5 py-4.5"
      style={{
        background: "#0D2E23",
        border: "1px solid #1A4A3A",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div
            className="mb-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.04em",
            }}
          >
            {priority}
          </div>
          <div className="text-[15px] font-bold tracking-[-0.01em] text-white">
            {name}
          </div>
        </div>
        <div
          className="grid h-9 w-9 place-items-center rounded-[10px]"
          style={{ background: palette.bg, color: palette.color }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div
        className="text-[22px] font-bold tabular-nums tracking-[-0.02em] text-white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {sgValue}{" "}
        <small className="text-xs" style={{ color: "#6FCBA1", marginLeft: 4 }}>
          {sgUnit}
        </small>
      </div>
      <div
        className="text-[13px] leading-[1.5]"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        {description}
      </div>
      <div
        className="mt-2 flex items-center justify-between border-t border-dashed pt-2.5 font-mono text-[10px] uppercase"
        style={{
          borderColor: "#1A4A3A",
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.06em",
        }}
      >
        <span>{nextSession}</span>
        <strong className="font-semibold" style={{ color: "#D1F843" }}>
          {frequency}
        </strong>
      </div>
    </div>
  );
}
