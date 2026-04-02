"use client";

import Link from "next/link";
import Image from "next/image";
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
          {/* ─── 1. Hero with Image ─── */}
          <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden">
            {/* Hero image background */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/academy/AK-Golf-Academy-42.jpg"
                alt="Coach og elev gjennomgår data på laptop"
                fill
                className="object-cover object-[center_30%]"
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
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <SectionLabel>Coaching</SectionLabel>
                </div>
              </motion.div>

              <motion.h1
                className="w-heading-xl max-w-3xl mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 }}
              >
                {ACADEMY_HERO.heading}
              </motion.h1>

              <motion.p
                className="text-lg text-grey-500 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {ACADEMY_HERO.description}
              </motion.p>

              <motion.div
                className="mt-12 w-16 h-px bg-gradient-to-r from-black/50 to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </section>


          {/* ─── 2. Slik fungerer det ─── */}
          <section id="how-it-works" className="w-section-lg bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>{HOW_IT_WORKS.eyebrow}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">{HOW_IT_WORKS.heading}</h2>
                  <p className="text-grey-500 max-w-2xl mx-auto mt-4 leading-relaxed">
                    {HOW_IT_WORKS.description}
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {HOW_IT_WORKS.steps.map((step) => (
                  <StaggerItem key={step.number}>
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-mono font-bold text-lg mb-4 shadow-lg">
                        {step.number}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-grey-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-grey-500 leading-relaxed">{step.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 3. Pakker og priser ─── */}
          <section id="packages" className="w-section-lg bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Pakker og priser</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Velg pakken som passer deg</h2>
                  <p className="text-grey-500 max-w-xl mx-auto mt-4">
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
                          ? "bg-black shadow-xl relative ring-2 ring-grey-300 md:scale-[1.03] md:-my-2"
                          : "bg-white border border-grey-200 hover:border-grey-300 hover:shadow-xl"
                      }`}
                    >
                      {/* Premium header for highlighted package */}
                      {pkg.highlighted && (
                        <>
                          <div className="h-1 bg-gradient-to-r from-grey-400 via-grey-300 to-grey-400" />
                          <div className="bg-gradient-to-r from-grey-200 to-grey-100 px-8 py-3">
                            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-black font-semibold">
                              For de som satser
                            </span>
                          </div>
                        </>
                      )}

                      <div className="p-8 flex flex-col flex-1">
                        <h3 className={`font-display text-xl font-semibold mb-1 ${pkg.highlighted ? "text-white" : "text-grey-900"}`}>
                          {pkg.name}
                        </h3>
                        <p className={`text-sm mb-4 ${pkg.highlighted ? "text-white/70" : "text-grey-500"}`}>{pkg.tagline}</p>

                        <div className="mb-4">
                          <span className={`font-mono text-4xl font-bold tracking-tight ${pkg.highlighted ? "text-white" : "text-black"}`}>
                            {pkg.price}
                          </span>
                          <span className={`text-sm ml-1 ${pkg.highlighted ? "text-white/60" : "text-grey-500"}`}>{pkg.period}</span>
                        </div>

                        <p className={`text-sm mb-6 leading-relaxed ${pkg.highlighted ? "text-white/70" : "text-grey-500"}`}>{pkg.description}</p>

                        <ul className="space-y-3 mb-8 flex-1">
                          {pkg.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5 text-sm">
                              <CheckIcon className={`shrink-0 mt-0.5 ${pkg.highlighted ? "text-white" : "text-black"}`} />
                              <span className={pkg.highlighted ? "text-white/80" : "text-grey-600"}>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={`/academy/booking?package=${pkg.name.toLowerCase().replace(' ', '-')}`}
                          className={`w-btn text-center w-full ${
                            pkg.highlighted
                              ? "bg-white hover:bg-grey-100 text-black font-semibold"
                              : "bg-black hover:bg-grey-900 text-white"
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
                  <div className="rounded-2xl overflow-hidden bg-black border border-grey-800">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 bg-white text-black text-xs font-mono uppercase tracking-wider rounded-full mb-3 font-semibold">
                            Anbefalt start
                          </span>
                          <h3 className="font-display text-xl font-semibold text-white mb-2">{ONBOARDING_PACKAGE.name}</h3>
                          <p className="text-sm text-white/70 mb-4">{ONBOARDING_PACKAGE.description}</p>
                          <ul className="flex flex-wrap gap-4 text-xs text-white/60">
                            {ONBOARDING_PACKAGE.features.map((f) => (
                              <li key={f} className="flex items-center gap-1.5">
                                <CheckIcon className="w-3 h-3 text-white" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="font-mono text-3xl font-bold text-white">{ONBOARDING_PACKAGE.price} <span className="text-base font-normal text-white/60">{ONBOARDING_PACKAGE.period}</span></p>
                          <Link href="/academy/booking?package=start" className="w-btn bg-white hover:bg-grey-100 text-black font-semibold mt-4 inline-flex">
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
                  <p className="text-grey-500 text-sm mt-4 max-w-lg mx-auto">
                    Flex gir deg coaching uten forpliktelser — men du får kun coaching-notater, ikke spillerportal.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {FLEX_PACKAGES.map((pkg) => (
                  <StaggerItem key={pkg.name}>
                    <div className="bg-white rounded-xl border border-grey-200 p-6 text-center hover:border-grey-300 hover:shadow-lg transition-all group">
                      <h4 className="font-semibold text-sm text-grey-700 mb-1 group-hover:text-black transition-colors">{pkg.name}</h4>
                      <p className="font-mono text-2xl font-bold text-black mb-1">
                        {pkg.price} <span className="text-sm font-normal text-grey-500">{pkg.period}</span>
                      </p>
                      <p className="text-xs text-grey-500">{pkg.duration}</p>
                      <p className="text-xs text-grey-400 mt-2">{pkg.tagline}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 5. Banecoaching ─── */}
          <section className="w-section-lg bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Banecoaching</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Coaching ute pa banen</h2>
                  <p className="text-grey-500 max-w-xl mx-auto mt-4">
                    Strategi i praksis — laer a velge riktig slag basert pa din faktiske spredning.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {BANECOACHING.map((item) => (
                  <StaggerItem key={item.name}>
                    <div className="bg-white rounded-2xl border border-grey-200 p-8 h-full hover:border-grey-300 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-block px-2 py-1 bg-black text-white text-xs font-mono uppercase tracking-wider rounded">
                          {item.coach}
                        </span>
                        <span className="font-mono text-sm text-grey-500">{item.period}</span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-black mb-2">{item.name}</h3>
                      <p className="font-mono text-3xl font-bold text-grey-900 mb-4">{item.price} <span className="text-sm font-normal text-grey-500">kr</span></p>
                      <p className="text-sm text-grey-500 mb-4 leading-relaxed">{item.description}</p>
                      <p className="text-xs text-grey-500">{item.details}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 6. Spillerportalen teaser ─── */}
          <section className="w-section-lg bg-black">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <span className="text-white"><SectionLabel>Spillerportalen</SectionLabel></span>
                  <h2 className="w-heading-lg text-white mt-4">Alt mellom sesjonene — i en app</h2>
                  <p className="text-grey-400 max-w-xl mx-auto mt-4">
                    Coaching-sesjonen er kontaktpunktet. Spillerportalen er motoren.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PORTAL_FEATURES.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-grey-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 7. The Foundation Method ─── */}
          <section className="w-section-lg bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>{FOUNDATION_METHOD.eyebrow}</SectionLabel>
                  <h2 className="w-heading-lg mt-4">{FOUNDATION_METHOD.heading}</h2>
                  <p className="text-grey-500 max-w-2xl mx-auto mt-4 leading-relaxed">
                    {FOUNDATION_METHOD.description}
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
                {FOUNDATION_METHOD.phases.map((phase, index) => (
                  <StaggerItem key={phase.id}>
                    <div className="bg-white rounded-xl border border-grey-200 p-6 text-center h-full relative">
                      {/* Connector line */}
                      {index < FOUNDATION_METHOD.phases.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-grey-300" />
                      )}
                      <span className="inline-block px-3 py-1 bg-grey-100 text-black text-[10px] font-mono uppercase tracking-wider rounded-full mb-3">
                        {phase.name}
                      </span>
                      <h4 className="font-display text-sm font-semibold text-grey-900 mb-2">{phase.title}</h4>
                      <p className="text-xs text-grey-500 leading-relaxed">{phase.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 8. Testimonials ─── */}
          <section className="w-section-lg bg-black">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <span className="text-white"><SectionLabel>Fra vare elever</SectionLabel></span>
                  <h2 className="w-heading-lg text-white mt-4">Resultater du kan hore</h2>
                  <p className="text-grey-400 max-w-lg mx-auto mt-4">
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
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-mono">
                          <span>{testimonial.handicapBefore}</span>
                          <span className="text-grey-500">→</span>
                          <span>{testimonial.handicapAfter}</span>
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-sm text-grey-300 leading-relaxed flex-1 mb-4">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>

                      {/* Author */}
                      <div>
                        <p className="text-sm font-medium text-white">{testimonial.name}</p>
                        <p className="text-xs text-grey-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── 9. FAQ ─── */}
          <section className="w-section-lg bg-grey-100">
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
