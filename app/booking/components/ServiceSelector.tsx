"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Check } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { StepHeader } from "./StepHeader";
import { ServiceIcon, getServiceCategoryLabel } from "./ServiceIcon";
import type { ServiceType } from "../types";
import { cn } from "@/lib/portal/utils/cn";

interface Props {
  services: ServiceType[];
  onSelect: (service: ServiceType) => void;
}

export function ServiceSelector({ services, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === selectedId);

  function handleContinue() {
    if (selectedService) {
      onSelect(selectedService);
    }
  }

  return (
    <div>
      <StepHeader
        eyebrow="Steg 1"
        heading="Velg type coaching"
        description="Velg tjenesten som passer dine behov"
      />

      <StaggerContainer className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const priceNok = service.price / 100;
          const categoryLabel = getServiceCategoryLabel(service.category);
          const isSelected = selectedId === service.id;

          return (
            <StaggerItem key={service.id}>
              <button
                onClick={() => setSelectedId(service.id)}
                className={cn(
                  "w-full text-left cursor-pointer group transition-all duration-300 p-5 rounded-xl border-2",
                  isSelected
                    ? "border-gold bg-gold/5"
                    : "border-ink-10 hover:border-gold/50 bg-white"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected ? "bg-gold/20" : "bg-ink-5"
                  )}>
                    <ServiceIcon
                      category={service.category}
                      size={24}
                      className={cn(
                        "transition-transform duration-300",
                        isSelected ? "text-gold" : "text-ink-50",
                        !isSelected && "group-hover:scale-105"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className={cn(
                          "font-semibold transition-colors",
                          isSelected ? "text-gold" : "text-ink-90 group-hover:text-gold"
                        )}>
                          {service.name}
                        </h3>
                        <span className="text-xs text-ink-50 uppercase tracking-wider">
                          {categoryLabel}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gold whitespace-nowrap">
                        {priceNok.toLocaleString("nb-NO")} kr
                      </span>
                    </div>

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-ink-50 mb-3 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-ink-50">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gold" />
                        {service.duration} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-gold" />
                        {service.instructors.length}{" "}
                        {service.instructors.length === 1 ? "trener" : "trenere"}
                      </span>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected ? "border-gold bg-gold" : "border-ink-20"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-ink-10">
        <button
          onClick={handleContinue}
          disabled={!selectedService}
          className="w-btn w-btn-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Velg instruktor
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
