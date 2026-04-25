import crypto from "node:crypto";

/**
 * Deterministisk idempotency key — samme input gir alltid samme key.
 * Stripe deduperer på key innen 24t-vinduet, så ved webhook-retries
 * eller paralleltkall returnerer Stripe samme refund i stedet for å
 * lage en ny.
 */
export function buildRefundIdempotencyKey(
  bookingId: string,
  amount: number,
): string {
  const hash = crypto
    .createHash("sha256")
    .update(`${bookingId}:${amount}`)
    .digest("hex")
    .slice(0, 32);
  return `refund-${hash}`;
}
