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
  ACADEMY_HERO_V2,
  ACADEMY_METHOD_V2,
  ACADEMY_PRICES_V2,
  ACADEMY_CTA_V2,
} from "@/lib/website-constants";

export default function AcademyPage() {
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
                  name: "Academy",
                  item: "https://akgolf.no/academy",
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
                src={ACADEMY_HERO_V2.heroImage}
                alt="Coaching med TrackMan-analyse"
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
                  {ACADEMY_HERO_V2.label}
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
                {ACADEMY_HERO_V2.heading}
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
                {ACADEMY_HERO_V2.description}
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
                  href="/booking-temp"
                  className="px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {ACADEMY_HERO_V2.ctaPrimary} &rarr;
                </Link>
                <Link
                  href="#prices"
                  className="px-7 py-3.5 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {ACADEMY_HERO_V2.ctaSecondary} &rarr;
                </Link>
              </motion.div>
            </div>
          </section>

          {/* ─── 2. Method (white bg) ─── */}
          <section className="py-28 md:py-40 bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-16">
                  <SectionLabel>{ACADEMY_METHOD_V2.label}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">
                    {ACADEMY_METHOD_V2.heading}
                  </h2>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {ACADEMY_METHOD_V2.steps.map((step) => (
                  <StaggerItem key={step.number}>
                    <div className="bg-[#F5F5F7] rounded-[20px] border border-[#E8E8ED] p-8 h-full">
                      <span className="block text-[80px] font-[900] leading-none text-[#E8E8ED] mb-4">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-grey-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 3. Full-width image ─── */}
          <section className="relative">
            <RevealOnScroll>
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image
                  src="/images/academy/AK-Golf-Academy-33.jpg"
                  alt="AK Golf Academy trening"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
              </div>
            </RevealOnScroll>
          </section>

          {/* ─── 4. Prices (white bg) ─── */}
          {/* TODO: Anders oppdaterer priser og pakkenavn manuelt */}
          <section id="prices" className="py-28 md:py-40 bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-16">
                  <SectionLabel>{ACADEMY_PRICES_V2.label}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">
                    {ACADEMY_PRICES_V2.heading}
                  </h2>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {ACADEMY_PRICES_V2.packages.map((pkg) => (
                  <StaggerItem key={pkg.name}>
                    <div
                      className={`rounded-[20px] p-8 h-full flex flex-col relative ${
                        pkg.highlighted
                          ? "bg-white border-2 border-[var(--color-brand)]"
                          : "bg-white border border-[#E8E8ED]"
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-3 left-8 px-3 py-1 bg-[#1D1D1F] text-white text-[10px] font-mono uppercase tracking-[0.12em] rounded-full font-semibold">
                          {pkg.badge}
                        </span>
                      )}
                      <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
                        {pkg.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-[48px] font-bold text-[#1D1D1F]">
                          {pkg.price}
                        </span>
                        <span className="text-sm text-grey-500 ml-2">
                          {pkg.unit}
                        </span>
                      </div>
                      {"perSession" in pkg && pkg.perSession && (
                        <p className="text-sm text-[var(--color-brand)] font-medium mb-1">
                          {pkg.perSession}
                        </p>
                      )}
                      {"savings" in pkg && pkg.savings && (
                        <p className="text-xs text-grey-500 mb-4">
                          {pkg.savings}
                        </p>
                      )}
                      {"note" in pkg && pkg.note && (
                        <p className="text-xs text-grey-500 mb-4">
                          {pkg.note}
                        </p>
                      )}
                      <ul className="space-y-3 mt-2 flex-1">
                        {pkg.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-grey-600"
                          >
                            <span className="text-grey-400 shrink-0">
                              &mdash;
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/booking-temp"
                        className="mt-8 px-7 py-3.5 rounded-[980px] bg-[#1D1D1F] text-white text-sm font-semibold hover:bg-[#2C2C2E] transition-colors text-center block"
                      >
                        Book coaching &rarr;
                      </Link>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 5. CTA (dark) ─── */}
          <section className="relative py-28 md:py-40 bg-[#1D1D1F] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={ACADEMY_CTA_V2.heroImage}
                alt="AK Golf Academy"
                fill
                className="object-cover opacity-15"
                style={{ objectPosition: "center 30%" }}
                sizes="100vw"
              />
            </div>
            <div className="w-container relative">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="w-heading-lg text-white mb-4">
                    {ACADEMY_CTA_V2.heading}
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-10">
                    {ACADEMY_CTA_V2.description}
                  </p>
                  <Link
                    href="/booking-temp"
                    className="inline-flex px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    {ACADEMY_CTA_V2.ctaLabel} &rarr;
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
