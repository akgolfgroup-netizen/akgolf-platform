"use server";

import { nanoid } from "nanoid";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { importTrackManSession } from "@/lib/portal/trackman/import-service";
import { generateTrackManInsightsCore } from "@/lib/portal/trackman/ai-insights";
import { parseVisionResponse } from "./vision-parser";
import {
  computeSessionAnalytics,
  updatePlayerMetrics,
  updateClubDispersion,
} from "./session-analytics";
import { parseTrackManCSV, convertToMetric } from "@/lib/portal/golf/trackman-parser";

export interface UploadMetadata {
  sessionDate: Date;
  club?: string;
  notes?: string;
}

export interface UploadImageResult {
  sessionId: string;
  shotsImported: number;
  confidence: number;
  notes: string | null;
}

export interface UploadCsvResult {
  sessionId: string;
  shotsImported: number;
}

export interface CsvPreviewShot {
  shotNumber: number;
  club: string;
  ballSpeed: number | null;
  carry: number | null;
  totalDistance: number | null;
  smashFactor: number | null;
}

export interface CsvPreviewResult {
  ok: true;
  totalShots: number;
  clubs: { club: string; count: number }[];
  firstShots: CsvPreviewShot[];
}

export interface CsvPreviewError {
  ok: false;
  error: string;
  hint?: string;
}

/**
 * Parser CSV uten a lagre. Brukes til a vise preview for spilleren godkjenner import.
 * Returnerer enten oppsummering eller en strukturert feil med hint.
 */
export async function previewTrackmanCsv(
  csvText: string,
): Promise<CsvPreviewResult | CsvPreviewError> {
  await requirePortalUser();

  if (!csvText || typeof csvText !== "string") {
    return { ok: false, error: "Tom fil eller ugyldig innhold." };
  }

  if (csvText.length > 5_000_000) {
    return {
      ok: false,
      error: "Filen er for stor (over 5 MB).",
      hint: "Eksporter en kortere okt eller del filen opp.",
    };
  }

  try {
    const rawShots = parseTrackManCSV(csvText);
    if (rawShots.length === 0) {
      return {
        ok: false,
        error: "Ingen gyldige slag funnet i filen.",
        hint: "Sjekk at du eksporterte fra TrackMan Range/Performance med kolonnene Club, Ball Speed, Carry.",
      };
    }

    const metric = rawShots.map(convertToMetric);

    // Klubb-fordeling
    const clubMap = new Map<string, number>();
    for (const shot of metric) {
      clubMap.set(shot.club, (clubMap.get(shot.club) ?? 0) + 1);
    }
    const clubs = Array.from(clubMap.entries())
      .map(([club, count]) => ({ club, count }))
      .sort((a, b) => b.count - a.count);

    const firstShots: CsvPreviewShot[] = metric.slice(0, 5).map((s, i) => ({
      shotNumber: i + 1,
      club: s.club,
      ballSpeed: s.ballSpeed,
      carry: s.carry,
      totalDistance: s.totalDistance,
      smashFactor: s.smashFactor,
    }));

    return {
      ok: true,
      totalShots: metric.length,
      clubs,
      firstShots,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Klarte ikke a lese filen.",
      hint: "Sjekk at filen er en gyldig TrackMan CSV-eksport.",
    };
  }
}

function getClubCategory(club: string): string {
  const lower = club.toLowerCase();
  if (lower.includes("driver") || lower.includes("wood")) return "WOOD";
  if (lower.includes("hybrid") || lower.includes("iron")) return "IRON";
  if (lower.includes("wedge") || lower === "pw" || lower === "gw" || lower === "sw" || lower === "lw")
    return "WEDGE";
  if (lower.includes("putter")) return "PUTTER";
  return "OTHER";
}

/**
 * Last opp TrackMan-bilde og parser med Claude Vision API.
 * @param imageBase64 — Base64-kodet bilde (inkludert data:image/...;base64, prefix)
 * @param metadata — Dato, kolle, notater
 */
