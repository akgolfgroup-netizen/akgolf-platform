import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import Anthropic from "@anthropic-ai/sdk";
import { convertToMetric, aggregateByClub, type TrackManShot } from "@/lib/portal/golf/trackman-parser";

export const maxDuration = 60;

const SYSTEM_PROMPT = `Du er en TrackMan data-ekstraktor. Du mottar et bilde av en TrackMan-skjerm eller rapport.
Ekstraher ALLE synlige slag-data og returner som JSON-array.

Returner KUN gyldig JSON i dette formatet:
[
  {
    "club": "Driver",
    "clubSpeed": 105.2,
    "ballSpeed": 155.3,
    "smashFactor": 1.48,
    "launchAngle": 12.5,
    "launchDirection": -1.2,
    "spinRate": 2450,
    "spinAxis": -3.5,
    "carry": 265,
    "totalDistance": 280,
    "offline": -8,
    "attackAngle": -1.5,
    "clubPath": 2.0,
    "faceAngle": 0.5,
    "faceToPath": -1.5,
    "maxHeight": 32,
    "landAngle": 38
  }
]

Regler:
- Alle avstandsverdier i YARDS
- Hastigheter i MPH
- Vinkler i grader
- Bruk null for manglende verdier
- Returner KUN JSON, ingen annen tekst`;

/**
 * POST /api/portal/trackman/upload-image — Last opp TrackMan screenshot for OCR
 * Body: { imageBase64: string, sessionDate?: string }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { imageBase64, sessionDate } = body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json(
      { error: "imageBase64 er paakrevd" },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic();

  let rawShots: TrackManShot[];
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
            {
              type: "text",
              text: "Ekstraher alle TrackMan-data fra dette bildet som JSON.",
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Kunne ikke finne JSON i Claude-svaret");
    }
    rawShots = JSON.parse(jsonMatch[0]);
  } catch (error) {
    return NextResponse.json(
      { error: `OCR feilet: ${error instanceof Error ? error.message : "Ukjent feil"}` },
      { status: 500 }
    );
  }

  if (!Array.isArray(rawShots) || rawShots.length === 0) {
    return NextResponse.json(
      { error: "Ingen slag funnet i bildet" },
      { status: 400 }
    );
  }

  const metricShots = rawShots.map(convertToMetric);
  const clubAggregates = aggregateByClub(metricShots);

  // Lagre TrackmanSession per klubb
  const sessions = [];
  for (const agg of clubAggregates) {
    const clubShots = metricShots.filter((s) => s.club === agg.club);
    const session = await prisma.trackmanSession.create({
      data: {
        id: nanoid(),
        userId: user.id,
        sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
        club: agg.club,
        shots: clubShots as unknown as Record<string, unknown>[],
        averages: agg as unknown as Record<string, unknown>,
      },
    });
    sessions.push(session);
  }

  return NextResponse.json({
    message: `${metricShots.length} slag ekstrahert fra bilde (${clubAggregates.length} klubber)`,
    sessions: sessions.length,
    clubSummary: clubAggregates.map((a) => ({
      club: a.club,
      count: a.count,
      avgCarry: a.avgCarry,
      avgTotal: a.avgTotal,
      lateralStdDev: a.lateralStdDev,
    })),
  });
}
