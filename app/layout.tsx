import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsent } from "@/components/website/CookieConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no";

// Viewport konfigurasjon (separert fra metadata i Next.js 15+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "AK Golf Group | Premium golfutvikling",
    template: "%s | AK Golf Group",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  description:
    "Premium golfutvikling for ambisiøse spillere. Individuell coaching, juniorakademi og teknologiløsninger for golfens fremtid.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "nb-NO": "/",
    },
  },
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
    siteName: "AK Golf Group",
    url: SITE_URL,
    title: "AK Golf Group — Premium golfutvikling",
    description:
      "Individuell coaching, juniorakademi og teknologiløsninger for ambisiøse golfere som krever resultater.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AK Golf Group — Premium golfutvikling",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@akgolf",
    site: "@akgolf",
    title: "AK Golf Group — Premium golfutvikling",
    description:
      "Individuell coaching, juniorakademi og teknologiløsninger for ambisiøse golfere.",
    images: [`${SITE_URL}/og-image.png`],
  },
  verification: {
    // Google Search Console (legg til når du har fått koden)
    // google: "your-verification-code",
  },
  category: "sports",
  classification: "Sports & Recreation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className="h-full">
      <head>
        {/* Preconnect til eksterne domener for ytelse */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for vanlige eksterne ressurser */}
        <link rel="dns-prefetch" href="https://analytics.vercel.com" />
        <link rel="dns-prefetch" href="https://clarity.ms" />
      </head>
      <body className={`${inter.variable} h-full`}>
        {/* Skip-to-content link for tilgjengelighet */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg"
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
