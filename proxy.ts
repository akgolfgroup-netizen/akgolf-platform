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
  "/maintenance",
  "/api/maintenance",
  "/api/health",
  "/academy",
  "/junior-academy",
  "/utvikling",
  "/booking",
  "/auth",
  "/api/booking",
  "/api/portal/public",
  "/api/portal/webhooks",
  "/_next",
  "/static",
  "/favicon",
  "/icon",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/.well-known",
];

// Beskyttede ruter som krever autentisering
const PROTECTED_ROUTES = ["/portal", "/admin", "/mission-board"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============================================================
  // 1. VEDLIKEHOLDSMODUS SJEKK
  // ============================================================
  if (MAINTENANCE_MODE) {
    const isAlwaysAllowed =
      pathname === "/" ||
      ALWAYS_ALLOWED_PATHS.some(
        (path) => pathname.startsWith(path) || pathname === path
      );

    if (!isAlwaysAllowed) {
      if (
        BYPASS_KEY &&
        request.nextUrl.searchParams.get("bypass") === BYPASS_KEY
      ) {
        const response = NextResponse.next({ request });
        response.cookies.set("maintenance_bypass", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
        return response;
      }

      const hasBypassCookie =
        request.cookies.get("maintenance_bypass")?.value === "true";

      if (!hasBypassCookie) {
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

  // Beskyttede ruter
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Offentlige auth-ruter (login, register, etc)
  const isPublicAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/portal/login") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/portal-preview");

  if (isProtectedRoute && !isPublicAuthRoute && !user) {
    // Admin-ruter redirecter til /admin/login, portal-ruter til /portal/login
    const loginPath = pathname.startsWith("/admin")
      ? "/admin/login"
      : "/portal/login";
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allerede innloggede brukere pa login-sider
  if (pathname === "/portal/login" && user) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (pathname === "/admin/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname === "/auth/login" && user) {
    const redirectTo =
      request.nextUrl.searchParams.get("redirect") || "/portal";
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
