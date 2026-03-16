/**
 * Cancellation policy for AK Golf bookings:
 * - >24h before: full refund (FREE)
 * - 2-24h before: 50% fee
 * - <2h before: no refund (100% fee)
 */

export interface CancellationResult {
  allowed: boolean;
  refundPercent: number; // 0-100
  feePercent: number; // 0-100
  reason: string;
}

export function evaluateCancellationPolicy(
  startTime: Date,
  now: Date = new Date()
): CancellationResult {
  const hoursUntilStart =
    (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Already started or in the past
  if (hoursUntilStart <= 0) {
    return {
      allowed: false,
      refundPercent: 0,
      feePercent: 100,
      reason: "Kan ikke avbestille en økt som allerede har startet.",
    };
  }

  // Less than 2 hours: no refund
  if (hoursUntilStart < 2) {
    return {
      allowed: true,
      refundPercent: 0,
      feePercent: 100,
      reason:
        "Avbestilling under 2 timer før start — ingen refusjon.",
    };
  }

  // 2-24 hours: 50% refund
  if (hoursUntilStart < 24) {
    return {
      allowed: true,
      refundPercent: 50,
      feePercent: 50,
      reason:
        "Avbestilling under 24 timer før start — 50% gebyr.",
    };
  }

  // More than 24 hours: full refund
  return {
    allowed: true,
    refundPercent: 100,
    feePercent: 0,
    reason: "Gratis avbestilling (mer enn 24 timer før start).",
  };
}
