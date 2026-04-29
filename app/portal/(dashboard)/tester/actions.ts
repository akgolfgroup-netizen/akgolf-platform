"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";

// ── Types ──

export interface TestOverviewData {
  testNumber: number;
  name: string;
  unit: string;
  higherIsBetter: boolean;
  description: string;
  group: string;
  userBest: { value: number; passed: boolean; date: string } | null;
}

export interface TesterStats {
  totalTests: number;
  completedTests: number;
  totalScore: number;
  bestTestName: string | null;
}

// ── Actions ──

/**
 * Henter alle testdefinisjoner med brukerens beste resultat.
 */
export async function getTestsOverview(): Promise<TestOverviewData[]> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  // Hent alle testdefinisjoner
  const { data: definitions, error: defError } = await supabase
    .from("TestDefinition")
    .select("testNumber, name, category, unit, formula, comparison")
    .order("testNumber", { ascending: true });

  if (defError || !definitions) return [];

  // Hent alle brukerens resultater
  const { data: userResults, error: resError } = await supabase
    .from("TestResult")
    .select("testNumber, value, passed, createdAt")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (resError) return [];

  // Bygg oversikt med brukerens beste resultat per test
  return definitions.map((def) => {
    const results = (userResults ?? []).filter(
      (r) => r.testNumber === def.testNumber
    );

    let userBest: TestOverviewData["userBest"] = null;

    if (results.length > 0) {
      const sorted = [...results].sort((a, b) =>
        def.comparison === "higher"
          ? b.value - a.value
          : a.value - b.value
      );
      const best = sorted[0];
      userBest = {
        value: best.value,
        passed: best.passed,
        date: best.createdAt,
      };
    }

    // Team Norway-tester (21-38) vs AK Standard (1-20)
    const group = def.testNumber >= 21 ? "Team Norway" : "AK Standard";

    return {
      testNumber: def.testNumber,
      name: def.name,
      unit: def.unit,
      higherIsBetter: def.comparison === "higher",
      description: def.category ?? "",
      group,
      userBest,
    };
  });
}

/**
 * Henter samlede statistikker for brukerens tester.
 */
export async function getTesterStats(): Promise<TesterStats> {
  const user = await requirePortalUser();
  if (!user?.id) {
    return { totalTests: 0, completedTests: 0, totalScore: 0, bestTestName: null };
  }

  const supabase = await createServerSupabase();

  // Total antall tester
  const { data: definitions } = await supabase
    .from("TestDefinition")
    .select("testNumber, name, comparison");

  const totalTests = definitions?.length ?? 0;

  // Brukerens resultater
  const { data: userResults } = await supabase
    .from("TestResult")
    .select("testNumber, value, passed")
    .eq("userId", user.id);

  if (!userResults || userResults.length === 0) {
    return { totalTests, completedTests: 0, totalScore: 0, bestTestName: null };
  }

  // Unike tester brukeren har gjennomfort
  const completedTestNumbers = new Set(userResults.map((r) => r.testNumber));
  const completedTests = completedTestNumbers.size;

  // Beregn total score (sum av beste verdier)
  let totalScore = 0;
  let bestTestValue = -Infinity;
  let bestTestName: string | null = null;

  for (const def of definitions ?? []) {
    const testResults = userResults.filter(
      (r) => r.testNumber === def.testNumber
    );
    if (testResults.length === 0) continue;

    const sorted = [...testResults].sort((a, b) =>
      def.comparison === "higher"
        ? b.value - a.value
        : a.value - b.value
    );
    const bestValue = sorted[0].value;
    totalScore += bestValue;

    if (bestValue > bestTestValue) {
      bestTestValue = bestValue;
      bestTestName = def.name;
    }
  }

  return {
    totalTests,
    completedTests,
    totalScore: Math.round(totalScore),
    bestTestName,
  };
}
