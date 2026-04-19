import "server-only";
import { prisma } from "@/lib/portal/prisma";
import type { TestHistory, TestHistoryEntry } from "./types";

const ALL_TEST_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

export async function getTestHistory(userId: string): Promise<TestHistory> {
  const [results, definitions] = await Promise.all([
    prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        testNumber: true,
        value: true,
        passed: true,
        createdAt: true,
        TestDefinition: { select: { name: true, unit: true } },
      },
    }),
    prisma.testDefinition.findMany({
      select: { testNumber: true, name: true, unit: true },
      orderBy: { testNumber: "asc" },
    }),
  ]);

  const defMap = new Map(
    definitions.map((d) => [d.testNumber, { name: d.name, unit: d.unit }])
  );

  const entries: TestHistoryEntry[] = results.map((r) => {
    const def = defMap.get(r.testNumber) ?? r.TestDefinition;
    return {
      testNumber: r.testNumber,
      testName: def?.name ?? `Test ${r.testNumber}`,
      value: r.value,
      unit: def?.unit ?? "",
      passed: r.passed,
      conductedAt: r.createdAt.toISOString(),
    };
  });

  const byNumber: Record<number, TestHistoryEntry[]> = {};
  for (const e of entries) {
    if (!byNumber[e.testNumber]) byNumber[e.testNumber] = [];
    byNumber[e.testNumber].push(e);
  }

  const recent: TestHistoryEntry[] = [];
  const seen = new Set<number>();
  for (const e of entries) {
    if (!seen.has(e.testNumber)) {
      seen.add(e.testNumber);
      recent.push(e);
    }
    if (recent.length >= 20) break;
  }

  const missingTests = ALL_TEST_NUMBERS.filter((n) => !seen.has(n));

  return { recent, byNumber, missingTests };
}
