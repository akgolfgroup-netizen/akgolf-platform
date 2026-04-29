"use client";

import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { ContactHero } from "./contact/contact-hero";
import { ContactQuickTiles } from "./contact/contact-quick-tiles";
import { ContactFormSection } from "./contact/contact-form-section";
import { ContactLocations } from "./contact/contact-locations";
import { ContactFaq } from "./contact/contact-faq";

export function ContactPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #F4F6F4)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav />
      <ContactHero />
      <ContactQuickTiles />
      <ContactFormSection />
      <ContactLocations />
      <ContactFaq />
      <WebFooter />
    </div>
  );
}
