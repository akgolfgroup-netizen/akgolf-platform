"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary: "bg-[var(--color-grey-900)] text-white shadow-lg",
  secondary: "bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)]",
  ghost: "bg-transparent text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]",
  outline: "bg-transparent border-2 border-[var(--color-grey-900)] text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-full",
        "transition-[transform,opacity,background-color,box-shadow] duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  );
}
