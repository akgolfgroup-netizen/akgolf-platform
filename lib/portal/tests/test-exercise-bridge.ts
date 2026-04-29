/**
 * Test ↔ Øvelse bro.
 *
 * Gjør det mulig å bruke TestDefinition som SessionExercise
 * i treningsplanleggeren. Ingen database-endringer nødvendig —
 * tester lagres som SessionExercise med testNumber satt.
 */

import type { SessionExercise } from "@/lib/portal/training/session-exercise-types";
import { nanoid } from "nanoid";
import { getTestArea, getTestPyramid } from "./test-battery";

export interface TestAsExercise {
  testNumber: number;
  name: string;
  category: string;
  unit: string;
  inputCount: number;
  comparison: string;
  source: "ak-standard" | "team-norway";
}

/**
 * Konverterer en TestDefinition til SessionExercise.
 * Brukes når en test dras inn i treningsplan-editoren.
 */
export function testToSessionExercise(
  test: TestAsExercise,
  overrides?: Partial<SessionExercise>
): SessionExercise {
  return {
    id: nanoid(),
    name: test.name,
    testNumber: test.testNumber,
    pyramid: getTestPyramid(test.testNumber) as any,
    area: getTestArea(test.testNumber) as any,
    durationMinutes: 30, // default varighet for en test
    repsWithBall: test.inputCount,
    focus: `${test.inputCount} slag — ${test.comparison === "higher_is_better" ? "høyere er bedre" : "lavere er bedre"}`,
    ...overrides,
  };
}

