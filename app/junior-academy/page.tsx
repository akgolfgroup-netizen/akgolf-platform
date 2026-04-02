"use client";

import Link from "next/link";
import Image from "next/image";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { CTASection } from "@/components/website/CTASection";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { RelatedPages } from "@/components/website/RelatedPages";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { motion } from "framer-motion";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import {
  JUNIOR_FAQ,
  JUNIOR_HERO,
  JUNIOR_CTA,
  JUNIOR_ACADEMY_INFO,
} from "@/lib/website-constants";

export default function JuniorPage() {
  return (
    <>
      <WebsiteNav />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Hjem", item: "https://akgolf.no" },
                { "@type": "ListItem", position: 2, name: "Junior Academy", item: "https://akgolf.no/junior-academy" },
              ],
            }),
          }}
        />
        <PageTransition>
        {/* ─── Hero Section with Image ─── */}
        <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden">
          {/* Hero image background */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/academy/AK-Golf-Academy-30.jpg"
              alt="Coach og spiller på vei ut på banen"
              fill
              className="object-cover object-[center_60%]"
              priority
              sizes="100vw"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="w-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [...EASE_ENTRANCE] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-black" />
                <SectionLabel>{JUNIOR_HERO.eyebrow}</SectionLabel>
              </div>
            </motion.div>

            <motion.h1
              className="w-heading-xl max-w-3xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [...EASE_ENTRANCE] }}
            >
              {JUNIOR_HERO.heading}
            </motion.h1>

            <motion.p
              className="text-lg text-grey-500 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [...EASE_ENTRANCE] }}
            >
              {JUNIOR_HERO.description}
            </motion.p>

            {/* Horizontal accent line */}
            <motion.div
              className="mt-12 w-16 h-px bg-gradient-to-r from-black/50 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [...EASE_ENTRANCE] }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </section>

        {/* ─── Pathway Pyramid ─── */}
        <section id="pathway" className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Utviklingsveien</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Fra klubbtrening til satsning.</h2>
                <p className="text-grey-500 max-w-2xl mx-auto leading-relaxed">
                  GFGK Junior gir alle juniorer et solid grunnlag. De som vil satse videre tar steget opp til AK Golf Junior Academy.
                </p>
              </div>
            </RevealOnScroll>

            <div className="max-w-xl mx-auto">
              {/* Top: GFGK Junior (klubbtrening) — startpunkt */}
              <RevealOnScroll delay={0.1}>
                <div className="bg-white border border-grey-200 rounded-2xl p-8 text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-grey-100 text-xs font-medium text-grey-600 tracking-wide mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-grey-400" />
                    Klubbtrening
                  </span>
                  <h3 className="text-2xl font-bold text-black mb-3">GFGK Junior</h3>
                  <p className="text-grey-500 text-sm leading-relaxed mb-6">
                    Treningsgrupper for alle juniorer i klubben. Aldersbaserte grupper med fokus på lek, læring og mestring.
                  </p>
                  <a
                    href="https://gfgk-junior.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-grey-200 text-black font-medium text-sm hover:bg-grey-50 transition-colors"
                  >
                    Se grupper og påmelding
                  </a>
                </div>
              </RevealOnScroll>

              {/* Arrow connector — peker nedover (visuell progresjon) */}
              <RevealOnScroll delay={0.2}>
                <div className="flex flex-col items-center py-4">
                  <svg className="w-4 h-4 text-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="w-px h-8 bg-grey-300" />
                </div>
              </RevealOnScroll>

              {/* Bottom: Junior Academy (satsning) — neste nivå */}
              <RevealOnScroll delay={0.3}>
                <div className="bg-black text-white rounded-2xl p-8 text-center relative z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium tracking-wide mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Neste nivå
                  </span>
                  <h3 className="text-2xl font-bold mb-3">{JUNIOR_ACADEMY_INFO.heading}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {JUNIOR_ACADEMY_INFO.intro}
                  </p>
                  <div className="inline-flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold">{JUNIOR_ACADEMY_INFO.price}</span>
                    <span className="text-white/60 text-sm">{JUNIOR_ACADEMY_INFO.priceUnit}</span>
                  </div>
                  <div>
                    <Link href="#apply" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-grey-100 transition-colors">
                      Kontakt oss
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <RevealOnScroll>
                <div className="lg:sticky lg:top-24">
                  <SectionLabel>Spørsmål & svar</SectionLabel>
                  <h2 className="w-heading-lg mt-4">
                    Ofte stilte<br />spørsmål.
                  </h2>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <FAQAccordion items={JUNIOR_FAQ} />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <CTASection
          heading={JUNIOR_CTA.heading}
          description={JUNIOR_CTA.description}
          ctaLabel={JUNIOR_CTA.primaryCta}
          ctaHref="#apply"
        />

        {/* ─── Application Form ─── */}
        <section id="apply" className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Start med et uforpliktende møte.</h2>
                <p className="text-grey-500 max-w-lg mx-auto">
                  Fyll ut skjemaet under, så tar vi kontakt innen 48 timer for å avtale et møte.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <ApplicationForm />
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Related Pages ─── */}
        <RelatedPages exclude="junior-academy" />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
