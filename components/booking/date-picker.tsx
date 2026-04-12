"use client";

import { useMemo } from "react";
import { addDays, startOfDay, format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";

interface BookingDatePickerProps {
  serviceName: string;
  instructorName: string;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  availableSlots: string[];
  loadingSlots: boolean;
  onSelectSlot: (slot: string) => void;
  onBack: () => void;
}

const DAYS_AHEAD = 28;

export function BookingDatePicker({
  serviceName,
  instructorName,
  selectedDate,
  onSelectDate,
  availableSlots,
  loadingSlots,
  onSelectSlot,
  onBack,
}: BookingDatePickerProps) {
  const dates = useMemo(
    () =>
      Array.from({ length: DAYS_AHEAD }, (_, i) =>
        addDays(startOfDay(new Date()), i + 1)
      ),
    []
  );

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-6 text-[var(--color-muted)] hover:text-[var(--color-grey-900)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tilbake
      </button>

      <h2 className="text-3xl font-semibold mb-2 text-[var(--color-grey-900)]">
        Velg dato og tid
      </h2>
      <p className="text-[var(--color-muted)] mb-8">
        {serviceName} med {instructorName}
      </p>

      {/* Date grid — Cal.com-style compact cards */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold mb-4 uppercase tracking-wider text-[var(--color-grey-400)]">
          Velg dato
        </h3>
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {dates.map((date) => {
            const selected =
              selectedDate &&
              format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <button
                key={date.toISOString()}
                onClick={() => !isWeekend && onSelectDate(date)}
                disabled={isWeekend}
                className={`
                  flex-shrink-0 rounded-xl py-3 px-4 text-center min-w-[72px]
                  transition-all duration-200 border
                  ${isWeekend ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                  ${
                    selected
                      ? "bg-[var(--color-grey-900)] border-[var(--color-grey-900)] shadow-lg"
                      : "bg-white border-[var(--color-grey-200)] hover:border-[var(--color-grey-900)] shadow-sm"
                  }
                `}
              >
                <p
                  className={`text-[10px] uppercase tracking-wide mb-0.5 font-medium ${
                    selected ? "text-white/70" : "text-[var(--color-grey-400)]"
                  }`}
                >
                  {format(date, "EEE", { locale: nb })}
                </p>
                <p
                  className={`text-xl font-semibold leading-tight ${
                    selected ? "text-white" : "text-[var(--color-grey-900)]"
                  }`}
                >
                  {format(date, "d")}
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    selected ? "text-white/60" : "text-[var(--color-muted)]"
                  }`}
                >
                  {format(date, "MMM", { locale: nb })}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xs font-semibold mb-4 uppercase tracking-wider text-[var(--color-grey-400)]">
            Ledige tider — {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
          </h3>

          {loadingSlots ? (
            <div className="flex items-center gap-3 py-12 text-[var(--color-muted)]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Henter tilgjengelige tider...</span>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-2xl p-8 text-center border border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-[var(--color-grey-300)]" />
              <p className="text-[var(--color-muted)]">
                Ingen ledige tider denne dagen.
              </p>
              <p className="text-sm mt-1 text-[var(--color-grey-300)]">
                Prov en annen dato.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onSelectSlot(slot)}
                  className="
                    rounded-xl py-3.5 text-sm font-medium
                    bg-white border border-[var(--color-grey-200)]
                    text-[var(--color-grey-900)]
                    hover:border-[var(--color-grey-900)] hover:shadow-md
                    active:scale-[0.97]
                    transition-all duration-150
                  "
                >
                  {format(new Date(slot), "HH:mm")}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
