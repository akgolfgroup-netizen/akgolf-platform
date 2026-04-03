import { logger } from "@/lib/logger";

/**
 * Verifiserer at cron-forespørselen kommer fra Vercel.
 * Returnerer true hvis autorisert, false ellers.
 */
export function verifyCronAuth(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    logger.error("[cron-auth] CRON_SECRET er ikke satt i miljøvariabler");
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}
