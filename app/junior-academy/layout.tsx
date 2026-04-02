import type { Metadata } from "next";
import { JUNIOR_FAQ } from "@/lib/website-constants";

export const metadata: Metadata = {
  title: "Junior Academy",
  description:
    "Strukturert talentutvikling for unge golfere. Aldersinndelte programmer fra grunnlag til pre-elite med individuell oppfølging.",
  openGraph: {
    title: "Junior Academy — Talentutvikling for unge golfere",
    description:
      "Aldersinndelte programmer (13–19 år) med individuell oppfølging, konkurranse og college-forberedelse.",
    url: "https://akgolf.no/junior",
  },
  twitter: {
    card: "summary_large_image",
    title: "Junior Academy — Talentutvikling for unge golfere",
    description:
      "Aldersinndelte programmer (13–19 år) med individuell oppfølging og konkurranse.",
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
    mainEntity: JUNIOR_FAQ.map((faq) => ({
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
