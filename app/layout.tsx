import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsent } from "@/components/website/CookieConsent";
import "./globals.css";

// Heritage Grid — DM Sans er hovedfont for hele appen
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Inter beholdes for bakoverkompatibilitet under migrering (fjernes i Steg 7)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "AK Golf Group | Premium golfutvikling",
    template: "%s | AK Golf Group",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  description:
    "Premium golfutvikling for ambisiøse spillere. Individuell coaching, juniorakademi og teknologiløsninger for golfens fremtid.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "golf",
    "golf coaching",
    "golf trener",
    "golf akademi",
    "TrackMan",
    "golf utvikling",
    "Norge",
    "Fredrikstad",
    "Miklagard",
    "golf instruksjon",
    "golf undervisning",
    "golfkurs",
    "junior golf",
    "golf trening",
  ],
  authors: [{ name: "Anders Kristiansen", url: "https://akgolf.no" }],
  creator: "AK Golf Group AS",
  publisher: "AK Golf Group AS",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "AK Golf Group",
    url: SITE_URL,
    title: "AK Golf Group — Premium golfutvikling",
    description:
      "Individuell coaching, juniorakademi og teknologiløsninger for ambisiøse golfere som krever resultater.",
    images: [`${SITE_URL}/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "AK Golf Group — Premium golfutvikling",
    description:
      "Individuell coaching, juniorakademi og teknologiløsninger for ambisiøse golfere.",
    images: [`${SITE_URL}/og-image.png`],
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className="h-full">
      <head>
        {/* Material Symbols Outlined — ikoner */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}>
        {/* Skip-to-content link for tilgjengelighet */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-on-surface focus:text-surface focus:rounded-lg"
        >
          Gå til hovedinnhold
        </a>

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "AK Golf Group",
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/favicon.svg`,
              },
              description:
                "Premium golfutvikling for ambisiøse spillere. Individuell coaching, juniorakademi og teknologiløsninger.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "post@akgolf.no",
                contactType: "customer service",
                availableLanguage: "Norwegian",
                areaServed: "NO",
              },
              sameAs: [
                // Legg til sosiale medier når tilgjengelig
                // "https://www.instagram.com/akgolf",
                // "https://www.facebook.com/akgolf",
                // "https://www.linkedin.com/company/ak-golf-group",
              ],
            }),
          }}
        />

        {/* JSON-LD: LocalBusiness / SportsActivityLocation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              "@id": `${SITE_URL}/#golfacademy`,
              name: "AK Golf Academy",
              url: `${SITE_URL}/landing`,
              description:
                "Premium golfcoaching og talentutvikling ved Gamle Fredrikstad Golfklubb og Miklagard Golfklubb.",
              sport: "Golf",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kongleveien 142",
                addressLocality: "Fredrikstad",
                addressRegion: "Viken",
                postalCode: "1615",
                addressCountry: "NO",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 59.2759,
                longitude: 10.9296,
              },
              telephone: "+47-xxx-xx-xxx",
              email: "post@akgolf.no",
              priceRange: "$$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday", "Sunday"],
                  opens: "10:00",
                  closes: "16:00",
                },
              ],
              image: `${SITE_URL}/og-image.png`,
              isPartOf: {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
              },
            }),
          }}
        />

        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "AK Golf Group",
              url: SITE_URL,
              description:
                "Premium golfutvikling for ambisiøse spillere.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/sok?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {children}

        <CookieConsent />
        <Analytics />
        <SpeedInsights />

        {/* Microsoft Clarity - heatmaps og session recordings */}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];if(y&&y.parentNode)y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
