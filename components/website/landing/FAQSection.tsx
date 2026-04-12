"use client";

import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll } from "../RevealOnScroll";
import { FAQAccordion } from "../FAQAccordion";
import { COACHING_FAQ } from "@/lib/website-constants";

export function FAQSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>Ofte stilte sporsmal</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-12">Har du sporsmal?</h2>
        </RevealOnScroll>
        <RevealOnScroll>
          <div className="max-w-2xl">
            <FAQAccordion items={COACHING_FAQ} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
