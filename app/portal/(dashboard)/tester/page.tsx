import { requirePortalUser } from "@/lib/portal/auth";
import { getTestsOverview, getTesterStats } from "./actions";
import { TesterClient } from "./tester-client";

import { MonoLabel, BentoGrid, BentoCard } from "@/components/portal/patterns";
export const metadata = {
  title: "DECADE Tester | PlayersHQ",
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
        <MonoLabel size="xs" uppercase className="mb-2 block text-on-surface-variant">
          DECADE System
        </MonoLabel>
        <h1 className="text-2xl font-bold text-on-surface">
          Tester
        </h1>
        <p className="text-on-surface-variant mt-1">
          Standardiserte tester for å måle fremgang
        </p>
      </div>

      {/* Stats */}
      <BentoGrid cols={4} gap="md">
        <BentoCard variant="light" padding="md">
          <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Fullførte tester</MonoLabel>
          <p className="text-3xl font-bold text-on-surface mt-1 tabular-nums">
            {stats.completedTests}/{stats.totalTests}
          </p>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Total score</MonoLabel>
          <p className="text-3xl font-bold text-on-surface mt-1 tabular-nums">
            {stats.totalScore}
          </p>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Tilgjengelige tester</MonoLabel>
          <p className="text-3xl font-bold text-on-surface mt-1 tabular-nums">
            {stats.totalTests}
          </p>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Beste test</MonoLabel>
          <p className="text-lg font-bold text-on-surface mt-1">
            {stats.bestTestName ?? "–"}
          </p>
        </BentoCard>
      </BentoGrid>

      {/* Test-liste og leaderboard */}
      <TesterClient tests={tests} />
    </div>
  );
}
