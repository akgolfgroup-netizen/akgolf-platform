import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check maintenance mode - only redirect if explicitly set to "true"
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;

  if (maintenanceMode === "true" && pathname !== "/maintenance") {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  // If we're on maintenance page but maintenance mode is off, redirect to home
  if (maintenanceMode !== "true" && pathname === "/maintenance") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
