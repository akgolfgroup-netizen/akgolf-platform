"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { HERO } from "@/lib/website-constants";

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Subtle radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-primary)/0.04, transparent)",
        }}
      />

      <div className="max-w-[1120px] mx-auto px-5 py-24 md:py-32 text-center relative z-10">
        <RevealOnScroll direction="blur">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-grey-200)] bg-white/80 backdrop-blur-sm px-4 py-1.5 mb-8">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-primary)" }}
            />
            <span className="text-xs font-medium tracking-wide text-[var(--color-muted)]">
              {HERO.statusBadge}
            </span>
          </div>

          {/* Heading with typographic contrast */}
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.03em] mb-6">
            <span className="font-light text-[var(--color-muted)]">
              Golf coaching.
            </span>
            <br />
            <span className="font-bold text-[var(--color-grey-900)]">
              Reimagined.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-[560px] mx-auto text-base md:text-lg leading-relaxed text-[var(--color-text)] mb-10">
            {HERO.subheading}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/academy"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--color-primary)" }}
            >
              {HERO.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "var(--color-accent-cta)",
                color: "var(--color-grey-900)",
              }}
            >
              {HERO.ctaSecondary}
            </Link>
          </div>

          {/* Trust items */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {HERO.trustItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs text-[var(--color-muted)]"
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--color-primary)" }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
