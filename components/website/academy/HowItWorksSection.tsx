"use client";

import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "../RevealOnScroll";

const STEPS = [
  {
    step: "01",
    title: "Book i appen",
    description:
      "Du booker 20-minutters coaching-sesjoner direkte i spillerportalen. Velg dag og tid som passer deg.",
  },
  {
    step: "02",
    title: "Tren med trener",
    description:
      "Hver sesjon er fokusert pa ett tema. TrackMan maler, video dokumenterer. Du far konkrete tall pa endringen.",
  },
  {
    step: "03",
    title: "Tren pa egenhand",
    description:
      "Mellom sesjonene har du en oppdatert treningsplan med ovelser, video og progresjon. Du vet alltid hva du skal jobbe med.",
  },
  {
    step: "04",
    title: "Folg utviklingen",
    description:
      "Spillerportalen viser handicap-utvikling, treningsstatistikk og Strokes Gained-analyse. Du ser fremgangen over tid.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <SectionLabel>Slik fungerer det</SectionLabel>
            <h2 className="w-heading-lg mt-4 mb-6">
              Coaching med oppfolging
            </h2>
            <p className="text-grey-400 leading-relaxed">
              De fleste golfere trener tilfeldig. Med et treningsabonnement far du
              en fast trener, en personlig plan og et system som folger deg mellom
              sesjonene. Resultatet er raskere utvikling og mer malrettet trening.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <StaggerItem key={step.step}>
              <div className="rounded-2xl border border-grey-200 bg-white p-6 h-full">
                <span className="text-4xl font-bold tracking-tight text-grey-200">
                  {step.step}
                </span>
                <h3 className="text-base font-semibold text-black mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-grey-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
