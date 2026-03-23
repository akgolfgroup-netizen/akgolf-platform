"use client";

import { Clock, Users } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { StepHeader } from "./StepHeader";
import { ServiceIcon, getServiceCategoryLabel } from "./ServiceIcon";
import type { ServiceType } from "../types";

interface Props {
  services: ServiceType[];
  onSelect: (service: ServiceType) => void;
}

export function ServiceSelector({ services, onSelect }: Props) {
  return (
    <div>
      <StepHeader
        eyebrow="Steg 1"
        heading="Velg tjeneste"
        description="Hva slags coaching ønsker du?"
      />

      <StaggerContainer className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const priceNok = service.price / 100;
          const categoryLabel = getServiceCategoryLabel(service.category);
          
          return (
            <StaggerItem key={service.id}>
              <button
                onClick={() => onSelect(service)}
                className="w-service-card w-full text-left cursor-pointer group hover:border-gold/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <ServiceIcon 
                    category={service.category} 
                    size={28}
                    className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="w-heading-sm group-hover:text-gold transition-colors">
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
                      <p className="text-sm text-ink-50 mb-4 line-clamp-2">
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
                        {service.instructors.length} {service.instructors.length === 1 ? "trener" : "trenere"}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
