"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";

import { COACHING_PACKAGES, FLEX_PACKAGES } from "@/lib/website-constants";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";

export function AcademyPricesV2() {
  return (
    <section id="priser" className="w-section bg-surface-container-lowest">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <SectionLabel>Pakker og priser</SectionLabel>
            <h2 className="w-heading-lg mt-4 mb-6">
              Finn pakken som passer deg
            </h2>
            <p className="text-text leading-relaxed">
              Alle abonnementer er uten bindingstid og kan avsluttes når som helst.
            </p>
          </div>
        </RevealOnScroll>

        {/* Abonnementer */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          {COACHING_PACKAGES.map((pkg) => (
            <StaggerItem key={`${pkg.name}-${pkg.coach}`}>
              <div
                className={`relative rounded-2xl p-8 flex flex-col gap-6 border h-full ${
                  pkg.highlighted
                    ? "bg-primary border-primary shadow-xl"
                    : "bg-surface-container-lowest border-outline-variant/30 shadow-card"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-secondary-fixed text-secondary-fixed-text text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.08em] mb-1 ${
                      pkg.highlighted ? "text-surface/50" : "text-on-surface-variant/60"
                    }`}
                  >
                    {pkg.coach}
                  </p>
                  <h3
                    className={`text-xl font-bold mb-1 ${
                      pkg.highlighted ? "text-surface" : "text-on-surface"
                    }`}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      pkg.highlighted ? "text-surface/65" : "text-text"
                    }`}
                  >
                    {pkg.tagline}
                  </p>
                </div>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      pkg.highlighted ? "text-surface" : "text-on-surface"
                    }`}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className={`text-sm mb-1 ${
                      pkg.highlighted ? "text-surface/65" : "text-text"
                    }`}
                  >
                    {pkg.period}
                  </span>
                </div>
                <ul className="space-y-3 flex-grow">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Icon name="check"
                        size={16}
                        className={`mt-0.5 shrink-0 ${
                          pkg.highlighted
                            ? "text-secondary-fixed"
                            : "text-success"
                        }`} />
                      <span
                        className={`text-sm ${
                          pkg.highlighted ? "text-surface/80" : "text-text"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Book nå-knapp */}
                <Link
                  href="/academy/booking"
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] text-sm font-semibold transition-all ${
                    pkg.highlighted
                      ? "bg-surface-container-lowest text-on-surface hover:bg-surface-container-lowest/90"
                      : "bg-on-surface text-surface hover:bg-on-surface/90"
                  }`}
                >
                  Book nå
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Flex */}
        <RevealOnScroll delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-outline-variant/30 bg-surface p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-on-surface mb-1">
                  {FLEX_PACKAGES[0].name}
                </h3>
                <p className="text-sm text-text mb-4">
                  {FLEX_PACKAGES[0].tagline}
                </p>
                <ul className="space-y-2">
                  {FLEX_PACKAGES[0].includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Icon name="check"
                        size={15}
                        className="mt-0.5 shrink-0 text-success" />
                      <span className="text-sm text-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-3xl font-bold text-on-surface">
                    {FLEX_PACKAGES[0].price}
                  </div>
                  <div className="text-sm text-text">
                    {FLEX_PACKAGES[0].period} &middot; {FLEX_PACKAGES[0].duration}
                  </div>
                </div>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 border border-outline-variant/30 text-text font-bold px-6 py-3 rounded-[20px] hover:bg-surface transition-all duration-200 text-sm"
                >
                  Book Flex-sesjon
                  <Icon name="arrow_forward" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <p className="text-center text-xs text-on-surface-variant/60 mt-8">
          Alle priser er inkludert. Ingen bindingstid på abonnementer.
        </p>
      </div>
    </section>
  );
}
