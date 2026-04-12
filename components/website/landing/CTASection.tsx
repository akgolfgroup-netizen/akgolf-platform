"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "../RevealOnScroll";
import { FINAL_CTA, BOOKING_URL } from "@/lib/website-constants";

export function CTASection() {
  return (
    <section className="px-4 md:px-6 pb-16">
      <RevealOnScroll>
        <div className="relative bg-black rounded-3xl py-20 md:py-28 px-8 text-center overflow-hidden max-w-[1120px] mx-auto">
          {/* Subtle glow accents */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[radial-gradient(circle,var(--color-primary)/0.12,transparent_70%)] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[radial-gradient(circle,var(--color-accent-cta)/0.05,transparent_70%)] pointer-events-none" />

          <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-6">
            {FINAL_CTA.eyebrow}
          </p>
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white tracking-tight mb-5 max-w-[640px] mx-auto leading-[1.1]">
            {FINAL_CTA.heading}
          </h2>
          <p className="relative z-10 text-base text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
            {FINAL_CTA.description}
          </p>
          <div className="relative z-10 flex gap-3 justify-center flex-wrap">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-cta text-accent-cta-text rounded-[20px] text-base font-bold hover:brightness-95 transition-all duration-300"
            >
              {FINAL_CTA.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white rounded-[20px] text-base font-medium hover:bg-white/5 transition-colors duration-300"
            >
              {FINAL_CTA.ctaSecondary}
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
