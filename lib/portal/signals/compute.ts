/**
 * Signal Computation — AK Golf HQ
 * Beregner aktive signaler for en spiller eller alle spillere.
 * Sprint 0: Kun stub. Implementeres i Sprint 1.
 */

import type { Signal, SignalFilter } from "./registry";

/**
 * Beregn alle aktive signaler for en enkelt spiller.
 * @stub Returnerer tom liste i Sprint 0.
 */
export async function computeSignalsForPlayer(
  _playerId: string
): Promise<Signal[]> {
  // TODO: Sprint 1 — implementer signal-beregning
  return [];
}

/**
 * Beregn signaler for alle spillere (coach-visning).
 * @stub Returnerer tom liste i Sprint 0.
 */
export async function computeAllSignals(
  _filter?: SignalFilter
): Promise<Signal[]> {
  // TODO: Sprint 1 — implementer signal-beregning
  return [];
}
