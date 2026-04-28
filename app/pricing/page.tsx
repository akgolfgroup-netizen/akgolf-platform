import type { Metadata } from "next";
import { PricingPageClient } from "@/components/website-v2/pricing-page-client";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Treningsabonnement, Flex-økter og banecoaching. Klare priser, ingen overraskelser. Performance fra 1 000 kr/mnd.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
