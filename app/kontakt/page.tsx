import type { Metadata } from "next";
import { ContactPageClient } from "@/components/website-v2/contact-page-client";

export const metadata: Metadata = {
  title: "Kontakt AK Golf Group",
  description:
    "Send oss en melding eller ring direkte. Vi tar kontakt så snart vi kan.",
};

export default function KontaktPage() {
  return <ContactPageClient />;
}
