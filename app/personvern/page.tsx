import type { Metadata } from "next";
import { PersonvernPageClient } from "@/components/website-v2/personvern-page-client";

export const metadata: Metadata = {
  title: "Personvern",
  description:
    "Personvernerklæring for AK Golf Group AS. Vi behandler dataene dine med omhu — klart språk, ingen jusspråk.",
};

export default function PersonvernPage() {
  return <PersonvernPageClient />;
}
