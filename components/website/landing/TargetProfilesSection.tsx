"use client";

import { UserPlus, Target, TrendingUp } from "lucide-react";
import { SectionLabel } from "../SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "../RevealOnScroll";
import { TARGET_PROFILES } from "@/lib/website-constants";

const ICONS: Record<string, React.ElementType> = {
  ny: UserPlus,
  planlos: Target,
  ambisios: TrendingUp,
};

export function TargetProfilesSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>{TARGET_PROFILES.eyebrow}</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-12">
            {TARGET_PROFILES.heading}
          </h2>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TARGET_PROFILES.profiles.map((profile) => {
            const Icon = ICONS[profile.id] ?? Target;
            return (
              <StaggerItem key={profile.id}>
                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-px transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface tracking-tight mb-3">
                    {profile.title}
                  </h3>
                  <p className="text-sm text-text leading-relaxed">
                    {profile.description}
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
