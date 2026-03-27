// lib/coach/ai/learning.ts

import { prisma } from "@/lib/portal/prisma";
import type { MessageCategory } from "./model-router";

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
  // Sjekk om AILearning-tabellen eksisterer
  // Denne vil feile elegant hvis modellen ikke er migrert ennå
  try {
    // Hent alle læringer for denne kategorien
    const learnings = await prisma.aILearning.findMany({
      where: {
        userId,
        category,
      },
      orderBy: {
        confidence: "desc",
      },
      take: 10,
    });

    // Enkel keyword-matching (kan utvides til embeddings senere)
    const messageWords = new Set(messageContent.toLowerCase().split(/\s+/));

    const scored = learnings.map((learning) => {
      const patternWords = new Set(learning.pattern.toLowerCase().split(/\s+/));
      const intersection = [...messageWords].filter((w) => patternWords.has(w));
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
    console.warn("AILearning table not found - learning system not yet migrated");
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
  try {
    // Finn eksisterende læring for denne kategorien
    const existing = await prisma.aILearning.findFirst({
      where: {
        userId,
        category,
        pattern: originalMessage,
      },
    });

    if (existing) {
      // Oppdater eksisterende
      const newConfidence = wasEdited
        ? Math.max(0.3, existing.confidence - 0.1) // Reduser hvis redigert
        : Math.min(0.99, existing.confidence + 0.05); // Øk hvis godkjent uten endring

      await prisma.aILearning.update({
        where: { id: existing.id },
        data: {
          response: approvedResponse,
          confidence: newConfidence,
          usageCount: existing.usageCount + 1,
          lastUsed: new Date(),
        },
      });
    } else {
      // Opprett ny læring
      await prisma.aILearning.create({
        data: {
          userId,
          category,
          pattern: originalMessage,
          response: approvedResponse,
          confidence: wasEdited ? 0.5 : 0.7,
          usageCount: 1,
          lastUsed: new Date(),
        },
      });
    }
  } catch {
    // AILearning-tabellen eksisterer ikke ennå
    console.warn("AILearning table not found - learning system not yet migrated");
  }
}
