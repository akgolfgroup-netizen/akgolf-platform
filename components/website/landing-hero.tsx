"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

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

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/academy/AK-Golf-Academy-20.jpg"
        alt="Golf coaching"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-[800px] px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs uppercase tracking-widest text-white/50 mb-6"
        >
          AK Golf Academy
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl tracking-[-0.03em] leading-[1.05] mb-6"
        >
          <span className="font-light text-white/60">Golf coaching.</span>
          <br />
          <span className="font-bold text-white">Reimagined.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Personlig coaching med TrackMan-analyse, AI-drevet innsikt
          og strukturerte treningsplaner. For alle nivåer.
        </motion.p>

        <motion.div variants={fadeUp} className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-[20px] text-base font-bold hover:bg-primary-alt transition-colors"
          >
            Kom i gang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#priser"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-cta text-accent-cta-text rounded-[20px] text-base font-bold hover:brightness-95 transition-all"
          >
            Se priser
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
