/**
 * Unit Conversion Utilities for Golf Distances
 * 
 * Støtter to enhetssystemer:
 * - IMPERIAL: Yards (for slag) + Feet (for putting)
 * - METRIC: Meters (for alt)
 * 
 * Alle interne lagringer skjer i meters (base unit).
 * Konvertering skjer kun ved visning/input.
 */

export type UnitSystem = "IMPERIAL" | "METRIC";

// Konverteringsfaktorer
const YARDS_TO_METERS = 0.9144;
const FEET_TO_METERS = 0.3048;
const METERS_TO_YARDS = 1 / YARDS_TO_METERS;
const METERS_TO_FEET = 1 / FEET_TO_METERS;

// ════════════════════════════════════════════════════════════
// KONVERTERING FRA LAGRET VERDI (meters) TIL VISNING
// ════════════════════════════════════════════════════════════

/**
 * Konverter meter til visningsenhet for full swing/distances
 * IMPERIAL → Yards (hele yards)
 * METRIC → Meters (hele meter)
 */
export function formatDistance(meters: number, unitSystem: UnitSystem): string {
  if (unitSystem === "IMPERIAL") {
    const yards = Math.round(meters * METERS_TO_YARDS);
    return `${yards} yd`;
  }
  const m = Math.round(meters);
  return `${m} m`;
}

/**
 * Konverter meter til visningsenhet for putting
 * IMPERIAL → Feet (med 1 desimal)
 * METRIC → Meters (med 2 desimaler)
 */
export function formatPuttingDistance(meters: number, unitSystem: UnitSystem): string {
  if (unitSystem === "IMPERIAL") {
    const feet = Math.round(meters * METERS_TO_FEET * 10) / 10;
    return `${feet} ft`;
  }
  const m = Math.round(meters * 100) / 100;
  return `${m} m`;
}

/**
 * Konverter meter til tall for visning (uten enhet)
 */
export function toDisplayValue(meters: number, unitSystem: UnitSystem, type: "full" | "putting" = "full"): number {
  if (unitSystem === "IMPERIAL") {
    if (type === "putting") {
      return Math.round(meters * METERS_TO_FEET * 10) / 10;
    }
    return Math.round(meters * METERS_TO_YARDS);
  }
  if (type === "putting") {
    return Math.round(meters * 100) / 100;
  }
  return Math.round(meters);
}

/**
 * Hent enhet-label for visning
 */
export function getUnitLabel(unitSystem: UnitSystem, type: "full" | "putting" = "full"): string {
  if (unitSystem === "IMPERIAL") {
    return type === "putting" ? "ft" : "yd";
  }
  return "m";
}

// ════════════════════════════════════════════════════════════
// KONVERTERING FRA INPUT TIL LAGRING (meters)
// ════════════════════════════════════════════════════════════

/**
 * Konverter input-verdi til meter for lagring
 * IMPERIAL: Yards → Meters
 * METRIC: Meters → Meters
 */
export function toMeters(value: number, unitSystem: UnitSystem, type: "full" | "putting" = "full"): number {
  if (unitSystem === "IMPERIAL") {
    if (type === "putting") {
      // Input er i feet
      return value * FEET_TO_METERS;
    }
    // Input er i yards
    return value * YARDS_TO_METERS;
  }
  // METRIC: Allerede i meters
  return value;
}

/**
 * Konverter yards (f.eks. fra DataGolf) til meters
 */
export function yardsToMeters(yards: number): number {
  return yards * YARDS_TO_METERS;
}

/**
 * Konverter feet til meters
 */
export function feetToMeters(feet: number): number {
  return feet * FEET_TO_METERS;
}

/**
 * Konverter meters til yards
 */
export function metersToYards(meters: number): number {
  return meters * METERS_TO_YARDS;
}

/**
 * Konverter meters til feet
 */
export function metersToFeet(meters: number): number {
  return meters * METERS_TO_FEET;
}

// ════════════════════════════════════════════════════════════
// AVSTANDSOMRÅDER / BUCKETS
// ════════════════════════════════════════════════════════════

/**
 * Approach distance buckets som brukes i DataGolf og systemet
 * Lagres i yards (standard golf), konverteres ved visning
 */
export const APPROACH_BUCKETS_YARDS = [
  { min: 0, max: 75, label: "< 75" },
  { min: 75, max: 100, label: "75-100" },
  { min: 100, max: 125, label: "100-125" },
  { min: 125, max: 150, label: "125-150" },
  { min: 150, max: 175, label: "150-175" },
  { min: 175, max: 200, label: "175-200" },
  { min: 200, max: 225, label: "200-225" },
  { min: 225, max: Infinity, label: "225+" },
] as const;

/**
 * Training area distance ranges (intern lagring i meters)
 */
export const TRAINING_AREA_RANGES_METERS = {
  INN200: { min: 200, max: Infinity, labelNO: "200+ m", labelEN: "200+ m" },
  INN150: { min: 150, max: 200, labelNO: "150-200 m", labelEN: "150-200 m" },
  INN100: { min: 100, max: 150, labelNO: "100-150 m", labelEN: "100-150 m" },
  INN50: { min: 50, max: 100, labelNO: "50-100 m", labelEN: "50-100 m" },
} as const;

