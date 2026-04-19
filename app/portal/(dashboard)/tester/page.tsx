import { requirePortalUser } from "@/lib/portal/auth";
import { getTestsOverview, getTesterStats } from "./actions";
import { TesterClient } from "./tester-client";

import { MonoLabel } from "@/components/portal/patterns";
export const metadata = {
  title: "DECADE Tester | AK Golf Portal",
};

export default async function TesterPage() {
  await requirePortalUser();

  const [tests, stats] = await Promise.all([
    getTestsOverview(),
    getTesterStats(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-portal-text">
          DECADE Tester
        </h1>
        <p className="text-portal-secondary mt-1">
          Standardiserte tester for å måle fremgang
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-card p-5">
          <MonoLabel as="p" size="xs" uppercase className="text-portal-secondary block">Fullførte tester</MonoLabel>
          <p className="text-3xl font-bold text-portal-text mt-1 tabular-nums">
            {stats.completedTests}/{stats.totalTests}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <MonoLabel as="p" size="xs" uppercase className="text-portal-secondary block">Total score</MonoLabel>
          <p className="text-3xl font-bold text-portal-text mt-1 tabular-nums">
            {stats.totalScore}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <MonoLabel as="p" size="xs" uppercase className="text-portal-secondary block">Tilgjengelige tester</MonoLabel>
          <p className="text-3xl font-bold text-portal-text mt-1 tabular-nums">
            {stats.totalTests}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <MonoLabel as="p" size="xs" uppercase className="text-portal-secondary block">Beste test</MonoLabel>
          <p className="text-3xl font-bold text-portal-text mt-1">
            {stats.bestTestName ?? "-"}
          </p>
        </div>
      </div>

      {/* Test-liste og leaderboard */}
      <TesterClient tests={tests} />
    </div>
  );
}
