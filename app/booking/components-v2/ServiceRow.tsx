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
          ? "bg-primary border-primary text-surface"
          : "bg-surface border-transparent hover:bg-surface-variant hover:border-primary"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-semibold ${isActive ? "text-surface" : "text-on-surface"}`}>
          {service.name}
        </div>
        <div className={`text-[11px] mt-0.5 ${isActive ? "text-surface/60" : "text-muted"}`}>
          {typeLabel}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className={`text-base font-bold ${isActive ? "text-secondary-fixed" : "text-primary"}`}>
          {service.price.toLocaleString("nb-NO")}
        </div>
        <div className={`text-[10px] ${isActive ? "text-surface/60" : "text-muted"}`}>
          {periodLabel}
        </div>
        {typeof service.availableSlotsThisWeek === "number" && (
          <div
            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
              isActive ? "bg-secondary-fixed/20 text-secondary-fixed" : "bg-surface-container-lowest text-primary"
            }`}
          >
            {service.availableSlotsThisWeek} ledige denne uken
          </div>
        )}
      </div>
    </button>
  );
}
