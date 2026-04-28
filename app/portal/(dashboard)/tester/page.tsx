import { requirePortalUser } from "@/lib/portal/auth";
import { getTestsOverview, getTesterStats } from "./actions";
import { TesterClient } from "./tester-client";
import { TesterShell } from "@/components/portal/tester/v2/tester-shell";
import { TesterPageHeader } from "@/components/portal/tester/v2/tester-page-header";
import { CompositeHero } from "@/components/portal/tester/v2/composite-hero";

export const metadata = {
  title: "Tester | PlayersHQ",
};

export default async function TesterPage() {
  await requirePortalUser();

  const [tests, stats] = await Promise.all([
    getTestsOverview(),
    getTesterStats(),
  ]);

  // Composite score 0-100: % of tests completed * (passing ratio bonus)
  const completionPct = stats.totalTests
    ? (stats.completedTests / stats.totalTests) * 100
    : 0;
  const passedCount = tests.filter((t) => t.userBest?.passed).length;
  const passingBonus = stats.completedTests
    ? (passedCount / stats.completedTests) * 30
    : 0;
  const compositeScore = Math.min(100, Math.round(completionPct * 0.7 + passingBonus));

  return (
    <TesterShell>
      <TesterPageHeader
        completedTests={stats.completedTests}
        totalTests={stats.totalTests}
      />

      <CompositeHero
        score={compositeScore}
        bestTestName={stats.bestTestName}
        totalScore={stats.totalScore}
      />

      <div className="mb-4 flex justify-between items-end" style={{ marginTop: 28 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Resultater
        </h3>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {tests.length} tester · {stats.completedTests} gjennomført
        </div>
      </div>

      <TesterClient tests={tests} />
    </TesterShell>
  );
}
