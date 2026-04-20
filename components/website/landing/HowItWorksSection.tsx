"use client";

import { SectionLabel } from "../SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "../RevealOnScroll";
import { HOW_IT_WORKS } from "@/lib/website-constants";

export function HowItWorksSection() {
  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>{HOW_IT_WORKS.eyebrow}</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4 max-w-[640px]">
            {HOW_IT_WORKS.heading}
          </h2>
          <p className="text-on-surface-variant/80 leading-relaxed max-w-2xl mb-16">
            {HOW_IT_WORKS.description}
          </p>
        </RevealOnScroll>

        <StaggerContainer className="space-y-0">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div
                className={`flex gap-6 md:gap-10 py-8 ${
                  i < HOW_IT_WORKS.steps.length - 1
                    ? "border-b border-outline-variant/20"
                    : ""
                }`}
              >
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted pt-1 min-w-[28px]">
                  {step.number}
                </p>
                <div>
                  <h3 className="text-lg font-bold text-on-surface tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