/**
 * Putting distance ranges (intern lagring i feet som meters)
 */
export const PUTTING_RANGES_FEET = {
  "PUTT0-3": { min: 0, max: 3, labelNO: "0-3 ft", labelEN: "0-3 ft" },
  "PUTT3-5": { min: 3, max: 5, labelNO: "3-5 ft", labelEN: "3-5 ft" },
  "PUTT5-10": { min: 5, max: 10, labelNO: "5-10 ft", labelEN: "5-10 ft" },
  "PUTT10-15": { min: 10, max: 15, labelNO: "10-15 ft", labelEN: "10-15 ft" },
  "PUTT15+": { min: 15, max: Infinity, labelNO: "15+ ft", labelEN: "15+ ft" },
} as const;

/**
 * Formater approach bucket label basert på brukerens enhets-preferanse
 */
export function formatApproachBucket(
  bucketLabel: string, 
  unitSystem: UnitSystem
): string {
  if (unitSystem === "METRIC") {
    // Konverter yards til meters for visning
    const match = bucketLabel.match(/(\d+)(?:-(\d+))?([+]?)/);
    if (!match) return bucketLabel;
    
    const min = parseInt(match[1], 10);
    const max = match[2] ? parseInt(match[2], 10) : null;
    const isPlus = match[3] === "+" || bucketLabel.includes("+");
    
    const minMeters = Math.round(yardsToMeters(min));
    if (isPlus || max === null) {
      return `${minMeters}+ m`;
    }
    const maxMeters = Math.round(yardsToMeters(max));
    return `${minMeters}-${maxMeters} m`;
  }
  // IMPERIAL: Vis original med yards
  return bucketLabel.includes("yd") ? bucketLabel : `${bucketLabel} yd`;
}

/**
 * Formater training area label
 */
export function formatTrainingAreaLabel(
  areaCode: string,
  unitSystem: UnitSystem
): { label: string; labelNO: string } {
  const range = TRAINING_AREA_RANGES_METERS[areaCode as keyof typeof TRAINING_AREA_RANGES_METERS];
  if (!range) return { label: areaCode, labelNO: areaCode };
  
  if (unitSystem === "IMPERIAL") {
    // Konverter meters til yards
    const minYards = Math.round(metersToYards(range.min));
    const maxYards = range.max === Infinity ? null : Math.round(metersToYards(range.max));
    
    if (maxYards === null) {
      return {
        label: `Approach ${minYards}+ yd`,
        labelNO: `Innspill ${minYards}+ m` // Norsk beholdes med m for lesbarhet
      };
    }
    return {
      label: `Approach ${minYards}-${maxYards} yd`,
      labelNO: `Innspill ${range.min}-${range.max} m`
    };
  }
  
  return {
    label: range.labelEN,
    labelNO: range.labelNO
  };
}

/**
 * Formater putting område label
 */
export function formatPuttingLabel(
  puttCode: string,
  unitSystem: UnitSystem
): { label: string; labelNO: string } {
  const range = PUTTING_RANGES_FEET[puttCode as keyof typeof PUTTING_RANGES_FEET];
  if (!range) return { label: puttCode, labelNO: puttCode };
  
  if (unitSystem === "METRIC") {
    // Konverter feet til meters
    const minMeters = Math.round(feetToMeters(range.min) * 10) / 10;
    const maxMeters = range.max === Infinity ? null : Math.round(feetToMeters(range.max) * 10) / 10;
    
    if (maxMeters === null) {
      return {
        label: `${minMeters}+ m`,
        labelNO: `${minMeters}+ m`
      };
    }
    return {
      label: `${minMeters}-${maxMeters} m`,
      labelNO: `${minMeters}-${maxMeters} m`
    };
  }
  
  return {
    label: range.labelEN,
    labelNO: range.labelNO
  };
}

// ════════════════════════════════════════════════════════════
// HJELPEFUNKSJONER
// ════════════════════════════════════════════════════════════

/**
 * Parse input string til tall (håndterer både komma og punktum)
 */
export function parseDistanceInput(input: string): number | null {
  const normalized = input.replace(",", ".").trim();
  const value = parseFloat(normalized);
  return isNaN(value) ? null : value;
}

/**
 * Valider at input er gyldig avstand
 */
export function validateDistance(value: number, type: "full" | "putting" = "full"): boolean {
  if (type === "putting") {
    // Putting: 0-100 feet / 0-30 meter
    return value >= 0 && value <= 30;
  }
  // Full swing: 0-500 yards / 0-460 meter
  return value >= 0 && value <= 500;
}

/**
 * Hent default unit system basert på locale
 * Norge/Scandinavia → METRIC
 * USA/UK → IMPERIAL
 */
export function getDefaultUnitSystem(locale: string): UnitSystem {
  const imperialLocales = ["en-US", "en-GB", "en-CA"];
  return imperialLocales.includes(locale) ? "IMPERIAL" : "METRIC";
}
