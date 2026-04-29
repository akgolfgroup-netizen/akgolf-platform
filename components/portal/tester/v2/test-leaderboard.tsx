"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Medal } from "lucide-react";

import type { TestOverviewData } from "@/app/portal/(dashboard)/tester/actions";

interface LeaderboardEntry {
  userId: string;
  name: string;
  image: string | null;
  bestValue: number;
  passed: boolean;
  rank: number;
  isCurrentUser: boolean;
}

interface TestLeaderboardProps {
  test: TestOverviewData;
  onBack: () => void;
}

const PERIODS = [
  { id: "all" as const, label: "Alle" },
  { id: "month" as const, label: "Denne måned" },
  { id: "week" as const, label: "Denne uke" },
];

export function TestLeaderboard({ test, onBack }: TestLeaderboardProps) {
  const [isPending, startTransition] = useTransition();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");
  const [loaded, setLoaded] = useState(false);

  function loadFor(p: "all" | "month" | "week") {
    setPeriod(p);
    startTransition(async () => {
      const res = await fetch(
        `/api/portal/tests/leaderboard?testNumber=${test.testNumber}&period=${p}`,
      );
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard ?? []);
        setUserRank(data.userRank);
        setLoaded(true);
      }
    });
  }

  // Load on mount
  if (!loaded && !isPending) {
    loadFor("all");
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#D1F843",
        }}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Tilbake til alle tester
      </button>

      <div
        className="rounded-2xl"
        style={{
          background: "#0F2E23",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              {test.name}
            </h2>
            <p
              className="mt-1"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
            >
              {test.description}
            </p>
          </div>
          {userRank ? (
            <div className="text-center">
              <div
                style={{
                  fontFamily: "'Inter Tight', Inter, sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#D1F843",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                #{userRank}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Din plass
              </div>
            </div>
          ) : null}
        </div>

        <div
          className="flex gap-1 p-1 rounded-[10px] mb-4"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadFor(p.id)}
              className="flex-1 py-1.5 rounded-md text-[12.5px] font-semibold transition"
              style={{
                background:
                  period === p.id ? "rgba(209,248,67,0.18)" : "transparent",
                color: period === p.id ? "#D1F843" : "rgba(255,255,255,0.55)",
                border: "none",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {isPending ? (
          <div className="flex justify-center py-8">
            <div
              className="rounded-full animate-spin"
              style={{
                width: 24,
                height: 24,
                border: "2px solid rgba(255,255,255,0.10)",
                borderTopColor: "#D1F843",
              }}
            />
          </div>
        ) : leaderboard.length === 0 ? (
          <p
            className="text-center py-8"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}
          >
            Ingen resultater for denne perioden
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className="flex justify-between items-center py-2.5 px-3 rounded-lg"
                style={{
                  background: entry.isCurrentUser
                    ? "rgba(209,248,67,0.08)"
                    : "transparent",
                  border: entry.isCurrentUser
                    ? "1px solid rgba(209,248,67,0.20)"
                    : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 text-center"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      color:
                        entry.rank <= 3
                          ? "#E8B967"
                          : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {entry.rank <= 3 ? (
                      <Medal className="w-4 h-4 inline" />
                    ) : (
                      entry.rank
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: entry.isCurrentUser ? 700 : 500,
                      color: entry.isCurrentUser ? "#fff" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {entry.bestValue} {test.unit}
                  </span>
                  {entry.passed ? (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        color: "#6FCBA1",
                        fontWeight: 700,
                      }}
                    >
                      Bestått
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
