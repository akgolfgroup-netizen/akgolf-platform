"use client";

import { ArrowRight } from "lucide-react";

interface BottomProgressBarProps {
  completed: number;
  total: number;
  message: string;
  onComplete?: () => void;
}

export function BottomProgressBar({
  completed,
  total,
  message,
  onComplete,
}: BottomProgressBarProps) {
  const pct = Math.min(100, Math.round((completed / total) * 100));
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 grid items-center gap-6 px-8 py-4 lg:left-64"
      style={{
        background: "linear-gradient(180deg, rgba(10,31,24,0.85), rgba(10,31,24,0.98))",
        borderTop: "1px solid rgba(209,248,67,0.20)",
        backdropFilter: "blur(10px)",
        gridTemplateColumns: "1fr auto auto",
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.12em] font-bold whitespace-nowrap"
          style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {completed}/{total}
          <span
            className="ml-2 font-medium normal-case tracking-[0.06em]"
            style={{ color: "rgba(255,255,255,0.85)", textTransform: "none" }}
          >
            {message}
          </span>
        </div>
        <div
          className="flex-1 h-1.5 max-w-[320px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <span
            className="block h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #6FCBA1, #D1F843)",
            }}
          />
        </div>
      </div>
      <div
        className="font-mono text-[10px] uppercase tracking-[0.10em] hidden md:block"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        DATA AUTO-LAGRES
      </div>
      <button
        type="button"
        onClick={onComplete}
        className="inline-flex items-center gap-1.5 rounded-[10px] px-5 py-2.5 text-[13px] font-extrabold transition-opacity"
        style={{ background: "#D1F843", color: "#0A1F18" }}
      >
        Fullfør kartlegging
        <ArrowRight className="w-4 h-4" />
      </button>
    </footer>
  );
}
