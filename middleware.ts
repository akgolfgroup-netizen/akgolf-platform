import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ============================================================
// VEDLIKEHOLDSMODUS KONFIGURASJON
// ============================================================
// Sett MAINTENANCE_MODE=true i .env for å aktivere vedlikeholdsmodus
// Bruk ?bypass=SECRET_KEY for å omgå vedlikeholdsmodus
// ============================================================

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";
const BYPASS_KEY = process.env.MAINTENANCE_BYPASS_KEY;

// Ruter som ALLTID er tilgjengelige (selv i vedlikeholdsmodus)
const ALWAYS_ALLOWED_PATHS = [
  "/maintenance",           // Vedlikeholdssiden selv
  "/api/maintenance",       // API for vedlikeholdsstatus
  "/api/health",            // Health checks
  "/_next",                 // Next.js assets
  "/static",                // Statiske filer
  "/favicon",               // Favicon
  "/icon",                  // Ikoner
  "/robots.txt",            // SEO
  "/sitemap.xml",           // SEO
  "/manifest.json",         // PWA
  "/.well-known",           // Standard well-known paths
];

// Ruter som er OFFENTLIGE (tilgjengelige uten innlogging)
const PUBLIC_PATHS = [
  "/",                      // Forsiden
  "/academy",               // Academy landing
  "/academy/booking",       // Booking
  "/spillerportal",         // Spillerportal info
  "/personvern",            // Personvern
  "/cookies",               // Cookie-policy
  "/vilkaar",               // Vilkår
  "/kontakt",               // Kontakt
  "/om-oss",                // Om oss
  "/tjenester",             // Tjenester
  "/priser",                // Priser
  "/blogg",                 // Blogg
  "/auth",                  // Auth routes (login, callback, etc)
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============================================================
  // 1. VEDLIKEHOLDSMODUS SJEKK
  // ============================================================
  if (MAINTENANCE_MODE) {
    // Sjekk om path er alltid tillatt
    const isAlwaysAllowed = ALWAYS_ALLOWED_PATHS.some(path => 
      pathname.startsWith(path) || pathname === path
    );

    if (isAlwaysAllowed) {
      // Fortsett til normal flyt
    } else {
      // Sjekk bypass key i query param
      if (BYPASS_KEY && request.nextUrl.searchParams.get("bypass") === BYPASS_KEY) {
        const response = NextResponse.next({ request });
        response.cookies.set("maintenance_bypass", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 timer
          path: "/",
        });
        return response;
      }

      // Sjekk bypass cookie
      const hasBypassCookie = request.cookies.get("maintenance_bypass")?.value === "true";
      
      if (!hasBypassCookie) {
        // Rewrite til vedlikeholdssiden
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    }
  }

  // ============================================================
  // 2. AUTENTISERING OG AUTORISASJON
  // ============================================================
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session - must be called before getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Beskyttede ruter som krever autentisering
  const protectedRoutes = ["/portal", "/admin", "/mission-board"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Sjekk om det er en offentlig auth route (login, register, etc)
  const isPublicAuthRoute = pathname.startsWith("/auth") || 
    pathname.startsWith("/portal/login") ||
    pathname.startsWith("/portal-preview");

  if (isProtectedRoute && !isPublicAuthRoute && !user) {
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allerede innloggede brukere på login-sider → redirect til portal
  if (pathname === "/portal/login" && user) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (pathname === "/auth/login" && user) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/portal";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
