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

/* ── SVG Illustrations for service cards ── */

function SportsplanSVG() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full max-w-[200px] mx-auto">
      {/* Document */}
      <rect x="40" y="10" width="120" height="140" rx="8" stroke="#E8E8ED" strokeWidth="1.5" fill="white" />
      {/* Header area */}
      <rect x="52" y="24" width="60" height="6" rx="3" fill="#E8E8ED" />
      <rect x="52" y="36" width="40" height="4" rx="2" fill="#F5F5F7" />
      {/* Section lines */}
      <rect x="52" y="52" width="96" height="4" rx="2" fill="#F5F5F7" />
      <rect x="52" y="62" width="80" height="4" rx="2" fill="#F5F5F7" />
      <rect x="52" y="72" width="88" height="4" rx="2" fill="#F5F5F7" />
      {/* Green highlight section */}
      <rect x="48" y="88" width="104" height="24" rx="6" fill="#2D6A4F" fillOpacity="0.08" />
      <rect x="56" y="94" width="64" height="4" rx="2" fill="#2D6A4F" fillOpacity="0.3" />
      <rect x="56" y="102" width="48" height="4" rx="2" fill="#2D6A4F" fillOpacity="0.2" />
      {/* Bottom lines */}
      <rect x="52" y="122" width="72" height="4" rx="2" fill="#F5F5F7" />
      <rect x="52" y="132" width="56" height="4" rx="2" fill="#F5F5F7" />
    </svg>
  );
}

function PortalMockupSVG() {
  return (
    <svg viewBox="0 0 120 220" fill="none" className="w-full max-w-[100px] mx-auto">
      {/* Phone frame */}
      <rect x="4" y="4" width="112" height="212" rx="20" stroke="#1D1D1F" strokeWidth="6" fill="#F5F5F7" />
      {/* Notch */}
      <rect x="36" y="4" width="48" height="14" rx="7" fill="#1D1D1F" />
      {/* Screen content */}
      {/* Handicap card */}
      <rect x="16" y="28" width="88" height="40" rx="8" fill="white" />
      <rect x="24" y="36" width="30" height="3" rx="1.5" fill="#E8E8ED" />
      <rect x="24" y="44" width="20" height="8" rx="2" fill="#1D1D1F" />
      <rect x="24" y="56" width="40" height="3" rx="1.5" fill="#2D6A4F" fillOpacity="0.3" />
      {/* Stats card */}
      <rect x="16" y="76" width="88" height="36" rx="8" fill="white" />
      <rect x="24" y="84" width="24" height="3" rx="1.5" fill="#E8E8ED" />
      {/* Mini bars */}
      <rect x="24" y="92" width="12" height="12" rx="2" fill="#2D6A4F" fillOpacity="0.2" />
      <rect x="40" y="96" width="12" height="8" rx="2" fill="#2D6A4F" fillOpacity="0.15" />
      <rect x="56" y="90" width="12" height="14" rx="2" fill="#2D6A4F" fillOpacity="0.25" />
      <rect x="72" y="94" width="12" height="10" rx="2" fill="#2D6A4F" fillOpacity="0.18" />
      {/* Plan card */}
      <rect x="16" y="120" width="88" height="36" rx="8" fill="white" />
      <rect x="24" y="128" width="36" height="3" rx="1.5" fill="#E8E8ED" />
      <rect x="24" y="136" width="72" height="3" rx="1.5" fill="#F5F5F7" />
      <rect x="24" y="144" width="56" height="3" rx="1.5" fill="#F5F5F7" />
      {/* Bottom nav */}
      <rect x="16" y="168" width="88" height="32" rx="8" fill="white" />
      <circle cx="36" cy="184" r="4" fill="#E8E8ED" />
      <circle cx="60" cy="184" r="4" fill="#2D6A4F" fillOpacity="0.3" />
      <circle cx="84" cy="184" r="4" fill="#E8E8ED" />
    </svg>
  );
}

