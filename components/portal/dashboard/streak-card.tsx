"use client";

import { Flame } from "lucide-react";

interface StreakCardProps {
  days: number;
  label?: string;
}

export function StreakCard({ days, label = "Treningsstreak" }: StreakCardProps) {
  // 14-day mock data (1 = trained, 0 = rest)
  const last14 = Array.from({ length: 14 }, (_, i) => (i < days ? 1 : 0));

  return (
    <div className="bg-[#FFFBF5] border-[0.5px] border-[#F5E6CC] rounded-[16px] p-5 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-4 h-4 text-[#C48A32]" />
        <span className="portal-label">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[32px] font-bold text-[#0A1F18] tabular-nums leading-none">
          {days}
        </span>
        <span className="text-sm text-[#7A8C85]">dager</span>
      </div>

      {/* 14-day bar visualization */}
      <div className="flex gap-[3px] mt-4">
        {last14.map((active, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              active ? "bg-[#005840]" : "bg-[#D5DFDB]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
