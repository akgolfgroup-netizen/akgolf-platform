"use client";

import Link from "next/link";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubPageHero } from "@/components/website/SubPageHero";
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
import { JUNIOR_PROGRAMS, JUNIOR_FAQ, JUNIOR_INTAKE, TEAM, TESTIMONIALS } from "@/lib/website-constants";

const juniorCoach = TEAM.find(m => m.role === "Junior Coach");

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
        {/* ─── Hero ─── */}
        <SubPageHero
          eyebrow="Junior Academy"
          heading="Neste generasjon golfere starter her."
          description="Strukturert talentutvikling for unge spillere med ambisjon. Fra grunnleggende ferdigheter til nasjonal og internasjonal konkurranse — vi bygger hele spilleren."
          accent="junior"
        />

        {/* ─── Philosophy ─── */}
        <section className="w-section bg-surface-warm">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <RevealOnScroll>
                <div>
                  <SectionLabel>Vår filosofi</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-6">
                    Mer enn golf.<br />
                    <span className="text-ink-40">Mestring for livet.</span>
                  </h2>
                  <p className="text-ink-50 leading-relaxed mb-4">
                    Junior Academy handler om mer enn å lage bedre golfere. Vi utvikler unge mennesker som lærer disiplin, målsetting, samarbeid og evnen til å håndtere både seirer og motgang.
                  </p>
                  <p className="text-ink-50 leading-relaxed">
                    Vår aldersinndelte treningsstruktur sikrer at hver junior får utfordringer og støtte tilpasset sitt ståsted i utviklingen. Fra den første konkurranseopplevelsen til forberedelse for elite- og college-golf — med en naturlig overgang til vårt <Link href="/academy" className="text-junior underline underline-offset-2 hover:text-junior/80 transition-colors">Academy-program</Link> for voksne.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ImagePlaceholder aspect="4/3" src="/images/academy/AK-Golf-Academy-22.jpg" label="Junior trening" />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── Junior Coach ─── */}
        {juniorCoach && (
          <section className="w-section-lg">
            <div className="w-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <RevealOnScroll>
                  <div className="max-w-sm mx-auto lg:mx-0">
                    <ImagePlaceholder aspect="3/4" label={juniorCoach.name} />
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                  <div>
                    <SectionLabel>Din trener</SectionLabel>
                    <h2 className="w-heading-lg mt-4 mb-1">{juniorCoach.name}</h2>
                    <p className="w-meta text-gold-text mb-6">
                      {juniorCoach.role} · {juniorCoach.division}
                    </p>
                    <p className="text-ink-50 leading-relaxed mb-6">{juniorCoach.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {juniorCoach.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-xs font-medium text-gold-text"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Link
                        href={`mailto:${juniorCoach.contact.email}`}
                        className="text-ink-50 hover:text-ink-80 transition-colors"
                      >
                        {juniorCoach.contact.email}
                      </Link>
                      <span className="text-ink-20">|</span>
                      <Link
                        href={`tel:${juniorCoach.contact.phone.replace(/\s/g, "")}`}
                        className="text-ink-50 hover:text-ink-80 transition-colors"
                      >
                        {juniorCoach.contact.phone}
                      </Link>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </section>
        )}

        {/* ─── Age Programs ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Aldersprogrammer</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-4">Riktig trening til riktig tid.</h2>
              <p className="text-ink-50 max-w-2xl leading-relaxed mb-12">
                Vår progresjon er designet for å bygge ferdigheter systematisk, med økende intensitet og spesialisering etter hvert som junioren modnes.
              </p>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {JUNIOR_PROGRAMS.map((program) => (
                <StaggerItem key={program.ageGroup}>
                  <div className="w-card h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-junior/10 text-junior text-xs font-mono font-medium">
                        {program.ageGroup}
                      </span>
                    </div>
                    <h3 className="w-heading-sm mb-2">{program.title}</h3>
                    <p className="text-sm text-ink-50 leading-relaxed mb-6 flex-1">{program.description}</p>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-ink-60">
                          <span className="w-1 h-1 rounded-full bg-junior shrink-0" />
                          {feature}
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
        <section className="w-section-lg bg-ink-100 w-section-dark">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>{JUNIOR_INTAKE.heading}</SectionLabel>
                <h2 className="w-heading-lg text-white mt-4 mb-4">Hvem passer Junior Academy for?</h2>
                <p className="text-ink-30 max-w-2xl mx-auto">{JUNIOR_INTAKE.description}</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {JUNIOR_INTAKE.criteria.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="w-card-dark h-full">
                    <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-ink-30 leading-relaxed">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <RevealOnScroll>
              <div className="text-center mb-8">
                <h3 className="w-heading-md text-white mb-2">Slik kommer du i gang</h3>
                <p className="text-ink-30">Fire enkle steg til Junior Academy.</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JUNIOR_INTAKE.process.map((step) => (
                <StaggerItem key={step.step}>
                  <div className="w-card-dark h-full">
                    <span className="font-mono text-xs text-gold-text tracking-[0.2em]">{step.step}</span>
                    <h4 className="text-white font-semibold mt-2 mb-2">{step.title}</h4>
                    <p className="text-sm text-ink-30 leading-relaxed">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Training Structure ─── */}
        <section className="w-section bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Treningsstruktur</SectionLabel>
              <h2 className="w-heading-lg mt-4 mb-12">En uke i Junior Academy.</h2>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { day: "Mandag", focus: "Teknikk & sving", desc: "Individuell og gruppebasert teknikktrening med videoanalyse." },
                { day: "Onsdag", focus: "Kort spill", desc: "Putting, chipping og bunkerslag — ferdighetene som redder score." },
                { day: "Torsdag", focus: "Banespill", desc: "Kursmanagement, strategisk spill og simulerte turneringssituasjoner." },
                { day: "Lørdag", focus: "Konkurranse", desc: "Interne og eksterne turneringer, eller intensiv treningsøkt." },
              ].map((item) => (
                <StaggerItem key={item.day}>
                  <div className="w-card h-full">
                    <span className="w-meta text-junior">{item.day}</span>
                    <h4 className="font-display text-base font-semibold text-ink-90 mt-2 mb-2">{item.focus}</h4>
                    <p className="text-sm text-ink-50 leading-relaxed">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── For Parents ─── */}
        <section className="w-section-lg">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <RevealOnScroll>
                <ImagePlaceholder aspect="4/3" src="/images/academy/AK-Golf-Academy-30.jpg" label="Foreldresamarbeid" />
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <div>
                  <SectionLabel>For foreldre</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-6">Vi er et team — dere inkludert.</h2>
                  <p className="text-ink-50 leading-relaxed mb-6">
                    Vi tror på tett samarbeid med foreldrene. Dere er en viktig del av utviklingsreisen, og vi holder dere informert og involvert gjennom hele prosessen.
                  </p>
                  <ul className="space-y-4">
                    {[
                      { title: "Kvartalsvise foreldremøter", desc: "Gjennomgang av fremgang, mål og planer fremover." },
                      { title: "Månedlige rapporter", desc: "Detaljerte fremgangsrapporter med data og trenervurderinger." },
                      { title: "Åpen kommunikasjon", desc: "Direkte kontakt med trenerteamet når dere trenger det." },
                      { title: "Tydelig kommunikasjon", desc: "Åpne linjer mellom trenere og foreldre gjennom hele sesongen." },
                    ].map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-junior shrink-0 mt-2" />
                        <div>
                          <p className="text-sm font-medium text-ink-80">{item.title}</p>
                          <p className="text-xs text-ink-50">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="bg-ink-100 w-section w-section-dark">
          <div className="w-container">
            <RevealOnScroll>
              <SectionLabel>Fra juniorforeldre</SectionLabel>
              <h2 className="w-heading-lg text-white mt-4 mb-12">Familier som stoler på oss.</h2>
            </RevealOnScroll>

            <FeaturedTestimonial
              quote={TESTIMONIALS[2].quote}
              name={TESTIMONIALS[2].name}
              role={TESTIMONIALS[2].role}
            />
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="w-section-lg bg-surface-warm">
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
                <FAQAccordion items={JUNIOR_FAQ} />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <CTASection
          eyebrow="Neste generasjon starter nå"
          heading="Avtal et møte om Junior Academy."
          description="Gi din junior en strukturert vei mot sine golfmål. Vi tar kontakt for en uforpliktende samtale."
          ctaLabel="Avtal et møte"
          ctaHref="#apply"
        />

        {/* ─── Application Form ─── */}
        <section id="apply" className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Start med et uforpliktende møte.</h2>
                <p className="text-ink-50 max-w-lg mx-auto">
                  Fyll ut skjemaet under, så tar vi kontakt innen 48 timer for å avtale et møte.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <ApplicationForm defaultProgram="junior-16-17" />
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
