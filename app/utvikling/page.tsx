"use client";

import Link from "next/link";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubPageHero } from "@/components/website/SubPageHero";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { FeatureGrid } from "@/components/website/FeatureGrid";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { ImagePlaceholder } from "@/components/website/ImagePlaceholder";
import { RelatedPages } from "@/components/website/RelatedPages";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import {
  SOFTWARE_FEATURES,
  KLUBB_FEATURES,
} from "@/lib/website-constants";

export default function UtviklingPage() {
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
                { "@type": "ListItem", position: 2, name: "Utvikling", item: "https://akgolf.no/utvikling" },
              ],
            }),
          }}
        />
        <PageTransition>
        {/* ─── Hero ─── */}
        <SubPageHero
          eyebrow="Utvikling & Teknologi"
          heading="Teknologi og rådgiving for golfens fremtid."
          description="Digitale treningsverktøy og sportslig rådgiving for golfklubber, forbund og trenere som vil ligge i forkant."
          accent="utvikling"
        />

        {/* ─── Software Section ─── */}
        <section id="software" className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <RevealOnScroll>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-software" />
                    <SectionLabel>AK Golf Software</SectionLabel>
                  </div>
                  <h2 className="w-heading-lg mb-6">
                    Digitale verktøy som<br />
                    <span className="text-ink-40">forandrer treningshverdagen.</span>
                  </h2>
                  <p className="text-ink-50 leading-relaxed">
                    Vår programvare er utviklet av trenere, for trenere. Vi forstår hverdagen på rangen og på banen — og har bygget verktøy som faktisk gjør en forskjell.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ImagePlaceholder aspect="16/10" src="/images/academy/AK-Golf-Academy-3.jpg" label="Software dashboard" />
              </RevealOnScroll>
            </div>

            <FeatureGrid features={SOFTWARE_FEATURES} columns={2} />

            <RevealOnScroll>
              <div className="mt-12 text-center">
                <Link href="#apply" className="w-btn w-btn-primary">
                  Bestill en demo
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Klubbtrening Section ─── */}
        <section id="klubb" className="w-section-lg">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <RevealOnScroll delay={0.2} className="order-2 lg:order-1">
                <ImagePlaceholder aspect="16/10" src="/images/academy/AK-Golf-Academy-17.jpg" label="Klubbtrening" />
              </RevealOnScroll>

              <RevealOnScroll className="order-1 lg:order-2">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-utvikling" />
                    <SectionLabel>Klubbtrening & Rådgiving</SectionLabel>
                  </div>
                  <h2 className="w-heading-lg mb-6">
                    Sportsplaner og rådgiving<br />
                    <span className="text-ink-40">for ambisiose klubber.</span>
                  </h2>
                  <p className="text-ink-50 leading-relaxed">
                    Vi hjelper golfklubber med å bygge sportslige strukturer som tiltrekker medlemmer, utvikler spillere og skaper resultater. Fra sportsplan til trenernettverk.
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            <FeatureGrid features={KLUBB_FEATURES} columns={2} />

            <RevealOnScroll>
              <div className="mt-12 text-center">
                <Link href="#apply" className="w-btn w-btn-primary">
                  Book en samtale
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── B2B CTA ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <SectionLabel>Interessert?</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Book en samtale.</h2>
                <p className="text-ink-50 leading-relaxed mb-8">
                  Vi starter alltid med en uforpliktende samtale for å forstå deres behov og ambisjoner. Deretter lager vi et skreddersydd forslag.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="#apply" className="w-btn w-btn-primary">
                    Book en samtale
                  </Link>
                  <Link href="/" className="w-btn w-btn-secondary">
                    Tilbake til forsiden &rarr;
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Application Form ─── */}
        <section id="apply" className="w-section-lg bg-surface-cream">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Fortell oss om deres behov.</h2>
                <p className="text-ink-50 max-w-lg mx-auto">
                  Fyll ut skjemaet under, så tar vi kontakt for en uforpliktende samtale om deres muligheter.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <ApplicationForm />
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Related Pages ─── */}
        <RelatedPages exclude="utvikling" />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
