/**
 * Læringsstil-tilpasning av AI-prompts.
 *
 * Når AI Coach genererer drill, plan eller sammendrag, sjekk
 * MentalProfile.preferredLearningStyle (TODO: feltet eksisterer ikke ennå —
 * må legges til i Prisma-migrasjon Sprint 6) og juster tonen.
 *
 * Læringsstiler:
 *   VISUAL    — foreslå videoer, grafiske eksempler, "se" + "vis"
 *   KINESTHETIC — drill-fokus, "kjenn", "merk", praktiske øvelser
 *   AUDITORY  — muntlig forklaring, lydopptak-anbefaling, "hør"
 *
 * Brukes av:
 *   - lib/portal/ai/coaching-summary.ts
 *   - lib/portal/ai/next-session-orchestrator.ts
 *   - lib/portal/ai/drill-pack.ts
 */

import { prisma } from "@/lib/portal/prisma";

export type LearningStyle = "VISUAL" | "KINESTHETIC" | "AUDITORY" | "UNKNOWN";

export interface LearningStyleHint {
  style: LearningStyle;
  promptAddition: string;
  toneGuidance: string;
}

const STYLE_PROMPTS: Record<LearningStyle, LearningStyleHint> = {
  VISUAL: {
    style: "VISUAL",
    promptAddition: `Eleven er VISUELL. Foreslå alltid en relevant video-referanse hvis tilgjengelig.
Bruk konkret bildespråk: "Se for deg en linje fra ball til mål."
Når du beskriver en bevegelse, beskriv det som om eleven ser seg selv utenfra.`,
    toneGuidance: "Bruk: se, vis, bilde, linje, vinkel, bane.",
  },
  KINESTHETIC: {
    style: "KINESTHETIC",
    promptAddition: `Eleven er KINESTETISK. Fokuser på følelse og kroppsoppmerksomhet.
Bruk handlings-orienterte instruksjoner: "Kjenn at vekten flyttes...".
Foreslå alltid drills med tydelig fysisk feedback.`,
    toneGuidance: "Bruk: kjenn, merk, beveg, press, hold, slipp.",
  },
  AUDITORY: {
    style: "AUDITORY",
    promptAddition: `Eleven er AUDITIV. Foreslå muntlig forklaring eller lydopptak.
Bruk rytme-metaforer: "Tenk one-and-two-and-three" for sving-tempo.
Ved sammendrag, oppsummer i stikkord som er enkle å huske muntlig.`,
    toneGuidance: "Bruk: hør, tempo, rytme, telle, snakke gjennom.",
  },
  UNKNOWN: {
    style: "UNKNOWN",
    promptAddition: "",
    toneGuidance: "Bruk balansert mix av visuelle, kinestetiske og auditive instruksjoner.",
  },
};

/**
 * Hent læringsstil-hint for en spiller.
 *
 * NB: MentalProfile.preferredLearningStyle finnes ikke i Prisma per i dag.
 * Returnerer UNKNOWN inntil migrasjon er kjørt.
 */
export async function getLearningStyleHint(userId: string): Promise<LearningStyleHint> {
  // TODO Sprint 6 Prisma-migrasjon: legg til preferredLearningStyle på MentalProfile
  void userId;
  void prisma;
  return STYLE_PROMPTS.UNKNOWN;
}

/**
 * Berik en eksisterende AI-prompt med læringsstil-hint.
 */
export async function enrichPromptWithLearningStyle(
  basePrompt: string,
  userId: string,
): Promise<string> {
  const hint = await getLearningStyleHint(userId);
  if (hint.style === "UNKNOWN") return basePrompt;
  return `${basePrompt}\n\n--- LÆRINGSSTIL-TILPASNING ---\n${hint.promptAddition}\n\nTone: ${hint.toneGuidance}`;
}
