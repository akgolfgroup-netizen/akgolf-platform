import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Vedlikeholdsmodus - les fra env, default til false (LIVE)
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
const BYPASS_KEY = process.env.MAINTENANCE_BYPASS_KEY;

export async function proxy(request: NextRequest) {
  // ─── Maintenance Mode ───
  if (MAINTENANCE_MODE) {
    const pathname = request.nextUrl.pathname;

    // Bypass med secret key
    if (BYPASS_KEY && request.nextUrl.searchParams.get("bypass") === BYPASS_KEY) {
      const response = NextResponse.next({ request });
      response.cookies.set("maintenance_bypass", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    // Sjekk bypass-cookie
    if (request.cookies.get("maintenance_bypass")?.value === "true") {
      // Continue to normal flow
    } else if (
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/favicon") &&
      !pathname.startsWith("/icon") &&
      !pathname.startsWith("/portal") &&
      !pathname.startsWith("/auth") &&
      pathname !== "/maintenance"
    ) {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
  }

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

  // Refresh the session — must be called before getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Website training plan dashboard requires authentication
  if (request.nextUrl.pathname.startsWith("/treningsplan/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Portal requires authentication (except login page)
  if (
    request.nextUrl.pathname.startsWith("/portal") &&
    !request.nextUrl.pathname.startsWith("/portal/login")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  // Coach Hub requires authentication (instructor/admin only)
  if (request.nextUrl.pathname.startsWith("/coach")) {
    if (!user) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  // Already logged-in users on login pages → redirect
  if (request.nextUrl.pathname === "/auth/login" && user) {
    return NextResponse.redirect(
      new URL("/treningsplan/dashboard", request.url)
    );
  }
  if (request.nextUrl.pathname === "/portal/login" && user) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
