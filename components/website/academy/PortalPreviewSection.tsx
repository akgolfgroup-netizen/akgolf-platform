"use client";

import {
  Calendar,
  BarChart3,
  Target,
  BookOpen,
  TrendingUp,
  Video,
  Smartphone,
} from "lucide-react";
import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "../RevealOnScroll";

const FEATURES = [
  {
    icon: Calendar,
    title: "Booking",
    description: "Book og administrer coaching-timer direkte. Se ledige tider og fa bekreftelse umiddelbart.",
  },
  {
    icon: BookOpen,
    title: "Treningsplan",
    description: "Personlig plan oppdatert av treneren etter hver sesjon. Ovelser med video, tid og progresjon.",
  },
  {
    icon: BarChart3,
    title: "Statistikk og analyse",
    description: "Handicap-utvikling, Strokes Gained-barer og benchmark mot spillere pa ditt niva.",
  },
  {
    icon: Target,
    title: "Strokes Gained",
    description: "Se hvor du taper og vinner slag. Tee, approach, kortspill og putting — malt og visualisert.",
  },
  {
    icon: Video,
    title: "Coaching-historikk",
    description: "Alle sesjoner logget med notater, video og TrackMan-data. Se tilbake pa hva dere jobbet med.",
  },
  {
    icon: TrendingUp,
    title: "Progresjon",
    description: "Folg utviklingen din over uker og maneder. Tydelige grafer og milestones nar du nar nye niva.",
  },
];

export function PortalPreviewSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <SectionLabel>Spillerportalen</SectionLabel>
            <h2 className="w-heading-lg mt-4 mb-6">
              Alt du trenger mellom sesjonene
            </h2>
            <p className="text-grey-400 leading-relaxed">
              Spillerportalen er treningsappen din. Her ser du treningsplanen,
              booker timer, folger progresjonen og har tilgang til alle ovelser
              med video. Treneren oppdaterer planen etter hver sesjon.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <div className="rounded-2xl border border-grey-200 bg-white p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-grey-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Launch banner */}
        <RevealOnScroll>
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-black">
                Spillerportalen lanseres mai 2026
              </h3>
            </div>
            <p className="text-sm text-grey-400 max-w-md mx-auto">
              Vi bygger portalen na. Alle med treningsabonnement far automatisk
              tilgang nar den er klar. I mellomtiden far du treningsplan og
              oppfolging direkte fra treneren.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
