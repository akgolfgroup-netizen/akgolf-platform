"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/portal/utils/cn";

interface HeroHeadingProps {
  /** Label over headingen (f.eks. dato eller kontekst) */
  label?: string;
  /** Hovedtekst (kan være delt med italic/accent-element) */
  title: ReactNode;
  /** Beskrivelse under headingen */
  description?: ReactNode;
  /** Actions hoyre side (knapper etc.) */
  actions?: ReactNode;
  className?: string;
}

/**
 * HeroHeading — stor serif-italic heading i ron-v2 stil.
 * Bruk `&lt;span className="font-serif italic text-[var(--color-primary)]"&gt;Erik&lt;/span&gt;`
 * for italic ord inni title.
 */
export function HeroHeading({
  label,
  title,
  description,
  actions,
  className,
}: HeroHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6", className)}
    >
      <div className="min-w-0">
        {label && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2"
          >
            <span className="w-6 h-px bg-[var(--color-muted)]" />
            {label}
          </motion.p>
        )}
        <h1 className="text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.85] font-[300] text-[var(--color-grey-900)] tracking-[-0.055em]">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-[var(--color-muted)] mt-5 max-w-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5 shrink-0">{actions}</div>}
    </motion.div>
  );
}
