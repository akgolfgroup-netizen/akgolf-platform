"use client";

import Link from "next/link";
import Image from "next/image";
import { ACADEMY_CTA_V2 } from "@/lib/website-constants";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";

export function AcademyCtaV2() {
  return (
    <section className="relative py-24 md:py-32 bg-primary overflow-hidden">
      {/* Subtilt bakgrunnsbilde */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={ACADEMY_CTA_V2.heroImage}
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
      </div>

      <div className="w-container relative">
        <RevealOnScroll>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {ACADEMY_CTA_V2.heading}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              {ACADEMY_CTA_V2.description}
            </p>
            <Link
              href="/booking"
              className="inline-flex px-8 py-4 rounded-[20px] bg-accent-cta text-accent-cta-text text-sm font-bold hover:brightness-105 transition-all duration-200"
            >
              {ACADEMY_CTA_V2.ctaLabel} &rarr;
            </Link>
            <p className="mt-6 text-sm text-white/40">
              Ingen binding. Avbestilling frem til 24 timer for.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
