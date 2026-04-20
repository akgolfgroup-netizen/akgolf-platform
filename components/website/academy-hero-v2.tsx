"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ACADEMY_HERO_V2 } from "@/lib/website-constants";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

export function AcademyHeroV2() {
  return (
    <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden bg-on-surface grain-overlay">
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={ACADEMY_HERO_V2.heroImage}
          alt="Coaching-sesjon med TrackMan"
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
      </div>

      <div className="w-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [...EASE_ENTRANCE] }}
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-surface/60 font-medium">
            {ACADEMY_HERO_V2.label}
          </span>
        </motion.div>

        <motion.h1
          className="text-[48px] font-extrabold leading-[1.1] tracking-tight text-surface max-w-3xl mt-6 whitespace-pre-line"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [...EASE_ENTRANCE] }}
        >
          {ACADEMY_HERO_V2.heading}
        </motion.h1>

        <motion.p
          className="text-base text-surface/60 max-w-2xl leading-relaxed mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [...EASE_ENTRANCE] }}
        >
          {ACADEMY_HERO_V2.description}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [...EASE_ENTRANCE] }}
        >
          <Link
            href="/booking"
            className="px-7 py-3.5 rounded-[20px] bg-primary text-surface text-sm font-semibold hover:bg-primary-alt transition-colors"
          >
            {ACADEMY_HERO_V2.ctaPrimary} &rarr;
          </Link>
          <Link
            href="#priser"
            className="px-7 py-3.5 rounded-[20px] border border-white/30 text-surface text-sm font-semibold hover:bg-surface-container-lowest/10 transition-colors"
          >
            {ACADEMY_HERO_V2.ctaSecondary} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
