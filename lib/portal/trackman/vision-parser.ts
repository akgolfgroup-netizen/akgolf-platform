"use server";

import Anthropic from "@anthropic-ai/sdk";

const VISION_MODEL = "claude-sonnet-4-5-20251001";

const VISION_SYSTEM_PROMPT = `Du er en TrackMan-data-parser. Bildet viser et TrackMan-skjermbilde med slag-data.

Returner KUN JSON i dette formatet:
{
  "club": "7-iron",
  "clubCategory": "iron",
  "shots": [
    {
      "shotNumber": 1,
      "ballSpeed": 132.5,
      "launchAngle": 18.2,
      "launchDirection": -2.1,
      "spinRate": 6800,
      "spinAxis": 1.5,
      "carryDistance": 165.0,
      "totalDistance": 178.2,
      "maxHeight": 32.5,
      "landingAngle": 48.0,
      "hangTime": 6.2
    }
  ],
  "averages": {
    "ballSpeed": 130.2,
    "carryDistance": 162.5,
    "spinRate": 6920
  },
  "confidence": 0.92,
  "notes": "Klart bilde. Alle 5 slag synlige."
}

Felt-regler:
- Distanser i meter (selv om TrackMan viser yards). Konverter: yards * 0.9144 = meter.
- ballSpeed i mph (ikke convert).
- spinRate i rpm.
- Hvis usikker på et felt: returner null, IKKE gjett.
- confidence 0-1 basert på bildekvalitet og lesbarhet.`;

export interface VisionShot {
  shotNumber: number;
  ballSpeed: number | null;
  launchAngle: number | null;
  launchDirection: number | null;
  spinRate: number | null;
  spinAxis: number | null;
  carryDistance: number | null;
  totalDistance: number | null;
  maxHeight: number | null;
  landingAngle: number | null;
  hangTime: number | null;
}

export interface VisionResult {
  club: string | null;
  clubCategory: string | null;
  shots: VisionShot[];
  averages: {
    ballSpeed?: number | null;
    carryDistance?: number | null;
    spinRate?: number | null;
  };
  confidence: number;
  notes: string | null;
}

export async function parseVisionResponse(imageBase64: string): Promise<VisionResult> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const mediaType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] ?? "image/png";

  const response = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: 4096,
    system: VISION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
              data: base64Data,
            },
          },
          {
            type: "text",
            text: "Parser TrackMan-data fra dette bildet.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Ingen tekstrespons fra Vision API");
  }
  const responseText = textBlock.text;

  let parsed: VisionResult;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Kunne ikke finne JSON i AI-responsen");
    }
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (!parsed.shots || !Array.isArray(parsed.shots)) {
    throw new Error("Ugyldig responsformat fra AI: mangler shots-array");
  }

  return parsed;
}
