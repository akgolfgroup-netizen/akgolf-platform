"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { CTASection } from "@/components/website/CTASection";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import {
  ACADEMY_HERO,
  ACADEMY_CTA,
  ACADEMY_FAQ,
  ACADEMY_TESTIMONIALS,
  HOW_IT_WORKS,
  COACHING_PACKAGES,
  ONBOARDING_PACKAGE,
  FLEX_PACKAGES,
  BANECOACHING,
  PORTAL_FEATURES,
  FOUNDATION_METHOD,
} from "@/lib/website-constants";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AcademyPage() {
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
                { "@type": "ListItem", position: 2, name: "Academy", item: "https://akgolf.no/academy" },
              ],
            }),
          }}
        />
        <PageTransition>
          {/* ─── 1. Hero ─── */}
          <section className="w-section-lg bg-gradient-to-b from-[#000000]/5 via-ink-05 to-surface-warm pt-28">
            <div className="w-container">
              <div className="max-w-2xl mx-auto text-center">
                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-ink-10 rounded-full text-xs font-medium text-ink-70 mb-8"
                >
                  <span className="w-2 h-2 rounded-full bg-[#B07D4F] animate-pulse" />
                  Academy — Coaching for resultater
                </motion.div>

                {/* Headline */}
                <motion.h1
                  className="w-heading-xl mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {ACADEMY_HERO.heading}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-lg md:text-xl text-ink-50 max-w-xl mx-auto leading-relaxed mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {ACADEMY_HERO.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4 justify-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Link href="#packages" className="w-btn w-btn-primary w-btn-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    Se pakker og priser
                  </Link>
                  <Link href="#how-it-works" className="w-btn w-btn-secondary w-btn-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    Slik fungerer det
                  </Link>
                </motion.div>

                {/* Trust Bar */}
                <motion.div
                  className="flex flex-wrap items-center justify-center gap-8 p-6 bg-white rounded-xl border border-ink-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {ACADEMY_CTA.valueProps.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-ink-60">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#B07D4F]">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="font-medium text-ink-80">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── 2. Slik fungerer det ─── */}
          <section id="how-it-works" className="w-section-lg bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>{HOW_IT_WORKS.eyebrow}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">{HOW_IT_WORKS.heading}</h2>
                  <p className="text-ink-50 max-w-2xl mx-auto mt-4 leading-relaxed">
                    {HOW_IT_WORKS.description}
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {HOW_IT_WORKS.steps.map((step) => (
                  <StaggerItem key={step.number}>
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#000000] text-white font-mono font-bold text-lg mb-4 shadow-lg">
                        {step.number}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-ink-90 mb-2">{step.title}</h3>
                      <p className="text-sm text-ink-50 leading-relaxed">{step.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 3. Pakker og priser ─── */}
          <section id="packages" className="w-section-lg bg-surface-warm">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Pakker og priser</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Velg pakken som passer deg</h2>
                  <p className="text-ink-50 max-w-xl mx-auto mt-4">
                    Alle abonnement inkluderer full spillerportal med treningsplan, ovelsesbank og statistikk. Coaching-tjenester er MVA-fritatt.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Subscription Cards */}
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
                {COACHING_PACKAGES.map((pkg) => (
                  <StaggerItem key={pkg.name}>
                    <div
                      className={`rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${
                        pkg.highlighted
                          ? "bg-[#000000] shadow-[0_8px_30px_rgba(184,151,92,0.3)] relative ring-2 ring-[#B07D4F]/50 md:scale-[1.03] md:-my-2"
                          : "bg-white border border-ink-10 hover:border-[#000000]/20 hover:shadow-xl"
                      }`}
                    >
                      {/* Premium header for highlighted package */}
                      {pkg.highlighted && (
                        <>
                          <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
                          <div className="bg-gradient-to-r from-[#B07D4F] to-[#F3EBE2] px-8 py-3">
                            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#000000] font-semibold">
                              For de som satser
                            </span>
                          </div>
                        </>
                      )}

                      <div className="p-8 flex flex-col flex-1">
                        <h3 className={`font-display text-xl font-semibold mb-1 ${pkg.highlighted ? "text-white" : "text-ink-90"}`}>
                          {pkg.name}
                        </h3>
                        <p className={`text-sm mb-4 ${pkg.highlighted ? "text-white/70" : "text-ink-50"}`}>{pkg.tagline}</p>

                        <div className="mb-4">
                          <span className={`font-mono text-4xl font-bold tracking-tight ${pkg.highlighted ? "text-[#B07D4F]" : "text-ink-90"}`}>
                            {pkg.price}
                          </span>
                          <span className={`text-sm ml-1 ${pkg.highlighted ? "text-white/60" : "text-ink-50"}`}>{pkg.period}</span>
                        </div>

                        <p className={`text-sm mb-6 leading-relaxed ${pkg.highlighted ? "text-white/70" : "text-ink-50"}`}>{pkg.description}</p>

                        <ul className="space-y-3 mb-8 flex-1">
                          {pkg.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5 text-sm">
                              <CheckIcon className={`shrink-0 mt-0.5 ${pkg.highlighted ? "text-[#B07D4F]" : "text-[#000000]"}`} />
                              <span className={pkg.highlighted ? "text-white/80" : "text-ink-60"}>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={`/academy/booking?package=${pkg.name.toLowerCase().replace(' ', '-')}`}
                          className={`w-btn text-center w-full ${
                            pkg.highlighted
                              ? "bg-[#B07D4F] hover:bg-[#F3EBE2] text-[#000000] font-semibold"
                              : "bg-[#000000] hover:bg-[#000000]/90 text-white"
                          }`}
                        >
                          Velg {pkg.name}
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Start Package */}
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto mb-12">
                  <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#000000] to-[#000000]/95 border border-[#000000]">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 bg-[#B07D4F] text-[#000000] text-xs font-mono uppercase tracking-wider rounded-full mb-3 font-semibold">
                            Anbefalt start
                          </span>
                          <h3 className="font-display text-xl font-semibold text-white mb-2">{ONBOARDING_PACKAGE.name}</h3>
                          <p className="text-sm text-white/70 mb-4">{ONBOARDING_PACKAGE.description}</p>
                          <ul className="flex flex-wrap gap-4 text-xs text-white/60">
                            {ONBOARDING_PACKAGE.features.map((f) => (
                              <li key={f} className="flex items-center gap-1.5">
                                <CheckIcon className="w-3 h-3 text-[#B07D4F]" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="font-mono text-3xl font-bold text-[#B07D4F]">{ONBOARDING_PACKAGE.price} <span className="text-base font-normal text-white/60">{ONBOARDING_PACKAGE.period}</span></p>
                          <Link href="/academy/booking?package=start" className="w-btn bg-white hover:bg-white/90 text-[#000000] font-semibold mt-4 inline-flex">
                            Kom i gang
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 4. Flex drop-in ─── */}
          <section className="w-section-lg bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-8">
                  <SectionLabel>Flex drop-in</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Trenger du binding? Nei.</h2>
                  <p className="text-ink-50 text-sm mt-4 max-w-lg mx-auto">
                    Flex gir deg coaching uten forpliktelser — men du far kun coaching-notater, ikke spillerportal.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {FLEX_PACKAGES.map((pkg) => (
                  <StaggerItem key={pkg.name}>
                    <div className="bg-white rounded-xl border border-ink-10 p-6 text-center hover:border-[#000000]/30 hover:shadow-lg transition-all group">
                      <h4 className="font-semibold text-sm text-ink-80 mb-1 group-hover:text-[#000000] transition-colors">{pkg.name}</h4>
                      <p className="font-mono text-2xl font-bold text-[#000000] mb-1">
                        {pkg.price} <span className="text-sm font-normal text-ink-50">{pkg.period}</span>
                      </p>
                      {"pricePerPerson" in pkg && pkg.pricePerPerson && (
                        <p className="text-xs text-ink-50 mb-2">{pkg.pricePerPerson} kr/pers</p>
                      )}
                      <p className="text-xs text-ink-50">{pkg.duration}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 5. Banecoaching ─── */}
          <section className="w-section-lg bg-surface-warm">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Banecoaching</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Coaching ute pa banen</h2>
                  <p className="text-ink-50 max-w-xl mx-auto mt-4">
                    Strategi i praksis — laer a velge riktig slag basert pa din faktiske spredning.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {BANECOACHING.map((item) => (
                  <StaggerItem key={item.name}>
                    <div className="bg-white rounded-2xl border border-ink-10 p-8 h-full hover:border-[#000000]/20 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-block px-2 py-1 bg-[#000000] text-white text-xs font-mono uppercase tracking-wider rounded">
                          {item.coach}
                        </span>
                        <span className="font-mono text-sm text-ink-50">{item.period}</span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-[#000000] mb-2">{item.name}</h3>
                      <p className="font-mono text-3xl font-bold text-ink-90 mb-4">{item.price} <span className="text-sm font-normal text-ink-50">kr</span></p>
                      <p className="text-sm text-ink-50 mb-4 leading-relaxed">{item.description}</p>
                      <p className="text-xs text-ink-50">{item.details}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 6. Spillerportalen teaser ─── */}
          <section className="w-section-lg bg-ink-90">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <span className="text-[#B07D4F]"><SectionLabel>Spillerportalen</SectionLabel></span>
                  <h2 className="w-heading-lg text-white mt-4">Alt mellom sesjonene — i en app</h2>
                  <p className="text-ink-40 max-w-xl mx-auto mt-4">
                    Coaching-sesjonen er kontaktpunktet. Spillerportalen er motoren.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PORTAL_FEATURES.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-ink-40 leading-relaxed">{feature.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 7. The Foundation Method ─── */}
          <section className="w-section-lg bg-surface-warm">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>{FOUNDATION_METHOD.eyebrow}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">{FOUNDATION_METHOD.heading}</h2>
                  <p className="text-ink-50 max-w-2xl mx-auto mt-4 leading-relaxed">
                    {FOUNDATION_METHOD.description}
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
                {FOUNDATION_METHOD.phases.map((phase, index) => (
                  <StaggerItem key={phase.id}>
                    <div className="bg-white rounded-xl border border-ink-10 p-6 text-center h-full relative">
                      {/* Connector line */}
                      {index < FOUNDATION_METHOD.phases.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-ink-20" />
                      )}
                      <span className="inline-block px-3 py-1 bg-[#B07D4F]/10 text-[#B07D4F] text-[10px] font-mono uppercase tracking-wider rounded-full mb-3">
                        {phase.name}
                      </span>
                      <h4 className="font-display text-sm font-semibold text-ink-90 mb-2">{phase.title}</h4>
                      <p className="text-xs text-ink-50 leading-relaxed">{phase.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 8. Testimonials ─── */}
          <section className="w-section-lg bg-ink-90">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <span className="text-[#B07D4F]"><SectionLabel>Fra vare elever</SectionLabel></span>
                  <h2 className="w-heading-lg text-white mt-4">Resultater du kan hore</h2>
                  <p className="text-ink-40 max-w-lg mx-auto mt-4">
                    Ekte historier fra spillere som har opplevd transformasjonen.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ACADEMY_TESTIMONIALS.map((testimonial) => (
                  <StaggerItem key={testimonial.name}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                      {/* Handicap change badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B07D4F]/20 text-[#B07D4F] text-xs font-mono">
                          <span>{testimonial.handicapBefore}</span>
                          <span className="text-ink-40">→</span>
                          <span>{testimonial.handicapAfter}</span>
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-sm text-ink-30 leading-relaxed flex-1 mb-4">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>

                      {/* Author */}
                      <div>
                        <p className="text-sm font-medium text-white">{testimonial.name}</p>
                        <p className="text-xs text-ink-50">{testimonial.role}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 9. FAQ ─── */}
          <section className="w-section-lg bg-ink-05">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Vanlige sporsmal</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Ofte stilte sporsmal</h2>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.15}>
                <div className="max-w-2xl mx-auto">
                  <FAQAccordion items={ACADEMY_FAQ} />
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── 10. CTA ─── */}
          <CTASection
            eyebrow={ACADEMY_CTA.eyebrow}
            heading={ACADEMY_CTA.heading}
            description={ACADEMY_CTA.description}
            ctaLabel={ACADEMY_CTA.primaryCta}
            ctaHref="/academy/booking"
            external={false}
            secondaryCtaLabel={ACADEMY_CTA.secondaryCta}
            secondaryCtaHref="#packages"
            secondaryExternal={false}
          />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
