/**
 * Kategori-krav A-K for de 20 fastsatte AK-golftestene.
 *
 * Kilde: AK Golf Academy Masterdokument v2.0 (april 2026), tilpasset
 * SPILLERKARTLEGGING_SPEC.md seksjon 8.
 *
 * Hver test har en numerisk terskel per kategori. Hvis spillerens beregnede
 * `value` matcher kategori-kravet (passer terskelen i `comparison`-retning),
 * regnes testen som "passed" pa det nivaet.
 *
 * Eksempel: Test 1 (Driver ballhastighet, higher_is_better) — A-spiller maa
 * holde 175 mph, K-spiller bare 105 mph.
 */

export type TestCategory = "TRACKMAN" | "SHORT_GAME" | "PUTTING" | "PHYSICAL" | "MENTAL";
export type TestComparison = "higher_is_better" | "lower_is_better" | "exact_match";
export type SkillCategory = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";

/**
 * Terskelverdier per test per kategori.
 *
 * For `higher_is_better`: spilleren passerer hvis value >= terskel.
 * For `lower_is_better`: spilleren passerer hvis value <= terskel.
 * For `exact_match`: spilleren passerer hvis abs(value - terskel) <= 0.05.
 */
export const CATEGORY_REQUIREMENTS: Record<number, Record<SkillCategory, number>> = {
  // ── TRACKMAN ─────────────────────────────────────────────
  1: { A: 175, B: 168, C: 160, D: 152, E: 145, F: 138, G: 130, H: 122, I: 115, J: 110, K: 105 }, // mph
  2: { A: 280, B: 265, C: 250, D: 235, E: 220, F: 205, G: 190, H: 175, I: 160, J: 145, K: 130 }, // m
  3: { A: 12, B: 14, C: 16, D: 19, E: 22, F: 26, G: 30, H: 35, I: 40, J: 45, K: 50 }, // m std (lower)
  4: { A: 165, B: 160, C: 155, D: 148, E: 140, F: 132, G: 122, H: 112, I: 100, J: 90, K: 80 }, // m
  5: { A: 6, B: 8, C: 10, D: 12, E: 15, F: 18, G: 22, H: 26, I: 30, J: 34, K: 38 }, // m std (lower)
  6: { A: 80, B: 72, C: 65, D: 58, E: 50, F: 42, G: 35, H: 28, I: 22, J: 16, K: 10 }, // %
  7: { A: 1.49, B: 1.48, C: 1.47, D: 1.46, E: 1.44, F: 1.42, G: 1.40, H: 1.38, I: 1.35, J: 1.32, K: 1.28 }, // ratio
  // ── SHORT GAME ───────────────────────────────────────────
  8: { A: 18, B: 16, C: 15, D: 14, E: 12, F: 10, G: 8, H: 6, I: 5, J: 4, K: 3 }, // poeng/20
  9: { A: 1.5, B: 2.0, C: 2.5, D: 3.0, E: 3.5, F: 4.5, G: 5.5, H: 7.0, I: 9.0, J: 12.0, K: 15.0 }, // m (lower)
  10: { A: 2.0, B: 2.5, C: 3.0, D: 3.5, E: 4.0, F: 5.0, G: 6.0, H: 7.5, I: 9.0, J: 11.0, K: 13.0 }, // m (lower)
  11: { A: 5, B: 4, C: 4, D: 3, E: 3, F: 2, G: 2, H: 2, I: 1, J: 1, K: 0 }, // antall/5
  // ── PUTTING ──────────────────────────────────────────────
  12: { A: 100, B: 98, C: 95, D: 92, E: 88, F: 82, G: 75, H: 65, I: 55, J: 45, K: 35 }, // % 1m
  13: { A: 65, B: 58, C: 52, D: 46, E: 40, F: 34, G: 28, H: 22, I: 16, J: 10, K: 6 }, // % 3m
  14: { A: 35, B: 28, C: 22, D: 18, E: 14, F: 10, G: 7, H: 5, I: 3, J: 2, K: 1 }, // % 6m
  15: { A: 30, B: 40, C: 50, D: 60, E: 75, F: 90, G: 110, H: 135, I: 165, J: 200, K: 250 }, // cm (lower)
  16: { A: 5, B: 5, C: 4, D: 4, E: 3, F: 3, G: 2, H: 2, I: 1, J: 1, K: 0 }, // poeng/5
  // ── PHYSICAL ─────────────────────────────────────────────
  17: { A: 75, B: 70, C: 65, D: 60, E: 55, F: 50, G: 45, H: 40, I: 35, J: 30, K: 25 }, // grader
  18: { A: 60, B: 50, C: 42, D: 35, E: 28, F: 22, G: 17, H: 13, I: 10, J: 7, K: 5 }, // sek
  19: { A: 2.7, B: 2.5, C: 2.3, D: 2.15, E: 2.0, F: 1.85, G: 1.7, H: 1.55, I: 1.4, J: 1.25, K: 1.1 }, // m
  // ── MENTAL ───────────────────────────────────────────────
  20: { A: 95, B: 88, C: 82, D: 75, E: 68, F: 60, G: 52, H: 45, I: 38, J: 30, K: 22 }, // poeng/100
};

/**
 * Sjekker om verdien passerer kategori-kravet.
 *
 * @param value Spillerens beregnede value
 * @param threshold Kategori-terskel
 * @param comparison Sammenligning fra TestDefinition
 */
export function meetsRequirement(
  value: number,
  threshold: number,
  comparison: TestComparison,
): boolean {
  switch (comparison) {
    case "higher_is_better":
      return value >= threshold;
    case "lower_is_better":
      return value <= threshold;
    case "exact_match":
      return Math.abs(value - threshold) <= 0.05;
  }
}

/**
 * Henter kategori-kravet for en spillers nivaa, eller default-niva (E)
 * hvis spillerens kategori er ukjent.
 */
export function getRequirementForCategory(
  testNumber: number,
  category: SkillCategory | null | undefined,
): number {
  const reqs = CATEGORY_REQUIREMENTS[testNumber];
  if (!reqs) return 0;
  const cat = (category ?? "E") as SkillCategory;
  return reqs[cat] ?? reqs.E;
}

/**
 * Finner hoyeste kategori spilleren har bestatt for en gitt test.
 * Returnerer null hvis ingen kategori er passert.
 */
export function getAchievedCategory(
  testNumber: number,
  value: number,
  comparison: TestComparison,
): SkillCategory | null {
  const reqs = CATEGORY_REQUIREMENTS[testNumber];
  if (!reqs) return null;
  const order: SkillCategory[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  for (const cat of order) {
    if (meetsRequirement(value, reqs[cat], comparison)) return cat;
  }
  return null;
}
