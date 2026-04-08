import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Sjekk om vedlikeholdsmodus er aktivert
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  
  // Hent path fra request
  const { pathname } = request.nextUrl;
  
  // Hvis vedlikeholdsmodus er aktivert og brukeren ikke allerede er på maintenance-siden
  if (isMaintenanceMode && pathname !== "/maintenance") {
    // Unntak for API-ruter og statiske filer
    if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/static")) {
      return NextResponse.next();
    }
    
    // Omdiriger til maintenance-siden
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }
  
  // Hvis vedlikeholdsmodus er av og brukeren er på maintenance-siden, send til forsiden
  if (!isMaintenanceMode && pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
