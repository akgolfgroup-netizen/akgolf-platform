"use client";

import {
  LayoutGrid,
  Target,
  BarChart3,
  TrendingUp,
  Command,
  Check,
} from "lucide-react";
import type { ViewId } from "@/lib/portal/views/registry";

interface StepViewProps {
  defaultView: ViewId | null;
  onSelect: (id: ViewId) => void;
}

const OPTIONS: { id: ViewId; label: string; desc: string; Icon: typeof LayoutGrid }[] = [
  { id: "opt1", label: "Athletic Grid", desc: "Kraftfull oversikt med modulære widgets", Icon: LayoutGrid },
  { id: "opt2", label: "Focus Today", desc: "Dagens fokus og neste steg", Icon: Target },
  { id: "opt3", label: "Data Rich", desc: "Tall-tung med grafer og trend", Icon: BarChart3 },
  { id: "opt4", label: "Progress Story", desc: "Visuell progresjon over tid", Icon: TrendingUp },
  { id: "opt5", label: "Command Center", desc: "Hurtighandlinger og status", Icon: Command },
];

export function StepView({ defaultView, onSelect }: StepViewProps) {
  return (
    <div className="w-full max-w-[720px]">
      <div
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        Steg 3 av 4 · Visning
      </div>
      <h1
        className="mt-2.5 mb-3.5 text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-white"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        Velg standardvisning
      </h1>
      <p
        className="text-[15px] mb-8 max-w-[56ch]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Layouten dashboardet starter med. Du kan bytte når som helst senere.
      </p>

      <div className="space-y-3">
        {OPTIONS.map((opt) => {
          const selected = defaultView === opt.id;
          const Icon = opt.Icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className="w-full flex items-center gap-4 rounded-[12px] px-5 py-4 text-left transition-colors border"
              style={{
                background: selected ? "rgba(209,248,67,0.06)" : "#0D2E23",
                borderColor: selected ? "rgba(209,248,67,0.40)" : "#1a4a3a",
              }}
            >
              <div
                className="w-11 h-11 rounded-[10px] grid place-items-center shrink-0"
                style={{
                  background: selected ? "#D1F843" : "rgba(255,255,255,0.05)",
                  color: selected ? "#0A1F18" : "rgba(255,255,255,0.85)",
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-[14px] tracking-tight">
                  {opt.label}
                </div>
                <div
                  className="text-[12px] mt-0.5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {opt.desc}
                </div>
              </div>
              {selected && (
                <div
                  className="w-6 h-6 rounded-full grid place-items-center shrink-0"
                  style={{ background: "#D1F843", color: "#0A1F18" }}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
