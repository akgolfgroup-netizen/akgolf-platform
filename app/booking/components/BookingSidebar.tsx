"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShoppingBag, X } from "lucide-react";
import type { ServiceType, Instructor } from "../types";

interface Props {
  service: ServiceType | null;
  instructor: Instructor | null;
  dateTime: string | null;
  duration?: number;
}

function formatPrice(price: number): string {
  // Prisene er lagret i kroner
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

function SidebarContent({ service, instructor, dateTime }: Props) {
  const formattedDateTime = dateTime ? formatDateTime(dateTime) : null;

  return (
    <>
      {/* Header */}
      <div className="text-xs font-semibold uppercase tracking-wider text-grey-500 pb-3 mb-4 border-b border-grey-200">
        Din bestilling
      </div>

      {/* Summary items */}
      <div className="space-y-3">
        <div className="flex justify-between items-start text-sm">
          <span className="text-grey-500">Tjeneste</span>
          <span className="font-medium text-black text-right">
            {service?.name || <span className="text-grey-400">Ikke valgt</span>}
          </span>
        </div>

        <div className="flex justify-between items-start text-sm">
          <span className="text-grey-500">Varighet</span>
          <span className="font-medium text-black text-right">
            {service ? `${service.duration} minutter` : <span className="text-grey-400">Ikke valgt</span>}
          </span>
        </div>

        <div className="flex justify-between items-start text-sm">
          <span className="text-grey-500">Instruktor</span>
          <span className="font-medium text-black text-right">
            {instructor?.user.name || <span className="text-grey-400">Ikke valgt</span>}
          </span>
        </div>

        <div className="flex justify-between items-start text-sm">
          <span className="text-grey-500">Dato & tid</span>
          {formattedDateTime ? (
            <span className="font-medium text-black text-right">
              {formattedDateTime.date}
              <br />
              <span className="font-normal">{formattedDateTime.time}</span>
            </span>
          ) : (
            <span className="text-grey-400">Ikke valgt</span>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-black">
        <span className="font-semibold text-black">Totalt</span>
        <span className="text-lg font-bold text-black">
          {service ? `kr ${formatPrice(service.price)}` : "kr 0"}
        </span>
      </div>

      {/* Cancellation notice */}
      <div className="mt-4 pt-4 border-t border-grey-200">
        <p className="text-xs text-grey-500 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[var(--color-brand)] flex-shrink-0" />
          Gratis avbestilling inntil 24 timer for
        </p>
      </div>
    </>
  );
}

export function BookingSidebar({ service, instructor, dateTime }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = [service, instructor, dateTime].filter(Boolean).length;

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white font-medium shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingBag size={18} />
          <span>
            Din bestilling {itemCount > 0 && `(${itemCount})`}
          </span>
        </motion.button>
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="lg:hidden fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-grey-100 transition-colors"
              >
                <X size={20} className="text-grey-500" />
              </button>

              <SidebarContent
                service={service}
                instructor={instructor}
                dateTime={dateTime}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block sticky top-6"
      >
        <div className="w-card">
          <SidebarContent
            service={service}
            instructor={instructor}
            dateTime={dateTime}
          />
        </div>
      </motion.div>
    </>
  );
}
