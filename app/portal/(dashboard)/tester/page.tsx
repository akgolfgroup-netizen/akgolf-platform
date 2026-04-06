import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { TesterClient } from "./tester-client";

export const dynamic = "force-dynamic";

export default async function TesterPage() {
  const user = await requirePortalUser();

  // Hent alle testdefinisjoner
  const testDefinitions = await prisma.testDefinition.findMany({
    orderBy: { testNumber: "asc" },
    select: {
      testNumber: true,
      name: true,
      unit: true,
      comparison: true,
      category: true,
    },
  });

  // Hent brukerens beste resultater
  const userResults = await prisma.testResult.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      testNumber: true,
      value: true,
      passed: true,
      createdAt: true,
    },
  });

  // Grupper per test — ta beste
  const bestPerTest = new Map<number, { value: number; passed: boolean; date: string }>();
  for (const r of userResults) {
    const existing = bestPerTest.get(r.testNumber);
    const def = testDefinitions.find((t) => t.testNumber === r.testNumber);
    const isBetter = def?.comparison === "higher"
      ? !existing || r.value > existing.value
      : !existing || r.value < existing.value;

    if (isBetter) {
      bestPerTest.set(r.testNumber, {
        value: r.value,
        passed: r.passed,
        date: r.createdAt.toISOString(),
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          DECADE Tester
        </h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Standardiserte tester for a male fremgang. Sammenlign med andre spillere.
        </p>
      </div>

      <TesterClient
        tests={testDefinitions.map((t) => ({
          testNumber: t.testNumber,
          name: t.name,
          unit: t.unit ?? "",
          higherIsBetter: t.comparison === "higher",
          description: t.category ?? "",
          userBest: bestPerTest.get(t.testNumber) ?? null,
        }))}
      />
    </div>
  );
}
