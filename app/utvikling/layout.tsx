import type { Metadata } from "next";

const description =
  "Utviklingsmodellen V3: 4 pillarer (teknikk, fysisk, mental, strategi), Trackman + TPI + klinisk psykolog, Strokes-Gained innebygd. Bygd på 14 års coaching og 280+ spillere.";

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
