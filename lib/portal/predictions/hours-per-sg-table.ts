/**
 * Typed loader for hours-per-sg-kalibreringstabellen.
 *
 * Data-filen (hours-per-sg-table.json) er "source of truth" for all
 * forecast-matematikk. Denne TypeScript-wrapperen gir:
 *   - Type-sikker tilgang
 *   - Oppslag-funksjoner (getHoursPerTenthSg, getEmpiricalShare)
 *   - Validering ved import (sjekk at tabellen er komplett)
 *
 * Metodologi: docs/strategy/COACHING_FORECAST_METHODOLOGY.md seksjon 6.
 */

import tableData from "./hours-per-sg-table.json" with { type: "json" };

// ── Typer ───────────────────────────────────────────────────────────

export type SgCategory = "OTT" | "APP" | "ARG" | "PUTT";
export type LevelGroup = "KG" | "FD" | "CB" | "A";

export interface HoursEstimate {
  /** Punktestimat — timer for +0.1 SG */
  hours: number;
  /** Nedre 95% konfidensintervall */
  ci95Low: number;
  /** Øvre 95% konfidensintervall */
  ci95High: number;
}

export interface EmpiricalShare {
  /** Gjennomsnittlig andel av SG-forbedringen som kommer fra kategorien */
  mean: number;
  /** Standardavvik */
  stdDev: number;
}

// ── Grunnleggende oppslag ───────────────────────────────────────────

/**
 * Map en A–K-kategori til riktig level-group for oppslag i tabellen.
 */
export function levelGroupFromCategory(category: string): LevelGroup {
  const normalized = category.toUpperCase().trim();
  if (["K", "J", "I", "H", "G"].includes(normalized)) return "KG";
  if (["F", "E", "D"].includes(normalized)) return "FD";
  if (["C", "B"].includes(normalized)) return "CB";
  if (normalized === "A") return "A";
  throw new Error(`Ukjent kategori: ${category}. Må være A–K.`);
}

/**
 * Hent timer-estimat for +0.1 SG-forbedring i gitt kategori og nivå.
 */
export function getHoursPerTenthSg(
  category: SgCategory,
  level: LevelGroup | string,
): HoursEstimate {
  const levelGroup: LevelGroup =
    level === "KG" || level === "FD" || level === "CB" || level === "A"
      ? level
      : levelGroupFromCategory(level);

  const entry = tableData.hoursPerTenthSg[category]?.[levelGroup];
  if (!entry) {
    throw new Error(
      `Mangler hours-per-sg for ${category} / ${levelGroup}. Sjekk hours-per-sg-table.json.`,
    );
  }
  return entry;
}

/**
 * Beregn timer for et spesifikt SG-delta (kan være mer eller mindre enn +0.1).
 *
 * Ikke-lineær når deltaet er stort: vi steg-aggregerer gjennom level-groups
 * hvis spilleren krysser en kategori-grense midt i forecast-perioden.
 */
export function estimateHoursForSgDelta(
  category: SgCategory,
  startLevel: LevelGroup | string,
  deltaSg: number,
): HoursEstimate {
  if (deltaSg <= 0) {
    return { hours: 0, ci95Low: 0, ci95High: 0 };
  }

  const estimate = getHoursPerTenthSg(category, startLevel);
  const steps = deltaSg / tableData.unitsPerStep;

  return {
    hours: estimate.hours * steps,
    ci95Low: estimate.ci95Low * steps,
    ci95High: estimate.ci95High * steps,
  };
}

/**
 * Bruk overlap-factor for å konvertere rå summert tidsbruk
 * til effektiv tidsbruk når flere kategorier trenes parallelt.
 */
export function applyOverlapFactor(rawHours: number): number {
  return rawHours * tableData.overlapFactor.value;
}

export function getOverlapFactor(): number {
  return tableData.overlapFactor.value;
}

// ── Empirisk fordeling (regularisering) ────────────────────────────

/**
 * Hent empirisk andel for en kategori (fra PGA Tour-analyse).
 * Brukes som regularisering i Trinn C (se metodologi seksjon 5.3).
 */
export function getEmpiricalShare(category: SgCategory): EmpiricalShare {
  return tableData.empiricalDistribution.shares[category];
}

export function getRegularizationWeight(): number {
  return tableData.empiricalDistribution.regularizationWeight;
}

/**
 * Anvend regularisering: blandet fordeling mellom headroom-basert
 * og empirisk-basert allokering.
 *
 * Formel: final = 0.7 * headroom + 0.3 * empirical
 */
export function regularizeAllocation(
  headroomShares: Record<SgCategory, number>,
): Record<SgCategory, number> {
  const weight = getRegularizationWeight();
  const categories: SgCategory[] = ["OTT", "APP", "ARG", "PUTT"];

  const result = {} as Record<SgCategory, number>;
  for (const cat of categories) {
    const empirical = getEmpiricalShare(cat).mean;
    result[cat] = (1 - weight) * (headroomShares[cat] ?? 0) + weight * empirical;
  }

  // Normaliser så summen blir 1.0 (kan drive noe pga rundingsfeil)
  const sum = Object.values(result).reduce((a, b) => a + b, 0);
  if (sum > 0) {
    for (const cat of categories) {
      result[cat] = result[cat] / sum;
    }
  }

  return result;
}

// ── Metadata ───────────────────────────────────────────────────────

export function getTableVersion(): string {
  return tableData.version;
}

export function getLastCalibrationDate(): string {
  return tableData.lastCalibration;
}

export function getStatus(): string {
  return tableData.status;
}

export function getDisclaimers(): string[] {
  return tableData.disclaimers;
}

// ── Validering ved import ──────────────────────────────────────────

function validateTable(): void {
  const categories: SgCategory[] = ["OTT", "APP", "ARG", "PUTT"];
  const levels: LevelGroup[] = ["KG", "FD", "CB", "A"];

  for (const cat of categories) {
    for (const lvl of levels) {
      const entry = tableData.hoursPerTenthSg[cat]?.[lvl];
      if (!entry) {
        throw new Error(`hours-per-sg-table.json mangler ${cat}/${lvl}`);
      }
      if (
        typeof entry.hours !== "number" ||
        typeof entry.ci95Low !== "number" ||
        typeof entry.ci95High !== "number"
      ) {
        throw new Error(`hours-per-sg-table.json har ugyldig entry for ${cat}/${lvl}`);
      }
      if (entry.ci95Low > entry.hours || entry.hours > entry.ci95High) {
        throw new Error(
          `CI-integritet brutt for ${cat}/${lvl}: [${entry.ci95Low}, ${entry.hours}, ${entry.ci95High}]`,
        );
      }
    }
  }

  // Sjekk at empirical shares summerer til ~1.0 (±0.05 toleranse)
  const empSum = categories
    .map((c) => tableData.empiricalDistribution.shares[c].mean)
    .reduce((a, b) => a + b, 0);
  if (Math.abs(empSum - 1.0) > 0.05) {
    throw new Error(
      `Empirical shares summerer til ${empSum.toFixed(3)} (forventet ≈ 1.0). Sjekk JSON.`,
    );
  }

  // Sjekk overlap-factor er i (0, 1]
  const ovf = tableData.overlapFactor.value;
  if (ovf <= 0 || ovf > 1) {
    throw new Error(`overlapFactor må være i (0, 1], er ${ovf}`);
  }
}

// Kjør validering ved modulinnlasting
validateTable();
