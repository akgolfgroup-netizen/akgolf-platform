import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AK Golf Academy | Personlig golf-coaching",
    template: "%s | AK Golf Academy",
  },
  description:
    "Personlig golf-coaching med TrackMan, videoanalyse og strukturerte treningsplaner. Book coaching med Anders Kristiansen.",
  keywords: [
    "golf coaching",
    "golf trener",
    "TrackMan",
    "golf akademi",
    "Norge",
    "Fredrikstad",
    "Miklagard",
    "golf instruktør",
    "golf undervisning",
    "golfkurs",
  ],
  authors: [{ name: "Anders Kristiansen" }],
  creator: "AK Golf Group",
  publisher: "AK Golf Group",
  metadataBase: new URL("https://akgolf.no"),
  alternates: {
    canonical: "/landing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "AK Golf Academy",
    url: "https://akgolf.no/landing",
    title: "AK Golf Academy | Personlig golf-coaching",
    description:
      "Personlig golf-coaching med TrackMan, videoanalyse og strukturerte treningsplaner.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AK Golf Academy - Premium golfutvikling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@akgolf",
    title: "AK Golf Academy | Personlig golf-coaching",
    description:
      "Personlig golf-coaching med TrackMan, videoanalyse og strukturerte treningsplaner.",
    images: ["/og-image.png"],
  },
  verification: {
    // Google Search Console verification (legg til når du har fått koden)
    // google: "your-google-verification-code",
  },
  category: "sports",
  other: {
    "msapplication-TileColor": "#2d5a27",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
