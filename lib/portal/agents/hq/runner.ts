/**
 * HQ Agent Runner — AK Golf HQ
 * Kjorer HQ AI-agenter og samler resultater.
 * Sprint 0: Kun stub. Implementeres i Sprint 1.
 */

import type { AgentId, AgentResult } from "./types";

/**
 * Kjor en spesifikk HQ-agent for en spiller.
 * @stub Returnerer tomt resultat i Sprint 0.
 */
export async function runHqAgent(
  _agentId: AgentId,
  _playerId: string
): Promise<AgentResult> {
  return {
    agentId: _agentId,
    playerId: _playerId,
    actions: [],
    durationMs: 0,
  };
}

/**
 * Kjor alle aktiverte HQ-agenter for en spiller.
 * @stub Returnerer tom liste i Sprint 0.
 */
export async function evaluateHqAgents(
  _playerId: string
): Promise<AgentResult[]> {
  return [];
}
