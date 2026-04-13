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

const SHADOW_MAP = {
  default: "var(--shadow-portal-card)",
  green: "var(--shadow-portal-glow-green)",
  lime: "var(--shadow-portal-glow-lime)",
  ai: "var(--shadow-portal-glow-ai)",
  accent: "var(--shadow-portal-glow-lime)",
};

const PADDING_MAP = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
};

const RADIUS_MAP = {
  default: "rounded-2xl",      /* 16px */
  large: "rounded-[32px]",     /* 32px - fra screenshots */
  xl: "rounded-[40px]",        /* 40px - hero sections */
  pill: "rounded-[9999px]",
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
        "relative overflow-hidden",
        RADIUS_MAP[radius],
        PADDING_MAP[padding],
        /* Variant styles */
        isAccent && "bg-[#d2f000]/10 border-2 border-[#d2f000]/30",
        isFeatured && "bg-white border-2 border-[#154212]/10 shadow-portal-floating",
        isElevated && "bg-white shadow-portal-floating",
        !isAccent && !isFeatured && !isElevated && "bg-white border border-[#154212]/6",
        /* Hover effects */
        !noHover && hover === "lift" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-portal-card-hover",
        !noHover && hover === "glow" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-portal-glow-lime hover:border-[#d2f000]/40",
        !noHover && hover === "scale" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:shadow-portal-card-hover",
        className,
      )}
      style={{
        boxShadow: glow ? SHADOW_MAP[glow] : undefined,
      }}
    >
      {/* Inner gradient for premium depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/80 to-transparent" />
      
      {/* Subtle lime glow for featured cards */}
      {isFeatured && (
        <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 bg-[#d2f000]/10 rounded-full blur-3xl" />
      )}
      
      <div className="relative">{children}</div>
    </motion.div>
  );
}
