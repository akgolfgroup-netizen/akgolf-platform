"use client";

import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { LandingHero } from "@/components/website/landing-hero";
import { LandingPurpose } from "@/components/website/landing-purpose";
import { LandingFeatures } from "@/components/website/landing-features";
import { LandingPricing } from "@/components/website/landing-pricing";
import { LandingCTA } from "@/components/website/landing-cta";

export default function HomePage() {
  return (
    <PageTransition>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg"
      >
        Hopp til innhold
      </a>

      <WebsiteNav />

      <main id="main-content">
        <LandingHero />
        <LandingPurpose />
        <LandingFeatures />
        <LandingPricing />
        <LandingCTA />
      </main>

      <WebsiteFooter />
      <BackToTop />
    </PageTransition>
  );
}
