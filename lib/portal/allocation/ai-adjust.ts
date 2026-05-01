// VERIFY: AI-justering av regelmotor-output — kun med Tier 2-samtykke
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md Fase 10

import { hasConsent } from "@/lib/portal/consent/service";
import { prisma } from "@/lib/portal/prisma";
import type { AreaAllocation } from "./formulas";

export interface AiAdjustInput {
  userId: string;
  baseAllocation: AreaAllocation;
  playerNotes?: string;
  coachNotes?: string;
  recentRounds?: Array<{ date: string; score: number; differential: number }>;
}

export interface AiAdjustOutput {
  adjusted: AreaAllocation;
  rationale: string;
  confidence: number;
}

/** AI-justering av allokering — kun hvis Tier 2-samtykke */
export async function aiAdjustAllocation(
  input: AiAdjustInput,
): Promise<AiAdjustOutput | null> {
  // 1. Sjekk samtykke
  const consent = await hasConsent(input.userId, "TIER_2_IMPROVEMENT");
  if (!consent) {
    return null;
  }

  // 2. Forenklet logikk (placeholder for Claude-integrasjon)
  // I produksjon: kall Claude med rules-output + fri-tekst-mal
  const base = { ...input.baseAllocation };
  const rationale: string[] = [];

  // Justér basert på nylige runder
  if (input.recentRounds && input.recentRounds.length >= 3) {
    const avgDiff = input.recentRounds.reduce((s, r) => s + r.differential, 0) / input.recentRounds.length;
    if (avgDiff > 5) {
      // Høye differentials -> mer teknikk
      base.teknikk = Math.min(50, base.teknikk + 5);
      base.spill = Math.max(5, base.spill - 3);
      base.mental = Math.max(5, base.mental - 2);
      rationale.push(`Høye differentials (snitt ${avgDiff.toFixed(1)}) -> +5% teknikk`);
    } else if (avgDiff < 2) {
      // Lave differentials -> mer spill/mental
      base.spill = Math.min(50, base.spill + 5);
      base.mental = Math.min(30, base.mental + 3);
      base.teknikk = Math.max(10, base.teknikk - 5);
      base.mental = Math.max(5, base.mental - 3);
      rationale.push(`Lave differentials (snitt ${avgDiff.toFixed(1)}) -> +5% spill, +3% mental`);
    }
  }

  // Justér basert på coach-notater
  if (input.coachNotes) {
    const notes = input.coachNotes.toLowerCase();
    if (notes.includes("putting") || notes.includes("green")) {
      base.spill = Math.min(50, base.spill + 3);
      rationale.push("Coach-notat: fokus på putting -> +3% spill");
    }
    if (notes.includes("driver") || notes.includes("lengde")) {
      base.slag = Math.min(50, base.slag + 3);
      rationale.push("Coach-notat: fokus på driver -> +3% slag");
    }
  }

  // Normaliser til 100%
  const sum = base.fysisk + base.teknikk + base.slag + base.spill + base.mental;
  if (sum !== 100) {
    const factor = 100 / sum;
    base.fysisk = Math.round(base.fysisk * factor);
    base.teknikk = Math.round(base.teknikk * factor);
    base.slag = Math.round(base.slag * factor);
    base.spill = Math.round(base.spill * factor);
    base.mental = Math.round(base.mental * factor);
  }

  // Juster for avrunding
  const finalSum = base.fysisk + base.teknikk + base.slag + base.spill + base.mental;
  const diff = 100 - finalSum;
  if (diff !== 0) {
    const entries = Object.entries(base) as [keyof AreaAllocation, number][];
    const maxKey = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    base[maxKey] += diff;
  }

  // 3. Persister AI-rasjonale
  await prisma.playerAllocation.updateMany({
    where: { userId: input.userId },
    data: { rationaleAi: rationale.join("\n") },
  });

  return {
    adjusted: base,
    rationale: rationale.join("\n") || "Ingen justering nødvendig",
    confidence: rationale.length > 0 ? 0.75 : 0.5,
  };
}
