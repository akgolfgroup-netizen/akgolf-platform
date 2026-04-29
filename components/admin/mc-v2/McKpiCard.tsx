import type { ReactNode } from "react";

interface McKpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  tone?: "default" | "accent" | "success" | "warning" | "danger";
  sub?: string;
}

const TONE_STYLES: Record<string, { value: string; sub: string }> = {
  default: { value: "#FFFFFF", sub: "rgba(255,255,255,0.45)" },
  accent: { value: "#D1F843", sub: "rgba(209,248,67,0.65)" },
  success: { value: "#6FCBA1", sub: "rgba(111,203,161,0.65)" },
  warning: { value: "#E8B967", sub: "rgba(232,185,103,0.65)" },
  danger: { value: "#F49283", sub: "rgba(244,146,131,0.65)" },
};

export function McKpiCard({ label, value, unit, icon, tone = "default", sub }: McKpiCardProps) {
  const t = TONE_STYLES[tone] ?? TONE_STYLES.default;
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {label}
        </span>
        {icon && <span className="text-white/40">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-[26px] font-bold tracking-[-0.025em] tabular-nums"
          style={{ color: t.value, fontFamily: "var(--font-inter-tight)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[13px] font-medium text-white/45">{unit}</span>
        )}
      </div>
      {sub && (
        <div className="mt-1 text-[11px] font-medium" style={{ color: t.sub }}>
          {sub}
        </div>
      )}
    </div>
  );
}
