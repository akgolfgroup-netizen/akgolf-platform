"use client";

import { useState } from "react";
import { SideExercises } from "./side-exercises";
import { SidePyramid } from "./side-pyramid";
import { SideTemplates } from "./side-templates";
import type { ExerciseTemplate, SessionLevel, WeekTemplate } from "./types";

type Tab = "ex" | "pyr" | "mal";

interface RightSidebarProps {
  exercises: ExerciseTemplate[];
  templates: WeekTemplate[];
  pyramidDistribution: Record<SessionLevel, number>;
  weekBias: string;
  aiSuggestion?: { dateLabel: string; reason: string } | null;
}

export function RightSidebar({
  exercises,
  templates,
  pyramidDistribution,
  weekBias,
  aiSuggestion,
}: RightSidebarProps) {
  const [tab, setTab] = useState<Tab>("ex");

  return (
    <aside
      className="hidden xl:flex flex-col overflow-hidden rounded-[16px]"
      style={{
        background: "#0A1F18",
        border: "1px solid #1a4a3a",
        width: "388px",
      }}
    >
      <div
        className="flex"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <SideTabBtn
          active={tab === "ex"}
          onClick={() => setTab("ex")}
          label="Øvelser"
          count={exercises.length}
        />
        <SideTabBtn
          active={tab === "pyr"}
          onClick={() => setTab("pyr")}
          label="AK-pyramide"
        />
        <SideTabBtn
          active={tab === "mal"}
          onClick={() => setTab("mal")}
          label="Maler"
          count={templates.length}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "ex" && (
          <SideExercises
            exercises={exercises}
            aiSuggestion={aiSuggestion}
          />
        )}
        {tab === "pyr" && (
          <SidePyramid
            distribution={pyramidDistribution}
            weekBias={weekBias}
          />
        )}
        {tab === "mal" && <SideTemplates templates={templates} />}
      </div>
    </aside>
  );
}

function SideTabBtn({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 px-2 py-3.5 text-[12px] font-semibold transition-colors"
      style={{
        background: "transparent",
        color: active ? "#D1F843" : "rgba(255,255,255,0.55)",
        borderBottom: `2px solid ${active ? "#D1F843" : "transparent"}`,
        marginBottom: "-1px",
        fontFamily: "var(--font-inter)",
      }}
    >
      {label}
      {count !== undefined && (
        <span
          className="ml-1 font-mono text-[9px]"
          style={{
            color: active ? "#D1F843" : "rgba(255,255,255,0.40)",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
