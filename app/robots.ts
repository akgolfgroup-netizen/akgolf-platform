import type { MetadataRoute } from "next";

/**
 * Robots.txt for AK Golf Platform
 * 
 * Styrer hvilke sider søkemotorer kan indeksere.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Portal - krever innlogging
          "/portal/",
          "/spillerportal/",
          
          // Admin
          "/admin/",
          
          // API endepunkter
          "/api/",
          
          // Webhooks
          "/api/portal/webhooks/",
          
          // Cron jobs
          "/api/portal/cron/",
          "/api/cron/",
          
          // Interne sider
          "/merkevare/takk",
          
          // Test-sider
          "/test/",
          
          // Gamle/booking-temp
          "/booking-temp/",
        ],
      },
      {
        // Spesifikk regel for Googlebot
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/portal/",
          "/api/",
          "/admin/",
        ],
      },
      {
        // Blokker crawlers som ikke respekterer rate limits
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
