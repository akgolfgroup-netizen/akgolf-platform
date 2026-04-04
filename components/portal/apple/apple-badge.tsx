"use client";

import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ICON_MAP, type IconName } from "./icon-map";

/**
 * AppleBadge Props
 *
 * For ikoner, bruk EN av disse:
 * - `icon`: Lucide icon-komponent (kun i Client Components)
 * - `iconName`: String-basert icon-navn (fungerer i Server Components)
 */
interface AppleBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "dark" | "neutral";
  size?: "sm" | "md" | "lg";
  /** @deprecated i Server Components — bruk iconName i stedet */
  icon?: LucideIcon;
  /** Bruk dette i Server Components i stedet for icon */
  iconName?: IconName;
  dot?: boolean;
  className?: string;
}

const variantMap = {
  success: "bg-[#2D6A4F]/5 text-[#2D6A4F] border-[#2D6A4F]/15",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  error: "bg-[#D14343]/5 text-[#D14343] border-[#D14343]/15",
  info: "bg-blue-50 text-blue-600 border-blue-100",
  dark: "bg-[var(--color-grey-100)] text-[var(--color-grey-900)] border-[var(--color-grey-200)]",
  neutral: "bg-[var(--color-grey-100)] text-[var(--color-grey-600)] border-[var(--color-grey-200)]",
};

const dotColorMap = {
  success: "bg-[#2D6A4F]",
  warning: "bg-amber-500",
  error: "bg-[#D14343]",
  info: "bg-blue-500",
  dark: "bg-[var(--color-grey-900)]",
  neutral: "bg-[var(--color-grey-500)]",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const iconSizeMap = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};

export function AppleBadge({
  children,
  variant = "neutral",
  size = "md",
  icon,
  iconName,
  dot = false,
  className,
}: AppleBadgeProps) {
  // Resolve icon: prioriter direkte icon prop, fall tilbake til iconName lookup
  const Icon = icon ?? (iconName ? ICON_MAP[iconName] : undefined);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border",
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColorMap[variant])} />
      )}
      {Icon && <Icon className={iconSizeMap[size]} />}
      {children}
    </span>
  );
}
