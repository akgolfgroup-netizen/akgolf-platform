"use client";

import type { TrainerService } from "./types";

interface ServiceRowProps {
  service: TrainerService;
  isActive: boolean;
  onSelect: () => void;
}

export function ServiceRow({ service, isActive, onSelect }: ServiceRowProps) {
  const periodLabel = service.isSubscription ? "kr/mnd" : "kr";
  const typeLabel = service.isSubscription
    ? `${service.duration} min · ${service.description ?? "Coaching"}`
    : `${service.duration} min · Enkeltokt`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-all border-2 text-left ${
        isActive
          ? "bg-[#005840] border-[#005840] text-white"
          : "bg-[#ECF0EF] border-transparent hover:bg-[#e3e9e7] hover:border-[#005840]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-semibold ${isActive ? "text-white" : "text-[#0A1F18]"}`}>
          {service.name}
        </div>
        <div className={`text-[11px] mt-0.5 ${isActive ? "text-white/60" : "text-[#A5B2AD]"}`}>
          {typeLabel}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className={`text-base font-bold ${isActive ? "text-[#D1F843]" : "text-[#005840]"}`}>
          {service.price.toLocaleString("nb-NO")}
        </div>
        <div className={`text-[10px] ${isActive ? "text-white/60" : "text-[#A5B2AD]"}`}>
          {periodLabel}
        </div>
        <div
          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
            isActive ? "bg-[rgba(209,248,67,0.2)] text-[#D1F843]" : "bg-white text-[#005840]"
          }`}
        >
          {service.availableSlotsThisWeek} ledige denne uken
        </div>
      </div>
    </button>
  );
}
