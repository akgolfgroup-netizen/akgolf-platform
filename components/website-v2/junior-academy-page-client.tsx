import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { JuniorHeroSection } from "./junior-academy/hero-section";
import { JuniorAgeGroupsSection } from "./junior-academy/age-groups-section";
import { JuniorParentBenefitsSection } from "./junior-academy/parent-benefits-section";
import { JuniorSeasonSection } from "./junior-academy/season-section";
import { JuniorCoachSection } from "./junior-academy/coach-section";
import { JuniorPartnerSection } from "./junior-academy/partner-section";
import { JuniorFaqSection } from "./junior-academy/faq-section";
import { JuniorCtaSection } from "./junior-academy/cta-section";

export function JuniorAcademyPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav active="junior" />

      <main id="main-content">
        <JuniorHeroSection />
        <JuniorAgeGroupsSection />
        <JuniorParentBenefitsSection />
        <JuniorSeasonSection />
        <JuniorCoachSection />
        <JuniorPartnerSection />
        <JuniorFaqSection />
        <JuniorCtaSection />
      </main>

      <WebFooter />
    </div>
  );
}
