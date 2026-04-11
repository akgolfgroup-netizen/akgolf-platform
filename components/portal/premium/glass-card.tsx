"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Padding-variant */
  padding?: "sm" | "md" | "lg";
  /** Hovedfarge for kortet */
  variant?: "light" | "dark";
  /** Delay for staggered reveal (i sekunder) */
  delay?: number;
  /** Gjor kortet til en button/link med hover-lift */
  interactive?: boolean;
  onClick?: () => void;
}

const PADDING = {
  sm: "p-4",
  md: "p-6",
  lg: "p-7 lg:p-8",
};

/**
 * GlassCard — premium glassmorphism-kort som passer over atmospheric background.
 * Light-variant for vanlige kort, dark for hero/featured.
 */
export function GlassCard({
  children,
  className,
  padding = "md",
  variant = "light",
  delay = 0,
  interactive = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: "spring",
        damping: 20,
        stiffness: 100,
      }}
      whileHover={interactive ? { y: -2 } : undefined}
      onClick={onClick}
      className={cn(
        "relative rounded-[24px] overflow-hidden",
        variant === "light" &&
          "bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)]",
        variant === "dark" &&
          "bg-[#0A1F18] border border-white/5 shadow-[0_20px_60px_-20px_rgba(10,31,24,0.25)] text-white",
        interactive && "cursor-pointer will-change-transform",
        interactive && variant === "light" && "hover:shadow-[0_12px_40px_-12px_rgba(0,88,64,0.2)] hover:border-[var(--color-primary)]/20",
        interactive && variant === "dark" && "hover:shadow-[0_24px_70px_-20px_rgba(209,248,67,0.15)]",
        PADDING[padding],
        className
      )}
    >
      {variant === "dark" && (
        <>
          {/* Gradient mesh */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(42,125,90,0.2), transparent 60%)",
            }}
          />
          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
