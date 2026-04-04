"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import {
  JUNIOR_HERO_V2,
  JUNIOR_AGE_GROUPS_V2,
  JUNIOR_GFGK_V2,
  JUNIOR_WANG_V2,
  JUNIOR_CTA_V2,
} from "@/lib/website-constants";

export default function JuniorPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-grey-900)] focus:text-white focus:rounded-lg"
      >
        Hopp til hovedinnhold
      </a>
      <WebsiteNav />

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
        <PageTransition>
          {/* ─── 1. Hero (dark, half height) ─── */}
          <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden bg-[#1D1D1F] grain-overlay">
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
                transition={{
                  duration: 0.8,
                  ease: [...EASE_ENTRANCE],
                }}
              >
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/60 font-medium">
                  {JUNIOR_HERO_V2.label}
                </span>
              </motion.div>

              <motion.h1
                className="text-[48px] font-extrabold leading-[1.1] tracking-tight text-white max-w-3xl mt-6 whitespace-pre-line"
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
                className="text-base text-white/60 max-w-2xl leading-relaxed mt-6"
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
                  className="px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {JUNIOR_HERO_V2.ctaPrimary} &rarr;
                </Link>
                <Link
                  href="#age-groups"
                  className="px-7 py-3.5 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {JUNIOR_HERO_V2.ctaSecondary} &rarr;
                </Link>
              </motion.div>
            </div>
          </section>

          {/* ─── 2. Age Groups (white bg) ─── */}
          <section id="age-groups" className="py-28 md:py-40 bg-white">
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
                    <div className="bg-[#F5F5F7] rounded-[20px] border border-[#E8E8ED] p-8 h-full flex flex-col">
                      <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-grey-500 font-medium">
                        {group.ageRange}
                      </span>
                      <h3 className="text-2xl font-bold text-[#1D1D1F] mt-3 mb-3">
                        {group.name}
                      </h3>
                      <p className="text-sm text-grey-500 leading-relaxed mb-6 flex-1">
                        {group.description}
                      </p>
                      <div className="pt-4 border-t border-[#E8E8ED]">
                        <p className="text-xs text-grey-500">
                          {group.schedule}
                        </p>
                        <p className="text-xs text-grey-400 mt-1">
                          {group.maxParticipants}
                        </p>
                        {"note" in group && group.note && (
                          <p className="text-xs text-[var(--color-brand)] font-medium mt-2">
                            {group.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 3. GFGK samarbeid (light section) ─── */}
          <section className="py-28 md:py-40 bg-[#F5F5F7]">
            <div className="w-container">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-grey-500 font-medium">
                    {JUNIOR_GFGK_V2.label}
                  </span>
                  <h2 className="w-heading-lg mt-4 mb-6">
                    {JUNIOR_GFGK_V2.heading}
                  </h2>
                  <p className="text-grey-500 leading-relaxed whitespace-pre-line">
                    {JUNIOR_GFGK_V2.description}
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 4. WANG (dark section) ─── */}
          <section className="py-28 md:py-40 bg-[#1D1D1F]">
            <div className="w-container">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/60 font-medium">
                    {JUNIOR_WANG_V2.label}
                  </span>
                  <h2 className="w-heading-lg text-white mt-4 mb-6">
                    {JUNIOR_WANG_V2.heading}
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-10">
                    {JUNIOR_WANG_V2.description}
                  </p>
                  {/* TODO: Legg til WANG-logo nar tilgjengelig */}
                  {/* TODO: Legg til lenker til WANG UNG/Toppidrett med korrekte URLer */}
                  <Link
                    href="/utvikling"
                    className="inline-flex px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    {JUNIOR_WANG_V2.ctaLabel} &rarr;
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 5. CTA (white bg) ─── */}
          <section id="apply" className="py-28 md:py-40 bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="w-heading-lg mb-4">
                    {JUNIOR_CTA_V2.heading}
                  </h2>
                  <p className="text-grey-500 leading-relaxed mb-10">
                    {JUNIOR_CTA_V2.description}
                  </p>
                  {/* TODO: Oppdater href til korrekt GFGK Junior kontakt-URL */}
                  <Link
                    href={JUNIOR_CTA_V2.ctaHref}
                    className="inline-flex px-7 py-3.5 rounded-[980px] bg-[#1D1D1F] text-white text-sm font-semibold hover:bg-[#2C2C2E] transition-colors"
                  >
                    {JUNIOR_CTA_V2.ctaLabel} &rarr;
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </section>
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
