import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";
import { AcademyHeroSection } from "@/components/website-v2/academy/hero-section";
import { AcademyPackagesSection } from "@/components/website-v2/academy/packages-section";
import { AcademyMatrixSection } from "@/components/website-v2/academy/matrix-section";
import { AcademyMethodSection } from "@/components/website-v2/academy/method-section";
import { AcademyCoachSection } from "@/components/website-v2/academy/coach-section";
import { AcademyFaqSection } from "@/components/website-v2/academy/main-faq-section";
import { AcademyCtaSection } from "@/components/website-v2/academy/cta-section";

export default function AcademyPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--akgolf-ink,#0A1F18)] focus:px-4 focus:py-2 focus:text-white"
      >
        Hopp til hovedinnhold
      </a>

      <div
        className="min-h-screen"
        style={{
          background: "var(--akgolf-surface, #ECF0EF)",
          color: "var(--akgolf-text, #324D45)",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
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

          <AcademyHeroSection />
          <AcademyPackagesSection />
          <AcademyMatrixSection />
          <AcademyMethodSection />
          <AcademyCoachSection />
          <AcademyFaqSection />
          <AcademyCtaSection />
        </main>

        <WebFooter />
      </div>
    </>
  );
}
