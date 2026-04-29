/**
 * Felles typer for spiller-vendt treningsplan v2 (Brand Guide V2.0).
 * Speiler V2Event fra actions.ts, men fjerner unknown[] for renere props.
 */

export interface V2Exercise {
  id: string;
  name: string;
  pyramid: string;
  area: string;
  lPhase: string | null;
  baller?: number;
  bevegelser?: number;
  /** Referanse til TestDefinition hvis dette er en test-øvelse. */
  testNumber?: number | null;
}

export interface V2EventLite {
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

export type AkTagKind = "tech" | "skill" | "score" | "mental" | "fysisk";

/** Map fra pyramide-kode (FYS/TEK/SLAG/SPILL/TURN) til tag-kategori. */
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

/** Map fra pyramide-kode til human label på norsk. */
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

/** Kategorisering for session-pill i week-strip basert på area-kode. */
export type SessionPillKind = "putt" | "iron" | "short" | "driver" | "round";

export function areaToPillKind(area: string | null | undefined): SessionPillKind {
  if (!area) return "iron";
  if (area.startsWith("PUTT")) return "putt";
  if (area === "TEE") return "driver";
  if (area === "INN50" || area === "CHIP" || area === "PITCH" || area === "LOB" || area === "BUNKER")
    return "short";
  if (area.startsWith("INN")) return "iron";
  return "iron";
}
