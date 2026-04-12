"use client";

import {
  BookOpen,
  CalendarCheck,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";

const FEATURES = [
  {
    title: "Treningsplan",
    description:
      "Personlig utviklingsplan som oppdateres etter hver sesjon. AI-drevet analyse viser hva du bor jobbe med neste gang.",
    icon: BookOpen,
    span: "md:col-span-2",
  },
  {
    title: "Booking",
    description:
      "Bestill sesjoner direkte i appen. Se tilgjengelige tider og velg det som passer deg.",
    icon: CalendarCheck,
    span: "",
  },
  {
    title: "Statistikk",
    description:
      "TrackMan-data, HCP-utvikling og treningslogg gir deg full oversikt over din progresjon.",
    icon: BarChart3,
    span: "",
  },
  {
    title: "Coaching-logg",
    description:
      "Videoopptak, trenernotater og ovelser fra hver sesjon — samlet pa ett sted slik at du alltid vet hva du har jobbet med.",
    icon: MessageSquare,
    span: "md:col-span-2",
  },
] as const;

export function LandingFeatures() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-[1120px] mx-auto px-5">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>Spillerportalen</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-grey-900)] mt-4">
              <span className="font-light text-[var(--color-muted)]">
                Alt du trenger.
              </span>{" "}
              Ett sted.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <RevealOnScroll
                key={feature.title}
                delay={i * 0.08}
                className={feature.span}
              >
                <div className="group rounded-2xl bg-white border border-[var(--color-grey-200)] p-8 md:p-10 h-full transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[var(--color-grey-300)]">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-5"
                    style={{
                      background: "var(--color-primary)/0.08",
                    }}
                  >
                    <Icon
                      className="w-4.5 h-4.5"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text)]">
                    {feature.description}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
