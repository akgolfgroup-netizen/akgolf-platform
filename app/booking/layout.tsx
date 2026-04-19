import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking | AK Golf",
  description:
    "Book din neste coaching-time hos AK Golf. Velg mellom ulike pakker og tjenester tilpasset ditt nivå.",
  openGraph: {
    title: "Booking | AK Golf",
    description:
      "Book din neste coaching-time hos AK Golf. Velg mellom ulike pakker og tjenester tilpasset ditt nivå.",
    type: "website",
    locale: "nb_NO",
    url: "https://akgolf.no/booking",
  },
  twitter: {
    card: "summary_large_image",
    title: "Booking | AK Golf",
    description:
      "Book din neste coaching-time hos AK Golf. Velg mellom ulike pakker og tjenester tilpasset ditt nivå.",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
