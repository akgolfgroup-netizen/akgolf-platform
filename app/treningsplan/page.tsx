"use client";

import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubPageHero } from "@/components/website/SubPageHero";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { PricingCard } from "@/components/website/PricingCard";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { CTASection } from "@/components/website/CTASection";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { PlanConfigurator } from "@/components/website/PlanConfigurator";
import { TRENINGSPLAN } from "@/lib/website-constants";

export default function TreningsplanPage() {
  return (
    <>
      <WebsiteNav />

      <main id="main-content">
        <PageTransition>
          {/* ─── Hero ─── */}
          <SubPageHero
            eyebrow={TRENINGSPLAN.hero.eyebrow}
            heading={TRENINGSPLAN.hero.heading}
            description={TRENINGSPLAN.hero.description}
            accent="software"
          />

          {/* ─── How it Works ─── */}
          <section className="w-section bg-surface-warm">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Slik fungerer det</SectionLabel>
                  <h2 className="w-heading-lg mt-4">Fra spørsmål til personlig treningsplan.</h2>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TRENINGSPLAN.howItWorks.map((step) => (
                  <StaggerItem key={step.number}>
                    <div className="w-card h-full text-center">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 font-mono text-lg font-bold text-gold-text mb-4">
                        {step.number}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-ink-90 mb-3">{step.title}</h3>
                      <p className="text-sm text-ink-50 leading-relaxed">{step.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── Configurator ─── */}
          <section id="start" className="w-section-lg">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Kom i gang</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">Lag din treningsplan.</h2>
                  <p className="text-ink-50 max-w-lg mx-auto">
                    Svar på fire spørsmål, og AI-en genererer en personalisert 12-ukers treningsplan. Du ser en gratis forhåndsvisning før du kjøper.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <PlanConfigurator />
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── Pricing ─── */}
          <section className="w-section-lg bg-surface-cream">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Priser</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">Velg det som passer deg.</h2>
                  <p className="text-ink-50 max-w-lg mx-auto">
                    Start med Basis for en enkel PDF-plan, eller oppgrader til Standard eller Premium for web-dashboard og kontinuerlig AI-justering.
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {TRENINGSPLAN.pricing.map((tier) => (
                  <StaggerItem key={tier.name}>
                    <PricingCard
                      name={tier.name}
                      price={`${tier.price}/${tier.period}`}
                      description={tier.description}
                      features={tier.features}
                      highlighted={tier.highlighted}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── AK Method Preview ─── */}
          <section className="bg-ink-100 w-section w-section-dark">
            <div className="w-container">
              <RevealOnScroll>
                <SectionLabel>AK-formelen</SectionLabel>
                <h2 className="w-heading-lg text-white mt-4 mb-6">Bygget på vår proprietære metodikk.</h2>
                <p className="text-ink-50 max-w-2xl leading-relaxed mb-12">
                  Treningspyramiden sikrer at du alltid trener på riktig ting for ditt nivå. Nybegynnere bygger fundament med fysikk og teknikk, mens avanserte spillere fokuserer mer på spill og turnering.
                </p>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { level: "TURN", desc: "Turnering", color: "from-gold/30 to-gold/10" },
                  { level: "SPILL", desc: "Spill + LIFE", color: "from-gold/25 to-gold/8" },
                  { level: "SLAG", desc: "Golfslag", color: "from-gold/20 to-gold/6" },
                  { level: "TEK", desc: "Teknikk", color: "from-gold/15 to-gold/4" },
                  { level: "FYS", desc: "Fysisk", color: "from-gold/10 to-gold/2" },
                ].map((item) => (
                  <StaggerItem key={item.level}>
                    <div className="w-card-glass text-center">
                      <div className="font-mono text-lg font-bold text-gold mb-1">{item.level}</div>
                      <div className="text-xs text-ink-50">{item.desc}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section className="w-section-lg">
            <div className="w-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <RevealOnScroll>
                  <div className="lg:sticky lg:top-24">
                    <SectionLabel>Vanlige spørsmål</SectionLabel>
                    <h2 className="w-heading-lg mt-4">
                      Svar på det du<br />lurer på.
                    </h2>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                  <FAQAccordion items={TRENINGSPLAN.faq} />
                </RevealOnScroll>
              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <CTASection
            eyebrow="Klar for å forbedre seg?"
            heading="Start med din AI-treningsplan i dag."
            description="Fire spørsmål. En personlig plan. Generert på sekunder."
            ctaHref="#start"
          />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
