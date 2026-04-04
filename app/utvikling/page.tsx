"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import {
  UTVIKLING_HERO_V2,
  UTVIKLING_SERVICES_V2,
  UTVIKLING_REFERENCES_V2,
  UTVIKLING_CTA_V2,
} from "@/lib/website-constants";

export default function UtviklingPage() {
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
                  name: "Utvikling",
                  item: "https://akgolf.no/utvikling",
                },
              ],
            }),
          }}
        />
        <PageTransition>
          {/* ─── 1. Hero (dark, no image) ─── */}
          <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden bg-[#1D1D1F] grain-overlay">
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
                  {UTVIKLING_HERO_V2.label}
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
                {UTVIKLING_HERO_V2.heading}
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
                {UTVIKLING_HERO_V2.description}
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
                  href="#contact"
                  className="px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {UTVIKLING_HERO_V2.ctaLabel} &rarr;
                </Link>
              </motion.div>
            </div>
          </section>

          {/* ─── 2. Services bento grid (white bg) ─── */}
          <section className="py-28 md:py-40 bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-16">
                  <SectionLabel>{UTVIKLING_SERVICES_V2.label}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">
                    {UTVIKLING_SERVICES_V2.heading}
                  </h2>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {/* Large card spanning 2 cols */}
                  {UTVIKLING_SERVICES_V2.items
                    .filter((item) => item.span === "large")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="md:col-span-2 bg-[#F5F5F7] rounded-[20px] border border-[#E8E8ED] p-10"
                      >
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-grey-500 font-medium">
                          {item.label}
                        </span>
                        <h3 className="text-2xl font-bold text-[#1D1D1F] mt-3 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-sm text-grey-500 leading-relaxed max-w-xl">
                          {item.description}
                        </p>
                      </div>
                    ))}

                  {/* Small cards */}
                  {UTVIKLING_SERVICES_V2.items
                    .filter((item) => item.span === "small")
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-[20px] p-8 ${
                          item.theme === "dark"
                            ? "bg-[#1D1D1F] text-white"
                            : "bg-white border border-[#E8E8ED]"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-mono uppercase tracking-[0.15em] font-medium ${
                            item.theme === "dark"
                              ? "text-white/60"
                              : "text-grey-500"
                          }`}
                        >
                          {item.label}
                        </span>
                        <h3
                          className={`text-xl font-bold mt-3 mb-3 ${
                            item.theme === "dark"
                              ? "text-white"
                              : "text-[#1D1D1F]"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed ${
                            item.theme === "dark"
                              ? "text-white/60"
                              : "text-grey-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 3. References / Social proof (grey bg) ─── */}
          <section className="py-28 md:py-40 bg-[#F5F5F7]">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center">
                  <SectionLabel>
                    {UTVIKLING_REFERENCES_V2.label}
                  </SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-8">
                    {UTVIKLING_REFERENCES_V2.heading}
                  </h2>
                  {UTVIKLING_REFERENCES_V2.clubs.map((club) => (
                    <p key={club} className="text-lg text-grey-500">
                      {club}
                    </p>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 4. CTA (dark) ─── */}
          <section id="contact" className="py-28 md:py-40 bg-[#1D1D1F]">
            <div className="w-container">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="w-heading-lg text-white mb-4">
                    {UTVIKLING_CTA_V2.heading}
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-10">
                    {UTVIKLING_CTA_V2.description}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/booking"
                      className="px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                    >
                      {UTVIKLING_CTA_V2.ctaPrimary} &rarr;
                    </Link>
                    <a
                      href="tel:+4790967995"
                      className="px-7 py-3.5 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                      {UTVIKLING_CTA_V2.ctaSecondary}
                    </a>
                  </div>
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
