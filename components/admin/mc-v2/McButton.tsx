import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "primary" | "accent" | "ghost";
type ButtonSize = "md" | "sm";

interface McButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const STYLES: Record<ButtonVariant, React.CSSProperties> = {
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
    color: "rgba(255,255,255,0.75)",
    border: "1px solid transparent",
  },
};

const SIZES: Record<ButtonSize, React.CSSProperties> = {
  md: { padding: "8px 14px", fontSize: 13 },
  sm: { padding: "5px 10px", fontSize: 11 },
};

export function McButton({
  variant = "default",
  size = "md",
  icon,
  children,
  className = "",
  style,
  ...rest
}: McButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors cursor-pointer ${className}`}
      style={{ ...STYLES[variant], ...SIZES[size], ...style }}
    >
      {icon}
      {children}
    </button>
  );
}
