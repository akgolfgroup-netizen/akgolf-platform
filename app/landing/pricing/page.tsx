import type { Metadata } from "next";
import { LandingPricingPageClient } from "@/components/website-v2/landing-pricing/landing-pricing-page-client";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Klare priser, ingen overraskelser. Foundation, Performance, Tour og Junior — pluss Flex-økter og banecoaching. Alle priser inkluderer mva.",
};

export default function LandingPricingPage() {
  return <LandingPricingPageClient />;
}
