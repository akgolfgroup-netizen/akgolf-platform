import type { Metadata } from "next";
import { JUNIOR_FAQ_V3 } from "@/lib/website-constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Junior Academy",
  description:
    "Lekent, strukturert juniorgolf for 6–17 år. Tre aldersgrupper med egne juniortrenere.",
  openGraph: {
    title: "Junior Academy — Lekent og strukturert juniorgolf",
    description:
      "Tre aldersgrupper for 6–17 år med egne juniortrenere.",
    url: "https://akgolf.no/junior-academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Junior Academy — Lekent og strukturert juniorgolf",
    description:
      "Tre aldersgrupper for 6–17 år med egne juniortrenere.",
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

  const hasFaq = JUNIOR_FAQ_V3.items.length > 0;

  return (
    <>
      {hasFaq ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      {children}
    </>
  );
}
