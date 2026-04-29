/**
 * Felles typer for treningsplan-v2 (Brand Guide V2.0 — pixel-rebuild av a5+a6).
 *
 * Holder seg lokalt slik at v2 ikke kobles til den eksisterende v2/-mappen
 * (som dekker en annen iterasjon). Alle felter speiler V2Event-shape fra
 * eksisterende `actions.ts` slik at vi gjenbruker getWeekEvents 1:1.
 */

export interface V2Exercise {
  id: string;
  name: string;
  pyramid: string;
  area: string;
  lPhase: string | null;
  baller?: number;
  bevegelser?: number;
}

export interface V2Event {
  id: string;
  date: string;
  startH: number;
  startM: number;
  dur: number;
  title: string;
  focus: string;
  area?: string | null;
  repsTotal?: number | null;
  description?: string | null;
  facilityId?: string | null;
  exercises: V2Exercise[];
  done: boolean;
  isGroupSession?: boolean;
  groupName?: string | null;
}

/** Kategoriserer en økt etter primær slag-fokus / område for week-strip-pills. */
export type SessionPillKind = "putt" | "iron" | "short" | "driver" | "round" | "coach";

export function areaToPillKind(area: string | null | undefined): SessionPillKind {
  if (!area) return "iron";
  if (area.startsWith("PUTT")) return "putt";
  if (area === "TEE") return "driver";
  if (
    area === "INN50" ||
    area === "CHIP" ||
    area === "PITCH" ||
    area === "LOB" ||
    area === "BUNKER"
  ) {
    return "short";
  }
  if (area.startsWith("INN")) return "iron";
  return "iron";
}

/** Kort norsk label brukt på pill-tekst. */
export function pillLabel(kind: SessionPillKind): string {
  const map: Record<SessionPillKind, string> = {
    putt: "Putt",
    iron: "Iron",
    short: "Short",
    driver: "Driver",
    round: "Runde",
    coach: "Coach",
  };
  return map[kind];
}

/** AK-pyramide kategori brukt på øvelses-tags. */
export type AkTagKind = "tech" | "skill" | "score" | "mental" | "fysisk";

export function pyramidToAkTag(code: string): AkTagKind {
  switch (code) {
    case "FYS":
      return "fysisk";
    case "TEK":
      return "tech";
    case "SLAG":
      return "skill";
    case "SPILL":
      return "score";
    case "TURN":
      return "mental";
    default:
      return "skill";
  }
}

export function pyramidLabel(code: string): string {
  switch (code) {
    case "FYS":
      return "Fysisk";
    case "TEK":
      return "Teknikk";
    case "SLAG":
      return "Skill";
    case "SPILL":
      return "Score";
    case "TURN":
      return "Mental";
    default:
      return code;
  }
}

/** Full bibliotek-rad for kort-grid'en under uke-stripen. */
export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  category: "putting" | "iron" | "short" | "driver" | "mental";
  durationLabel: string;
  badgeText?: string;
  footerLabel?: string;
  hasVideo?: boolean;
}
