import type { ReactNode } from "react";

/**
 * Felles kort-skjelett for alle Spillerprofil 360-komponenter.
 * Sikrer konsistent BG V2.0-styling.
 */
export function CardShell({
  label,
  title,
  actionLabel,
  children,
  dark = false,
  footer,
}: {
  label: string;
  title: string;
  actionLabel?: string;
  children: ReactNode;
  dark?: boolean;
  footer?: ReactNode;
}) {
  if (dark) {
    return (
      <div
        className="rounded-2xl p-6 relative overflow-hidden h-full"
        style={{
          background: "var(--color-sidebar)",
          color: "#FFFFFF",
        }}
      >
        <div
          className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl"
          style={{ background: "rgba(209,248,67,0.10)" }}
        />
        <header className="mb-5 relative">
          <MonoLabel color="accent">{label}</MonoLabel>
          <h2
            className="font-semibold text-[20px] tracking-tight mt-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
        </header>
        <div className="relative">{children}</div>
        {footer && <div className="relative mt-4">{footer}</div>}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: "var(--color-card)",
        boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <header className="flex items-end justify-between mb-5">
        <div>
          <MonoLabel>{label}</MonoLabel>
          <h2
            className="font-semibold text-[20px] tracking-tight mt-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {title}
          </h2>
        </div>
        {actionLabel && (
          <button
            className="text-[11px] font-mono uppercase cursor-pointer transition-colors"
            style={{
              color: "var(--color-primary)",
              letterSpacing: "0.12em",
            }}
          >
            {actionLabel}
          </button>
        )}
      </header>
      {children}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

export function MonoLabel({
  children,
  color = "subtle",
}: {
  children: ReactNode;
  color?: "subtle" | "muted" | "accent" | "primary";
}) {
  const c =
    color === "accent"
      ? "var(--color-accent)"
      : color === "primary"
      ? "var(--color-primary)"
      : color === "muted"
      ? "var(--color-ink-muted)"
      : "var(--color-ink-subtle)";
  return (
    <div
      className="text-[10px] font-mono uppercase"
      style={{ letterSpacing: "0.12em", color: c }}
    >
      {children}
    </div>
  );
}
