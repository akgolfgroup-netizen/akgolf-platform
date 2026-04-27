"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";
import { BackToTop } from "@/components/website/BackToTop";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import {
  JUNIOR_HERO_V2,
  JUNIOR_ACADEMY_PROGRAM,
  JUNIOR_AGE_GROUPS_V2,
  JUNIOR_WANG_V2,
  JUNIOR_CTA_V2,
} from "@/lib/website-constants";

export default function JuniorPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-on-surface focus:text-surface focus:rounded-lg"
      >
        Hopp til hovedinnhold
      </a>
      <WebNav active="junior" />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Hjem",
                  item: "https://akgolf.no",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Junior Academy",
                  item: "https://akgolf.no/junior-academy",
                },
              ],
            }),
          }}
        />

        {/* 1. Hero */}
        <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden bg-on-surface grain-overlay">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={JUNIOR_HERO_V2.heroImage}
              alt="Junior golftrening"
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
                {JUNIOR_HERO_V2.label}
              </span>
            </motion.div>

            <motion.h1
              className="text-[48px] font-extrabold leading-[1.1] tracking-tight text-surface max-w-3xl mt-6 whitespace-pre-line"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [...EASE_ENTRANCE],
              }}
            >
              {JUNIOR_HERO_V2.heading}
            </motion.h1>

            <motion.p
              className="text-base text-surface/60 max-w-2xl leading-relaxed mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [...EASE_ENTRANCE],
              }}
            >
              {JUNIOR_HERO_V2.description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [...EASE_ENTRANCE],
              }}
            >
              <Link
                href="#apply"
                className="px-7 py-3.5 rounded-[20px] bg-primary text-surface text-sm font-semibold hover:bg-primary-alt transition-colors"
              >
                {JUNIOR_HERO_V2.ctaPrimary} &rarr;
              </Link>
              <Link
                href="#age-groups"
                className="px-7 py-3.5 rounded-[20px] border border-white/30 text-surface text-sm font-semibold hover:bg-surface-container-lowest/10 transition-colors"
              >
                {JUNIOR_HERO_V2.ctaSecondary} &rarr;
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. AK Golf Junior Academy program */}
        <section className="py-24 md:py-32 bg-surface-container-lowest">
          <div className="w-container">
            <RevealOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <SectionLabel>{JUNIOR_ACADEMY_PROGRAM.label}</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">
                  {JUNIOR_ACADEMY_PROGRAM.heading}
                </h2>
                <p className="text-on-surface-variant leading-relaxed max-w-xl mx-auto mb-8">
                  {JUNIOR_ACADEMY_PROGRAM.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-on-surface">
                      {JUNIOR_ACADEMY_PROGRAM.price}
                    </p>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-surface-variant" />
                  <div className="text-center">
                    <p className="text-sm text-on-surface-variant">
                      {JUNIOR_ACADEMY_PROGRAM.capacity}
                    </p>
                  </div>
                </div>

                <Link
                  href="#apply"
                  className="inline-flex px-8 py-4 rounded-[20px] bg-primary text-surface text-sm font-semibold hover:bg-primary-alt transition-colors"
                >
                  {JUNIOR_ACADEMY_PROGRAM.ctaLabel} &rarr;
                </Link>
              </div>
            </RevealOnScroll>

            {/* Bilder */}
            <RevealOnScroll delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16">
                {JUNIOR_ACADEMY_PROGRAM.images.map((src) => (
                  <div
                    key={src}
                    className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                  >
                    <Image
                      src={src}
                      alt="AK Golf Junior Academy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 3. GFGK Junior treningsgrupper */}
        <section id="age-groups" className="py-24 md:py-32 bg-surface">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>{JUNIOR_AGE_GROUPS_V2.label}</SectionLabel>
                <h2 className="w-heading-lg mt-4">
                  {JUNIOR_AGE_GROUPS_V2.heading}
                </h2>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {JUNIOR_AGE_GROUPS_V2.groups.map((group) => (
                <StaggerItem key={group.ageRange}>
                  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 shadow-card hover:shadow-[0_8px_24px_rgba(45,90,39,0.08)] transition-shadow duration-300 h-full flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-on-surface-variant font-medium">
                      {group.ageRange}
                    </span>
                    <h3 className="text-2xl font-bold text-on-surface mt-3 mb-3">
                      {group.name}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-1">
                      {group.description}
                    </p>
                    <div className="pt-4 border-t border-outline-variant/30">
                      <p className="text-xs text-on-surface-variant">
                        {group.schedule}
                      </p>
                      <p className="text-xs text-on-surface-variant/60 mt-1">
                        {group.maxParticipants}
                      </p>
                      {"note" in group && group.note && (
                        <p className="text-xs text-primary font-medium mt-2">
                          {group.note}
                        </p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* GFGK Logo */}
            <RevealOnScroll delay={0.1}>
              <div className="flex flex-col items-center gap-3 mt-12">
                <Image
                  src="/images/partners/gfgk-logo.svg"
                  alt="Gamle Fredrikstad Golfklubb"
                  width={80}
                  height={80}
                  className="opacity-60"
                />
                <p className="text-xs text-on-surface-variant">
                  I regi av GFGK Junior
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 4. WANG Toppidrett */}
        <section className="py-24 md:py-32 bg-on-surface">
          <div className="w-container">
            <RevealOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-surface/60 font-medium">
                  {JUNIOR_WANG_V2.label}
                </span>
                <h2 className="w-heading-lg text-surface mt-4 mb-6">
                  {JUNIOR_WANG_V2.heading}
                </h2>
                <div className="flex justify-center mb-8">
                  <Image
                    src="/images/partners/wang-logo-white-symbol.svg"
                    alt="WANG Toppidrett"
                    width={80}
                    height={80}
                    className="opacity-80"
                  />
                </div>
                <p className="text-surface/60 leading-relaxed mb-10">
                  {JUNIOR_WANG_V2.description}
                </p>
                <a
                  href="https://wang.no/toppidrett/fredrikstad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-7 py-3.5 rounded-[20px] border border-white/30 text-surface text-sm font-semibold hover:bg-surface-container-lowest/10 transition-colors"
                >
                  {JUNIOR_WANG_V2.ctaLabel} &rarr;
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 5. CTA */}
        <section id="apply" className="py-24 md:py-32 bg-surface-container-lowest">
          <div className="w-container">
            <RevealOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="w-heading-lg mb-4">
                  {JUNIOR_CTA_V2.heading}
                </h2>
                <p className="text-on-surface-variant leading-relaxed mb-10">
                  {JUNIOR_CTA_V2.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={JUNIOR_CTA_V2.ctaPrimaryHref}
                    className="inline-flex px-7 py-3.5 rounded-[20px] bg-primary text-surface text-sm font-semibold hover:bg-primary-alt transition-colors"
                  >
                    {JUNIOR_CTA_V2.ctaPrimary} &rarr;
                  </Link>
                  <a
                    href={JUNIOR_CTA_V2.ctaSecondaryHref}
                    className="inline-flex px-7 py-3.5 rounded-[20px] border border-outline-variant/30 text-on-surface text-sm font-semibold hover:bg-surface transition-colors"
                  >
                    {JUNIOR_CTA_V2.ctaSecondary} &rarr;
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <BackToTop />
      <WebFooter />
    </>
  );
}
