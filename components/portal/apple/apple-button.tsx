"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ICON_MAP, type IconName } from "./icon-map";

/**
 * AppleButton Props
 *
 * For ikoner, bruk EN av disse:
 * - `icon`: Lucide icon-komponent (kun i Client Components)
 * - `iconName`: String-basert icon-navn (fungerer i Server Components)
 *
 * Eksempel Server Component:
 *   <AppleButton iconName="plus">Ny</AppleButton>
 *
 * Eksempel Client Component:
 *   <AppleButton icon={Plus}>Ny</AppleButton>
 */
interface AppleButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  /** @deprecated i Server Components — bruk iconName i stedet */
  icon?: LucideIcon;
  /** Bruk dette i Server Components i stedet for icon */
  iconName?: IconName;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantMap = {
  primary:
    "bg-[var(--color-black)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-grey-800)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-[var(--color-grey-100)] text-[var(--color-grey-900)] hover:bg-[var(--color-grey-200)]",
  ghost:
    "bg-transparent text-[var(--color-grey-600)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]",
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
  icon,
  iconName,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: AppleButtonProps) {
  // Resolve icon: prioriter direkte icon prop, fall tilbake til iconName lookup
  const Icon = icon ?? (iconName ? ICON_MAP[iconName] : undefined);

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-[var(--radius-pill)] border-none cursor-pointer",
        "transition-all duration-300 ease-[var(--ease-apple)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grey-400)] focus-visible:ring-offset-2",
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
          {Icon && iconPosition === "left" && (
            <Icon className={iconSizeMap[size]} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={iconSizeMap[size]} />
          )}
        </>
      )}
    </motion.button>
  );
}
