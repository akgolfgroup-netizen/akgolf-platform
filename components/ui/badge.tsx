"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "navy" | "subtle" | "outline";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-[var(--color-grey-100)] text-[var(--color-grey-700)]",
  gold: "bg-[var(--color-grey-100)] text-[var(--color-grey-900)] border border-[var(--color-grey-200)]",
  navy: "bg-[var(--color-grey-900)] text-white",
  subtle: "bg-[var(--color-grey-100)] text-[var(--color-grey-500)]",
  outline: "bg-transparent border border-[var(--color-grey-200)] text-[var(--color-grey-600)]",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
