"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";

interface AppleButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantMap = {
  primary: "bg-[var(--apple-gold-500)] text-white shadow-[var(--shadow-glow-gold)] hover:bg-[var(--apple-gold-600)] hover:shadow-[var(--shadow-glow-gold-hover)]",
  secondary: "bg-[var(--apple-gray-100)] text-[var(--apple-gray-900)] hover:bg-[var(--apple-gray-200)]",
  ghost: "bg-transparent text-[var(--apple-gray-600)] hover:bg-[var(--apple-gray-100)] hover:text-[var(--apple-gray-900)]",
  gold: "bg-gradient-to-r from-[var(--apple-gold-400)] to-[var(--apple-gold-500)] text-white shadow-[var(--shadow-glow-gold)] hover:shadow-[var(--shadow-glow-gold-hover)]",
};

const sizeMap = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-5 py-3 text-[15px] gap-2",
  lg: "px-6 py-4 text-base gap-2.5",
};

const iconSizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5",
};

export function AppleButton({
  children,
  className,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: AppleButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-xl border-none cursor-pointer",
        "transition-all duration-300 ease-[var(--ease-apple)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-gold-500)] focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantMap[variant],
        sizeMap[size],
        fullWidth && "w-full",
        className
      )}
      whileHover={!disabled ? { y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className={iconSizeMap[size]} />}
          {children}
          {Icon && iconPosition === "right" && <Icon className={iconSizeMap[size]} />}
        </>
      )}
    </motion.button>
  );
}
