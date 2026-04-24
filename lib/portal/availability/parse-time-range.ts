/**
 * Parse kort-format tilgjengelighet.
 *
 *   "10-18"        -> { start: "10:00", end: "18:00" }
 *   "10:30-17:45"  -> { start: "10:30", end: "17:45" }
 *   "9-17"         -> { start: "09:00", end: "17:00" }
 *   "fri" | "off"  -> { off: true }
 *   "–" (endash) godtas som separator.
 */

export type ParsedTimeRange =
  | { start: string; end: string; off?: false }
  | { off: true }
  | { error: string };

const NUM_RE = /^([0-1]?\d|2[0-3])(?::([0-5]\d))?$/;

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function normalize(part: string): { h: number; m: number } | null {
  const m = part.trim().match(NUM_RE);
  if (!m) return null;
  return { h: Number(m[1]), m: m[2] ? Number(m[2]) : 0 };
}

export function parseTimeRange(input: string): ParsedTimeRange {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return { error: "Tom input" };

  if (["fri", "off", "stengt"].includes(trimmed)) {
    return { off: true };
  }

  // Splitt på -, –, eller til
  const parts = trimmed.split(/\s*[-–]\s*|\s+til\s+/);
  if (parts.length !== 2) {
    return { error: "Forventer format som '10-18' eller '10:30-17:45'" };
  }

  const start = normalize(parts[0]);
  const end = normalize(parts[1]);
  if (!start) return { error: `Ugyldig starttid: '${parts[0]}'` };
  if (!end) return { error: `Ugyldig sluttid: '${parts[1]}'` };

  const startMin = start.h * 60 + start.m;
  const endMin = end.h * 60 + end.m;
  if (startMin >= endMin) {
    return { error: "Starttid må være før sluttid" };
  }

  return {
    start: `${pad(start.h)}:${pad(start.m)}`,
    end: `${pad(end.h)}:${pad(end.m)}`,
  };
}
