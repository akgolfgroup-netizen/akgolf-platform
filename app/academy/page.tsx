"use client";

import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubPageHero } from "@/components/website/SubPageHero";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { FeatureGrid } from "@/components/website/FeatureGrid";
import { PricingCard } from "@/components/website/PricingCard";
import { FeaturedTestimonial } from "@/components/website/FeaturedTestimonial";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { CTASection } from "@/components/website/CTASection";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { ImagePlaceholder } from "@/components/website/ImagePlaceholder";
import { RelatedPages } from "@/components/website/RelatedPages";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import {
  ACADEMY_FEATURES,
  ACADEMY_PROGRAMS,
  ACADEMY_FAQ,
  TESTIMONIALS,
} from "@/lib/website-constants";

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
        {/* ─── Hero ─── */}
        <SubPageHero
          eyebrow="AK Golf Academy"
          heading="Din sving. Din plan. Dine resultater."
          description="Individuell coaching og skreddersydde utviklingsplaner for voksne spillere som vil ta spillet til neste nivå. Evidensbasert, personlig og med dokumenterte resultater."
          accent="academy"
        />

        {/* ─── Philosophy ─── */}
        <section className="w-section bg-surface-warm">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <RevealOnScroll>
                <div>
                  <SectionLabel>Vår tilnærming</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-6">
                    Ingen to spillere er like.<br />
                    <span className="text-ink-40">Hvorfor skal treningen være det?</span>
                  </h2>
                  <p className="text-ink-50 leading-relaxed mb-4">
                    I AK Golf Academy starter alt med deg. Vi analyserer spillet ditt fra alle vinkler — teknikk, strategi, mentalt spill og fysikk — for å bygge en plan som er 100% tilpasset dine mål og ditt utgangspunkt.
                  </p>
                  <p className="text-ink-50 leading-relaxed">
                    Vår evidensbaserte metode kombinerer det beste fra moderne golftreningsforskning med praktisk erfaring fra coaching på alle nivåer, fra nybegynner til tour-spiller.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ImagePlaceholder aspect="4/3" label="Academy coaching" />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── What's Included ─── */}
        <section className="w-section-lg">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Hva inkluderes</SectionLabel>
                <h2 className="w-heading-lg mt-4">Alt du trenger for å nå dine mål.</h2>
              </div>
            </RevealOnScroll>

            <FeatureGrid features={ACADEMY_FEATURES} columns={3} />
          </div>
        </section>

        {/* ─── AK Method for Adults ─── */}
        <section className="w-section-lg bg-surface-cream">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>AK-metoden for voksne</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-6">Systematisk forbedring. Målbare resultater.</h2>
              <p className="text-ink-50 max-w-2xl leading-relaxed mb-12">
                Vår metode er bygget på tre pilarer som sammen skaper varig forbedring. Uansett om du er nybegynner eller erfaren, tilpasser vi intensiteten og fokuset etter ditt nivå.
              </p>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Teknisk analyse",
                  description: "Grundig analyse av sving, kontakt og bevegelsesmønster med avansert videoteknologi. Klare, konkrete tilbakemeldinger du kan handle på.",
                },
                {
                  number: "02",
                  title: "Strategisk spill",
                  description: "Kursmanagement, slagvalg og situasjonsanalyse. Lær deg å ta smartere beslutninger på banen — ikke bare slå hardere.",
                },
                {
                  number: "03",
                  title: "Mental styrke",
                  description: "Rutiner, fokus og prestasjon under press. Det mentale spillet er det som skiller gode spillere fra de som virkelig leverer.",
                },
              ].map((item) => (
                <StaggerItem key={item.number}>
                  <div className="w-glass-card-gold h-full">
                    <span className="font-mono text-2xl text-gold font-medium">{item.number}</span>
                    <h3 className="font-display text-lg font-semibold text-ink-90 mt-3 mb-3">{item.title}</h3>
                    <p className="text-sm text-ink-50 leading-relaxed">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section className="w-section-lg">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Programmer</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Velg pakken som passer deg.</h2>
                <p className="text-ink-50 max-w-lg mx-auto">
                  Alle pakker inkluderer tilgang til var treningsplattform og mulighet for oppgradering underveis.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {ACADEMY_PROGRAMS.map((program) => (
                <StaggerItem key={program.name}>
                  <PricingCard
                    name={program.name}
                    price={program.price}
                    description={program.description}
                    features={program.features}
                    highlighted={program.highlighted}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="bg-ink-100 w-section w-section-dark">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Fra våre elever</SectionLabel>
              <h2 className="w-heading-lg text-white mt-4 mb-12">De som har opplevd det.</h2>
            </RevealOnScroll>

            <FeaturedTestimonial
              quote={TESTIMONIALS[0].quote}
              name={TESTIMONIALS[0].name}
              role={TESTIMONIALS[0].role}
            />
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="w-section-lg">
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
                <FAQAccordion items={ACADEMY_FAQ} />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <CTASection
          eyebrow="Klar for å starte?"
          heading="Avtal en samtale om Academy."
          description="Ta første steg mot ditt beste spill. Vi tar kontakt innen 48 timer."
          ctaLabel="Avtal en samtale"
          ctaHref="#apply"
        />

        {/* ─── Application Form ─── */}
        <section id="apply" className="w-section-lg bg-surface-cream">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Start din Academy-reise.</h2>
                <p className="text-ink-50 max-w-lg mx-auto">
                  Fyll ut skjemaet under, så tar vi kontakt innen 48 timer for en uforpliktende samtale.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <ApplicationForm defaultProgram="academy-utvikling" />
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Related Pages ─── */}
        <RelatedPages exclude="academy" />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
