import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { AcademyHeroV2 } from "@/components/website/academy-hero-v2";
import { AcademyMethodV2 } from "@/components/website/academy-method-v2";
import { PlayerJourney } from "@/components/website/player-journey";
import { AcademyPricesV2 } from "@/components/website/academy-prices-v2";
import { AcademyCtaV2 } from "@/components/website/academy-cta-v2";

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

        {/* 1. Hero med coaching-bilde */}
        <AcademyHeroV2 />

        {/* 2. Metodikken bak (Analyse, Plan, Oppfolging) */}
        <AcademyMethodV2 />

        {/* 3. Spillerreisen */}
        <PlayerJourney />

        {/* 4. Priser og pakker */}
        <AcademyPricesV2 />

        {/* 5. Avsluttende CTA */}
        <AcademyCtaV2 />
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
