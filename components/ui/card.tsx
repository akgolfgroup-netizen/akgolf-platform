"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps {
  variant?: "default" | "elevated" | "bordered" | "gold";
  isHoverable?: boolean;
  isAnimated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const variants = {
  default: "bg-white border border-ink-20",
  elevated: "bg-white shadow-lg border border-ink-10",
  bordered: "bg-transparent border-2 border-ink-20",
  gold: "bg-white border border-gold/30 shadow-gold",
};

export function Card({
  children,
  variant = "default",
  isHoverable = false,
  isAnimated = false,
  className,
}: CardProps) {
  const baseClasses = cn(
    "rounded-2xl overflow-hidden",
    variants[variant],
    isHoverable && "transition-all duration-300 hover:shadow-xl hover:border-gold/30 hover:-translate-y-1",
    className
  );

  if (isAnimated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("px-6 py-4 bg-ink-05 border-t border-ink-10", className)}>{children}</div>;
}
