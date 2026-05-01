"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { isTestOverdue } from "@/lib/portal/training/test-scheduler";

export interface CoachTestRow {
  testNumber: number;
  name: string;
  category: string;
  unit: string;
  comparison: string;
  /** Siste resultat (kan vaere null om aldri utfort) */
  latest: {
    value: number;
    passed: boolean;
    createdAt: Date;
  } | null;
  /** Antall fullfortet tester (historikk) */
  historyCount: number;
  /** Dager siden siste utforing */
  daysSinceLatest: number | null;
  /** Om testen er forfalt (>56d siden siste utforing eller aldri utfort) */
  retestDue: boolean;
}

export interface CoachTestRegister {
  studentId: string;
  studentName: string | null;
  rows: CoachTestRow[];
  stats: {
    totalTests: number;
    completedTests: number;
    overdueTests: number;
    passedTests: number;
  };
}

/**
 * Henter test-register for en spiller fra coach-perspektiv.
 *
 * Bruker eksisterende `isTestOverdue` fra test-scheduler.ts (56d default,
 * 84d for langtid-tester).
 */
export async function getCoachTestRegister(
  studentId: string,
): Promise<CoachTestRegister | null> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  // Hent spiller + alle testdefinisjoner + alle test-resultater for spilleren
  const [student, definitions, allResults] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true },
    }),
    prisma.testDefinition.findMany({
      where: { testNumber: { lte: 20 } }, // kun de 20 fastsatte
      orderBy: { testNumber: "asc" },
    }),
    prisma.testResult.findMany({
      where: { userId: studentId },
      orderBy: { createdAt: "desc" },
      select: {
        testNumber: true,
        value: true,
        passed: true,
        createdAt: true,
      },
    }),
  ]);

  if (!student) return null;

  // Grupper resultater per testNumber
  const resultsByTest = new Map<number, typeof allResults>();
  for (const r of allResults) {
    const existing = resultsByTest.get(r.testNumber) ?? [];
    existing.push(r);
    resultsByTest.set(r.testNumber, existing);
  }

  const now = new Date();
  const rows: CoachTestRow[] = definitions.map((def) => {
    const results = resultsByTest.get(def.testNumber) ?? [];
    const latest = results[0] ?? null;
    const daysSinceLatest = latest
      ? Math.floor((now.getTime() - latest.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const retestDue = !latest || isTestOverdue(latest.createdAt, def.testNumber);

    return {
      testNumber: def.testNumber,
      name: def.name,
      category: def.category,
      unit: def.unit,
      comparison: def.comparison,
      latest: latest
        ? {
            value: latest.value,
            passed: latest.passed,
            createdAt: latest.createdAt,
          }
        : null,
      historyCount: results.length,
      daysSinceLatest,
      retestDue,
    };
  });

  const completedTests = rows.filter((r) => r.latest !== null).length;
  const overdueTests = rows.filter((r) => r.retestDue).length;
  const passedTests = rows.filter((r) => r.latest?.passed === true).length;

  return {
    studentId: student.id,
    studentName: student.name,
    rows,
    stats: {
      totalTests: definitions.length,
      completedTests,
      overdueTests,
      passedTests,
    },
  };
}
