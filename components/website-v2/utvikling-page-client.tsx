import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { UtviklingHeroSection } from "./utvikling/hero-section";
import { UtviklingPillarsSection } from "./utvikling/pillars-section";
import { UtviklingStatsRow } from "./utvikling/stats-row";
import { UtviklingReadingSection } from "./utvikling/reading-section";
import { UtviklingCompareSection } from "./utvikling/compare-section";
import { UtviklingTestimonialsSection } from "./utvikling/testimonials-section";
import { UtviklingCtaSection } from "./utvikling/cta-section";

export function UtviklingPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav />

      <main>
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
                  name: "Utvikling",
                  item: "https://akgolf.no/utvikling",
                },
              ],
            }),
          }}
        />

        <UtviklingHeroSection />
        <UtviklingPillarsSection />
        <UtviklingStatsRow />
        <UtviklingReadingSection />
        <UtviklingCompareSection />
        <UtviklingTestimonialsSection />
        <UtviklingCtaSection />
      </main>

      <WebFooter />
    </div>
  );
}
