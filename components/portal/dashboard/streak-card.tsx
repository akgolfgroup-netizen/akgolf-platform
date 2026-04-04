"use client";

import { Flame } from "lucide-react";

interface StreakCardProps {
  days: number;
  label?: string;
}

export function StreakCard({ days, label = "Treningsstreak" }: StreakCardProps) {
  return (
    <div className="bg-[#FFFBF5] border border-[#F5E6CC] rounded-[14px] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-4 h-4 text-[var(--color-warning)]" />
        <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-extrabold text-[#1D1D1F] tabular-nums">{days}</span>
        <span className="text-xs text-[#86868B]">dager</span>
      </div>
    </div>
  );
}
