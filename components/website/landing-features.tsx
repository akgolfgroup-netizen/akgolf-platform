"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "./RevealOnScroll";
import { PORTAL_FEATURES } from "@/lib/website-constants";

const BENTO_CARDS = [
  {
    span: "md:col-span-2 md:row-span-2",
    tag: "Spillerportalen",
    title: "Din treningspartner mellom øktene",
    description:
      "Treningsplaner, scoring, AI-coaching og TrackMan-data — samlet på ett sted.",
    href: "/portal",
    bg: "bg-black text-white",
    imageSrc: "/images/portal-preview-page.png",
  },
  {
    span: "",
    tag: "AI-analyse",
    title: "Personlig innsikt",
    description: "Automatiserte anbefalinger basert på dine data.",
    href: "/academy",
    bg: "bg-ai-light text-ai-text",
  },
  {
    span: "",
    tag: "TrackMan",
    title: "Data du kan stole på",
    description: "Analyse fra verdens beste launch monitor, logget i profilen din.",
    href: "/academy",
    bg: "bg-primary text-white",
  },
  {
    span: "md:col-span-2",
    tag: "Treningsplan",
    title: "Oppdateres etter hver sesjon",
    description:
      "Konkrete øvelser, fokusområder og progresjon — så du vet nøyaktig hva du skal jobbe med.",
    href: "/academy",
    bg: "bg-surface text-text",
  },
];

export function LandingFeatures() {
  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>Plattformen</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4">
            Alt du trenger for å utvikle spillet
          </h2>
          <p className="text-grey-500 leading-relaxed max-w-2xl mb-12">
            Coaching er bare starten. Portalen gir deg verktøyene
            til å jobbe strukturert mellom øktene.
          </p>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
          {BENTO_CARDS.map((card) => (
            <StaggerItem key={card.title} className={card.span}>
              <Link
                href={card.href}
                className={`group relative block h-full rounded-2xl p-8 overflow-hidden transition-shadow duration-300 hover:shadow-card-hover ${card.bg}`}
              >
                {card.imageSrc && (
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    className="object-cover object-top opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                  />
                )}
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div className="relative z-10 flex flex-col justify-end h-full">
                  <p className="text-[10px] font-bold tracking-[0.08em] uppercase opacity-50 mb-2">
                    {card.tag}
                  </p>
                  <h3 className="text-lg font-bold tracking-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm opacity-60 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Portal feature chips */}
        <RevealOnScroll className="mt-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {PORTAL_FEATURES.slice(0, 5).map((f) => (
              <span
                key={f.title}
                className="px-4 py-2 bg-surface border border-grey-200 rounded-full text-xs font-medium text-text"
              >
                {f.title}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
