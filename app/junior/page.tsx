"use client";

import Link from "next/link";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { FeaturedTestimonial } from "@/components/website/FeaturedTestimonial";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { CTASection } from "@/components/website/CTASection";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { ImagePlaceholder } from "@/components/website/ImagePlaceholder";
import { RelatedPages } from "@/components/website/RelatedPages";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { motion } from "framer-motion";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import {
  JUNIOR_FAQ,
  JUNIOR_INTAKE,
  TEAM,
  TESTIMONIALS,
  JUNIOR_AGE_GROUPS,
  JUNIOR_SEASON_PROGRAM,
  JUNIOR_PACKAGES,
  JUNIOR_PARENT_INFO,
  JUNIOR_HERO,
  JUNIOR_PHILOSOPHY,
  JUNIOR_TRAINING_WEEK,
  JUNIOR_CTA,
  JUNIOR_CAMP,
  JUNIOR_ACADEMY_INFO,
} from "@/lib/website-constants";

const juniorCoach = TEAM.find(m => m.name === "Anders Kristiansen");

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
                { "@type": "ListItem", position: 2, name: "Junior Academy", item: "https://akgolf.no/junior" },
              ],
            }),
          }}
        />
        <PageTransition>
        {/* ─── Hero Section with Badge ─── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          {/* Gradient mesh — light theme */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-24 right-[10%] w-[400px] h-[400px] rounded-full bg-grey-200 opacity-50 blur-[80px]" />
            <div className="absolute bottom-0 left-[20%] w-[300px] h-[300px] rounded-full bg-grey-300 opacity-30 blur-[60px]" />
            <div className="absolute top-0 left-[10%] w-px h-[30vh] bg-gradient-to-b from-transparent via-grey-300 to-transparent" />
          </div>

          <div className="w-container relative">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [...EASE_ENTRANCE] }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-grey-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <span className="text-xs font-medium text-grey-600 tracking-wide">
                  Junior Academy — Neste generasjon golfere
                </span>
              </span>
            </motion.div>

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

        {/* ─── Age Groups & Levels ─── */}
        <section className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Aldersgrupper og nivaer</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-4">Riktig trening til riktig tid.</h2>
              <p className="text-grey-500 max-w-2xl leading-relaxed mb-12">
                Vår progresjon er designet for å bygge ferdigheter systematisk, med økende intensitet og spesialisering etter hvert som junioren modnes.
              </p>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JUNIOR_AGE_GROUPS.map((program) => (
                <StaggerItem key={program.ageGroup}>
                  <div className="bg-white rounded-[20px] p-7 border border-grey-200 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/10 text-black text-xs font-mono font-medium">
                        {program.ageGroup}
                      </span>
                      <span className="text-xs text-grey-400">{program.sessionsPerWeek}x/uke</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-black mb-2">{program.title}</h3>
                    <p className="text-sm text-grey-500 leading-relaxed mb-4 flex-1">{program.description}</p>
                    <ul className="space-y-2 mb-4">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-grey-600">
                          <span className="w-1 h-1 rounded-full bg-black shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-grey-200">
                      <p className="text-sm font-medium text-black">
                        Kontakt oss for pris
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Junior Academy Info (Abonnement) ─── */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>AK Golf Junior Academy</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">For de som satser.</h2>
                <p className="text-grey-500 max-w-2xl mx-auto leading-relaxed">
                  {JUNIOR_ACADEMY_INFO.intro}
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Benefits */}
              <RevealOnScroll>
                <div className="bg-grey-100 rounded-[20px] p-8 border border-grey-200 h-full">
                  <h3 className="text-black font-semibold text-lg mb-6">Hva du far</h3>
                  <ul className="space-y-4">
                    {JUNIOR_ACADEMY_INFO.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5 text-black">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-grey-600 text-sm leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>

              {/* Pathway */}
              <RevealOnScroll delay={0.2}>
                <div className="bg-grey-100 rounded-[20px] p-8 border border-grey-200 h-full">
                  <h3 className="text-black font-semibold text-lg mb-6">{JUNIOR_ACADEMY_INFO.pathway.heading}</h3>
                  <div className="space-y-4">
                    {JUNIOR_ACADEMY_INFO.pathway.steps.map((step, index) => (
                      <div key={step.name} className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black text-xs font-mono font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-black text-sm font-medium">{step.name}</p>
                          <p className="text-grey-500 text-xs">{step.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Academy Packages */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {JUNIOR_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div
                    className={`rounded-[20px] p-8 flex flex-col h-full transition-all duration-300 ${
                      pkg.highlighted
                        ? "bg-black text-white relative shadow-lg hover:shadow-xl hover:-translate-y-1"
                        : "bg-white border border-grey-200 hover:border-grey-300 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {pkg.highlighted && (
                      <span className="absolute -top-3 left-8 bg-white text-black text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                        Anbefalt
                      </span>
                    )}
                    <span className={`text-[10px] font-mono uppercase tracking-[0.15em] mb-2 ${pkg.highlighted ? "text-grey-400" : "text-grey-400"}`}>{pkg.tagline}</span>
                    <h3 className={`font-display text-xl font-semibold mb-1 ${pkg.highlighted ? "text-white" : "text-black"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-sm font-medium mb-1 ${pkg.highlighted ? "text-grey-300" : "text-black"}`}>
                      Kontakt oss for pris
                    </p>
                    <p className={`text-sm leading-relaxed mb-6 ${pkg.highlighted ? "text-grey-300" : "text-grey-500"}`}>
                      {pkg.description}
                    </p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 mt-0.5 ${pkg.highlighted ? "text-white" : "text-black"}`}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className={pkg.highlighted ? "text-grey-200" : "text-grey-600"}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="#apply" className={`w-btn text-center ${pkg.highlighted ? "bg-white text-black hover:opacity-90" : "w-btn-primary"}`} style={pkg.highlighted ? { borderRadius: '980px', padding: '0.875rem 2rem' } : undefined}>
                      Avtal et mote
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Junior Camp ─── */}
        <section className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <RevealOnScroll>
                <div>
                  <SectionLabel>Junior Camp</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-2">{JUNIOR_CAMP.name}</h2>
                  <p className="text-sm font-medium text-black mb-6">
                    Kontakt oss for pris
                  </p>
                  <p className="text-grey-500 leading-relaxed mb-4">
                    {JUNIOR_CAMP.description}
                  </p>
                  <p className="text-grey-500 leading-relaxed mb-8">
                    {JUNIOR_CAMP.details}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/10 text-black text-xs font-medium">
                      5 dager
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/10 text-black text-xs font-medium">
                      3 timer/dag
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/10 text-black text-xs font-medium">
                      Maks 12 deltakere
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/10 text-black text-xs font-medium">
                      3 camper/sesong
                    </span>
                  </div>

                  <Link href="#apply" className="w-btn w-btn-primary">
                    Meld interesse for camp
                  </Link>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ImagePlaceholder aspect="4/3" src="/images/academy/AK-Golf-Academy-22.jpg" label="Junior Camp" />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── Season Program / Arshjul ─── */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>{JUNIOR_SEASON_PROGRAM.heading}</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-4">Trening hele aret.</h2>
              <p className="text-grey-500 max-w-2xl leading-relaxed mb-12">
                {JUNIOR_SEASON_PROGRAM.description}
              </p>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JUNIOR_SEASON_PROGRAM.seasons.map((season) => (
                <StaggerItem key={season.name}>
                  <div className="bg-grey-100 rounded-[20px] p-7 border border-grey-200 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">
                        {season.name === "Vår" && "🌱"}
                        {season.name === "Sommer" && "☀️"}
                        {season.name === "Høst" && "🍂"}
                        {season.name === "Vinter" && "❄️"}
                      </span>
                      <div>
                        <h4 className="font-display font-semibold text-black">{season.name}</h4>
                        <p className="text-xs text-grey-400">{season.months}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-black mb-3">{season.focus}</p>
                    <ul className="space-y-2">
                      {season.activities.map((activity) => (
                        <li key={activity} className="flex items-center gap-2 text-xs text-grey-600">
                          <span className="w-1 h-1 rounded-full bg-black shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Training Week ─── */}
        <section className="py-20 md:py-28 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Treningsstruktur</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-12">En uke i Junior Academy.</h2>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JUNIOR_TRAINING_WEEK.map((item) => (
                <StaggerItem key={item.day}>
                  <div className="bg-white rounded-[20px] p-7 border border-grey-200 h-full">
                    <span className="text-xs font-mono uppercase tracking-wider text-grey-400">{item.day}</span>
                    <h4 className="font-display text-base font-semibold text-black mt-2 mb-2">{item.focus}</h4>
                    <p className="text-sm text-grey-500 leading-relaxed">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Philosophy ─── */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <RevealOnScroll>
                <div>
                  <SectionLabel>{JUNIOR_PHILOSOPHY.label}</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-6">
                    {JUNIOR_PHILOSOPHY.heading}<br />
                    <span className="text-grey-400">{JUNIOR_PHILOSOPHY.subheading}</span>
                  </h2>
                  <p className="text-grey-500 leading-relaxed mb-4">
                    {JUNIOR_PHILOSOPHY.paragraphs[0]}
                  </p>
                  <p className="text-grey-500 leading-relaxed">
                    {JUNIOR_PHILOSOPHY.paragraphs[1].split("Academy-program")[0]}
                    <Link href="/academy" className="text-black underline underline-offset-2 hover:text-grey-600 transition-colors">Academy-program</Link>
                    {JUNIOR_PHILOSOPHY.paragraphs[1].split("Academy-program")[1]}
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ImagePlaceholder aspect="4/3" src="/images/academy/AK-Golf-Academy-20.jpg" label="Junior trening" />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── Junior Coach ─── */}
        {juniorCoach && (
          <section className="py-28 md:py-40 bg-grey-100">
            <div className="w-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <RevealOnScroll>
                  <div className="max-w-sm mx-auto lg:mx-0">
                    <ImagePlaceholder aspect="3/4" src="/images/academy/AK-Golf-Academy-20.jpg" label={juniorCoach.name} alt={`${juniorCoach.name} - Junior Coach`} />
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                  <div>
                    <SectionLabel>Din trener</SectionLabel>
                    <h2 className="w-heading-lg mt-4 mb-1">{juniorCoach.name}</h2>
                    <p className="text-xs font-mono uppercase tracking-wider text-grey-400 mb-6">
                      {juniorCoach.role} · {juniorCoach.division}
                    </p>
                    <p className="text-grey-500 leading-relaxed mb-6">{juniorCoach.bio}</p>
                    <div className="text-sm">
                      <Link
                        href={`mailto:${juniorCoach.contact.email}`}
                        className="text-grey-500 hover:text-black transition-colors"
                      >
                        {juniorCoach.contact.email}
                      </Link>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </section>
        )}

        {/* ─── For Parents ─── */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>For foreldre</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-4">{JUNIOR_PARENT_INFO.heading}</h2>
              <p className="text-grey-500 max-w-2xl leading-relaxed mb-12">
                {JUNIOR_PARENT_INFO.description}
              </p>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {JUNIOR_PARENT_INFO.expectations.map((section) => (
                <StaggerItem key={section.title}>
                  <div className="bg-grey-100 rounded-[20px] p-7 border border-grey-200 h-full">
                    <h4 className="font-display font-semibold text-black mb-4">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2" />
                          <p className="text-sm text-grey-600 leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Intake Criteria ─── */}
        <section className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>{JUNIOR_INTAKE.heading}</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Hvem passer Junior Academy for?</h2>
                <p className="text-grey-500 max-w-2xl mx-auto">{JUNIOR_INTAKE.description}</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {JUNIOR_INTAKE.criteria.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="bg-white rounded-[20px] p-7 border border-grey-200 h-full">
                    <h4 className="text-black font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-grey-500 leading-relaxed">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <RevealOnScroll>
              <div className="text-center mb-8">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-black mb-2">Slik kommer du i gang</h3>
                <p className="text-grey-500">Fire enkle steg til Junior Academy.</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JUNIOR_INTAKE.process.map((step) => (
                <StaggerItem key={step.step}>
                  <div className="bg-white rounded-[20px] p-7 border border-grey-200 h-full">
                    <span className="font-mono text-xs text-grey-400 tracking-[0.2em]">{step.step}</span>
                    <h4 className="text-black font-semibold mt-2 mb-2">{step.title}</h4>
                    <p className="text-sm text-grey-500 leading-relaxed">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Fra juniorforeldre</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-12">Familier som stoler pa oss.</h2>
            </RevealOnScroll>

            <FeaturedTestimonial
              quote={TESTIMONIALS[2].quote}
              name={TESTIMONIALS[2].name}
              role={TESTIMONIALS[2].role}
            />
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-28 md:py-40 bg-grey-100">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <RevealOnScroll>
                <div className="lg:sticky lg:top-24">
                  <SectionLabel>Sporsmal & svar</SectionLabel>
                  <h2 className="w-heading-lg mt-4">
                    Ofte stilte<br />sporsmal.
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
          eyebrow={JUNIOR_CTA.eyebrow}
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
                <h2 className="w-heading-lg mt-4 mb-4">Start med et uforpliktende mote.</h2>
                <p className="text-grey-500 max-w-lg mx-auto">
                  Fyll ut skjemaet under, sa tar vi kontakt innen 48 timer for a avtale et mote.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <ApplicationForm />
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Related Pages ─── */}
        <RelatedPages exclude="junior" />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
