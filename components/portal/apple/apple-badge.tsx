"use client";

import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";

interface AppleBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "gold" | "neutral";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  dot?: boolean;
  className?: string;
}

const variantMap = {
  success: "bg-green-50 text-green-600 border-green-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  error: "bg-red-50 text-red-600 border-red-100",
  info: "bg-blue-50 text-blue-600 border-blue-100",
  gold: "bg-[var(--apple-gold-50)] text-[var(--apple-gold-600)] border-[var(--apple-gold-100)]",
  neutral: "bg-[var(--apple-gray-100)] text-[var(--apple-gray-600)] border-[var(--apple-gray-200)]",
};

const dotColorMap = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  gold: "bg-[var(--apple-gold-500)]",
  neutral: "bg-[var(--apple-gray-500)]",
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
  icon: Icon,
  dot = false,
  className,
}: AppleBadgeProps) {
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
