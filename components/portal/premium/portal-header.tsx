"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import { fadeInUp } from "./motion-presets";

/**
 * PortalHeader — felles side-header for spillerportalen.
 *
 * Brukes oversst pa hver portal-side for konsistent rytme.
 * Inneholder innebygd Framer Motion fadeInUp-animasjon.
 *
 * - `label`: liten uppercase-etikett (f.eks. dato eller seksjonsnavn)
 * - `title`: hovedoverskrift
 * - `description`: hjelpetekst under tittelen
 * - `actions`: knapper eller menyer pa hoyre side
 */
export interface PortalHeaderProps {
  /** Liten etikett over tittelen — f.eks. "Fredag 11. april" eller "Dashboard". */
  label?: string;
  /** Hovedoverskrift. Pakalvet. */
  title: string;
  /** Beskrivelse / underoverskrift. */
  description?: string;
  /** Handlingsknapper / menyer som vises pa hoyre side. */
  actions?: React.ReactNode;
  /** Ekstra klassenavn pa container. */
  className?: string;
}

export function PortalHeader({
  label,
  title,
  description,
  actions,
  className,
}: PortalHeaderProps) {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {label ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {label}
          </p>
        ) : null}
        <h1
          className="mt-1 text-3xl font-bold tracking-tight text-[var(--color-text)] lg:text-4xl"
          style={{ letterSpacing: "-0.025em" }}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-md text-[var(--color-muted)]">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {actions}
        </div>
      ) : null}
    </motion.header>
  );
}
