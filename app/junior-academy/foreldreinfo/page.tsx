import type { Metadata } from "next";
import { ParentInfoPageClient } from "@/components/website-v2/parent-info-page-client";

export const metadata: Metadata = {
  title: "Foreldreinfo — Junior Academy",
  description:
    "Praktisk informasjon for foreldre med junior i AK Golf Junior Academy. Hva forventes, hvordan følge med på fremgang, og kommunikasjonskanaler.",
};

export default function ForeldreInfoPage() {
  return <ParentInfoPageClient />;
}
