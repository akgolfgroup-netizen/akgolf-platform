"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { ServiceType, Instructor } from "../types";

interface Props {
  service: ServiceType | null;
  instructor: Instructor | null;
  dateTime: string | null;
  duration?: number;
}

function formatPrice(price: number): string {
  // Prisene er lagret i kroner (ikke øre)
  return price.toLocaleString("nb-NO");
}

function formatDateTime(dateTimeStr: string): { date: string; time: string } {
  const date = new Date(dateTimeStr);
  const dateStr = date.toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate end time based on duration
  const endDate = new Date(date.getTime() + 60 * 60 * 1000); // Default 60 min
  const endTimeStr = endDate.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: dateStr, time: `kl. ${timeStr} - ${endTimeStr}` };
}

export function BookingSidebar({ service, instructor, dateTime }: Props) {
  const formattedDateTime = dateTime ? formatDateTime(dateTime) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="sticky top-6"
    >
      <div className="w-card">
        {/* Header */}
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-50 pb-3 mb-4 border-b border-ink-10">
          Din bestilling
        </div>

        {/* Summary items */}
        <div className="space-y-3">
          <div className="flex justify-between items-start text-sm">
            <span className="text-ink-50">Tjeneste</span>
            <span className="font-medium text-ink-90 text-right">
              {service?.name || <span className="text-ink-30">Ikke valgt</span>}
            </span>
          </div>

          <div className="flex justify-between items-start text-sm">
            <span className="text-ink-50">Varighet</span>
            <span className="font-medium text-ink-90 text-right">
              {service ? `${service.duration} minutter` : <span className="text-ink-30">Ikke valgt</span>}
            </span>
          </div>

          <div className="flex justify-between items-start text-sm">
            <span className="text-ink-50">Instruktor</span>
            <span className="font-medium text-ink-90 text-right">
              {instructor?.user.name || <span className="text-ink-30">Ikke valgt</span>}
            </span>
          </div>

          <div className="flex justify-between items-start text-sm">
            <span className="text-ink-50">Dato & tid</span>
            {formattedDateTime ? (
              <span className="font-medium text-ink-90 text-right">
                {formattedDateTime.date}
                <br />
                <span className="font-normal">{formattedDateTime.time}</span>
              </span>
            ) : (
              <span className="text-ink-30">Ikke valgt</span>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-ink-90">
          <span className="font-semibold text-ink-90">Totalt</span>
          <span className="text-lg font-bold text-gold">
            {service ? `kr ${formatPrice(service.price)}` : "kr 0"}
          </span>
        </div>

        {/* Cancellation notice */}
        <div className="mt-4 pt-4 border-t border-ink-10">
          <p className="text-xs text-ink-50 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-success flex-shrink-0" />
            Gratis avbestilling inntil 24 timer for
          </p>
        </div>
      </div>
    </motion.div>
  );
}
