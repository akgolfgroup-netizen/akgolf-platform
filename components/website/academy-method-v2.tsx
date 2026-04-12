"use client";

import { ScanSearch, ClipboardList, TrendingUp } from "lucide-react";
import { ACADEMY_METHOD_V2 } from "@/lib/website-constants";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";

const STEP_ICONS = [ScanSearch, ClipboardList, TrendingUp] as const;

export function AcademyMethodV2() {
  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>{ACADEMY_METHOD_V2.label}</SectionLabel>
            <h2 className="w-heading-lg mt-4">
              {ACADEMY_METHOD_V2.heading}
            </h2>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ACADEMY_METHOD_V2.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <StaggerItem key={step.number}>
                <div className="bg-white rounded-2xl p-8 border border-grey-200 shadow-card hover:shadow-card-hover transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-accent-cta" />
                    </div>
                    <span className="text-4xl font-bold text-grey-200 select-none leading-none">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-grey-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
