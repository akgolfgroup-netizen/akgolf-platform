import type { MetadataRoute } from "next";

/**
 * Sitemap for AK Golf Platform
 * 
 * Genererer automatisk sitemap for alle offentlige sider.
 * Viktig for SEO og søkemotor-indeksering.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no";

// Statiske sider med prioritering
const staticPages = [
  // Hovedsider (høyest prioritet)
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/booking", priority: 0.9, changeFrequency: "weekly" as const },
  
  // Landing pages
  { path: "/landing", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/landing/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/landing/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/landing/contact", priority: 0.8, changeFrequency: "monthly" as const },
  
  // Andre offentlige sider
  { path: "/academy", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/junior-academy", priority: 0.8, changeFrequency: "monthly" as const },
  
  // Booking-kategorier
  { path: "/booking/kategori/coaching", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/booking/kategori/junior", priority: 0.7, changeFrequency: "weekly" as const },
  
  // Juridisk
  { path: "/personvern", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/vilkar", priority: 0.3, changeFrequency: "yearly" as const },
  
  // Portal (kun offentlige sider)
  { path: "/portal/login", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
