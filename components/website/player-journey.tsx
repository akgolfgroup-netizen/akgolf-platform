"use client";

import { CheckCircle2, User } from "lucide-react";
import { PLAYER_JOURNEY, PLAYER_JOURNEY_SECTION } from "@/lib/website-constants";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";

export function PlayerJourney() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <SectionLabel>{PLAYER_JOURNEY_SECTION.label}</SectionLabel>
            <h2 className="w-heading-lg mt-4 mb-4">
              {PLAYER_JOURNEY_SECTION.heading}
            </h2>
            <p className="text-grey-400 leading-relaxed max-w-xl mx-auto">
              {PLAYER_JOURNEY_SECTION.description}
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLAYER_JOURNEY.map((phase, index) => (
            <StaggerItem key={phase.id}>
              <div className="bg-white rounded-2xl p-8 border border-grey-200 shadow-card hover:shadow-card-hover hover:-translate-y-px transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg ${
                      phase.coach === "Anders"
                        ? "bg-black text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full text-xs font-semibold text-grey-500 uppercase tracking-wider">
                    <User size={14} className="text-grey-300" />
                    Coach {phase.coach}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {phase.title}
                  </h3>
                  <div className="h-1 w-12 bg-grey-200 group-hover:w-full transition-all duration-500" />
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {phase.steps.map((step) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 text-grey-500"
                    >
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-grey-300"
                        size={18}
                      />
                      <span className="text-sm font-medium leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
