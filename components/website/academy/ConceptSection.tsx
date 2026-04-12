"use client";

import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll } from "../RevealOnScroll";
import { ACADEMY_CONCEPT } from "@/lib/website-constants";

export function ConceptSection() {
  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>{ACADEMY_CONCEPT.eyebrow}</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-8 max-w-[640px]">
            {ACADEMY_CONCEPT.heading}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll>
          <div className="max-w-2xl space-y-6">
            {ACADEMY_CONCEPT.paragraphs.map((p, i) => (
              <p key={i} className="text-base text-text leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
