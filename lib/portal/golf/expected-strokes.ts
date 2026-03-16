/**
 * Expected Strokes Tables
 * Ported from akgolf-iup pei-to-sg.ts
 *
 * Based on PGA Tour statistics for strokes gained calculation.
 */

export type LieType = "tee" | "fairway" | "rough" | "bunker" | "recovery" | "green";

// Expected putts from green (0-28 meters)
const EXPECTED_PUTTS: [number, number][] = [
  [0.1, 1.0], [0.5, 1.02], [1.0, 1.1], [1.5, 1.2], [2.0, 1.4],
  [2.5, 1.5], [3.0, 1.6], [3.5, 1.66], [4.0, 1.72], [4.5, 1.78],
  [5.0, 1.82], [6.0, 1.9], [7.0, 1.96], [8.0, 2.0], [9.0, 2.04],
  [10.0, 2.07], [12.0, 2.13], [14.0, 2.18], [16.0, 2.212],
  [18.0, 2.244], [20.0, 2.276], [24.0, 2.34], [28.0, 2.406],
];

const EXPECTED_FAIRWAY: [number, number][] = [
  [5, 2.06], [10, 2.2], [20, 2.38], [30, 2.5], [50, 2.64],
  [70, 2.75], [90, 2.84], [100, 2.88], [120, 2.94], [140, 3.0],
  [160, 3.06], [180, 3.14], [200, 3.26], [240, 3.52], [280, 3.8],
  [350, 4.22], [450, 4.72], [550, 4.94],
];

const EXPECTED_ROUGH: [number, number][] = [
  [5, 2.22], [10, 2.36], [20, 2.54], [30, 2.66], [50, 2.82],
  [70, 2.94], [90, 3.04], [100, 3.08], [120, 3.16], [140, 3.24],
  [160, 3.34], [180, 3.46], [200, 3.62], [240, 3.94], [280, 4.26],
  [350, 4.74], [450, 5.06], [550, 5.13],
];

const EXPECTED_BUNKER: [number, number][] = [
  [5, 2.26], [10, 2.44], [14, 2.48], [20, 2.56], [30, 2.72],
  [50, 2.92], [80, 3.18], [100, 3.32], [150, 3.58], [200, 3.84],
  [300, 4.32], [500, 5.04],
];

const EXPECTED_RECOVERY: [number, number][] = [
  [10, 2.54], [20, 2.74], [30, 2.88], [50, 3.08], [75, 3.26],
  [100, 3.42], [150, 3.72], [200, 4.0], [300, 4.54], [500, 5.32],
];

const EXPECTED_TEE: [number, number][] = [
  [100, 2.95], [130, 2.97], [150, 3.0], [170, 3.06], [200, 3.2],
  [240, 3.42], [280, 3.66], [320, 3.88], [360, 4.02], [400, 4.14],
  [460, 4.44], [520, 4.82], [600, 4.92],
];

function lerp(x: number, x1: number, y1: number, x2: number, y2: number): number {
  if (x2 === x1) return y1;
  return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
}

function lookupFromTable(distance: number, table: [number, number][]): number {
  if (distance <= 0) return table[0][1];
  if (distance >= table[table.length - 1][0]) return table[table.length - 1][1];

  for (let i = 0; i < table.length - 1; i++) {
    const [d1, e1] = table[i];
    const [d2, e2] = table[i + 1];
    if (distance <= d2) return lerp(distance, d1, e1, d2, e2);
  }
  return table[table.length - 1][1];
}

export function getExpectedPutts(distanceMeters: number): number {
  return lookupFromTable(distanceMeters, EXPECTED_PUTTS);
}

const LIE_TABLES: Record<Exclude<LieType, "green">, [number, number][]> = {
  tee: EXPECTED_TEE,
  fairway: EXPECTED_FAIRWAY,
  rough: EXPECTED_ROUGH,
  bunker: EXPECTED_BUNKER,
  recovery: EXPECTED_RECOVERY,
};

export function getExpectedStrokes(distance: number, lie: LieType): number {
  if (lie === "green") return getExpectedPutts(distance);
  return lookupFromTable(distance, LIE_TABLES[lie]);
}
