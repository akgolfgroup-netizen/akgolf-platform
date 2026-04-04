"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

function ExpandableCard({ item }: { item: { id: string; label: string; title: string; description: string; expandedDescription: string; span: string; theme: string } }) {
  const [expanded, setExpanded] = useState(false);
  const isDark = item.theme === "dark";

  return (
    <div
      className={`rounded-[20px] p-8 ${
        item.span === "large" ? "md:col-span-2 p-10" : ""
      } ${
        isDark
          ? "bg-[#1D1D1F] text-white"
          : item.span === "large"
            ? "bg-[#F5F5F7] border border-[#E8E8ED]"
            : "bg-white border border-[#E8E8ED]"
      }`}
    >
      <span
        className={`text-[10px] font-mono uppercase tracking-[0.15em] font-medium ${
          isDark ? "text-white/60" : "text-grey-500"
        }`}
      >
        {item.label}
      </span>
      <h3
        className={`text-xl font-bold mt-3 mb-3 ${
          item.span === "large" ? "text-2xl" : ""
        } ${isDark ? "text-white" : "text-[#1D1D1F]"}`}
      >
        {item.title}
      </h3>
      <p
        className={`text-sm leading-relaxed ${
          item.span === "large" ? "max-w-xl" : ""
        } ${isDark ? "text-white/60" : "text-grey-500"}`}
      >
        {item.description}
      </p>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              className={`text-sm leading-relaxed mt-4 ${
                item.span === "large" ? "max-w-xl" : ""
              } ${isDark ? "text-white/60" : "text-grey-500"}`}
            >
              {item.expandedDescription}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`text-xs font-semibold mt-4 transition-colors ${
          isDark ? "text-white/80 hover:text-white" : "text-[#1D1D1F] hover:text-[#6E6E73]"
        }`}
      >
        {expanded ? "Vis mindre" : "Les mer"}
      </button>
    </div>
  );
}

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
          {/* ─── 1. Hero (dark, with background image) ─── */}
          <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden bg-[#1D1D1F] grain-overlay">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/branding/ak-golf-academy-19.jpg"
                alt="Bred fairway"
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
                  {UTVIKLING_SERVICES_V2.items.map((item) => (
                    <ExpandableCard key={item.id} item={item} />
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
                  <h2 className="w-heading-lg mt-4 mb-12">
                    {UTVIKLING_REFERENCES_V2.heading}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-8 max-w-3xl mx-auto">
                    <div className="flex flex-col items-center gap-3">
                      <Image
                        src="/images/partners/gfgk-logo.svg"
                        alt="Gamle Fredrikstad Golfklubb"
                        width={80}
                        height={80}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      />
                      <p className="text-sm text-grey-500">Gamle Fredrikstad Golfklubb</p>
                    </div>
                    {/* TODO: Legg til Miklagard-logo nar tilgjengelig */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-[16px] border border-[#E8E8ED] bg-white flex items-center justify-center">
                        <span className="text-xs font-semibold text-grey-500">MG</span>
                      </div>
                      <p className="text-sm text-grey-500">Miklagard Golfklubb</p>
                    </div>
                  </div>
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
                  <Link
                    href="/booking"
                    className="inline-flex px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    {UTVIKLING_CTA_V2.ctaPrimary} &rarr;
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
