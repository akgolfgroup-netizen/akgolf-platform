/**
 * Test-skedulerer (DECADE-protokoll).
 *
 * Standardvalg: 8 uker mellom test og retest. 12 uker for langtid-tester (TBD).
 *
 * Auto-skedulering trigges fra agent-runner.onTestResultLogged.
 * Brukes av:
 *   - TestRegister.tsx (ekstra UI-info når lagring er ferdig)
 *   - lib/portal/agents/runner.ts (allerede integrert)
 */

import { addDays } from "date-fns";

export const DEFAULT_RETEST_DAYS = 56; // 8 uker
export const LONG_TERM_RETEST_DAYS = 84; // 12 uker

/**
 * Tester som krever lengre intervall (typisk strukturelle endringer).
 * TODO Anders: utvid listen.
 */
const LONG_TERM_TEST_NUMBERS = new Set<number>([
  // Eksempel: 50, 80 osv. Wires opp etter avklaring.
]);

export interface RetestSchedule {
  testNumber: number;
  testName: string;
  completedAt: Date;
  nextRetestAt: Date;
  intervalDays: number;
  isLongTerm: boolean;
}

export function calculateRetestDate(
  testNumber: number,
  testName: string,
  completedAt: Date,
): RetestSchedule {
  const isLongTerm = LONG_TERM_TEST_NUMBERS.has(testNumber);
  const intervalDays = isLongTerm ? LONG_TERM_RETEST_DAYS : DEFAULT_RETEST_DAYS;
  const nextRetestAt = addDays(completedAt, intervalDays);

  return {
    testNumber,
    testName,
    completedAt,
    nextRetestAt,
    intervalDays,
    isLongTerm,
  };
}

/**
 * Sjekk om en test er forsinket (overdue) basert på siste lagrede testresultat.
 */
export function isTestOverdue(lastCompletedAt: Date, testNumber: number): boolean {
  const isLongTerm = LONG_TERM_TEST_NUMBERS.has(testNumber);
  const intervalDays = isLongTerm ? LONG_TERM_RETEST_DAYS : DEFAULT_RETEST_DAYS;
  const dueDate = addDays(lastCompletedAt, intervalDays);
  return dueDate < new Date();
}
