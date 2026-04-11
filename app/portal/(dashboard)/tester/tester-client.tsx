"use client";

import { useState, useTransition } from "react";
import { Medal } from "lucide-react";
import type { TestOverviewData } from "./actions";

type TestData = TestOverviewData;

interface LeaderboardEntry {
  userId: string;
  name: string;
  image: string | null;
  bestValue: number;
  passed: boolean;
  rank: number;
  isCurrentUser: boolean;
}

interface Props {
  tests: TestData[];
}

export function TesterClient({ tests }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");

  function loadLeaderboard(testNumber: number, p: string = period) {
    setSelectedTest(testNumber);
    startTransition(async () => {
      const res = await fetch(
        `/api/portal/tests/leaderboard?testNumber=${testNumber}&period=${p}`
      );
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard ?? []);
        setUserRank(data.userRank);
      }
    });
  }

  function handlePeriodChange(p: "all" | "month" | "week") {
    setPeriod(p);
    if (selectedTest !== null) {
      loadLeaderboard(selectedTest, p);
    }
  }

  const selectedTestData = tests.find((t) => t.testNumber === selectedTest);

  return (
    <div className="space-y-4">
      {/* Test-oversikt */}
      {selectedTest === null ? (
        <div className="space-y-3">
          {tests.map((test) => (
            <button
              key={test.testNumber}
              onClick={() => loadLeaderboard(test.testNumber)}
              className="w-full text-left bg-white rounded-xl border border-[var(--color-grey-200)] p-4 hover:border-[var(--color-brand)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--color-grey-400)]">
                      #{test.testNumber}
                    </span>
                    <span className="font-semibold text-[var(--color-grey-900)]">
                      {test.name}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-grey-500)] mt-1">
                    {test.description}
                  </p>
                </div>
                <div className="text-right">
                  {test.userBest ? (
                    <div>
                      <div className="text-lg font-bold text-[var(--color-grey-900)]">
                        {test.userBest.value}
                        <span className="text-xs text-[var(--color-grey-400)] ml-1">
                          {test.unit}
                        </span>
                      </div>
                      <div className={`text-xs ${test.userBest.passed ? "text-[var(--color-success-text)]" : "text-[var(--color-grey-400)]"}`}>
                        {test.userBest.passed ? "Bestatt" : "Ikke bestatt"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--color-grey-300)]">
                      Ingen resultat
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

          {tests.length === 0 && (
            <p className="text-center text-sm text-[var(--color-grey-400)] py-8">
              Ingen tester tilgjengelig
            </p>
          )}
        </div>
      ) : (
        /* Leaderboard for valgt test */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTest(null)}
            className="text-sm text-[var(--color-brand)] hover:underline"
          >
            Tilbake til alle tester
          </button>

          <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-grey-900)]">
                  {selectedTestData?.name}
                </h2>
                <p className="text-xs text-[var(--color-grey-500)]">
                  {selectedTestData?.description}
                </p>
              </div>
              {userRank && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-brand)]">
                    #{userRank}
                  </div>
                  <div className="text-xs text-[var(--color-grey-400)]">Din plass</div>
                </div>
              )}
            </div>

            {/* Periode-filter */}
            <div className="flex gap-1 bg-[var(--color-grey-100)] rounded-lg p-0.5 mb-4">
              {[
                { id: "all" as const, label: "Alle" },
                { id: "month" as const, label: "Denne maned" },
                { id: "week" as const, label: "Denne uke" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p.id
                      ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                      : "text-[var(--color-grey-500)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Leaderboard */}
            {isPending ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-2 border-[var(--color-grey-300)] border-t-[var(--color-brand)] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between py-3 px-3 rounded-lg ${
                      entry.isCurrentUser ? "bg-[var(--color-brand)]/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 text-center font-bold ${
                          entry.rank === 1
                            ? "text-yellow-500"
                            : entry.rank === 2
                              ? "text-[var(--color-grey-400)]"
                              : entry.rank === 3
                                ? "text-amber-600"
                                : "text-[var(--color-grey-300)]"
                        }`}
                      >
                        {entry.rank <= 3 ? (
                          <Medal className="h-5 w-5 inline" />
                        ) : (
                          entry.rank
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          entry.isCurrentUser
                            ? "font-bold text-[var(--color-grey-900)]"
                            : "text-[var(--color-grey-700)]"
                        }`}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--color-grey-900)] tabular-nums">
                        {entry.bestValue} {selectedTestData?.unit}
                      </span>
                      {entry.passed && (
                        <span className="text-xs text-[var(--color-success-text)]">
                          Bestatt
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-sm text-[var(--color-grey-400)] py-8">
                    Ingen resultater for denne perioden
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
