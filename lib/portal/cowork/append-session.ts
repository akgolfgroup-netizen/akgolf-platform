/**
 * Cowork-integrering: skriver publiserte coaching-sammendrag til
 * ~/Claude Cowork/ak-golf-academy/sessions/<studentnavn>/<yyyy-mm-dd>.md
 *
 * Kun aktivert når COWORK_SYNC_PATH env-var er satt (lokal maskin).
 * På Vercel er dette typisk off — kun på Anders sin lokale dev-maskin.
 */
import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/lib/logger";

export interface CoworkSessionExport {
  studentName: string;
  sessionDate: Date;
  primaryFocus: string | null;
  summary: string | null;
  keyPoints: string[];
  focusAreas: string[];
  actionItems: string[];
  rawTranscript: string | null;
  sessionId: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function appendSessionToCowork(
  session: CoworkSessionExport
): Promise<{ ok: boolean; path?: string; reason?: string }> {
  const basePath = process.env.COWORK_SYNC_PATH;
  if (!basePath) return { ok: false, reason: "COWORK_SYNC_PATH not set" };

  try {
    const studentSlug = slugify(session.studentName);
    const dateStr = session.sessionDate.toISOString().slice(0, 10);
    const dirPath = path.join(basePath, "ak-golf-academy", "sessions", studentSlug);
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${dateStr}-${session.sessionId.slice(0, 6)}.md`);

    const markdown = formatMarkdown(session);
    await fs.writeFile(filePath, markdown, "utf-8");

    return { ok: true, path: filePath };
  } catch (err) {
    logger.error("[cowork] append failed", err);
    return { ok: false, reason: err instanceof Error ? err.message : "unknown" };
  }
}

function formatMarkdown(s: CoworkSessionExport): string {
  const lines: string[] = [];
  lines.push(`# Coachingøkt — ${s.studentName}`);
  lines.push("");
  lines.push(`**Dato:** ${s.sessionDate.toISOString().slice(0, 10)}`);
  if (s.primaryFocus) lines.push(`**Primærfokus:** ${s.primaryFocus}`);
  lines.push("");

  if (s.summary) {
    lines.push("## Sammendrag");
    lines.push("");
    lines.push(s.summary);
    lines.push("");
  }

  if (s.keyPoints.length > 0) {
    lines.push("## Nøkkelpunkter");
    lines.push("");
    s.keyPoints.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  }

  if (s.focusAreas.length > 0) {
    lines.push("## Fokusområder");
    lines.push("");
    s.focusAreas.forEach((f) => lines.push(`- ${f}`));
    lines.push("");
  }

  if (s.actionItems.length > 0) {
    lines.push("## Handlingspunkter");
    lines.push("");
    s.actionItems.forEach((a) => lines.push(`- ${a}`));
    lines.push("");
  }

  if (s.rawTranscript) {
    lines.push("## Full transkripsjon");
    lines.push("");
    lines.push("```");
    lines.push(s.rawTranscript);
    lines.push("```");
    lines.push("");
  }

  lines.push("---");
  lines.push(`<sub>Generert fra CoachHQ (session: ${s.sessionId})</sub>`);
  return lines.join("\n");
}
