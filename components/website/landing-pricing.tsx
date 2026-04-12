"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "./RevealOnScroll";

const PLANS = [
  {
    name: "Performance",
    sessions: "2 økter per måned",
    price: "1 600",
    unit: "kr/mnd",
    features: [
      "2 x 20 min coaching",
      "TrackMan-analyse",
      "Personlig treningsplan",
      "Spillerportalen",
      "7 dagers booking-vindu",
    ],
    cta: "Velg Performance",
    popular: false,
  },
  {
    name: "Performance Pro",
    sessions: "4 økter per måned",
    price: "2 000",
    unit: "kr/mnd",
    features: [
      "4 x 20 min coaching",
      "TrackMan-analyse",
      "Personlig treningsplan",
      "Spillerportalen",
      "14 dagers booking-vindu",
      "Prioritert booking",
    ],
    cta: "Velg Performance Pro",
    popular: true,
  },
  {
    name: "Flex",
    sessions: "Enkeltøkter uten binding",
    price: "1 500+",
    unit: "kr",
    features: [
      "50 eller 90 min økter",
      "TrackMan-analyse",
      "Ingen binding",
      "48 timers booking-vindu",
    ],
    cta: "Se Flex-pakker",
    popular: false,
  },
];

export function LandingPricing() {
  return (
    <section id="priser" className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>Priser</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4">
            Velg pakken som passer deg
          </h2>
          <p className="text-grey-500 leading-relaxed max-w-2xl mb-12">
            Ingen bindingstid. Alle pakker kan sies opp når som helst.
          </p>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={`bg-white rounded-[20px] p-8 flex flex-col h-full relative hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-primary"
                    : "border border-grey-200"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                    Mest populær
                  </span>
                )}
                <h3 className="text-xl font-bold text-black">{plan.name}</h3>
                <p className="text-sm text-muted mb-5">{plan.sessions}</p>
                <p className="text-[40px] font-black text-black tracking-tight leading-none">
                  {plan.price}{" "}
                  <span className="text-sm font-normal text-muted">
                    {plan.unit}
                  </span>
                </p>
                <div className="h-px bg-grey-100 my-6" />
                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-text"
                    >
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/booking"
                  className={`block text-center mt-6 py-3.5 rounded-[20px] text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    plan.popular
                      ? "bg-accent-cta text-accent-cta-text hover:brightness-95"
                      : "bg-surface text-text hover:bg-grey-100"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
