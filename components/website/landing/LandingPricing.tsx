"use client";

import { SectionLabel } from "@/components/website/SectionLabel";
import { PricingCard } from "@/components/website/PricingCard";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";
import { COACHING_PACKAGES } from "@/lib/website-constants";

const FLEX_CARD = {
  name: "Flex",
  price: "Fra 450 kr",
  description:
    "Enkelttimer uten binding. 20, 50 eller 90 minutter — velg det som passer deg. Inkluderer 30 dagers portaltilgang.",
  features: [
    "Ingen binding eller abonnement",
    "20 / 50 / 90 min sesjoner",
    "TrackMan og videoanalyse",
    "30 dagers portaltilgang",
  ] as const,
  highlighted: false,
};

export function LandingPricing() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-center mb-16">
          <SectionLabel>Priser</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-grey-900)] mt-4">
            <span className="font-light text-[var(--color-muted)]">
              Enkle priser.
            </span>{" "}
            Ingen overraskelser.
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {COACHING_PACKAGES.map((pkg) => (
            <StaggerItem key={pkg.name}>
              <PricingCard
                name={pkg.name}
                price={`${pkg.price} ${pkg.period}`}
                description={pkg.tagline}
                features={pkg.features}
                highlighted={pkg.highlighted}
              />
            </StaggerItem>
          ))}
          <StaggerItem>
            <PricingCard
              name={FLEX_CARD.name}
              price={FLEX_CARD.price}
              description={FLEX_CARD.description}
              features={FLEX_CARD.features}
              highlighted={false}
            />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
