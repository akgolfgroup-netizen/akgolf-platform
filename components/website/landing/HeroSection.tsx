"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { EASE_ENTRANCE } from "@/lib/design-tokens";
import { HERO } from "@/lib/website-constants";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_ENTRANCE },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/branding/ak-golf-academy-11.jpg"
        alt="Golf coaching med TrackMan på rangen"
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full pb-16 md:pb-24 lg:pb-28"
      >
        <div className="w-container">
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-5"
          >
            {HERO.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-[-0.03em] leading-[1.05] text-white max-w-[720px] mb-6"
          >
            {HERO.heading}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-white/80 max-w-[540px] leading-relaxed mb-10"
          >
            {HERO.subheading}
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-cta text-accent-cta-text rounded-[20px] text-[15px] font-bold hover:brightness-95 transition-all duration-300"
            >
              Book coaching
              <Icon name="arrow_forward" className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
