import type { ReactNode } from "react";

interface McCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  padding?: number | string;
}

export function McCard({ children, className = "", glow, padding = 18 }: McCardProps) {
  return (
    <div
      className={className}
      style={{
        background: glow ? "rgba(209,248,67,0.04)" : "rgba(255,255,255,0.025)",
        border: glow
          ? "1px solid rgba(209,248,67,0.20)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: typeof padding === "number" ? `${padding}px` : padding,
        boxShadow: glow ? "0 0 24px rgba(209,248,67,0.06)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface McCardHeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}

export function McCardHeader({ title, sub, action }: McCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <div>
        <h3
          className="m-0 text-[14px] font-semibold text-white tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-inter-tight)" }}
        >
          {title}
        </h3>
        {sub && (
          <div
            className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
