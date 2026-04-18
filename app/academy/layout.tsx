import type { Metadata } from "next";
import { ACADEMY_FAQ } from "@/lib/website-constants";

export const metadata: Metadata = {
  title: "Academy | AK Golf",
  description:
    "Bli en bedre golfer med AK Golf Academy. Personlig coaching, TrackMan-analyse og strukturerte treningsprogrammer for alle nivåer.",
  openGraph: {
    title: "Academy | AK Golf",
    description:
      "Bli en bedre golfer med AK Golf Academy. Personlig coaching, TrackMan-analyse og strukturerte treningsprogrammer for alle nivåer.",
    type: "website",
    locale: "nb_NO",
    url: "https://akgolf.no/academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy | AK Golf",
    description:
      "Bli en bedre golfer med AK Golf Academy. Personlig coaching, TrackMan-analyse og strukturerte treningsprogrammer for alle nivåer.",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ACADEMY_FAQ.map((faq) => ({
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
