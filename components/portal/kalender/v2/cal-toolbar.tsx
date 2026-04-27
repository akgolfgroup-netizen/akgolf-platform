"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export type ViewMode = "day" | "week" | "month";

interface CalToolbarProps {
  monthLabel: string;
  year: number;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalToolbar({
  monthLabel,
  year,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
}: CalToolbarProps) {
  return (
    <div
      className="flex items-center gap-4 py-3.5 mb-3.5"
      style={{ borderBottom: "1px solid #1a4a3a" }}
    >
      <div
        className="text-[26px] font-extrabold tracking-[-0.025em] text-white"
        style={{ minWidth: "230px", fontFamily: "var(--font-inter-tight)" }}
      >
        {monthLabel}
        <span
          className="font-medium ml-2"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          {year}
        </span>
      </div>

      <div className="flex gap-1">
        <ToolbarBtn onClick={onPrev}>
          <ChevronLeft className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={onNext}>
          <ChevronRight className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      <button
        type="button"
        onClick={onToday}
        className="rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.10em] font-bold"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        I dag
      </button>

      <div
        className="ml-auto inline-flex rounded-[10px] p-[3px]"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {(["day", "week", "month"] as const).map((m) => {
          const active = viewMode === m;
          const label = m === "day" ? "Dag" : m === "week" ? "Uke" : "Måned";
          return (
            <button
              key={m}
              type="button"
              onClick={() => onViewModeChange(m)}
              className="px-3.5 py-1.5 rounded-[7px] font-mono text-[10px] font-bold uppercase tracking-[0.10em] transition-colors"
              style={{
                background: active ? "#D1F843" : "transparent",
                color: active ? "#0A1F18" : "rgba(255,255,255,0.6)",
                border: "none",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-8 h-8 rounded-lg grid place-items-center"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {children}
    </button>
  );
}
