import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Vedlikeholdsmodus
 *
 * Sett MAINTENANCE_MODE=true for å aktivere.
 * Fjern eller sett til false for å deaktivere.
 */
const MAINTENANCE_MODE = true;

// Stier som alltid skal være tilgjengelige
const ALLOWED_PATHS = [
  "/maintenance",
  "/api/", // API-er for interne formål
  "/_next/", // Next.js assets
  "/favicon.ico",
  "/images/", // Bilder
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sjekk om vedlikeholdsmodus er aktiv
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  // Tillat visse stier
  if (ALLOWED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Redirect til vedlikeholdsside
  const maintenanceUrl = new URL("/maintenance", request.url);
  return NextResponse.rewrite(maintenanceUrl);
}

export const config = {
  matcher: [
    /*
     * Match alle stier unntatt:
     * - _next/static (statiske filer)
     * - _next/image (bilde-optimalisering)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
