import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";
import { BackToTop } from "@/components/website/BackToTop";
import { AcademyHeroV2 } from "@/components/website/academy-hero-v2";
import { ConceptSection } from "@/components/website/academy/ConceptSection";
import { HowItWorksSection } from "@/components/website/academy/HowItWorksSection";
import { PortalPreviewSection } from "@/components/website/academy/PortalPreviewSection";
import { AcademyPricesV2 } from "@/components/website/academy-prices-v2";
import { ComparisonSection } from "@/components/website/academy/ComparisonSection";

import { AcademyCtaV2 } from "@/components/website/academy-cta-v2";
import { FAQSection } from "@/components/website/landing/FAQSection";

export default function AcademyPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-on-surface focus:text-surface focus:rounded-lg"
      >
        Hopp til hovedinnhold
      </a>
      <WebNav active="academy" />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Hjem",
                  item: "https://akgolf.no",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Academy",
                  item: "https://akgolf.no/academy",
                },
              ],
            }),
          }}
        />

        {/* 1. Hero */}
        <AcademyHeroV2 />

        {/* 2. Konsept — Hvorfor abonnement */}
        <ConceptSection />

        {/* 3. Slik fungerer det — 4 steg */}
        <HowItWorksSection />

        {/* 4. PlayersHQ — funksjoner + lanseres mai 2026 */}
        <PortalPreviewSection />

        {/* 5. Priser og pakker */}
        <AcademyPricesV2 />

        {/* 6. Abonnement vs Flex */}
        <ComparisonSection />

        {/* 7. CTA */}
        <AcademyCtaV2 />

        {/* 9. FAQ */}
        <FAQSection />
      </main>

      <BackToTop />
      <WebFooter />
    </>
  );
}
