"use client";


import { Icon } from "@/components/ui/icon";
import { Calendar, BarChart3, Target, BookOpen, TrendingUp, Video } from "lucide-react";
import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "../RevealOnScroll";

const FEATURES = [
  {
    icon: Calendar,
    title: "Booking",
    description: "Book og administrer coaching-timer direkte. Se ledige tider og få bekreftelse umiddelbart.",
  },
  {
    icon: BookOpen,
    title: "Treningsplan",
    description: "Personlig plan oppdatert av treneren etter hver sesjon. Øvelser med video, tid og progresjon.",
  },
  {
    icon: BarChart3,
    title: "Statistikk og analyse",
    description: "Handicap-utvikling, Strokes Gained-barer og benchmark mot spillere på ditt nivå.",
  },
  {
    icon: Target,
    title: "Strokes Gained",
    description: "Se hvor du taper og vinner slag. Tee, approach, kortspill og putting — målt og visualisert.",
  },
  {
    icon: Video,
    title: "Coaching-historikk",
    description: "Alle sesjoner logget med notater, video og TrackMan-data. Se tilbake på hva dere jobbet med.",
  },
  {
    icon: TrendingUp,
    title: "Progresjon",
    description: "Følg utviklingen din over uker og måneder. Tydelige grafer og milestones når du når nye nivå.",
  },
];

export function PortalPreviewSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <SectionLabel>PlayersHQ</SectionLabel>
            <h2 className="w-heading-lg mt-4 mb-6">
              Alt du trenger mellom sesjonene
            </h2>
            <p className="text-text leading-relaxed">
              PlayersHQ er treningsappen din. Her ser du treningsplanen,
              booker timer, følger progresjonen og har tilgang til alle øvelser
              med video. Treneren oppdaterer planen etter hver sesjon.
            </p>
          </div>
        </RevealOnScroll>

        {/* Live banner */}
        <RevealOnScroll>
          <div className="mb-12 rounded-2xl bg-on-surface p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Icon name="smartphone" className="w-5 h-5 text-secondary-fixed" />
              <h3 className="font-semibold text-surface">
                PlayersHQ er live
              </h3>
            </div>
            <p className="text-sm text-surface/70 max-w-md mx-auto">
              Logg inn for å se din personlige treningsplan, booke timer og
              følge utviklingen din — alt på ett sted.
            </p>
            <a
              href="/portal/login"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-secondary-fixed text-on-surface text-sm font-bold hover:bg-secondary-fixed/90 transition-colors"
            >
              Logg inn på portalen
            </a>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text leading-relaxed">
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
