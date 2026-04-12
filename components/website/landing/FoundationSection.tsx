"use client";

import Image from "next/image";
import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll } from "../RevealOnScroll";
import { FOUNDATION_METHOD } from "@/lib/website-constants";

export function FoundationSection() {
  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>{FOUNDATION_METHOD.eyebrow}</SectionLabel>
        </RevealOnScroll>

        <RevealOnScroll>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-black tracking-[-0.02em] leading-[1.1] mt-4 mb-6 max-w-[640px]">
            {FOUNDATION_METHOD.heading}
          </h2>
          <p className="text-lg text-grey-500 leading-relaxed max-w-2xl mb-16">
            {FOUNDATION_METHOD.description}
          </p>
        </RevealOnScroll>

        {/* Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FOUNDATION_METHOD.phases.map((phase, i) => (
            <RevealOnScroll key={phase.id} delay={i * 0.1}>
              <div className="relative">
                {/* Phase image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={`/images/branding/ak-golf-academy-${String((i + 1) * 3).padStart(2, "0")}.jpg`}
                    alt={phase.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Phase number */}
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                  {phase.name}
                </p>

                <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                  {phase.title}
                </h3>
                <p className="text-sm text-text leading-relaxed">
                  {phase.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
