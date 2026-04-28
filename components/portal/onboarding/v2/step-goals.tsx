"use client";

import {
  CircleDot,
  Target,
  Zap,
  FlagTriangleRight,
  Brain,
  TrendingUp,
  Dumbbell,
  Trophy,
  Leaf,
} from "lucide-react";
import { GOAL_CHIPS } from "./types";

const ICONS = {
  "circle-dot": CircleDot,
  target: Target,
  zap: Zap,
  "flag-triangle-right": FlagTriangleRight,
  brain: Brain,
  "trending-up": TrendingUp,
  dumbbell: Dumbbell,
};

interface StepGoalsProps {
  selectedGoals: string[];
  onToggleGoal: (id: string) => void;
  playerType: "performance" | "leisure" | null;
  onSetPlayerType: (t: "performance" | "leisure") => void;
}

export function StepGoals({
  selectedGoals,
  onToggleGoal,
  playerType,
  onSetPlayerType,
}: StepGoalsProps) {
  return (
    <div className="w-full max-w-[720px]">
      <div
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        Steg 1 av 4 · Mål
      </div>
      <h1
        className="mt-2.5 mb-3.5 text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-white font-display"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        Hva vil du oppnå?
      </h1>
      <p
        className="text-[15px] mb-8 max-w-[56ch]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Vi bruker dette til å bygge planen din og kalibrere AI Coach. Du kan
        endre når som helst.
      </p>

      <FieldLabel>Fokusområder · velg 1–3</FieldLabel>
      <div className="flex flex-wrap gap-2 mb-7">
        {GOAL_CHIPS.map((chip) => {
          const selected = selectedGoals.includes(chip.id);
          const IconCmp = ICONS[chip.icon];
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onToggleGoal(chip.id)}
              className="px-3.5 py-2.5 rounded-full inline-flex items-center gap-1.5 text-[13px] transition-colors border"
              style={{
                background: selected ? "rgba(209,248,67,0.14)" : "rgba(255,255,255,0.04)",
                borderColor: selected ? "rgba(209,248,67,0.30)" : "rgba(255,255,255,0.10)",
                color: selected ? "#D1F843" : "rgba(255,255,255,0.85)",
                fontWeight: selected ? 600 : 500,
              }}
            >
              <IconCmp className="w-3.5 h-3.5" />
              {chip.label}
            </button>
          );
        })}
      </div>

      <FieldLabel>Hva beskriver deg best?</FieldLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5">
        <PlayerTypeCard
          icon={<Trophy className="w-5 h-5" />}
          title="Performance"
          desc="Konkurransespiller — vil ned i HCP, klubbmesterskap, turneringer."
          selected={playerType === "performance"}
          onClick={() => onSetPlayerType("performance")}
        />
        <PlayerTypeCard
          icon={<Leaf className="w-5 h-5" />}
          title="Fritids­spiller"
          desc="Jeg spiller for moro skyld og vil bli litt bedre, ikke nødvendigvis konkurrere."
          selected={playerType === "leisure"}
          onClick={() => onSetPlayerType("leisure")}
        />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1.5"
      style={{
        color: "rgba(255,255,255,0.5)",
        fontFamily: "var(--font-jetbrains-mono)",
      }}
    >
      {children}
    </div>
  );
}

function PlayerTypeCard({
  icon,
  title,
  desc,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-[14px] p-5 transition-colors border-[1.5px]"
      style={{
        background: selected ? "rgba(209,248,67,0.06)" : "#0D2E23",
        borderColor: selected ? "#D1F843" : "#1a4a3a",
      }}
    >
      <div
        className="w-9 h-9 rounded-[9px] grid place-items-center mb-3"
        style={{
          background: selected ? "#D1F843" : "rgba(209,248,67,0.15)",
          color: selected ? "#0A1F18" : "#D1F843",
        }}
      >
        {icon}
      </div>
      <div className="text-[15px] font-bold text-white tracking-tight">{title}</div>
      <div
        className="text-[12px] mt-1 leading-[1.4]"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        {desc}
      </div>
    </button>
  );
}
