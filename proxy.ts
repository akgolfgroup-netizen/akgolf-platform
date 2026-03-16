import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
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
    "/treningsplan/dashboard/:path*",
    "/auth/:path*",
    "/portal/:path*",
  ],
};
