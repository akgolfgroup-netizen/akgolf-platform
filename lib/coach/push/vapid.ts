import webpush from "web-push";
import { logger } from "@/lib/logger";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
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
    logger.error("Failed to configure VAPID", error);
    return false;
  }
}

export { webpush, VAPID_PUBLIC_KEY, ensureVapidConfigured };
