import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Vedlikeholdsmodus middleware
 *
 * For å aktivere: Sett MAINTENANCE_MODE=true i .env.local
 * For å deaktivere: Sett MAINTENANCE_MODE=false eller fjern variabelen
 */

// Stier som IKKE skal redirectes til vedlikehold
const EXCLUDED_PATHS = [
  "/maintenance",
  "/api",
  "/_next",
  "/favicon.ico",
  "/images",
  "/fonts",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sjekk om vedlikeholdsmodus er aktivert
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (!maintenanceMode) {
    return NextResponse.next();
  }

  // Ikke redirect eksluderte stier
  const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
  if (isExcluded) {
    return NextResponse.next();
  }

  // Redirect til vedlikeholdssiden
  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
