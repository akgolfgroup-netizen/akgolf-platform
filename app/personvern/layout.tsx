import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Personvern | AK Golf",
  description:
    "Personvernerklæring for AK Golf Platform. Les hvordan vi behandler dine data.",
  openGraph: {
    title: "Personvern | AK Golf",
    description:
      "Personvernerklæring for AK Golf Platform. Les hvordan vi behandler dine data.",
    type: "website",
    locale: "nb_NO",
    url: "https://akgolf.no/personvern",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personvern | AK Golf",
    description:
      "Personvernerklæring for AK Golf Platform. Les hvordan vi behandler dine data.",
  },
};

export default function PersonvernLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
