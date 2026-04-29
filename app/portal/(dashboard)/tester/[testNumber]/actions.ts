"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { calculateValue } from "@/lib/portal/tests/calculate";
import {
  getRequirementForCategory,
  meetsRequirement,
  type SkillCategory,
} from "@/lib/portal/tests/category-requirements";
import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";

/**
 * Lagrer test-resultat. Beregner value fra raw input via calculate.ts,
 * sjekker pass/fail mot kategori-krav, og redirecter til resultat-side.
 */
export async function submitTestResult(
  testNumber: number,
  rawInputs: number[],
  redirectTo?: string,
): Promise<void> {
  const user = await requirePortalUser();

  const test = await prisma.testDefinition.findUnique({
    where: { testNumber },
  });
  if (!test) throw new Error(`Test ${testNumber} ikke funnet`);

  // Beregn aggregert value fra raw input via formula-spec
  const value = calculateValue(testNumber, rawInputs);

  // Hent spillerens kategori (default F om ikke satt)
  const usi = await prisma.unifiedSkillSnapshot.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { estimatedCategory: true },
  });
  const category = (usi?.estimatedCategory ?? "F") as SkillCategory;
  const skillLevel = getSkillLevelByCode(category);

  // Hent kategori-krav-verdi (terskel for a passere) + sammenlignings-retning
  const threshold = getRequirementForCategory(testNumber, category);
  const test2 = await prisma.testDefinition.findUnique({
    where: { testNumber },
    select: { comparison: true },
  });
  const comparison = (test2?.comparison ?? "higher_is_better") as
    | "higher_is_better"
    | "lower_is_better"
    | "exact_match";

  const passed = meetsRequirement(value, threshold, comparison);
  const categoryReq = threshold;
  void skillLevel;

  await prisma.testResult.create({
    data: {
      id: nanoid(),
      userId: user.id,
      testNumber,
      value,
      rawInput: rawInputs,
      passed,
      categoryReq,
    },
  });

  revalidatePath("/portal/tester");

  // Redirect til treningsplan hvis test ble startet derfra
  if (redirectTo) {
    redirect(redirectTo);
  }
  redirect(`/portal/tester/${testNumber}/resultat`);
}
