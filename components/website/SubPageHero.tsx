"use client";

import { motion } from "framer-motion";
import { ACCENT_COLORS, EASE_ENTRANCE, type Accent } from "@/lib/design-tokens";
import { SectionLabel } from "./SectionLabel";

export function SubPageHero({
  eyebrow,
  heading,
  description,
  accent = "academy",
}: {
  eyebrow: string;
  heading: string;
  description: string;
  accent?: Accent;
}) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-24 right-[10%] w-[400px] h-[400px] rounded-full ${ACCENT_COLORS[accent]} opacity-[0.08] blur-[80px]`} />
        <div className="absolute bottom-0 left-[20%] w-[300px] h-[300px] rounded-full bg-gold opacity-[0.05] blur-[60px]" />
        {/* Decorative gold line */}
        <div className="absolute top-0 left-[10%] w-px h-[30vh] bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      </div>

      <div className="w-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [...EASE_ENTRANCE] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-2 h-2 rounded-full ${ACCENT_COLORS[accent]}`} />
            <SectionLabel>{eyebrow}</SectionLabel>
          </div>
        </motion.div>

        <motion.h1
          className="w-heading-xl max-w-3xl mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [...EASE_ENTRANCE] }}
        >
          {heading}
        </motion.h1>

        <motion.p
          className="text-lg text-ink-50 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [...EASE_ENTRANCE] }}
        >
          {description}
        </motion.p>

        {/* Horizontal gold accent */}
        <motion.div
          className="mt-12 w-16 h-px bg-gradient-to-r from-gold/40 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [...EASE_ENTRANCE] }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </section>
  );
}
