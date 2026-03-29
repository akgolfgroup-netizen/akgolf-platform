/**
 * CSRF protection via Origin/Referer header validation.
 *
 * This is a simple but effective approach for modern browsers that
 * automatically send Origin headers with cross-origin requests.
 */

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "https://akgolf.no",
  "https://www.akgolf.no",
  "http://localhost:3000",
].filter(Boolean) as string[];

/**
 * Verify that the request originates from an allowed origin.
 *
 * Checks both Origin and Referer headers for compatibility.
 *
 * @param request - The incoming request
 * @returns true if the request is from an allowed origin
 */
export function verifyCsrf(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Check Origin header (preferred)
  if (origin && ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed))) {
    return true;
  }

  // Fallback to Referer header
  if (
    referer &&
    ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed))
  ) {
    return true;
  }

  // Reject if neither header matches
  return false;
}
