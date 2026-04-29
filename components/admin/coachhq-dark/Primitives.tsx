import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ============================================================
 * Card
 * ========================================================== */

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  padding?: number | string;
}

export function Card({ children, className = "", glow, padding = 18 }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "#0D2E23",
        border: glow
          ? "1.5px solid rgba(209,248,67,0.30)"
          : "1px solid #1a4a3a",
        borderRadius: 16,
        padding: typeof padding === "number" ? `${padding}px` : padding,
        boxShadow: glow ? "0 0 24px rgba(209,248,67,0.10)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, sub, action, className = "" }: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-3.5 ${className}`}
    >
      <h3
        className="m-0 text-[14px] font-semibold"
        style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
      >
        {title}
      </h3>
      {(sub || action) && (
        <div className="flex items-center gap-2">
          {sub && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {sub}
            </span>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Button
 * ========================================================== */

type ButtonVariant = "default" | "primary" | "accent" | "ghost";
type ButtonSize = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  icon,
  children,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const styles: Record<ButtonVariant, React.CSSProperties> = {
    default: {
      background: "rgba(255,255,255,0.05)",
      color: "#E6EAE8",
      border: "1px solid rgba(255,255,255,0.08)",
    },
    primary: {
      background: "#005840",
      color: "#FFFFFF",
      border: "1px solid #005840",
      fontWeight: 600,
    },
    accent: {
      background: "#D1F843",
      color: "#0A1F18",
      border: "1px solid #D1F843",
      fontWeight: 600,
    },
    ghost: {
      background: "transparent",
      color: "rgba(255,255,255,0.8)",
      border: "1px solid transparent",
    },
  };

  const sizing: Record<ButtonSize, React.CSSProperties> = {
    md: { padding: "8px 14px", fontSize: 13 },
    sm: { padding: "5px 10px", fontSize: 11 },
  };

  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors ${className}`}
      style={{ ...styles[variant], ...sizing[size], ...style }}
    >
      {icon}
      {children}
    </button>
  );
}

/* ============================================================
 * Pill
 * ========================================================== */

type PillTone =
  | "default"
  | "accent"
  | "success"
  | "warn"
  | "danger"
  | "info"
  | "violet";

interface PillProps {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
}

const PILL_STYLES: Record<PillTone, React.CSSProperties> = {
  default: {
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.85)",
  },
  accent: { background: "rgba(209,248,67,0.18)", color: "#D1F843" },
  success: { background: "rgba(42,125,90,0.25)", color: "#6FCBA1" },
  warn: { background: "rgba(196,138,50,0.22)", color: "#E8B967" },
  danger: { background: "rgba(184,66,51,0.22)", color: "#F49283" },
  info: { background: "rgba(0,122,255,0.18)", color: "#6FB3FF" },
  violet: { background: "rgba(175,82,222,0.18)", color: "#C896E8" },
};

export function Pill({ tone = "default", children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${className}`}
      style={PILL_STYLES[tone]}
    >
      {children}
    </span>
  );
}

/* ============================================================
 * Eyebrow + MonoLabel
 * ========================================================== */

export function Eyebrow({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accent ? "#D1F843" : "rgba(255,255,255,0.45)",
      }}
    >
      {children}
    </span>
  );
}

export function MonoLabel({
  children,
  className = "",
  color,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: color ?? "rgba(255,255,255,0.45)",
      }}
    >
      {children}
    </span>
  );
}
