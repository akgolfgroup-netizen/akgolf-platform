/**
 * JSON-LD Structured Data Helpers
 * 
 * Brukes for å generere Schema.org markup for bedre SEO.
 * @see https://schema.org/
 */

import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no";

// ============================================================================
// Organization & Local Business
// ============================================================================

export const organizationSchema = {
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
    "Premium golfutvikling for ambisiøse spillere. Individuell coaching, juniorakademi og teknologiløsninger for golfens fremtid.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "post@akgolf.no",
    contactType: "customer service",
    availableLanguage: "Norwegian",
    areaServed: "NO",
  },
  sameAs: [
    // Add social media URLs when available
    // "https://www.instagram.com/akgolf",
    // "https://www.facebook.com/akgolf",
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "AK Golf Academy",
  url: SITE_URL,
  description:
    "Premium golfcoaching og talentutvikling ved Gamle Fredrikstad Golfklubb.",
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
};

// ============================================================================
// Course (Coaching Packages)
// ============================================================================

export interface CourseSchemaProps {
  name: string;
  description: string;
  duration?: string;
  price?: string;
  url?: string;
}

export function generateCourseSchema({
  name,
  description,
  duration,
  price,
  url,
}: CourseSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "AK Golf Academy",
      sameAs: SITE_URL,
    },
    ...(duration && { timeRequired: duration }),
    ...(url && { url: `${SITE_URL}${url}` }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "NOK",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

// ============================================================================
// Service (Coaching Services)
// ============================================================================

export interface ServiceSchemaProps {
  name: string;
  description: string;
  price?: string;
  duration?: string;
  url?: string;
}

export function generateServiceSchema({
  name,
  description,
  price,
  duration,
  url,
}: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "AK Golf Academy",
      url: SITE_URL,
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "NOK",
      },
    }),
    ...(duration && { duration }),
    ...(url && { url: `${SITE_URL}${url}` }),
    areaServed: {
      "@type": "Country",
      name: "Norway",
    },
  };
}

// ============================================================================
// BreadcrumbList
// ============================================================================

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// ============================================================================
// WebSite (Search)
// ============================================================================

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "AK Golf Group",
  url: SITE_URL,
  description:
    "Premium golfutvikling for ambisiøse spillere. Individuell coaching, juniorakademi og teknologiløsninger.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/sok?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ============================================================================
// FAQ Page
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// Person (Coach)
// ============================================================================

export interface PersonSchemaProps {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function generatePersonSchema({
  name,
  jobTitle,
  description,
  image,
  url,
}: PersonSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(jobTitle && { jobTitle }),
    ...(description && { description }),
    ...(image && { image: `${SITE_URL}${image}` }),
    ...(url && { url: `${SITE_URL}${url}` }),
    worksFor: {
      "@type": "Organization",
      name: "AK Golf Group",
      url: SITE_URL,
    },
  };
}

// ============================================================================
// Helper function to inject JSON-LD into page
// ============================================================================

export function injectJsonLd(schema: unknown) {
  return {
    __html: JSON.stringify(schema),
  };
}

// ============================================================================
// Common metadata helpers
// ============================================================================

export function generateMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/og-image.png",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    keywords: [
      "golf coaching",
      "golf trener",
      "TrackMan",
      "golf akademi",
      "Norge",
      ...keywords,
    ],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      siteName: "AK Golf Group",
      url,
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}
