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
}

const SHADOW_MAP = {
  default: "var(--shadow-portal-card)",
  green: "var(--shadow-portal-glow-green)",
  ai: "var(--shadow-portal-glow-ai)",
  accent:
    "inset 0 0 30px rgba(209,248,67,0.08), 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
};

export function PremiumCard({
  children,
  className,
  delay = 0,
  glow,
  noHover,
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_APPLE }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[var(--color-portal-card)] p-5",
        !noHover &&
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)]",
        className,
      )}
      style={{
        boxShadow: glow ? SHADOW_MAP[glow] : SHADOW_MAP.default,
      }}
    >
      {/* Inner gradient for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.02] to-black/[0.01]" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
