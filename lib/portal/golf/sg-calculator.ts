/**
 * Strokes Gained Calculator
 * Beregner SG per slag basert pa expected strokes-tabeller.
 */

import { getExpectedStrokes, getExpectedPutts, type LieType } from "./expected-strokes";

export type SGCategory = "OFF_THE_TEE" | "APPROACH" | "SHORT_GAME" | "PUTTING";

export interface ShotSG {
  expectedBefore: number;
  expectedAfter: number;
  strokesGained: number;
  sgCategory: SGCategory;
}

/**
 * Kategoriser et slag basert pa lie og avstand
 */
export function categorizeSGShot(
  fromLie: LieType,
  fromDistance: number,
  toLie: LieType
): SGCategory {
  void toLie;
  if (fromLie === "green") return "PUTTING";
  if (fromLie === "tee") return "OFF_THE_TEE";
  if (
    fromDistance <= 50 &&
    (fromLie === "rough" ||
      fromLie === "fairway" ||
      fromLie === "bunker" ||
      fromLie === "recovery")
  ) {
    return "SHORT_GAME";
  }
  return "APPROACH";
}

/**
 * Beregn Strokes Gained for et enkelt slag.
 * SG = ExpectedStrokes(start) - ExpectedStrokes(slutt) - 1
 *
 * Spesialtilfelle: Hvis ballen gar i hullet (toDistance = 0, toLie = "hole"),
 * er expectedAfter = 0.
 */
export function calculateShotSG(
  fromLie: LieType,
  fromDistance: number,
  toLie: string,
  toDistance: number
): ShotSG {
  const expectedBefore =
    fromLie === "green"
      ? getExpectedPutts(fromDistance)
      : getExpectedStrokes(fromDistance, fromLie);

  const isHoled = toLie === "hole" || toDistance <= 0.05;
  const expectedAfter = isHoled
    ? 0
    : toLie === "green"
      ? getExpectedPutts(toDistance)
      : getExpectedStrokes(toDistance, toLie as LieType);

  const strokesGained = expectedBefore - expectedAfter - 1;
  const sgCategory = categorizeSGShot(fromLie, fromDistance, toLie as LieType);

  return {
    expectedBefore: Math.round(expectedBefore * 1000) / 1000,
    expectedAfter: Math.round(expectedAfter * 1000) / 1000,
    strokesGained: Math.round(strokesGained * 1000) / 1000,
    sgCategory,
  };
}

/**
 * Beregn total SG for en serie slag (et helt hull)
 */
export function calculateHoleSG(
  shots: Array<{
    fromLie: LieType;
    fromDistance: number;
    toLie: string;
    toDistance: number;
  }>
): {
  sgTotal: number;
  sgTee: number;
  sgApproach: number;
  sgShortGame: number;
  sgPutting: number;
} {
  let sgTee = 0;
  let sgApproach = 0;
  let sgShortGame = 0;
  let sgPutting = 0;

  for (const shot of shots) {
    const result = calculateShotSG(
      shot.fromLie,
      shot.fromDistance,
      shot.toLie,
      shot.toDistance
    );

    switch (result.sgCategory) {
      case "OFF_THE_TEE":
        sgTee += result.strokesGained;
        break;
      case "APPROACH":
        sgApproach += result.strokesGained;
        break;
      case "SHORT_GAME":
        sgShortGame += result.strokesGained;
        break;
      case "PUTTING":
        sgPutting += result.strokesGained;
        break;
    }
  }

  const round3 = (n: number) => Math.round(n * 1000) / 1000;

  return {
    sgTotal: round3(sgTee + sgApproach + sgShortGame + sgPutting),
    sgTee: round3(sgTee),
    sgApproach: round3(sgApproach),
    sgShortGame: round3(sgShortGame),
    sgPutting: round3(sgPutting),
  };
}

/**
 * Beregn forventet score for et hull basert pa hullets par og lengde
 * Bruker expected strokes fra tee
 */
export function expectedHoleScore(lengthMeter: number): number {
  return getExpectedStrokes(lengthMeter, "tee");
}
