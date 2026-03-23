"use client";

import { usePlan } from "@/components/dashboard/DashboardShell";
import { TestScheduleCard } from "@/components/dashboard/TestScheduleCard";

export default function TesterPage() {
  const { plan } = usePlan();
  const { testPlan } = plan;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="w-heading-md mb-1">Testplan</h1>
        <p className="text-sm text-ink-50">
          Systematisk testing for a male fremgang og justere planen.
        </p>
      </div>

      {/* Test timeline */}
      <div className="space-y-4">
        {testPlan.schedule.map((entry) => (
          <TestScheduleCard
            key={entry.weekNumber}
            entry={entry}
            protocols={testPlan.protocols}
            targets={testPlan.targets}
          />
        ))}
      </div>

      {/* Coming soon: Test result form */}
      <div className="w-card p-6 text-center border-2 border-dashed border-ink-10">
        <p className="text-sm font-semibold text-ink-50 mb-1">
          Registrering av testresultater
        </p>
        <p className="text-xs text-ink-50">
          Kommer snart — logg testresultatene dine og se planen justeres
          automatisk.
        </p>
      </div>
    </div>
  );
}
