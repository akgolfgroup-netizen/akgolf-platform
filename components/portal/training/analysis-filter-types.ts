import type { TrainingFilter } from "@/lib/portal/training/analysis-actions";

export const PERIODE_OPTIONS = [
  { key: "7d", label: "Siste 7 dager", days: 7 },
  { key: "30d", label: "Siste 30 dager", days: 30 },
  { key: "90d", label: "Siste 90 dager", days: 90 },
  { key: "1y", label: "Siste år", days: 365 },
  { key: "custom", label: "Egendefinert", days: 0 },
] as const;

export type PeriodeKey = (typeof PERIODE_OPTIONS)[number]["key"];

export const PARAM_MAP = {
  pyramid: "p",
  area: "a",
  lPhase: "l",
  cs: "cs",
  env: "m",
  press: "pr",
} as const;

export function parseArrayParam(sp: URLSearchParams, key: string): string[] {
  const raw = sp.get(key);
  return raw ? raw.split(",").filter(Boolean) : [];
}

export function formatDateInput(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function getPeriodDates(
  periode: PeriodeKey,
  fromStr: string | null,
  toStr: string | null
): { from: Date; to: Date } {
  const to = toStr ? new Date(toStr + "T23:59:59") : new Date();
  const opt = PERIODE_OPTIONS.find((o) => o.key === periode);
  if (opt && opt.days > 0) {
    const from = new Date();
    from.setDate(from.getDate() - opt.days);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }
  const from = fromStr
    ? new Date(fromStr + "T00:00:00")
    : new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export function countActiveFilters(sp: URLSearchParams): number {
  let count = 0;
  Object.values(PARAM_MAP).forEach((k) => {
    if (sp.get(k)) count++;
  });
  if (sp.get("periode") && sp.get("periode") !== "90d") count++;
  if (sp.get("from") || sp.get("to")) count++;
  return count;
}

export interface FilterState {
  pyramid: string[];
  area: string[];
  lPhase: string[];
  cs: string[];
  env: string[];
  press: string[];
}

export function filterStateFromSearchParams(sp: URLSearchParams): FilterState {
  return {
    pyramid: parseArrayParam(sp, PARAM_MAP.pyramid),
    area: parseArrayParam(sp, PARAM_MAP.area),
    lPhase: parseArrayParam(sp, PARAM_MAP.lPhase),
    cs: parseArrayParam(sp, PARAM_MAP.cs),
    env: parseArrayParam(sp, PARAM_MAP.env),
    press: parseArrayParam(sp, PARAM_MAP.press),
  };
}

export function filterStateFromTrainingFilter(tf: TrainingFilter): FilterState {
  return {
    pyramid: tf.pyramidCodes ?? [],
    area: tf.areas ?? [],
    lPhase: tf.lPhases ?? [],
    cs: tf.csLevels ?? [],
    env: tf.environments ?? [],
    press: tf.pressureLevels ?? [],
  };
}

export function buildFilterFromSearchParams(
  sp: URLSearchParams,
  userId?: string
): { filter: TrainingFilter; periodeLabel: string } {
  const periode = (sp.get("periode") as PeriodeKey) ?? "90d";
  const fromStr = sp.get("from");
  const toStr = sp.get("to");
  const { from, to } = getPeriodDates(periode, fromStr, toStr);

  const periodeLabel =
    PERIODE_OPTIONS.find((o) => o.key === periode)?.label ?? "Siste 90 dager";

  const filter: TrainingFilter = {
    userId,
    pyramidCodes: parseArrayParam(sp, PARAM_MAP.pyramid),
    areas: parseArrayParam(sp, PARAM_MAP.area),
    lPhases: parseArrayParam(sp, PARAM_MAP.lPhase),
    csLevels: parseArrayParam(sp, PARAM_MAP.cs),
    environments: parseArrayParam(sp, PARAM_MAP.env),
    pressureLevels: parseArrayParam(sp, PARAM_MAP.press),
    fromDate: from,
    toDate: to,
  };

  return { filter, periodeLabel };
}
