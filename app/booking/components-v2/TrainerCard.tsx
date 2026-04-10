"use client";

import { ServiceRow } from "./ServiceRow";
import type { TrainerWithServices } from "./types";

interface TrainerCardProps {
  trainer: TrainerWithServices;
  isSelected: boolean;
  selectedServiceId: string | null;
  onSelectTrainer: () => void;
  onSelectService: (serviceId: string) => void;
}

export function TrainerCard({
  trainer,
  isSelected,
  selectedServiceId,
  onSelectTrainer,
  onSelectService,
}: TrainerCardProps) {
  return (
    <div
      onClick={onSelectTrainer}
      className={`rounded-[20px] overflow-hidden cursor-pointer bg-white transition-all duration-300 border-2 ${
        isSelected
          ? "border-[#D1F843] shadow-[0_12px_40px_rgba(0,88,64,0.15)] -translate-y-0.5"
          : "border-transparent hover:border-[#D1F843] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,88,64,0.12)]"
      }`}
    >
      <div
        className="w-full aspect-[3/4] bg-cover bg-top bg-[#324D45] relative"
        style={{ backgroundImage: `url(${trainer.imageUrl})` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[rgba(10,31,24,0.9)] via-[rgba(10,31,24,0.4)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white z-[2]">
          <div className="text-xl font-bold tracking-tight">{trainer.name}</div>
          <div className="text-xs text-white/60 mt-0.5 font-medium">{trainer.role}</div>
          <div className="inline-block mt-2 bg-[rgba(209,248,67,0.15)] text-[#D1F843] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {trainer.badge}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isSelected ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="px-5 pt-4 pb-5">
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A5B2AD] mb-3">
            Tilgjengelige tjenester
          </div>
          {trainer.services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              isActive={selectedServiceId === service.id}
              onSelect={() => onSelectService(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
