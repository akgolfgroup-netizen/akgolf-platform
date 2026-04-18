import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utvikling | AK Golf",
  description:
    "Golfutvikling og performance coaching for ambisiøse spillere. Data-drevet trening med AK Golf.",
  openGraph: {
    title: "Utvikling | AK Golf",
    description:
      "Golfutvikling og performance coaching for ambisiøse spillere. Data-drevet trening med AK Golf.",
    type: "website",
    locale: "nb_NO",
    url: "https://akgolf.no/utvikling",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utvikling | AK Golf",
    description:
      "Golfutvikling og performance coaching for ambisiøse spillere. Data-drevet trening med AK Golf.",
  },
};

export default function UtviklingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
