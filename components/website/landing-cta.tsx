"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "./RevealOnScroll";

export function LandingCTA() {
  return (
    <section className="px-4 md:px-6 pb-12">
      <RevealOnScroll>
        <div className="relative bg-black rounded-3xl py-20 md:py-28 px-8 text-center overflow-hidden max-w-[1120px] mx-auto">
          {/* Subtle glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[radial-gradient(circle,var(--color-primary)/0.15,transparent_70%)]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[radial-gradient(circle,var(--color-accent-cta)/0.06,transparent_70%)]" />

          <p className="relative z-10 text-xs uppercase tracking-widest text-white/30 mb-6">
            Neste steg
          </p>
          <h2 className="relative z-10 text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Klar for å forbedre spillet ditt?
          </h2>
          <p className="relative z-10 text-base text-white/40 mb-10 max-w-lg mx-auto">
            Book din første coaching-økt og få en personlig treningsplan.
            Ingen binding. Resultater fra dag én.
          </p>
          <div className="relative z-10 flex gap-3 justify-center flex-wrap">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-cta text-accent-cta-text rounded-[20px] text-base font-bold hover:brightness-95 transition-all"
            >
              Book din første økt
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white rounded-[20px] text-base font-medium hover:bg-white/5 transition-colors"
            >
              Les mer om coaching
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
