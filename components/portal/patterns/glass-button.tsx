/**
 * GlassButton — Pattern P-09 (v3.1 Course Hero v4)
 *
 * Pill-knapp med glass / lime / amber varianter for Course Hero-skjermer.
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css (.ch-btn)
 */

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type GlassButtonVariant = "glass" | "lime" | "amber" | "dark";
type GlassButtonSize = "sm" | "md" | "icon";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<GlassButtonVariant, string> = {
  glass:
    "bg-[rgba(12,22,17,0.62)] backdrop-blur-[22px] backdrop-saturate-[130%] border border-white/[0.14] text-white hover:bg-[rgba(12,22,17,0.78)]",
  lime:
    "bg-accent-cta text-[#0A1F18] border border-[rgba(10,31,24,0.08)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]",
  amber:
    "bg-[#F5C542] text-[#0A1F18] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(245,197,66,0.3)]",
  dark:
    "bg-[#0A1F18] text-white border border-white/10 hover:bg-[#0A1F18]/90",
};

const SIZE_CLASSES: Record<GlassButtonSize, string> = {
  sm: "h-8 px-3 text-[11px] gap-1.5",
  md: "h-10 px-4 text-[12px] gap-1.5",
  icon: "h-9 w-9 p-0 grid place-items-center",
};

export function GlassButton({
  children,
  variant = "glass",
  size = "md",
  icon,
  className,
  type = "button",
  ...props
}: GlassButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
