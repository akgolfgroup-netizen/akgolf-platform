"use client";

import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { CTASection } from "@/components/website/CTASection";
import { LandingHero } from "@/components/website/landing/LandingHero";
import { LandingPurpose } from "@/components/website/landing/LandingPurpose";
import { LandingFeatures } from "@/components/website/landing/LandingFeatures";
import { LandingPricing } from "@/components/website/landing/LandingPricing";

export default function HomePage() {
  return (
    <>
      <WebsiteNav />
      <PageTransition>
        <main>
          {/* 1. Hero — typografi-fokusert, Linear-inspirert */}
          <LandingHero />

          {/* 2. Formal — tre kolonner: Coaching / Junior / Utvikling */}
          <LandingPurpose />

          {/* 3. Features — bento grid med portal-beskrivelser */}
          <LandingFeatures />

          {/* 4. Priser — tre kort: Performance / Performance Pro / Flex */}
          <LandingPricing />

          {/* 5. CTA — avsluttende konverteringsseksjon */}
          <CTASection
            eyebrow="Klar?"
            heading="Klar for a forbedre spillet ditt?"
            description="Begrenset kapasitet — maks 65 plasser for a sikre kvalitet og tilgjengelighet. Reserver din plass i dag."
            ctaLabel="Se coaching-pakker"
            ctaHref="/academy"
            external={false}
            secondaryCtaLabel="Book Flex-sesjon"
            secondaryCtaHref="/booking"
            secondaryExternal={false}
          />
        </main>
      </PageTransition>
      <WebsiteFooter />
      <BackToTop />
    </>
  );
}
