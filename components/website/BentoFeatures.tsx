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
    <section className="py-[120px] md:py-[160px] bg-white">
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

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title} className={feature.span}>
                <div className={`${feature.bg} rounded-[20px] ${feature.span.includes("row-span-2") ? "p-10 md:p-12" : "p-8"} h-full border border-[#E8E8ED] ${feature.bg === "bg-[#1D1D1F]" ? "border-transparent" : ""} transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden`}>
                  {feature.span.includes("row-span-2") && (
                    <svg className="absolute right-6 bottom-6 w-40 h-40 opacity-[0.07] text-current" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                      <polygon points="50,5 95,35 80,90 20,90 5,35" />
                      <polygon points="50,20 78,40 70,78 30,78 22,40" />
                      <polygon points="50,35 65,47 60,67 40,67 35,47" />
                      <line x1="50" y1="5" x2="50" y2="50" />
                      <line x1="95" y1="35" x2="50" y2="50" />
                      <line x1="80" y1="90" x2="50" y2="50" />
                      <line x1="20" y1="90" x2="50" y2="50" />
                      <line x1="5" y1="35" x2="50" y2="50" />
                    </svg>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${feature.bg === "bg-[#1D1D1F]" ? "bg-white/10" : feature.bg === "bg-[#EDF5F0]" ? "bg-[#2D6A4F]/10" : "bg-[#F5F5F7]"}`}>
                    <Icon className={`w-5 h-5 ${"iconColor" in feature && feature.iconColor ? feature.iconColor : (feature.bg === "bg-[#1D1D1F]" ? "text-white" : "text-[#1D1D1F]")}`} />
                  </div>
                  <h3 className={`font-display ${feature.span.includes("row-span-2") ? "text-xl md:text-2xl" : "text-xl"} font-bold mb-3 ${"textColor" in feature && feature.textColor ? feature.textColor : "text-[#1D1D1F]"}`}>
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
