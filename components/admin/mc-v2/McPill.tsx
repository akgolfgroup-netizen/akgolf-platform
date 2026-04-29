import type { ReactNode } from "react";

type PillTone = "default" | "accent" | "success" | "warning" | "danger" | "info" | "violet";

interface McPillProps {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
}

const STYLES: Record<PillTone, React.CSSProperties> = {
  default: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" },
  accent: { background: "rgba(209,248,67,0.14)", color: "#D1F843" },
  success: { background: "rgba(42,125,90,0.22)", color: "#6FCBA1" },
  warning: { background: "rgba(196,138,50,0.18)", color: "#E8B967" },
  danger: { background: "rgba(184,66,51,0.18)", color: "#F49283" },
  info: { background: "rgba(0,122,255,0.14)", color: "#6FB3FF" },
  violet: { background: "rgba(175,82,222,0.14)", color: "#C896E8" },
};

export function McPill({ tone = "default", children, className = "" }: McPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${className}`}
      style={STYLES[tone]}
    >
      {children}
    </span>
  );
}
