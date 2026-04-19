"use client";

/**
 * CourseHero — Pattern P-07 (v3.1 Course Hero v4)
 *
 * Wrapper for hero-skjermer med foto-bakgrunn + dark canvas + gradient overlay.
 * Brukes på Dashboard V6, Runde live, Statistikk V2, TrackMan, Mission Control.
 *
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css + dashboard-v6-hero.html
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";
import Image from "next/image";

interface CourseHeroProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Bakgrunnsbilde (public path, f.eks. "/images/course-hero/hero-golf-divot.jpg").
   * Hvis ikke angitt, brukes en dark-gradient som fallback.
   */
  bgImage?: string;
  bgAlt?: string;
  /**
   * Gradient-overlay-variant:
   * - "dashboard": myk top-til-bottom for bento-kort i bunnen
   * - "immersive": sterk mørkning rundt kantene for shot-tracking/immersivt innhold
   * - "subtle": lett overlay for hero med mange lesbare elementer
   */
  overlay?: "dashboard" | "immersive" | "subtle";
  /**
   * Hvis true, rendrer ingen sidebar (for full-screen hero).
   * Default false — rendrer children direkte uten layout-endring.
   */
  fullScreen?: boolean;
}

const OVERLAY_STYLES: Record<NonNullable<CourseHeroProps["overlay"]>, string> = {
  dashboard:
    "before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(180deg,rgba(10,15,12,0.55)_0%,rgba(10,15,12,0.15)_28%,rgba(10,15,12,0.35)_60%,rgba(10,15,12,0.95)_100%)]",
  immersive:
    "before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_30%_30%,transparent_40%,rgba(0,0,0,0.45)_100%)]",
  subtle:
    "before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(180deg,rgba(10,15,12,0.4)_0%,rgba(10,15,12,0.2)_50%,rgba(10,15,12,0.6)_100%)]",
};

export function CourseHero({
  children,
  bgImage,
  bgAlt = "",
  overlay = "dashboard",
  fullScreen = false,
  className,
  ...props
}: CourseHeroProps) {
  return (
    <div
      className={cn(
        "course-hero relative overflow-hidden bg-[#0a0f0c] text-[#F2F5F1]",
        fullScreen ? "min-h-screen" : "min-h-[600px] rounded-[24px]",
        OVERLAY_STYLES[overlay],
        className
      )}
      {...props}
    >
      {/* Foto/SVG-bakgrunn */}
      {bgImage && (
        <div className="absolute inset-0 -z-0">
          <Image
            src={bgImage}
            alt={bgAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Fallback ambient hvis ingen bgImage */}
      {!bgImage && (
        <div
          className="absolute inset-0 -z-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(0,88,64,0.35), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(209,248,67,0.08), transparent 50%), #0a0f0c",
          }}
        />
      )}

      {/* Content over gradient */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
