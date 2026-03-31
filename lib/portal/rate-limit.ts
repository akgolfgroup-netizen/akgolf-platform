interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key (e.g., IP address or user ID).
 * Uses in-memory token bucket algorithm.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  let entry = rateLimitStore.get(key);

  // Reset if window has expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const allowed = entry.count <= config.limit;
  const remaining = Math.max(0, config.limit - entry.count);

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client IP from request headers.
 * Handles Vercel/Cloudflare proxy headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return "127.0.0.1";
}

// Pre-configured rate limits
export const RATE_LIMITS = {
  /** Booking creation: 10 per minute per IP */
  BOOKING_CREATE: { limit: 10, windowSeconds: 60 },
  /** Slot queries: 30 per minute per IP */
  BOOKING_SLOTS: { limit: 30, windowSeconds: 60 },
  /** General API: 100 per minute per IP */
  API_GENERAL: { limit: 100, windowSeconds: 60 },
  /** Contact form: 5 per minute per IP */
  CONTACT_FORM: { limit: 5, windowSeconds: 60 },
  /** AI endpoints: 20 per minute per user (expensive operations) */
  AI_ENDPOINTS: { limit: 20, windowSeconds: 60 },
  /** Subscription management: 10 per minute per IP */
  SUBSCRIPTIONS: { limit: 10, windowSeconds: 60 },
  /** Coaching booking: 10 per minute per IP */
  COACHING_BOOK: { limit: 10, windowSeconds: 60 },
} as const;
