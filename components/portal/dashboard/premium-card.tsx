"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: "green" | "ai" | "accent";
  noHover?: boolean;
  variant?: "default" | "accent";
  padding?: "sm" | "md" | "lg";
  hover?: "none" | "lift" | "glow";
}

const SHADOW_MAP = {
  default: "var(--shadow-portal-card)",
  green: "var(--shadow-portal-glow-green)",
  ai: "var(--shadow-portal-glow-ai)",
  accent:
    "inset 0 0 30px rgba(209,248,67,0.08), 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
};

const PADDING_MAP = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6 py-16",
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
}: PremiumCardProps) {
  const isAccent = variant === "accent";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_APPLE }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        PADDING_MAP[padding],
        isAccent ? "bg-accent-cta/10 border border-accent-cta/20" : "bg-portal-bg border border-portal-border",
        !noHover && hover === "lift" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)]",
        !noHover && hover === "glow" && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_20px_rgba(209,248,67,0.15)]",
        className,
      )}
      style={{
        boxShadow: glow ? SHADOW_MAP[glow] : undefined,
      }}
    >
      {/* Inner gradient for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.02] to-black/[0.01]" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
