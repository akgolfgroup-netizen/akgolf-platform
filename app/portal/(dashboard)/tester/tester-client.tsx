"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";

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
              className="w-full text-left bg-surface-container-lowest rounded-xl border border-outline-variant p-4 hover:border-black/8 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-outline tabular-nums">
                      #{test.testNumber}
                    </span>
                    <span className="font-semibold text-on-surface">
                      {test.name}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {test.description}
                  </p>
                </div>
                <div className="text-right">
                  {test.userBest ? (
                    <div>
                      <div className="text-lg font-bold text-on-surface tabular-nums">
                        {test.userBest.value}
                        <span className="text-xs text-outline ml-1">
                          {test.unit}
                        </span>
                      </div>
                      <div className={`text-xs ${test.userBest.passed ? "text-success-text" : "text-outline"}`}>
                        {test.userBest.passed ? "Bestatt" : "Ikke bestatt"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-outline">
                      Ingen resultat
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

          {tests.length === 0 && (
            <p className="text-center text-sm text-outline py-8">
              Ingen tester tilgjengelig
            </p>
          )}
        </div>
      ) : (
        /* Leaderboard for valgt test */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTest(null)}
            className="text-sm text-primary hover:underline"
          >
            Tilbake til alle tester
          </button>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-on-surface">
                  {selectedTestData?.name}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {selectedTestData?.description}
                </p>
              </div>
              {userRank && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary tabular-nums">
                    #{userRank}
                  </div>
                  <div className="text-xs text-outline">Din plass</div>
                </div>
              )}
            </div>

            {/* Periode-filter */}
            <div className="flex gap-1.5 rounded-[10px] bg-surface-container p-[3px] mb-4">
              {[
                { id: "all" as const, label: "Alle" },
                { id: "month" as const, label: "Denne maned" },
                { id: "week" as const, label: "Denne uke" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  className={`flex-1 py-[7px] rounded-[7px] text-[13px] font-medium transition-all ${
                    period === p.id
                      ? "bg-primary text-surface shadow-[0_2px_8px_rgba(0,88,64,0.3)]"
                      : "text-outline hover:text-on-surface-variant"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Leaderboard */}
            {isPending ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-2 border-outline border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between py-3 px-3 rounded-lg ${
                      entry.isCurrentUser ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 text-center font-bold tabular-nums ${
                          entry.rank === 1
                            ? "text-warning"
                            : entry.rank === 2
                              ? "text-outline"
                              : entry.rank === 3
                                ? "text-warning"
                                : "text-outline"
                        }`}
                      >
                        {entry.rank <= 3 ? (
                          <Icon name="military_tech" className="h-5 w-5 inline" />
                        ) : (
                          entry.rank
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          entry.isCurrentUser
                            ? "font-bold text-on-surface"
                            : "text-on-surface"
                        }`}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-on-surface tabular-nums">
                        {entry.bestValue} {selectedTestData?.unit}
                      </span>
                      {entry.passed && (
                        <span className="text-xs text-success-text">
                          Bestatt
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-sm text-outline py-8">
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
