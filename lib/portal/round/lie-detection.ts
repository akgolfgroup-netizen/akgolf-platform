import { booleanPointInPolygon } from "@turf/turf";
import type { Coord } from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from "geojson";

export type LieType = "tee" | "fairway" | "rough" | "bunker" | "green";

export interface HoleStrategyOverlay {
  fairway?: Feature<Polygon | MultiPolygon>[];
  rough?: Feature<Polygon | MultiPolygon>[];
  bunkers?: { name?: string; polygon: Feature<Polygon | MultiPolygon> }[];
  greens?: Feature<Polygon | MultiPolygon>[];
  hazards?: Feature<Polygon | MultiPolygon>[];
}

/**
 * Detekter lie fra GPS-posisjon basert på hull-overlay.
 * Prioritet: green > bunker > fairway > rough
 */
export function detectLieFromGps(
  position: Coord,
  overlay: HoleStrategyOverlay | null
): LieType | null {
  if (!overlay) return null;

  // 1. Sjekk green
  if (overlay.greens) {
    for (const green of overlay.greens) {
      if (booleanPointInPolygon(position, green)) {
        return "green";
      }
    }
  }

  // 2. Sjekk bunker
  if (overlay.bunkers) {
    for (const bunker of overlay.bunkers) {
      if (booleanPointInPolygon(position, bunker.polygon)) {
        return "bunker";
      }
    }
  }

  // 3. Sjekk fairway
  if (overlay.fairway) {
    for (const fw of overlay.fairway) {
      if (booleanPointInPolygon(position, fw)) {
        return "fairway";
      }
    }
  }

  // 4. Sjekk rough
  if (overlay.rough) {
    for (const rough of overlay.rough) {
      if (booleanPointInPolygon(position, rough)) {
        return "rough";
      }
    }
  }

  // Utenfor kjente soner
  return null;
}
