"use client";

import { RevealOnScroll, StaggerContainer, StaggerItem } from "./RevealOnScroll";
import { SectionLabel } from "./SectionLabel";
import { Target, Sparkles, Crosshair } from "lucide-react";

const features = [
  {
    title: "Strokes Gained-analyse",
    description: "Identifiser nøyaktig hvor du taper og vinner slag sammenlignet med ditt handicap-nivå. Data-drevet beslutninger for treningen din.",
    icon: Target,
    span: "md:col-span-2 md:row-span-2",
    bg: "bg-white",
  },
  {
    title: "AI-drevet treningsplan",
    description: "Personlig treningsplan som oppdateres etter hver økt basert på dine data.",
    icon: Sparkles,
    span: "md:col-span-1",
    bg: "bg-[#EDF5F0]",
    iconColor: "text-[#2D6A4F]",
  },
  {
    title: "TrackMan-integrasjon",
    description: "Hver økt inkluderer fullstendig TrackMan-analyse med balldata og klubbdata.",
    icon: Crosshair,
    span: "md:col-span-1",
    bg: "bg-[#1D1D1F]",
    textColor: "text-white",
    descColor: "text-[#86868B]",
  },
] as const;

export function BentoFeatures() {
  return (
    <section className="py-28 md:py-40 bg-white">
      <div className="w-container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>Metodikk</SectionLabel>
            <h2 className="w-heading-lg mt-5">Data-drevet coaching</h2>
            <p className="text-[#6E6E73] max-w-xl mx-auto mt-5 text-lg leading-relaxed">
              Kombinasjonen av TrackMan-data, Strokes Gained-analyse og individuell oppfølging gir deg en klar retning.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title} className={feature.span}>
                <div className={`${feature.bg} rounded-[20px] p-8 h-full border border-[#E8E8ED] ${feature.bg === "bg-[#1D1D1F]" ? "border-transparent" : ""}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${feature.bg === "bg-[#1D1D1F]" ? "bg-white/10" : feature.bg === "bg-[#EDF5F0]" ? "bg-[#2D6A4F]/10" : "bg-[#F5F5F7]"}`}>
                    <Icon className={`w-5 h-5 ${"iconColor" in feature && feature.iconColor ? feature.iconColor : (feature.bg === "bg-[#1D1D1F]" ? "text-white" : "text-[#1D1D1F]")}`} />
                  </div>
                  <h3 className={`font-display text-xl font-bold mb-3 ${"textColor" in feature && feature.textColor ? feature.textColor : "text-[#1D1D1F]"}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${"descColor" in feature && feature.descColor ? feature.descColor : "text-[#6E6E73]"}`}>
                    {feature.description}
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
