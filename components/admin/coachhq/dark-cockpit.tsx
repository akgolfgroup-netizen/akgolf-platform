"use client";

import type { ReactNode } from "react";

/**
 * Dark CoachHQ tokens og delte primitiver brukt på Spiller-skjermene
 * (public/design-reference/handoff-2026-04-27/screens/d5–d8).
 *
 * Sidene wrappes selv i `CoachHQDarkShell` (ikke MCLayout) — denne fila
 * leverer kun innholdet i `<main>`-området.
 */
export const DARK_TOKENS = {
  bg: "#102B1E",
  card: "#0D2E23",
  line: "#1A4A3A",
  primary: "#005840",
  accent: "#D1F843",
  success: "#6FCBA1",
  warn: "#E8B967",
  danger: "#F49283",
  blue: "#6FB3FF",
  violet: "#C896E8",
  textMuted: "rgba(255,255,255,0.55)",
  textSubtle: "rgba(255,255,255,0.45)",
} as const;

export function DarkPageHead({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div
      className="flex items-end justify-between gap-4 pb-4 mb-5 flex-wrap"
      style={{ borderBottom: `1px solid ${DARK_TOKENS.line}` }}
    >
      <div>
        <div
          className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: DARK_TOKENS.accent }}
        >
          {eyebrow}
        </div>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.025em] text-white">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          {subtitle}
        </p>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function DarkButton({
  children,
  variant = "default",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "accent" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantStyle = (() => {
    switch (variant) {
      case "primary":
        return {
          background: DARK_TOKENS.primary,
          color: "#fff",
          border: `1px solid ${DARK_TOKENS.primary}`,
          fontWeight: 600,
        };
      case "accent":
        return {
          background: DARK_TOKENS.accent,
          color: "#0A1F18",
          border: `1px solid ${DARK_TOKENS.accent}`,
          fontWeight: 600,
        };
      case "ghost":
        return {
          background: "transparent",
          color: "rgba(255,255,255,0.8)",
          border: "1px solid transparent",
        };
      default:
        return {
          background: "rgba(255,255,255,0.05)",
          color: "#E6EAE8",
          border: "1px solid rgba(255,255,255,0.08)",
        };
    }
  })();

  return (
    <button
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors hover:brightness-110 ${className}`}
      style={variantStyle}
      {...rest}
    >
      {children}
    </button>
  );
}

export function DarkPill({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?:
    | "default"
    | "accent"
    | "success"
    | "warn"
    | "danger"
    | "lime"
    | "green"
    | "amber"
    | "violet"
    | "coral"
    | "blue";
  className?: string;
}) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)" },
    accent: { background: "rgba(209,248,67,0.18)", color: DARK_TOKENS.accent },
    lime: { background: "rgba(209,248,67,0.18)", color: DARK_TOKENS.accent },
    success: { background: "rgba(42,125,90,0.22)", color: DARK_TOKENS.success },
    green: { background: "rgba(42,125,90,0.22)", color: DARK_TOKENS.success },
    warn: { background: "rgba(196,138,50,0.22)", color: DARK_TOKENS.warn },
    amber: { background: "rgba(196,138,50,0.22)", color: DARK_TOKENS.warn },
    danger: { background: "rgba(184,66,51,0.22)", color: DARK_TOKENS.danger },
    coral: { background: "rgba(184,66,51,0.22)", color: DARK_TOKENS.danger },
    violet: { background: "rgba(175,82,222,0.22)", color: DARK_TOKENS.violet },
    blue: { background: "rgba(0,122,255,0.18)", color: DARK_TOKENS.blue },
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-[11px] px-2.5 py-1 font-medium ${className}`}
      style={styles[variant]}
    >
      {children}
    </span>
  );
}

export function DarkStatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div
      className="rounded-[10px] px-3.5 py-3"
      style={{
        background: DARK_TOKENS.card,
        border: `1px solid ${DARK_TOKENS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: DARK_TOKENS.textSubtle }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[22px] font-bold tracking-[-0.02em] tabular-nums"
        style={{ color: valueColor ?? "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

/** Avatar med initialer i farget bakgrunn (matcher mockup). */
export function avatarColor(name: string | null | undefined): string {
  const palette = [
    "#D1F843",
    "#6FCBA1",
    "#6FB3FF",
    "#E8B967",
    "#C896E8",
    "#F49283",
    "#A5B2AD",
  ];
  if (!name) return palette[6];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
