"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

interface AppleCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: "glass" | "solid" | "dark";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantMap = {
  glass: "bg-white/70 backdrop-blur-xl border border-white/50",
  solid: "bg-white border border-[var(--color-grey-200)]",
  dark: "bg-[var(--color-grey-900)]/80 backdrop-blur-xl border border-white/10",
};

export function AppleCard({
  children,
  className,
  variant = "glass",
  hover = true,
  padding = "md",
  ...props
}: AppleCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl shadow-[var(--shadow-card)]",
        variantMap[variant],
        paddingMap[padding],
        hover && "transition-all duration-300 ease-[var(--ease-apple)]",
        className
      )}
      whileHover={hover ? {
        y: -4,
        scale: 1.01,
        boxShadow: "var(--shadow-card-hover)"
      } : undefined}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
