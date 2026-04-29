import type { Metadata } from "next";

const description =
  "Utviklingsmodellen til AK Golf — fire pillarer (teknikk, fysisk, mental, strategi) og Strokes Gained-innsikt for varig framgang.";

export const metadata: Metadata = {
  title: "Utviklingsmodellen | AK Golf Akademi",
  description,
  openGraph: {
    title: "Utviklingsmodellen | AK Golf Akademi",
    description,
    type: "website",
    locale: "nb_NO",
    url: "https://akgolf.no/utvikling",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utviklingsmodellen | AK Golf Akademi",
    description,
  },
};

export default function UtviklingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
