import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { AcademyHeroV2 } from "@/components/website/academy-hero-v2";
import { ConceptSection } from "@/components/website/academy/ConceptSection";
import { AcademyPricesV2 } from "@/components/website/academy-prices-v2";
import { ComparisonSection } from "@/components/website/academy/ComparisonSection";
import { TestimonialSection } from "@/components/website/landing/TestimonialSection";
import { AcademyCtaV2 } from "@/components/website/academy-cta-v2";
import { FAQSection } from "@/components/website/landing/FAQSection";

export default function AcademyPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg"
      >
        Hopp til hovedinnhold
      </a>
      <WebsiteNav />

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

        {/* 3. Priser og pakker */}
        <AcademyPricesV2 />

        {/* 4. Abonnement vs Flex */}
        <ComparisonSection />

        {/* 5. Kundehistorie */}
        <TestimonialSection />

        {/* 6. CTA */}
        <AcademyCtaV2 />

        {/* 7. FAQ */}
        <FAQSection />
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
