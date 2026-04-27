import type { Metadata } from "next";
import { JUNIOR_FAQ_V3 } from "@/lib/website-constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Junior Academy",
  description:
    "Lekent, strukturert juniorgolf for 6–17 år. Tre aldersgrupper, sommerleir og talentstige — med foreldreapp som viser fremgang uke for uke.",
  openGraph: {
    title: "Junior Academy — Lekent, strukturert, og stolt foreldreapp",
    description:
      "Tre aldersgrupper (6–17 år), egne juniortrenere, sommerleir og talentstige. Foreldreapp inkludert.",
    url: "https://akgolf.no/junior-academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Junior Academy — Lekent, strukturert, og stolt foreldreapp",
    description:
      "Tre aldersgrupper for 6–17 år, sommerleir, talentstige og foreldreapp.",
  },
};

export default function JuniorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: JUNIOR_FAQ_V3.items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
