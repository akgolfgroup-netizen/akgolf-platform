"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

/**
 * PremiumBentoCard — bento-grid kort med:
 * - Spotlight som følger musen (radial gradient)
 * - col-span / row-span støtte for bento-layout
 * - Hover lift + gradient border
 * - Valgfri CTA-pil og badge
 * - AK Golf brand-tokens
 *
 * Bruk i PremiumBentoGrid eller som enkeltkort.
 */
interface PremiumBentoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: "primary" | "success" | "warning" | "ai" | "neutral";
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  /** Antall kolonner kortet dekker (1-3) */
  colSpan?: 1 | 2 | 3;
  /** Antall rader kortet dekker (1-2) */
  rowSpan?: 1 | 2;
  /** Gjør kortet permanent "hovered" (for featured kort) */
  featured?: boolean;
  className?: string;
  /** Gradient-variant for visuelt hierarki */
  variant?: "default" | "soft" | "bold";
}

const BADGE_STYLES = {
  primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  ai: "bg-[var(--color-ai)]/10 text-[var(--color-ai)]",
  neutral: "bg-black/5 text-[var(--color-muted)]",
};

const SPAN_CLASSES = {
  col: {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  },
  row: {
    1: "md:row-span-1",
    2: "md:row-span-2",
  },
};

export function PremiumBentoCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeVariant = "neutral",
  href,
  onClick,
  children,
  colSpan = 1,
  rowSpan = 1,
  featured = false,
  className,
  variant = "default",
}: PremiumBentoCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = React.useState(false);

  const showSpotlight = hovered || featured;

  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(500px circle at ${x}px ${y}px, rgba(0, 88, 64, 0.08), transparent 60%)`
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const content = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[24px] p-6 border transition-all duration-300 h-full",
        variant === "default" && "bg-white border-black/5",
        variant === "soft" &&
          "bg-gradient-to-br from-[var(--color-primary)]/[0.03] to-white border-[var(--color-primary)]/10",
        variant === "bold" &&
          "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white border-transparent",
        "hover:-translate-y-0.5 will-change-transform cursor-pointer",
        variant !== "bold" &&
          "hover:border-[var(--color-primary)]/20 hover:shadow-[0_12px_40px_-12px_rgba(0,88,64,0.15)]",
        variant === "bold" &&
          "hover:shadow-[0_12px_40px_-12px_rgba(0,88,64,0.35)]",
        featured && "shadow-[0_8px_32px_-12px_rgba(0,88,64,0.12)] -translate-y-0.5",
        SPAN_CLASSES.col[colSpan],
        SPAN_CLASSES.row[rowSpan],
        className
      )}
    >
      {/* Spotlight layer */}
      {variant !== "bold" && (
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: showSpotlight ? 1 : 0,
            background: spotlightBackground,
          }}
        />
      )}

      {/* Subtle dot pattern on hover (only for default variant) */}
      {variant === "default" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            showSpotlight ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,88,64,0.04)_1px,transparent_1px)] bg-[length:12px_12px]" />
        </div>
      )}

      {/* Header row */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                variant === "bold"
                  ? "bg-white/15 text-white"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h3
            className={cn(
              "font-semibold tracking-tight text-base leading-tight",
              variant === "bold" ? "text-white" : "text-[var(--color-text)]"
            )}
          >
            {title}
          </h3>
        </div>
        {badge && variant !== "bold" && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              BADGE_STYLES[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
        {badge && variant === "bold" && (
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-white/15 text-white backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "relative text-sm leading-relaxed mb-4",
            variant === "bold" ? "text-white/80" : "text-[var(--color-muted)]"
          )}
        >
          {description}
        </p>
      )}

      {/* Children (custom content) */}
      {children && <div className="relative">{children}</div>}

      {/* CTA arrow (vises på hover hvis href/onClick) */}
      {(href || onClick) && (
        <div
          className={cn(
            "relative mt-4 flex items-center gap-1.5 text-xs font-semibold transition-all duration-300",
            showSpotlight ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
            variant === "bold" ? "text-white" : "text-[var(--color-primary)]"
          )}
        >
          Se mer
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );

  // Hvis href brukes, wrap i Link. Ellers wrap i div.
  if (href && !onClick) {
    return (
      <a
        href={href}
        className={cn(SPAN_CLASSES.col[colSpan], SPAN_CLASSES.row[rowSpan], "block no-underline")}
      >
        {content}
      </a>
    );
  }

  return content;
}

/**
 * PremiumBentoGrid — container for bento-kort med auto-rows.
 */
interface PremiumBentoGridProps {
  children: React.ReactNode;
  className?: string;
  /** Antall kolonner på desktop (default 3) */
  columns?: 2 | 3 | 4;
}

export function PremiumBentoGrid({
  children,
  className,
  columns = 3,
}: PremiumBentoGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 auto-rows-[minmax(180px,_auto)]",
        gridCols[columns],
        className
      )}
    >
      {children}
    </div>
  );
}
