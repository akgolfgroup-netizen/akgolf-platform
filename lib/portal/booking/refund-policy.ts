/**
 * Refunderingspolicy for avbestilte bookinger.
 *
 * Standardvalg #1 (Anders' fullmakt):
 *  - Mer enn 24 timer før start: full refund (100%)
 *  - 8-24 timer før start: 50% refund
 *  - Mindre enn 8 timer før start (eller etter): 0% refund
 *
 * TODO: Bekreft med Anders. Kan justeres per pakketype senere.
 */

export interface RefundDecision {
  refundPct: number;
  refundAmountKr: number;
  reason: string;
  windowLabel: string;
}

const FULL_REFUND_HOURS = 24;
const PARTIAL_REFUND_HOURS = 8;
const PARTIAL_REFUND_PCT = 50;

export function calculateRefund(params: {
  startTime: Date;
  cancelledAt: Date;
  paidAmountKr: number;
}): RefundDecision {
  const { startTime, cancelledAt, paidAmountKr } = params;
  const hoursUntilStart = (startTime.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60);

  if (hoursUntilStart >= FULL_REFUND_HOURS) {
    return {
      refundPct: 100,
      refundAmountKr: paidAmountKr,
      reason: `Avbestilt mer enn ${FULL_REFUND_HOURS} timer før start`,
      windowLabel: "Full refundering",
    };
  }

  if (hoursUntilStart >= PARTIAL_REFUND_HOURS) {
    return {
      refundPct: PARTIAL_REFUND_PCT,
      refundAmountKr: Math.round(paidAmountKr * PARTIAL_REFUND_PCT / 100),
      reason: `Avbestilt mellom ${PARTIAL_REFUND_HOURS}-${FULL_REFUND_HOURS} timer før start`,
      windowLabel: `${PARTIAL_REFUND_PCT}% refundering`,
    };
  }

  return {
    refundPct: 0,
    refundAmountKr: 0,
    reason:
      hoursUntilStart < 0
        ? "Avbestilt etter at økten skulle starte"
        : `Avbestilt mindre enn ${PARTIAL_REFUND_HOURS} timer før start`,
    windowLabel: "Ingen refundering",
  };
}
