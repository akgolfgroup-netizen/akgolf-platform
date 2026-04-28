import "server-only";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import type {
  LibraryItem,
  V2EventLite,
  V2Exercise,
} from "@/components/portal/treningsplan/v2";

interface PeriodizationInfo {
  periodType: string;
  label: string | null;
  weekNumber: number;
  totalWeeks: number;
  focusAllocation: Record<string, number> | null;
}

/** Standard ukestall hvis ingen periodisering finnes. */
const DEFAULT_WEEKLY_VOLUME_MIN = 480; // 8 timer
const DEFAULT_WEEKLY_SESSIONS = 6;

export function computeWeeklyTargets(
  periodization: PeriodizationInfo | null | undefined,
): { volumeMinutes: number; sessions: number } {
  if (!periodization) {
    return {
      volumeMinutes: DEFAULT_WEEKLY_VOLUME_MIN,
      sessions: DEFAULT_WEEKLY_SESSIONS,
    };
  }
  switch (periodization.periodType) {
    case "spesialiseringsperiode":
      return { volumeMinutes: 600, sessions: 7 };
    case "turneringsperiode":
      return { volumeMinutes: 360, sessions: 5 };
    case "grunnperiode":
    default:
      return { volumeMinutes: DEFAULT_WEEKLY_VOLUME_MIN, sessions: DEFAULT_WEEKLY_SESSIONS };
  }
}

/**
 * Henter coach-fornavn fra spillerens aktive plan.
 * Returnerer null hvis ingen plan eller hvis coach er spilleren selv.
 */
export async function getActiveCoachName(): Promise<string | null> {
  const me = await requirePortalUser();
  if (!me?.id) return null;

  const plan = await prisma.trainingPlan.findFirst({
    where: { studentId: me.id, isActive: true },
    select: { createdById: true },
  });

  if (!plan) return null;
  if (plan.createdById === me.id) return null; // selvlaget plan

  const coach = await prisma.user.findUnique({
    where: { id: plan.createdById },
    select: { name: true },
  });
  return coach?.name?.split(" ")[0] ?? null;
}

/**
 * Bygger bibliotek-elementer fra ukens øvelser.
 * Dedup på navn — én rad per unik øvelse.
 */
export function buildLibraryItems(events: V2EventLite[]): LibraryItem[] {
  const seen = new Map<string, LibraryItem>();

  for (const ev of events) {
    for (const ex of ev.exercises) {
      const key = ex.name.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.set(key, exerciseToLibraryItem(ex, ev));
    }
  }

  return Array.from(seen.values());
}

function exerciseToLibraryItem(ex: V2Exercise, ev: V2EventLite): LibraryItem {
  return {
    id: ex.id,
    name: ex.name,
    description: ex.area
      ? `Område: ${areaShortLabel(ex.area)}${ex.lPhase ? ` · ${ex.lPhase}` : ""}`
      : ex.lPhase ?? "Tilpasset øvelse",
    category: pyramidToLibraryCategory(ex.pyramid, ex.area),
    durationLabel: `${Math.max(1, Math.round(ev.dur / Math.max(1, ev.exercises.length)))} min`,
    footerLabel: undefined,
    hasVideo: false,
  };
}

function pyramidToLibraryCategory(
  pyramid: string,
  area: string | null | undefined,
): LibraryItem["category"] {
  if (pyramid === "TURN") return "mental";
  if (area?.startsWith("PUTT")) return "putting";
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
  if (area?.startsWith("INN")) return "iron";
  return "iron";
}

function areaShortLabel(code: string): string {
  const map: Record<string, string> = {
    TEE: "Tee",
    INN200: "Innspill 200+m",
    INN150: "Innspill 150–200m",
    INN100: "Innspill 100–150m",
    INN50: "Innspill 50–100m",
    CHIP: "Chip",
    PITCH: "Pitch",
    LOB: "Lob",
    BUNKER: "Bunker",
  };
  return map[code] ?? code;
}
