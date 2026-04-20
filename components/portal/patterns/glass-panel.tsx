/**
 * GlassPanel — Pattern P-08 (v3.1 Course Hero v4)
 *
 * Glassmorph-kort for flytende paneler over foto-hero.
 * Dark (default) eller light variant.
 *
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css (.ch-panel)
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "dark" | "light";
  blur?: "default" | "strong";
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING_MAP = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function GlassPanel({
  children,
  variant = "dark",
  blur = "default",
  padding = "md",
  className,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-[24px] border shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
        variant === "dark" &&
          "bg-[rgba(10,20,15,0.82)] text-[#F2F5F1] border-white/[0.14]",
        variant === "light" &&
          "bg-[rgba(248,250,246,0.78)] text-on-surface border-[rgba(10,31,24,0.08)] shadow-[0_20px_60px_rgba(10,31,24,0.18)]",
        blur === "default" && "backdrop-blur-[22px] backdrop-saturate-[130%]",
        blur === "strong" && "backdrop-blur-[36px] backdrop-saturate-[140%]",
        PADDING_MAP[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GlassPanelRow — rad-element for glass-paneler (label + value).
 */
interface GlassPanelRowProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  unit?: string;
  last?: boolean;
  variant?: "dark" | "light";
}

export function GlassPanelRow({
  label,
  value,
  unit,
  last = false,
  variant = "dark",
  className,
  ...props
}: GlassPanelRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-3.5 text-[13px]",
        !last && variant === "dark" && "border-b border-white/[0.08]",
        !last && variant === "light" && "border-b border-[rgba(10,31,24,0.06)]",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "text-xs",
          variant === "dark" ? "text-surface/58" : "text-on-surface-variant/80"
        )}
      >
        {label}
      </span>
      <span className="font-semibold tabular-nums">
        {value}
        {unit && (
          <span className="font-normal opacity-50 text-[11px] ml-0.5">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}
