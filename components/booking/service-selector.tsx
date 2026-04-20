"use client";



import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import type { BookingServiceType } from "./booking-types";
import { formatBookingPrice } from "./booking-types";

interface ServiceSelectorProps {
  services: BookingServiceType[];
  onSelect: (service: BookingServiceType) => void;
}

export function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-on-surface mb-3 tracking-tight">
          Velg din treningsform
        </h2>
        <p className="text-on-surface-variant">
          Alle coaching-timer inkluderer TrackMan-analyse og personlig tilpasning
        </p>
      </div>

      <div className="space-y-3">
        {services.map((svc, index) => (
          <motion.button
            key={svc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => onSelect(svc)}
            className="w-full text-left group"
          >
            <PremiumCard delay={0} padding="md" hover="lift">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: svc.color ?? undefined }}
                    />
                    <h3 className="text-base font-semibold text-on-surface truncate">
                      {svc.name}
                    </h3>
                  </div>
                  {svc.description && (
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-3 line-clamp-2">
                      {svc.description}
                    </p>
                  )}
                  <div className="flex items-center gap-5 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <Icon name="schedule" className="w-3.5 h-3.5 text-on-surface-variant" />
                      {svc.duration} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="person" className="w-3.5 h-3.5 text-on-surface-variant" />
                      {svc.maxStudents === 1
                        ? "Individuell"
                        : `Gruppe (maks ${svc.maxStudents})`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xl font-semibold text-on-surface tabular-nums">
                    {formatBookingPrice(svc.price)}
                  </span>
                  <Icon name="chevron_right" className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </PremiumCard>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
