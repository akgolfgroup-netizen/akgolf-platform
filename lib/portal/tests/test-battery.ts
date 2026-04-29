/**
 * Testbatteri — hjelpefunksjoner for Team Norway + AK Golf tester.
 *
 * Brukes av:
 *   - Tester-oversikt (group, source, kategori)
 *   - Treningsplan (test som øvelse)
 *   - Nivå-vurdering (A–K-kategori basert på testresultater)
 */

export type TestSource = "ak-standard" | "team-norway";
export type TestBatteryCategory =
  | "golfslag"
  | "pei"
  | "teknikk"
  | "beslutning"
  | "trackman"
  | "putting"
  | "physical"
  | "mental";

/**
 * Hvilken "kilde" testen tilhører.
 */
export function getTestSource(testNumber: number): TestSource {
  return testNumber >= 21 ? "team-norway" : "ak-standard";
}

/**
 * Pen kategori-label for UI.
 */
export function getTestCategoryLabel(testNumber: number): string {
  if (testNumber >= 21 && testNumber <= 28) return "Golfslag";
  if (testNumber >= 29 && testNumber <= 31) return "PEI";
  if (testNumber >= 32 && testNumber <= 35) return "Teknikk";
  if (testNumber >= 36 && testNumber <= 37) return "Gate";
  if (testNumber === 38) return "Beslutning";

  // Eksisterende DECADE-protokoll
  if (testNumber >= 1 && testNumber <= 7) return "TrackMan";
  if (testNumber >= 8 && testNumber <= 11) return "Nærspill";
  if (testNumber >= 12 && testNumber <= 16) return "Putting";
  if (testNumber >= 17 && testNumber <= 19) return "Fysisk";
  if (testNumber === 20) return "Mentalt";

  return "Annet";
}

/**
 * Gruppe-navn for toppnivå-gruppering i UI.
 */
export function getTestGroup(testNumber: number): string {
  return getTestSource(testNumber) === "team-norway"
    ? "Team Norway"
    : "AK Standard";
}

/**
 * Sjekker om en SessionExercise refererer til en test.
 */
export function isTestExercise(
  exercise: { testNumber?: number | null | undefined }
): boolean {
  return typeof exercise.testNumber === "number" && exercise.testNumber > 0;
}

/**
 * Henter test-navn fra testNumber (brukes når vi bare har tallet).
 * Krever at test-definisjoner er lastet inn.
 */
export function getTestName(
  testNumber: number,
  definitions: Map<number, string>
): string {
  return definitions.get(testNumber) ?? `Test #${testNumber}`;
}

/**
 * Beregn PEI (Proximity Error Index) for et enkelt slag.
 *
 * PEI = resultDistance / targetDistance
 * Lavere er bedre. PEI > 1 betyr at ballen havnet lengre fra enn target.
 */
export function calculatePEI(
  targetDistance: number,
  resultDistance: number
): number {
  if (targetDistance <= 0) return 0;
  const pei = resultDistance / targetDistance;
  return Math.min(pei, 2.0); // Cap at 2.0 for å unngå ekstreme utslag
}

/**
 * Beregn gjennomsnittlig PEI for en serie slag.
 */
export function calculateAvgPEI(
  shots: { targetDistance: number; resultDistance: number }[]
): number {
  if (shots.length === 0) return 0;
  const sum = shots.reduce(
    (acc, s) => acc + calculatePEI(s.targetDistance, s.resultDistance),
    0
  );
  return Math.round((sum / shots.length) * 1000) / 1000;
}

/**
 * Test-til-pyramide-mapping.
 * Brukes når tester legges til i treningsplanen.
 */
export function getTestPyramid(testNumber: number): string {
  if (testNumber >= 1 && testNumber <= 7) return "SLAG";
  if (testNumber >= 8 && testNumber <= 11) return "SLAG";
  if (testNumber >= 12 && testNumber <= 16) return "PUTT";
  if (testNumber >= 17 && testNumber <= 19) return "FYS";
  if (testNumber >= 21 && testNumber <= 28) return "SLAG";
  if (testNumber >= 29 && testNumber <= 31) return "SLAG";
  if (testNumber >= 32 && testNumber <= 35) return "TEK";
  if (testNumber >= 36 && testNumber <= 37) return "SLAG";
  if (testNumber === 20 || testNumber === 38) return "SPILL";
  return "SLAG";
}

/**
 * Test-til-område-mapping.
 */
export function getTestArea(testNumber: number): string {
  if (testNumber >= 1 && testNumber <= 3) return "TEE";
  if (testNumber >= 4 && testNumber <= 7) return "IRON_50_100";
  if (testNumber >= 8 && testNumber <= 11) return "CHIP";
  if (testNumber >= 12 && testNumber <= 16) return "PUTT";
  if (testNumber >= 17 && testNumber <= 19) return "FYS";
  if (testNumber >= 21 && testNumber <= 28) return "CHIP";
  if (testNumber >= 29 && testNumber <= 31) return "CHIP";
  if (testNumber >= 32 && testNumber <= 33) return "TEE";
  if (testNumber >= 34 && testNumber <= 35) return "IRON_50_100";
  if (testNumber >= 36 && testNumber <= 37) return "CHIP";
  if (testNumber === 20 || testNumber === 38) return "SPILL";
  return "CHIP";
}
