import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Priser",
  description: "Klare priser, ingen overraskelser. Performance, Flex og On-Course. Alle priser inkluderer mva.",
};

export default function LandingPricingPage() {
  redirect("/academy/abonnement");
}
