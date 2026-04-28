import type { Metadata } from "next";
import { AbonnementPageClient } from "@/components/website-v2/academy/abonnement-page-client";

export const metadata: Metadata = {
  title: "Academy-medlemskap",
  description:
    "Tre veier inn i AK Golf Academy. Performance med Markus fra 1 000 kr/mnd, Performance med Anders fra 1 200 kr/mnd, Performance Pro fra 2 200 kr/mnd. PlayerHQ, TrackMan og treningsplan inkludert.",
};

export default function AcademyAbonnementPage() {
  return <AbonnementPageClient />;
}
