"use client";

import { useMemo, useState } from "react";
import type { TestOverviewData } from "./actions";
import { TestRow } from "@/components/portal/tester/v2/test-row";
import { TestLeaderboard } from "@/components/portal/tester/v2/test-leaderboard";

interface Props {
  tests: TestOverviewData[];
}

export function TesterClient({ tests }: Props) {
  const [selectedTestNumber, setSelectedTestNumber] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, TestOverviewData[]>();
    for (const t of tests) {
      const key = t.description || "Annet";
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [tests]);

  const selectedTest =
    selectedTestNumber !== null
      ? tests.find((t) => t.testNumber === selectedTestNumber) ?? null
      : null;

  if (selectedTest) {
    return (
      <TestLeaderboard
        test={selectedTest}
        onBack={() => setSelectedTestNumber(null)}
      />
    );
  }

  if (tests.length === 0) {
    return (
      <p
        className="text-center py-8"
        style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}
      >
        Ingen tester tilgjengelig
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([category, list]) => (
        <div key={category}>
          <div
            className="mb-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              fontWeight: 700,
            }}
          >
            {category}
          </div>
          <div className="flex flex-col gap-2">
            {list.map((t) => (
              <TestRow
                key={t.testNumber}
                test={t}
                onClick={() => setSelectedTestNumber(t.testNumber)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
