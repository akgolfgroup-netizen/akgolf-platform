"use client";

import {
  Zap,
  CircleDot,
  UserCog,
  Trophy,
  Brain,
  Moon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type IconKey = "zap" | "circle-dot" | "user-cog" | "trophy" | "brain" | "moon";

const ICON_MAP: Record<IconKey, LucideIcon> = {
  zap: Zap,
  "circle-dot": CircleDot,
  "user-cog": UserCog,
  trophy: Trophy,
  brain: Brain,
  moon: Moon,
};

export interface ActionItem {
  iconName: IconKey;
  impact: string;
  title: string;
  description: string;
  duration: string;
  ctaLabel: string;
}

export function RecommendedActions({ actions }: { actions: ActionItem[] }) {
  return (
    <>
      <div className="flex items-end justify-between mb-3.5 mt-7">
        <h3 className="font-display m-0 text-lg font-bold tracking-[-0.02em] text-white">
          Anbefalte tiltak · prioritert etter forventet effekt
        </h3>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          AUTO-FORSLAG
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {actions.map((action) => (
          <ActionCard key={action.title} action={action} />
        ))}
      </div>
    </>
  );
}

function ActionCard({ action }: { action: ActionItem }) {
  const Icon = ICON_MAP[action.iconName];
  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-6 py-5 flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 rounded-xl bg-[#D1F843]/15 text-[#D1F843] grid place-items-center">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#D1F843] bg-[#D1F843]/15 px-1.5 py-0.5 rounded">
          {action.impact}
        </span>
      </div>
      <h5 className="font-display m-0 text-[15px] font-bold leading-[1.3] tracking-[-0.01em] text-white">
        {action.title}
      </h5>
      <p className="m-0 text-[12.5px] leading-[1.5] text-white/65 flex-1">
        {action.description}
      </p>
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06] font-mono text-[11px] text-white/50">
        <span>
          VARIGHET <span className="text-white font-bold text-[13px] ml-1">{action.duration}</span>
        </span>
        <button className="bg-[#D1F843]/[0.18] text-[#D1F843] border-0 rounded-md px-2.5 py-1.5 text-[11px] font-bold inline-flex items-center gap-1 hover:bg-[#D1F843]/[0.28] transition">
          {action.ctaLabel}
          <ArrowRight className="w-[11px] h-[11px]" />
        </button>
      </div>
    </div>
  );
}
