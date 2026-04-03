"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ICON_MAP, type IconName } from "./icon-map";

/**
 * BentoCard Props
 *
 * For ikoner, bruk EN av disse:
 * - `icon`: Lucide icon-komponent (kun i Client Components)
 * - `iconName`: String-basert icon-navn (fungerer i Server Components)
 *
 * Eksempel Server Component:
 *   <BentoCard iconName="info" title="Info" />
 *
 * Eksempel Client Component:
 *   <BentoCard icon={Info} title="Info" />
 */
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  rowSpan?: 1 | 2;
  variant?: "glass" | "solid" | "gradient" | "dark";
  title?: string;
  subtitle?: string;
  /** @deprecated i Server Components — bruk iconName i stedet */
  icon?: LucideIcon;
  /** Bruk dette i Server Components i stedet for icon */
  iconName?: IconName;
  iconColor?: string;
  action?: React.ReactNode;
  hover?: boolean;
}

const spanMap = {
  1: "col-span-1 max-lg:col-span-3 max-md:col-span-1",
  2: "col-span-2 max-lg:col-span-3 max-md:col-span-1",
  3: "col-span-3 max-lg:col-span-3 max-md:col-span-1",
  4: "col-span-4 max-lg:col-span-6 max-md:col-span-1",
  6: "col-span-6 max-lg:col-span-6 max-md:col-span-1",
  8: "col-span-8 max-lg:col-span-6 max-md:col-span-1",
  12: "col-span-12 max-lg:col-span-6 max-md:col-span-1",
};

const rowSpanMap = {
  1: "",
  2: "row-span-2",
};

const variantMap = {
  glass: "bg-white/70 backdrop-blur-xl border border-white/50",
  solid: "bg-white border border-[var(--color-grey-200)]",
  gradient: "bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]",
  dark: "bg-[var(--color-grey-900)]/80 backdrop-blur-xl border border-white/10",
};

export function BentoCard({
  children,
  className,
  span = 4,
  rowSpan = 1,
  variant = "glass",
  title,
  subtitle,
  icon,
  iconName,
  iconColor = "text-[var(--color-grey-900)]",
  action,
  hover = true,
}: BentoCardProps) {
  // Resolve icon: prioriter direkte icon prop, fall tilbake til iconName lookup
  const Icon = icon ?? (iconName ? ICON_MAP[iconName] : undefined);

  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6 shadow-[var(--shadow-card)]",
        variantMap[variant],
        spanMap[span],
        rowSpanMap[rowSpan],
        hover && "transition-[transform,box-shadow] duration-300",
        className
      )}
      whileHover={hover ? {
        y: -4,
        scale: 1.01,
        boxShadow: "var(--shadow-card-hover)",
      } : undefined}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {(title || subtitle || Icon || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
                <Icon className={cn("w-5 h-5", iconColor)} />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[var(--color-grey-500)]">{subtitle}</p>
              )}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}