function QRSkiltSVG() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full max-w-[200px] mx-auto">
      {/* Sign frame */}
      <rect x="20" y="10" width="100" height="130" rx="6" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="white" fillOpacity="0.05" />
      {/* QR code placeholder */}
      <rect x="40" y="24" width="60" height="60" rx="4" fill="white" fillOpacity="0.1" />
      {/* QR pattern */}
      <rect x="46" y="30" width="12" height="12" rx="1" fill="white" fillOpacity="0.25" />
      <rect x="82" y="30" width="12" height="12" rx="1" fill="white" fillOpacity="0.25" />
      <rect x="46" y="66" width="12" height="12" rx="1" fill="white" fillOpacity="0.25" />
      <rect x="62" y="46" width="16" height="16" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="62" y="66" width="8" height="8" rx="1" fill="white" fillOpacity="0.2" />
      <rect x="74" y="58" width="8" height="8" rx="1" fill="white" fillOpacity="0.15" />
      {/* Text lines under QR */}
      <rect x="40" y="94" width="60" height="4" rx="2" fill="white" fillOpacity="0.2" />
      <rect x="48" y="104" width="44" height="3" rx="1.5" fill="white" fillOpacity="0.1" />
      {/* Phone scanning */}
      <rect x="135" y="40" width="48" height="90" rx="10" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="white" fillOpacity="0.05" />
      <rect x="151" y="40" width="16" height="8" rx="4" fill="white" fillOpacity="0.15" />
      {/* Camera viewfinder */}
      <rect x="143" y="58" width="32" height="32" rx="4" stroke="white" strokeOpacity="0.3" strokeWidth="1" fill="none" strokeDasharray="4 4" />
      {/* Scan line */}
      <line x1="143" y1="74" x2="175" y2="74" stroke="#2D6A4F" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

const MOCKUP_MAP: Record<string, React.ComponentType> = {
  sportsplan: SportsplanSVG,
  programvare: PortalMockupSVG,
  skilting: QRSkiltSVG,
};

function ExpandableCard({
  item,
}: {
  item: {
    id: string;
    label: string;
    title: string;
    description: string;
    expandedDescription: string;
    span: string;
    theme: string;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const isDark = item.theme === "dark";
  const MockupComponent = MOCKUP_MAP[item.id];

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
            {MockupComponent && (
              <div className="mt-6 flex justify-center">
                <MockupComponent />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`text-xs font-semibold mt-4 transition-colors ${
          isDark
            ? "text-white/80 hover:text-white"
            : "text-[#1D1D1F] hover:text-[#6E6E73]"
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
                src="/images/academy/AK-Golf-Academy-8.jpg"
                alt="Coach og elev ved laptop"
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
                      <p className="text-sm text-grey-500">
                        Gamle Fredrikstad Golfklubb
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-[16px] border border-[#E8E8ED] bg-white flex items-center justify-center">
                        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
                          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                            style={{ fontSize: "16px", fontWeight: 700, fill: "#6E6E73", fontFamily: "var(--font-inter), system-ui" }}>
                            MG
                          </text>
                        </svg>
                      </div>
                      <p className="text-sm text-grey-500">
                        Miklagard Golfklubb
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 4. CTA (light bg) ─── */}
          <section id="contact" className="py-28 md:py-40 bg-[#F5F5F7]">
            <div className="w-container">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="w-heading-lg text-[#1D1D1F] mb-4">
                    {UTVIKLING_CTA_V2.heading}
                  </h2>
                  <p className="text-[#48484A] leading-relaxed mb-10">
                    {UTVIKLING_CTA_V2.description}
                  </p>
                  <Link
                    href="/booking"
                    className="inline-flex px-7 py-3.5 rounded-[980px] bg-[#1D1D1F] text-white text-sm font-semibold hover:bg-[#2C2C2E] transition-colors"
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
