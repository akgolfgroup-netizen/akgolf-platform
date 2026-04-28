"use client";

import { cn } from "@/lib/portal/utils/cn";
import type { ReactNode } from "react";

interface DarkCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent";
  style?: React.CSSProperties;
}

/**
 * Mørk kort-stil brukt i playerhq-mockupene (a3, a11, a12).
 * Match tokens fra .claude/rules/design-system.md (sidebar #0F1F18 / #0D2E23).
 */
export function DarkCard({
  children,
  className,
  variant = "default",
  style,
}: DarkCardProps) {
  return (
    <div
      className={cn("rounded-[16px] p-5", className)}
      style={{
        background:
          variant === "accent"
            ? "linear-gradient(180deg, rgba(209,248,67,0.04), transparent 50%)"
            : "#0D2E23",
        border:
          variant === "accent"
            ? "1px solid rgba(209,248,67,0.30)"
            : "1px solid #1A4A3A",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  title: string;
  sub?: string;
}

export function SectionHeading({ title, sub }: SectionHeadingProps) {
  return (
    <div className="mt-8 mb-3.5 flex items-end justify-between">
      <h2
        className="m-0 text-[22px] font-bold tracking-[-0.025em] text-white"
        style={{ fontFamily: "var(--font-inter-tight, Inter)" }}
      >
        {title}
      </h2>
      {sub ? (
        <div
          className="font-mono text-[9px] uppercase"
          style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

interface MonoCapsProps {
  children: ReactNode;
  className?: string;
}

export function MonoCaps({ children, className }: MonoCapsProps) {
  return (
    <div
      className={cn("font-mono text-[9px] uppercase", className)}
      style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)" }}
    >
      {children}
    </div>
  );
}
