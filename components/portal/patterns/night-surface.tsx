"use client";

/**
 * NightSurface — Pattern P-03 (v3.1)
 *
 * Kontekstuell dark mode — IKKE global. Brukes på data-first-skjermer:
 * TrackMan, Mission Control, dashboard V2 Night Ops.
 *
 * Setter dark-kontekst for barn via CSS-variabler, slik at komponenter
 * kan tilpasse seg via `.night-surface &`-selector i egen CSS.
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";
import { createContext, useContext } from "react";

interface NightSurfaceContextValue {
  isNight: true;
}

const NightSurfaceContext = createContext<NightSurfaceContextValue | null>(null);

/**
 * Hook for å sjekke om vi er inne i en NightSurface.
 * Returnerer true hvis innsatt, false ellers.
 */
export function useIsNightSurface(): boolean {
  return useContext(NightSurfaceContext) !== null;
}

interface NightSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "ambient";
}

export function NightSurface({
  children,
  variant = "default",
  className,
  ...props
}: NightSurfaceProps) {
  return (
    <NightSurfaceContext.Provider value={{ isNight: true }}>
      <div
        className={cn(
          "night-surface relative",
          "bg-[#0A1F18] text-[#F7FAF8]",
          variant === "ambient" &&
            "before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,88,64,0.25),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(209,248,67,0.08),transparent_50%)]",
          className
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    </NightSurfaceContext.Provider>
  );
}