export async function uploadTrackmanImage(
  imageBase64: string,
  metadata: UploadMetadata
): Promise<UploadImageResult> {
  const user = await requirePortalUser();

  if (!imageBase64 || typeof imageBase64 !== "string") {
    throw new Error("Bilde mangler eller er ugyldig");
  }

  const parsed = await parseVisionResponse(imageBase64);

  if (parsed.shots.length === 0) {
    throw new Error("Ingen slag funnet i bildet");
  }

  const sessionId = nanoid();
  const club = metadata.club ?? parsed.club ?? "Ukjent";
  const sessionDate = metadata.sessionDate ?? new Date();

  // 1. Lagre TrackmanSession
  await prisma.trackmanSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      sessionDate,
      club,
      shots: parsed.shots as unknown as Prisma.InputJsonValue,
      averages: parsed.averages as unknown as Prisma.InputJsonValue,
      sourceType: "image",
    },
  });

  // 2. Lagre TrackManShotData per slag
  for (let i = 0; i < parsed.shots.length; i++) {
    const shot = parsed.shots[i];
    await prisma.trackManShotData.create({
      data: {
        sessionId,
        userId: user.id,
        shotNumber: shot.shotNumber ?? i + 1,
        club,
        clubCategory: getClubCategory(club),
        ballSpeed: shot.ballSpeed,
        launchAngle: shot.launchAngle,
        launchDirection: shot.launchDirection,
        spinRate: shot.spinRate,
        spinAxis: shot.spinAxis,
        carryDistance: shot.carryDistance,
        totalDistance: shot.totalDistance,
        maxHeight: shot.maxHeight,
        landingAngle: shot.landingAngle,
        hangTime: shot.hangTime,
        notes: metadata.notes ?? null,
        context: "TRAINING",
        pressureLevel: 1,
      },
    });
  }

  // 3. Lagre analytics
  await computeSessionAnalytics(sessionId, user.id, parsed.shots, club);

  // 4. Oppdater metrics
  await updatePlayerMetrics(user.id);

  // 5. Oppdater dispersion
  await updateClubDispersion(user.id, parsed.shots, club);

  // 6. Generer AI-innsikter (fire-and-forget)
  try {
    await generateTrackManInsightsCore(sessionId, user.id, user.name);
  } catch {
    // Innsikter kan genereres manuelt senere
  }

  return {
    sessionId,
    shotsImported: parsed.shots.length,
    confidence: parsed.confidence,
    notes: parsed.notes,
  };
}

/**
 * Sletter en TrackMan-sesjon (alle slag + analytics + Trackman-session).
 * Sjekker eierskap. Brukes fra import-historikk-listen.
 */
export async function deleteTrackmanSession(
  sessionId: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requirePortalUser();

  if (!sessionId || typeof sessionId !== "string") {
    return { ok: false, error: "Mangler sessionId" };
  }

  const owner = await prisma.trackManShotData.findFirst({
    where: { sessionId, userId: user.id },
    select: { id: true },
  });

  if (!owner) {
    return { ok: false, error: "Sesjon ikke funnet" };
  }

  await prisma.$transaction([
    prisma.trackManSessionAnalytics.deleteMany({
      where: { sessionId, userId: user.id },
    }),
    prisma.trackManShotData.deleteMany({
      where: { sessionId, userId: user.id },
    }),
    prisma.trackmanSession.deleteMany({
      where: { id: sessionId, userId: user.id },
    }),
  ]);

  return { ok: true };
}

/**
 * Last opp TrackMan CSV. Wrapper rundt eksisterende import-service.
 */
export async function uploadTrackmanCsv(
  csvText: string,
  metadata: UploadMetadata
): Promise<UploadCsvResult> {
  const user = await requirePortalUser();

  if (!csvText || typeof csvText !== "string") {
    throw new Error("CSV-tekst mangler");
  }

  const result = await importTrackManSession({
    userId: user.id,
    csvContent: csvText,
    sessionDate: metadata.sessionDate,
    context: "TRAINING",
  });

  return {
    sessionId: result.sessionId,
    shotsImported: result.shotCount,
  };
}
