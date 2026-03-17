"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "navy" | "subtle" | "outline";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-ink-10 text-ink-70",
  gold: "bg-gold/10 text-gold-text border border-gold/20",
  navy: "bg-navy text-white",
  subtle: "bg-ink-05 text-ink-50",
  outline: "bg-transparent border border-ink-20 text-ink-60",
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
