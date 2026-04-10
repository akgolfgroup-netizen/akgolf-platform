import * as React from "react";
import { cn } from "@/lib/portal/utils/cn";

/**
 * PortalCard — universell card-komponent for spillerportalen.
 *
 * Server-safe (ingen "use client") slik at den kan brukes direkte i
 * server components uten a tvinge inn klient-bundle.
 *
 * Varianter:
 * - `default` — hvit bakgrunn med subtil border som lyser opp pa hover
 * - `soft`    — gradient fra primary/5 til hvit (rolig fokus-kort)
 * - `bold`    — gradient fra primary til primary-alt med hvit tekst
 *
 * Padding-skala:
 * - `sm` = p-4
 * - `md` = p-6  (default)
 * - `lg` = p-6 lg:p-8
 */
export interface PortalCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  variant?: "default" | "soft" | "bold";
  /** HTML-tag — default `div`. Bruk `section` eller `article` for semantikk. */
  as?: "div" | "section" | "article";
}

const PADDING_CLASSES: Record<NonNullable<PortalCardProps["padding"]>, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-6 lg:p-8",
};

const VARIANT_CLASSES: Record<NonNullable<PortalCardProps["variant"]>, string> = {
  default:
    "bg-white border border-black/5 hover:border-[var(--color-primary)]/20 hover:shadow-[0_8px_32px_-12px_rgba(0,88,64,0.12)]",
  soft: "bg-gradient-to-br from-[var(--color-primary)]/5 to-white border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/20",
  bold: "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white border border-[var(--color-primary)]/40 shadow-[0_12px_40px_-16px_rgba(0,88,64,0.45)]",
};

export function PortalCard({
  children,
  className,
  padding = "md",
  variant = "default",
  as = "div",
  ...rest
}: PortalCardProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(
        "rounded-[24px] transition-all duration-300",
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
