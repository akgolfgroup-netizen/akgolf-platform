"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: "green" | "ai" | "lime" | "accent";
  noHover?: boolean;
  variant?: "default" | "accent" | "featured" | "elevated";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: "none" | "lift" | "glow" | "scale";
  radius?: "default" | "large" | "xl" | "pill";
}

const PADDING_MAP = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
};

const RADIUS_MAP = {
  default: "rounded-xl",
  large: "rounded-2xl",
  xl: "rounded-3xl",
  pill: "rounded-full",
};

export function PremiumCard({
  children,
  className,
  delay = 0,
  glow,
  noHover,
  variant = "default",
  padding = "md",
  hover = "lift",
  radius = "large",
}: PremiumCardProps) {
  const isAccent = variant === "accent";
  const isFeatured = variant === "featured";
  const isElevated = variant === "elevated";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_APPLE }}
      className={cn(
        "relative overflow-hidden border border-[#D5DFDB] bg-white",
        RADIUS_MAP[radius],
        PADDING_MAP[padding],
        isAccent && "bg-[#D1F843]/10 border-[#D1F843]/30",
        isFeatured && "shadow-[0_8px_32px_rgba(10,31,24,0.08)]",
        isElevated && "shadow-[0_4px_20px_rgba(10,31,24,0.06)]",
        !noHover && hover === "lift" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(10,31,24,0.08)] hover:border-[#A5B2AD]",
        !noHover && hover === "glow" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_24px_rgba(209,248,67,0.25)] hover:border-[#D1F843]/40",
        !noHover && hover === "scale" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(10,31,24,0.08)]",
        className,
      )}
      style={{
        boxShadow: glow && !isFeatured && !isElevated ? "0 0 0 1px rgba(10,31,24,0.04), 0 1px 2px rgba(10,31,24,0.03), 0 4px 12px rgba(10,31,24,0.04)" : undefined,
      }}
    >
      {isFeatured && (
        <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 bg-[#D1F843]/10 rounded-full blur-3xl" />
      )}
      
      <div className="relative">{children}</div>
    </motion.div>
  );
}
