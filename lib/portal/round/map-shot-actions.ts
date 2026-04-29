"use server";

import { logShot } from "./shot-actions";
import type { ShotData } from "./shot-types";

/**
 * Adapter: F3 kart-modus → F2 logShot.
 * Omgjør ShotData-formatet til F2s logShot-signatur.
 */
export async function logShotWithGps(data: ShotData) {
  return logShot(data.roundId, {
    holeNumber: data.holeNumber,
    holeId: data.holeId,
    shotNumber: data.shotNumber,
    club: data.club,
    fromLie: data.fromLie,
    fromDistance: data.fromDistance,
    toLie: data.toLie,
    toDistance: data.toDistance,
    fromLat: data.fromLat,
    fromLng: data.fromLng,
    toLat: data.toLat,
    toLng: data.toLng,
    par: data.par,
  });
}
