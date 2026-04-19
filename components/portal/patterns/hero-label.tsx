/**
 * HeroLabel — Pattern P-11 (v3.1 Course Hero v4)
 *
 * Flytende glass-pill med kontekst: kurs-navn, dato, status.
 * Plasseres på toppen/hjørner av CourseHero.
 *
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css (.ch-hero-label)
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface HeroLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Visuell styrke på glass */
  variant?: "glass" | "lime";
}

const VARIANT_CLASSES = {
  glass:
    "bg-[rgba(12,22,17,0.62)] backdrop-blur-[22px] backdrop-saturate-[130%] border border-white/[0.14] text-white/88",
  lime:
    "bg-accent-cta text-[#0A1F18] border border-[rgba(10,31,24,0.08)]",
};

export function HeroLabel({
  children,
  variant = "glass",
  className,
  ...props
}: HeroLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full",
        "text-[11px] font-medium",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * HeroLabelSeparator — prikk-separator for multi-segment hero-labels.
 */
export function HeroLabelSeparator() {
  return (
    <span
      aria-hidden="true"
      className="w-1 h-1 rounded-full bg-white/30 shrink-0"
    />
  );
}
