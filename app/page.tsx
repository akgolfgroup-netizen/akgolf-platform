"use client";

import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { HeroSection } from "@/components/website/landing/HeroSection";
import { HowItWorksSection } from "@/components/website/landing/HowItWorksSection";
import { PortalPreviewSection } from "@/components/website/landing/PortalPreviewSection";
import { TargetProfilesSection } from "@/components/website/landing/TargetProfilesSection";
import { TeamSection } from "@/components/website/landing/TeamSection";

import { TestimonialSection } from "@/components/website/landing/TestimonialSection";
import { CTASection } from "@/components/website/landing/CTASection";

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
        <HeroSection />
        <HowItWorksSection />
        <PortalPreviewSection />
        <TargetProfilesSection />
        <TeamSection />

        <TestimonialSection />
        <CTASection />
      </main>

      <WebsiteFooter />
      <BackToTop />
    </PageTransition>
  );
}
