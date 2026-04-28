"use client";

import { useState } from "react";
import { Plus, Wind, Film, Anchor, Target, Repeat, Play, CheckCircle2 } from "lucide-react";

interface Drill {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  category: "breath" | "visualization" | "focus";
  completed?: boolean;
  icon: "wind" | "film" | "anchor" | "target" | "repeat";
}

const ICON_MAP = {
  wind: Wind,
  film: Film,
  anchor: Anchor,
  target: Target,
  repeat: Repeat,
};

const DEFAULT_DRILLS: Drill[] = [
  {
    id: "1",
    name: "Box breathing · 4-4-4-4",
    description: "2 minutter · før runde eller når presset bygger seg",
    durationMin: 2,
    category: "breath",
    icon: "wind",
  },
  {
    id: "2",
    name: "Mental rehearsal · drive-hull",
    description: "Visualiser perfekt sving + landing 3× før hull",
    durationMin: 3.5,
    category: "visualization",
    icon: "film",
  },
  {
    id: "3",
    name: "Anchor-ord etter dårlig hull",
    description: "«Neste shot» · reset etter bogey eller verre",
    durationMin: 1,
    category: "focus",
    completed: true,
    icon: "anchor",
  },
  {
    id: "4",
    name: "Eksternt fokus · spike i bakken",
    description: "Velg objekt 3 m foran ballen for alignment",
    durationMin: 1,
    category: "focus",
    icon: "target",
  },
  {
    id: "5",
    name: "5-4-3-2-1 grounding",
    description: "Når roen er borte: 5 du ser, 4 du hører, …",
    durationMin: 4,
    category: "breath",
    icon: "repeat",
  },
];

const TABS = [
  { id: "all" as const, label: "Alle" },
  { id: "breath" as const, label: "Pust" },
  { id: "visualization" as const, label: "Visualisering" },
  { id: "focus" as const, label: "Fokus" },
];

export function DrillCard() {
  const [tab, setTab] = useState<"all" | "breath" | "visualization" | "focus">(
    "all",
  );

  const drills = tab === "all"
    ? DEFAULT_DRILLS
    : DEFAULT_DRILLS.filter((d) => d.category === tab);

  return (
    <section
      className="rounded-2xl"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "22px 24px",
      }}
    >
      <div className="flex justify-between items-center mb-3.5">
        <h4
          style={{
            margin: 0,
            fontSize: 16,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Mental drill-bibliotek
        </h4>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Legg til
        </button>
      </div>

      <div
        className="flex gap-1 p-1 rounded-[9px] mb-4"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {TABS.map((t) => {
          const isActive = tab === t.id;
          const count =
            t.id === "all"
              ? DEFAULT_DRILLS.length
              : DEFAULT_DRILLS.filter((d) => d.category === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="flex-1 px-2.5 py-1.5 rounded-md text-[11.5px] font-semibold transition"
              style={{
                background: isActive ? "rgba(175,82,222,0.20)" : "transparent",
                color: isActive ? "#D4AAF7" : "rgba(255,255,255,0.55)",
                border: "none",
              }}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5">
        {drills.map((d) => {
          const Icon = ICON_MAP[d.icon];
          return (
            <div
              key={d.id}
              className="flex gap-3.5 items-center rounded-xl px-3.5 py-3 transition cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: d.completed ? 0.6 : 1,
              }}
            >
              <div
                className="grid place-items-center flex-shrink-0"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(175,82,222,0.15)",
                  color: "#C99CF3",
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 600,
                    textDecoration: d.completed ? "line-through" : "none",
                  }}
                >
                  {d.name}
                </div>
                <div
                  className="mt-0.5"
                  style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}
                >
                  {d.description}
                </div>
              </div>
              <div
                className="flex gap-2.5 items-center flex-shrink-0"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {d.completed ? (
                  <CheckCircle2 className="w-4.5 h-4.5" style={{ color: "#6FCBA1" }} />
                ) : (
                  <>
                    <span>{d.durationMin}:00</span>
                    <div
                      className="grid place-items-center flex-shrink-0"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: "rgba(209,248,67,0.18)",
                        color: "#D1F843",
                      }}
                    >
                      <Play className="w-3 h-3" />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
