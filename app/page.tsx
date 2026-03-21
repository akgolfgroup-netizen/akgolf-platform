"use client";

import Image from "next/image";
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
  DIVISIONS,
  HOW_IT_WORKS,
  COACHING_PACKAGES,
  FLEX_PACKAGES,
  PORTAL_FEATURES,
  COACHING_FAQ,
  BOOKING_URL,
} from "@/lib/website-constants";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <WebsiteNav />

      <main id="main-content">
        {/* ─── 1. Hero (mork) ─── */}
        <section className="relative min-h-screen flex items-center pt-[52px]">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/hero/hero-main.jpg"
              alt=""
              fill
              className="object-cover object-[75%_center] md:object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-ink-100/40 md:bg-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-100/90 via-ink-100/70 to-ink-100/30" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-warm to-transparent" />
          </div>

          <div className="w-container relative w-full">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <SectionLabel>{HERO.eyebrow}</SectionLabel>
              </motion.div>

              <motion.h1
                className="w-heading-xl mt-6 mb-6 text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.heading}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-ink-20 max-w-xl leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.subheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a href="#packages" className="w-btn w-btn-primary">{HERO.ctaPrimary}</a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── 2. How It Works (lys) ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-6">
                <SectionLabel>{HOW_IT_WORKS.eyebrow}</SectionLabel>
                <h2 className="w-heading-lg mt-4">{HOW_IT_WORKS.heading}</h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <p className="text-ink-50 max-w-2xl mx-auto text-center leading-relaxed mb-16">
                {HOW_IT_WORKS.description}
              </p>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.steps.map((step) => (
                <StaggerItem key={step.number}>
                  <div className="text-center">
                    <span className="inline-block font-mono text-4xl font-bold text-gold-muted mb-4">
                      {step.number}
                    </span>
                    <h3 className="w-heading-sm mb-3">{step.title}</h3>
                    <p className="text-sm text-ink-50 leading-relaxed">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 3. Packages (lys) ─── */}
        <section id="packages" className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Pakker og priser</SectionLabel>
                <h2 className="w-heading-lg mt-4">Velg pakken som passer deg.</h2>
                <p className="text-ink-50 max-w-lg mx-auto mt-4">
                  Alle abonnement er uten bindingstid og kan sies opp naar som helst.
                </p>
              </div>
            </RevealOnScroll>

            {/* Subscription packages */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {COACHING_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div
                    className={`rounded-2xl p-8 flex flex-col h-full transition-all duration-400 ${
                      pkg.highlighted
                        ? "bg-ink-90 text-white border-2 border-gold/30 shadow-xl relative"
                        : "bg-white border border-ink-10 hover:border-ink-20 hover:shadow-lg"
                    }`}
                  >
                    {pkg.highlighted && (
                      <span className="absolute -top-3 left-8 bg-gold text-white text-[10px] font-mono uppercase tracking-[0.12em] px-3 py-1 rounded-full">
                        Mest populaer
                      </span>
                    )}

                    <h3 className={`font-display text-xl font-semibold mb-1 ${pkg.highlighted ? "text-white" : "text-ink-90"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`font-mono text-2xl font-bold mb-1 ${pkg.highlighted ? "text-gold" : "text-gold-text"}`}>
                      {pkg.price}
                      <span className="text-sm font-normal ml-1">{pkg.period}</span>
                    </p>
                    <p className={`text-sm leading-relaxed mb-6 ${pkg.highlighted ? "text-ink-30" : "text-ink-50"}`}>
                      {pkg.description}
                    </p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                          <span className={pkg.highlighted ? "text-ink-20" : "text-ink-60"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={BOOKING_URL}
                      className={`w-btn text-center ${
                        pkg.highlighted ? "w-btn-gold" : "w-btn-primary"
                      }`}
                    >
                      Kom i gang
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Flex packages */}
            <RevealOnScroll>
              <div className="text-center mb-8">
                <h3 className="w-heading-md">Ikke klar for abonnement?</h3>
                <p className="text-ink-50 mt-2">Prov en enkeltsesjon uten binding.</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {FLEX_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div className="w-card flex flex-col h-full">
                    <div className="flex items-baseline justify-between mb-2">
                      <h4 className="font-display text-lg font-semibold text-ink-90">{pkg.name}</h4>
                      <span className="font-mono text-sm text-ink-40">{pkg.duration}</span>
                    </div>
                    <p className="font-mono text-2xl font-bold text-gold-text mb-2">
                      {pkg.price}
                      <span className="text-sm font-normal ml-1">{pkg.period}</span>
                    </p>
                    <p className="text-sm text-ink-50 leading-relaxed mb-6 flex-1">
                      {pkg.description}
                    </p>
                    <a
                      href={BOOKING_URL}
                      className="w-btn w-btn-ghost text-center"
                    >
                      Book naa
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 4. Portal Features (mork) ─── */}
        <section className="w-section-lg bg-ink-100 w-section-dark">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Spillerportalen</SectionLabel>
                <h2 className="w-heading-lg text-white mt-4">
                  Din treningsplattform mellom sesjonene.
                </h2>
                <p className="text-ink-40 max-w-lg mx-auto mt-4">
                  Alle coaching-pakker inkluderer full tilgang til spillerportalen med treningsplan, statistikk og ovelsesbank.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PORTAL_FEATURES.map((feature) => (
                <StaggerItem key={feature.title}>
                  <div className="w-card-dark p-6">
                    <h3 className="font-display text-base font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-ink-40 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 5. Drop-in vs Abonnement (lys) ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <SectionLabel>Sammenligning</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-6">Enkelttime eller abonnement?</h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Flex */}
                <div className="w-card">
                  <h3 className="w-heading-sm mb-4">AK Flex (enkeltsesjoner)</h3>
                  <ul className="space-y-3 text-sm text-ink-60">
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>Ingen binding eller abonnement</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>50 eller 90 minutter per sesjon</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>Coaching-notater i appen etterpaa</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5 text-ink-30">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span className="text-ink-40">Ingen spillerportal-tilgang</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5 text-ink-30">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span className="text-ink-40">Ingen treningsplan mellom sesjonene</span>
                    </li>
                  </ul>
                </div>

                {/* Subscription */}
                <div className="w-card border-gold/20">
                  <h3 className="w-heading-sm mb-4">AK Performance (abonnement)</h3>
                  <ul className="space-y-3 text-sm text-ink-60">
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>Jevnlig coaching med fast frekvens</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>Full spillerportal med treningsplan</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>TrackMan-data logget i profilen</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>Selvbooking via appen</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon className="shrink-0 mt-0.5 text-gold" />
                      <span>Ingen bindingstid</span>
                    </li>
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── 6. FAQ (cream) ─── */}
        <section id="faq" className="w-section-lg bg-surface-cream">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Sporsmal og svar</SectionLabel>
                <h2 className="w-heading-lg mt-4">Ofte stilte sporsmal</h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="max-w-2xl mx-auto">
                <FAQAccordion items={COACHING_FAQ} />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── 7. Team (lys) ─── */}
        <TeamSection />

        {/* ─── 8. Kontakt ─── */}
        <section id="apply" className="w-section-lg bg-surface-cream">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Start med en uforpliktende samtale.</h2>
                <p className="text-ink-50 max-w-lg mx-auto">
                  Fortell oss om dine maal, saa finner vi ut hvordan vi kan hjelpe deg videre.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
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
