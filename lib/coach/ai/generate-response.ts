// lib/coach/ai/generate-response.ts

import Anthropic from "@anthropic-ai/sdk";
import { routeToModel, categorizeMessage, type AIModel, type MessageCategory } from "./model-router";
import { findSimilarResponses } from "./learning";

const anthropic = new Anthropic();

/** Konfidensterskel for auto-send (0.95 = 95%) */
export const AUTO_SEND_CONFIDENCE_THRESHOLD = 0.95;

interface GenerateResponseResult {
  content: string;
  confidence: number;
  category: MessageCategory;
  modelUsed: AIModel;
  shouldAutoSend: boolean;
}

export async function generateAIResponse(
  messageContent: string,
  senderName: string,
  channel: string,
  userId: string
): Promise<GenerateResponseResult> {
  const category = categorizeMessage(messageContent);
  const model = routeToModel(messageContent);

  // Sjekk om vi har lignende svar fra før
  const similarResponses = await findSimilarResponses(userId, category, messageContent);

  let confidence = 0.5;
  let responseContent: string;

  if (similarResponses.length > 0 && similarResponses[0].confidence >= 0.9) {
    // Høy konfidensert match — bruk eksisterende svar
    responseContent = similarResponses[0].response;
    confidence = similarResponses[0].confidence;
  } else {
    // Generer nytt svar
    responseContent = await callAIModel(model, messageContent, senderName, channel, similarResponses);
    confidence = similarResponses.length > 0 ? 0.7 : 0.5;
  }

  return {
    content: responseContent,
    confidence,
    category,
    modelUsed: model,
    shouldAutoSend: confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD,
  };
}

async function callAIModel(
  model: AIModel,
  messageContent: string,
  senderName: string,
  channel: string,
  previousResponses: { pattern: string; response: string }[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(channel, previousResponses);

  if (model === "ollama") {
    return callOllama(systemPrompt, messageContent, senderName);
  }

  if (model === "kimi") {
    // Kimi er ikke implementert ennå — fall tilbake til Claude Sonnet
    console.info("Kimi not implemented, falling back to Claude Sonnet");
    return callClaudeModel("claude-sonnet-4-6", systemPrompt, messageContent, senderName);
  }

  // Claude models
  const claudeModel =
    model === "claude-haiku"
      ? "claude-haiku-4-5-20251001"
      : model === "claude-sonnet"
        ? "claude-sonnet-4-6"
        : "claude-opus-4-6";

  return callClaudeModel(claudeModel, systemPrompt, messageContent, senderName);
}

async function callClaudeModel(
  model: string,
  systemPrompt: string,
  messageContent: string,
  senderName: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Melding fra ${senderName}:\n\n${messageContent}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function callOllama(systemPrompt: string, messageContent: string, senderName: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        prompt: `${systemPrompt}\n\nMelding fra ${senderName}:\n${messageContent}\n\nSvar:`,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.warn(`Ollama returned ${response.status}, falling back to Claude Haiku`);
      return callClaudeModel("claude-haiku-4-5-20251001", systemPrompt, messageContent, senderName);
    }

    const data = (await response.json()) as { response: string };
    return data.response;
  } catch (error) {
    console.warn("Ollama not available, falling back to Claude Haiku:", error);
    return callClaudeModel("claude-haiku-4-5-20251001", systemPrompt, messageContent, senderName);
  }
}

function buildSystemPrompt(channel: string, previousResponses: { pattern: string; response: string }[]): string {
  let prompt = `Du er en assistent for AK Golf Academy. Du svarer på vegne av trenerne på en profesjonell, vennlig og hjelpsom måte.

Kanal: ${channel}

Retningslinjer:
- Vær høflig og profesjonell
- Bruk norsk bokmål
- Hold svarene korte og konkrete
- Hvis du ikke vet svaret, si det ærlig
- Ikke lov noe du ikke kan holde`;

  if (previousResponses.length > 0) {
    prompt += "\n\nTidligere godkjente svar på lignende henvendelser:";
    previousResponses.slice(0, 3).forEach((r, i) => {
      prompt += `\n\nEksempel ${i + 1}:\nHenvendelse: ${r.pattern}\nSvar: ${r.response}`;
    });
  }

  return prompt;
}
