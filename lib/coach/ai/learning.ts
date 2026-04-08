// lib/coach/ai/learning.ts

import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
import type { MessageCategory } from "./model-router";
import type { AILearning } from "@prisma/client";

interface LearnedResponse {
  pattern: string;
  response: string;
  confidence: number;
}

export async function findSimilarResponses(
  userId: string,
  category: MessageCategory,
  messageContent: string
): Promise<LearnedResponse[]> {
  const supabase = createServiceClient();

  // Sjekk om AILearning-tabellen eksisterer
  // Denne vil feile elegant hvis modellen ikke er migrert ennå
  try {
    // Hent alle læringer for denne kategorien
    const { data: learnings } = await supabase
      .from("AILearning")
      .select("pattern, response, confidence")
      .eq("userId", userId)
      .eq("category", category)
      .order("confidence", { ascending: false })
      .limit(10);

    if (!learnings || learnings.length === 0) {
      return [];
    }

    // Enkel keyword-matching (kan utvides til embeddings senere)
    const messageWords = new Set(messageContent.toLowerCase().split(/\s+/));

    const scored = learnings.map((learning) => {
      const patternWords = new Set(learning.pattern.toLowerCase().split(/\s+/));
      const intersection = Array.from(messageWords).filter((w) => patternWords.has(w));
      const similarity = intersection.length / Math.max(messageWords.size, patternWords.size);

      return {
        ...learning,
        similarity,
      };
    });

    return scored
      .filter((s) => s.similarity > 0.3)
      .sort((a, b) => b.similarity * b.confidence - a.similarity * a.confidence)
      .map((s) => ({
        pattern: s.pattern,
        response: s.response,
        confidence: s.confidence * s.similarity,
      }));
  } catch {
    // AILearning-tabellen eksisterer ikke ennå
    logger.warn("AILearning table not found - learning system not yet migrated");
    return [];
  }
}

export async function learnFromApproval(
  userId: string,
  category: MessageCategory,
  originalMessage: string,
  approvedResponse: string,
  wasEdited: boolean
): Promise<void> {
  const supabase = createServiceClient();

  try {
    // Finn eksisterende læring for denne kategorien
    const { data: existing } = await supabase
      .from("AILearning")
      .select("id, confidence, usageCount")
      .eq("userId", userId)
      .eq("category", category)
      .eq("pattern", originalMessage)
      .single();

    if (existing) {
      // Oppdater eksisterende
      const newConfidence = wasEdited
        ? Math.max(0.3, existing.confidence - 0.1) // Reduser hvis redigert
        : Math.min(0.99, existing.confidence + 0.05); // Øk hvis godkjent uten endring

      await supabase
        .from("AILearning")
        .update({
          response: approvedResponse,
          confidence: newConfidence,
          usageCount: existing.usageCount + 1,
          lastUsed: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      // Opprett ny læring
      await supabase
        .from("AILearning")
        .insert({
          userId,
          category,
          pattern: originalMessage,
          response: approvedResponse,
          confidence: wasEdited ? 0.5 : 0.7,
          usageCount: 1,
          lastUsed: new Date().toISOString(),
        });
    }
  } catch {
    // AILearning-tabellen eksisterer ikke ennå
    logger.warn("AILearning table not found - learning system not yet migrated");
  }
}
