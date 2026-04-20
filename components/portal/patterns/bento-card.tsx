/**
 * BentoCard — Pattern P-13 (v3.1 Course Hero v4)
 *
 * Glass-bento-kort for Course Hero-layouts. Default dark-glass,
 * accent-variant bruker lime bakgrunn.
 *
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css (.ch-bento-card)
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "glass" | "accent" | "light";
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING_MAP = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

const VARIANT_CLASSES = {
  glass:
    "bg-[rgba(10,20,15,0.82)] backdrop-blur-[22px] backdrop-saturate-[130%] border border-white/[0.14] text-[#F2F5F1]",
  accent:
    "bg-secondary-fixed text-[#0A1F18] border border-transparent",
  light:
    "bg-[rgba(248,250,246,0.78)] backdrop-blur-[22px] backdrop-saturate-[130%] border border-[rgba(10,31,24,0.08)] text-on-surface",
};

export function BentoCard({
  children,
  variant = "glass",
  interactive = false,
  padding = "md",
  className,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-[20px]",
        VARIANT_CLASSES[variant],
        PADDING_MAP[padding],
        interactive &&
          "transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-secondary-fixed/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * BentoGrid — grid-container for bento-kort.
 */
interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

const COLS_MAP = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

const GAP_MAP = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-5",
};

export function BentoGrid({
  children,
  cols = 3,
  gap = "md",
  className,
  ...props
}: BentoGridProps) {
  return (
    <div className={cn("grid", COLS_MAP[cols], GAP_MAP[gap], className)} {...props}>
      {children}
    </div>
  );
}

/**
 * BentoEyebrow — label for bento-kort med lime-dot prefiks.
 */
interface BentoEyebrowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  dotColor?: string;
}

export function BentoEyebrow({
  children,
  dotColor = "#D1F843",
  className,
  ...props
}: BentoEyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-surface/45",
        className
      )}
      {...props}
    >
      <span
        className="w-[5px] h-[5px] rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      {children}
    </div>
  );
}
