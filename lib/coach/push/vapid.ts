import webpush from "web-push";
import { logger } from "@/lib/logger";

// VAPID keys must be URL-safe Base64 without "=" padding
const VAPID_PUBLIC_KEY = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "").replace(/=+$/, "");
const VAPID_PRIVATE_KEY = (process.env.VAPID_PRIVATE_KEY || "").replace(/=+$/, "");
const VAPID_CONTACT = process.env.VAPID_CONTACT_EMAIL || "mailto:post@akgolf.no";

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return true;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    logger.warn("VAPID keys not configured - push notifications disabled");
    return false;
  }
  try {
    webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    vapidConfigured = true;
    return true;
  } catch (error) {
    logger.error("[webpush] VAPID config failed", error);
    return false;
  }
}

export { webpush, VAPID_PUBLIC_KEY, ensureVapidConfigured };
