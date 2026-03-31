"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { TeamSection } from "@/components/website/TeamSection";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { BackToTop } from "@/components/website/BackToTop";
import {
  HERO,
  HOW_IT_WORKS,
  COACHING_PACKAGES,
  FLEX_PACKAGES,
  PORTAL_FEATURES,
  COACHING_FAQ,
  BOOKING_URL,
  FOUNDATION_TEST,
} from "@/lib/website-constants";

/* ─── Ikoner ─── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ─── Animasjons-variants ─── */

export default function HomePage() {
  return (
    <>
      <WebsiteNav />

      <main id="main-content">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 1. HERO — Apple Light Theme with image                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[100svh] flex items-center pt-[48px]">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/hero/hero-main.jpg"
              alt=""
              fill
              className="object-cover object-[75%_center] md:object-center"
              priority
              sizes="100vw"
            />
            {/* White gradient overlay from left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/20" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="w-container relative w-full">
            <div className="max-w-2xl">
              <motion.p
                className="text-xs font-mono uppercase tracking-[0.2em] text-grey-500 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {HERO.eyebrow}
              </motion.p>

              <motion.h1
                className="w-heading-xl mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.heading}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-grey-500 max-w-lg leading-relaxed mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                {HERO.subheading}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <Link href="/#packages" className="w-btn w-btn-primary">
                  Se pakker og priser
                </Link>
                <Link href="/#apply" className="w-btn w-btn-secondary">
                  Kontakt oss
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                className="flex flex-wrap gap-x-6 gap-y-2 mt-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {["PGA Professional", "Trackman Certified", "TPI Certified", "10+ års erfaring"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-[11px] text-grey-400 font-medium tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-black" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-grey-400">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black w-scroll-indicator">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 2. SLIK FUNGERER DET — 3 steg                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <SectionLabel>{HOW_IT_WORKS.eyebrow}</SectionLabel>
                <h2 className="w-heading-lg mt-5">{HOW_IT_WORKS.heading}</h2>
                <p className="text-grey-500 max-w-xl mx-auto mt-5 text-lg leading-relaxed">
                  {HOW_IT_WORKS.description}
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 max-w-4xl mx-auto">
              {HOW_IT_WORKS.steps.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="text-center">
                    <span className="inline-block font-display text-5xl md:text-6xl font-bold text-grey-200 mb-5">
                      {step.number}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-black mb-3">{step.title}</h3>
                    <p className="text-sm text-grey-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. FOUNDATION TEST — Light theme                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section id="start" className="relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Bilde */}
            <div className="relative h-72 lg:h-auto">
              <Image
                src="/images/sections/instruksjon.jpg"
                alt="Golf coaching session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Innhold — Light theme */}
            <div className="bg-grey-100 flex items-center p-10 md:p-16 lg:p-20">
              <RevealOnScroll>
                <div className="max-w-lg">
                  <span className="inline-block bg-black/10 text-black text-[10px] font-mono uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6">
                    {FOUNDATION_TEST.tagline}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
                    {FOUNDATION_TEST.name}
                  </h2>
                  <p className="text-grey-500 text-lg leading-relaxed mb-8">{FOUNDATION_TEST.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-10">
                    {FOUNDATION_TEST.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <CheckIcon className="text-black shrink-0" />
                        <span className="text-sm text-grey-600">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end gap-6">
                    <div>
                      <span className="font-display text-4xl font-bold text-black">{FOUNDATION_TEST.price} kr</span>
                      <p className="text-xs text-grey-400 mt-1">{FOUNDATION_TEST.refundNote}</p>
                    </div>
                    <a href={BOOKING_URL} className="w-btn w-btn-primary shrink-0">
                      Book nå
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 4. PRIS-SAMMENLIGNING — Light theme                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Sammenligning</SectionLabel>
                <h2 className="w-heading-lg mt-5">Enkelttime eller abonnement?</h2>
                <p className="text-grey-500 max-w-lg mx-auto mt-4 text-lg">
                  De fleste sparer over 60% med abonnement sammenlignet med enkelttimer.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Flex */}
                <div className="bg-white rounded-[20px] p-8 border border-grey-200">
                  <p className="text-xs font-mono uppercase tracking-wider text-grey-400 mb-4">Enkeltsesjoner</p>
                  <h3 className="font-display text-xl font-semibold text-black mb-2">AK Flex</h3>
                  <p className="font-display text-3xl font-bold text-black mb-6">
                    fra 1 500 <span className="text-base font-normal text-grey-400">kr/time</span>
                  </p>
                  <ul className="space-y-3">
                    {[
                      { ok: true, text: "Ingen binding" },
                      { ok: true, text: "50 eller 90 min per sesjon" },
                      { ok: true, text: "Coaching-notater etterpå" },
                      { ok: false, text: "Ingen spillerportal" },
                      { ok: false, text: "Ingen treningsplan" },
                      { ok: false, text: "Ingen selvbooking" },
                    ].map((item) => (
                      <li key={item.text} className="flex items-start gap-2.5 text-sm">
                        {item.ok ? (
                          <CheckIcon className="shrink-0 mt-0.5 text-grey-400" />
                        ) : (
                          <XIcon className="shrink-0 mt-0.5 text-grey-300" />
                        )}
                        <span className={item.ok ? "text-grey-600" : "text-grey-400"}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Abonnement — Featured */}
                <div className="bg-black rounded-[20px] p-8 relative">
                  <div className="absolute -top-3 right-8">
                    <span className="bg-white text-black text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                      Spar 67%
                    </span>
                  </div>
                  <p className="text-xs font-mono uppercase tracking-wider text-grey-400 mb-4">Abonnement</p>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">AK Performance</h3>
                  <p className="font-display text-3xl font-bold text-white mb-1">
                    fra 500 <span className="text-base font-normal text-grey-400">kr/økt</span>
                  </p>
                  <p className="text-xs text-grey-500 mb-6">Performance Pro: 4 økter/mnd = 2 000 kr</p>
                  <ul className="space-y-3">
                    {[
                      "Ingen binding — si opp når som helst",
                      "Jevnlig coaching med fast frekvens",
                      "Full spillerportal med treningsplan",
                      "TrackMan-data i din profil",
                      "Selvbooking via appen",
                      "AI-analyse og øvelsesbank",
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-2.5 text-sm">
                        <CheckIcon className="shrink-0 mt-0.5 text-white" />
                        <span className="text-grey-300">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 5. COACHING-PAKKER — Light theme                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section id="packages" className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Velg din pakke</SectionLabel>
                <h2 className="w-heading-lg mt-5">To nivåer. Ingen bindingstid.</h2>
                <p className="text-grey-500 max-w-xl mx-auto mt-4">
                  Begge inkluderer full spillerportal, treningsplan og TrackMan-data. Oppgrader eller si opp når som helst.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {COACHING_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div
                    className={`rounded-[20px] flex flex-col h-full transition-all duration-300 ${
                      pkg.highlighted
                        ? "bg-black text-white relative shadow-lg hover:shadow-xl hover:-translate-y-1"
                        : "bg-white border border-grey-200 hover:border-grey-300 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {pkg.highlighted && (
                      <div className="absolute -top-3 left-8">
                        <span className="bg-white text-black text-[10px] font-mono uppercase tracking-wider px-4 py-1 rounded-full font-semibold">
                          Mest populær
                        </span>
                      </div>
                    )}

                    <div className="p-10 flex flex-col flex-1">
                      <h3 className={`font-display text-2xl font-bold mb-2 ${pkg.highlighted ? "text-white" : "text-black"}`}>
                        {pkg.name}
                      </h3>

                      <div className="mb-2">
                        <span className={`font-display text-4xl font-bold ${pkg.highlighted ? "text-white" : "text-black"}`}>
                          {pkg.price}
                        </span>
                        <span className={`text-sm ml-1 ${pkg.highlighted ? "text-grey-400" : "text-grey-500"}`}>
                          {pkg.period}
                        </span>
                      </div>

                      {/* Pris per økt beregning */}
                      <p className={`text-xs font-mono mb-6 ${pkg.highlighted ? "text-grey-400" : "text-grey-400"}`}>
                        = {pkg.highlighted ? "500" : "800"} kr per økt
                      </p>

                      <p className={`text-sm leading-relaxed mb-8 ${pkg.highlighted ? "text-grey-300" : "text-grey-500"}`}>
                        {pkg.description}
                      </p>

                      <ul className="space-y-3 mb-8 flex-1">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm">
                            <CheckIcon className={`shrink-0 mt-0.5 ${pkg.highlighted ? "text-white" : "text-black"}`} />
                            <span className={pkg.highlighted ? "text-grey-200" : "text-grey-600"}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={BOOKING_URL}
                        className={`w-btn text-center ${pkg.highlighted ? "bg-white text-black hover:opacity-90" : "w-btn-primary"}`}
                        style={pkg.highlighted ? { borderRadius: '980px', padding: '0.875rem 2rem' } : undefined}
                      >
                        Kom i gang
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Flex alternativ */}
            <RevealOnScroll>
              <div className="text-center mt-20 mb-10">
                <h3 className="font-display text-xl font-semibold text-black">Ikke klar for abonnement?</h3>
                <p className="text-grey-500 mt-2">Prøv en enkeltsesjon uten binding.</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {FLEX_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div className="bg-white rounded-[20px] p-6 border border-grey-200 hover:border-grey-300 transition-colors">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-display text-base font-semibold text-black">{pkg.name}</h4>
                      <span className="text-xs text-grey-400 font-mono">{pkg.duration}</span>
                    </div>
                    <p className="font-display text-xl font-bold text-black mb-2">
                      {pkg.price}
                      <span className="text-sm font-normal text-grey-400 ml-1">{pkg.period}</span>
                    </p>
                    <p className="text-sm text-grey-500 leading-relaxed mb-4">{pkg.description}</p>
                    <a href={BOOKING_URL} className="w-btn w-btn-secondary text-center w-full text-sm">
                      Book nå
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 6. SPILLERPORTALEN — Light theme                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Spillerportalen</SectionLabel>
                <h2 className="w-heading-lg mt-5">
                  Tren smartere mellom øktene.
                </h2>
                <p className="text-grey-500 max-w-lg mx-auto mt-4 text-lg">
                  Alle coaching-pakker inkluderer full tilgang til spillerportalen med treningsplan, statistikk og øvelsesbank.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PORTAL_FEATURES.map((feature) => (
                <StaggerItem key={feature.title}>
                  <div className="bg-grey-100 border border-grey-200 rounded-[20px] p-7 hover:bg-grey-200/50 hover:border-grey-300 transition-all duration-300">
                    <h3 className="font-display text-base font-semibold text-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-grey-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 7. FAQ                                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Spørsmål og svar</SectionLabel>
                <h2 className="w-heading-lg mt-5">Ofte stilte spørsmål</h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="max-w-2xl mx-auto">
                <FAQAccordion items={COACHING_FAQ} />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 8. TEAM                                                           */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TeamSection />

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 9. KONTAKT / CTA                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section id="apply" className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-5 mb-4">Klar for å starte?</h2>
                <p className="text-grey-500 max-w-md mx-auto text-lg">
                  Fortell oss om dine mål, så finner vi ut hvordan vi kan hjelpe deg videre.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <ApplicationForm />
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
