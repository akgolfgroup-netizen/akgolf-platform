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
    // To-nivå gruppering: gruppe (AK Standard / Team Norway) → kategori
    const map = new Map<string, Map<string, TestOverviewData[]>>();
    for (const t of tests) {
      const groupKey = t.group || "Annet";
      const catKey = t.description || "Annet";
      if (!map.has(groupKey)) map.set(groupKey, new Map());
      const catMap = map.get(groupKey)!;
      const arr = catMap.get(catKey) ?? [];
      arr.push(t);
      catMap.set(catKey, arr);
    }
    return Array.from(map.entries()).map(([group, catMap]) => ({
      group,
      categories: Array.from(catMap.entries()),
    }));
  }, [tests]);

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case "TRACKMAN": return "TrackMan";
      case "SHORT_GAME": return "Nærspill";
      case "PUTTING": return "Putting";
      case "PHYSICAL": return "Fysisk";
      case "MENTAL": return "Mentalt";
      default: return cat;
    }
  };

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
    <div className="space-y-8">
      {grouped.map(({ group, categories }) => (
        <div key={group}>
          {/* Gruppe-header */}
          <div
            className="mb-4 flex items-center gap-2"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 700,
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: group === "Team Norway" ? "#D1F843" : "#005840",
              }}
            />
            {group}
          </div>

          {/* Kategorier innenfor gruppen */}
          <div className="space-y-5">
            {categories.map(([category, list]) => (
              <div key={category}>
                <div
                  className="mb-2 pl-3"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 700,
                  }}
                >
                  {categoryLabel(category)}
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
        </div>
      ))}
    </div>
  );
}
