"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { nb } from "date-fns/locale";

import { motion } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

interface DatePickerProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  maxAdvanceDays?: number;
}

const WEEKDAYS = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];

export function BookingDatePicker({
  selected,
  onSelect,
  maxAdvanceDays = 28,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(today, maxAdvanceDays), [today, maxAdvanceDays]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const canGoBack = isSameMonth(currentMonth, new Date()) === false &&
    !isBefore(currentMonth, startOfMonth(new Date()));
  const canGoForward = isBefore(startOfMonth(addMonths(currentMonth, 1)), maxDate);

  function isDisabled(date: Date): boolean {
    if (isBefore(date, today)) return true;
    if (isSameDay(date, today)) return true;
    if (isBefore(maxDate, date)) return true;
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return true;
    return false;
  }

  return (
    <PremiumCard className="p-4" hover="none">
      <div className="select-none">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
            disabled={!canGoBack}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-grey-400 hover:bg-grey-50 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Forrige måned"
          >
            <Icon name="chevron_left" className="w-4 h-4" />
          </button>
          <h3 className="text-base font-semibold text-black capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: nb })}
          </h3>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            disabled={!canGoForward}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-grey-400 hover:bg-grey-50 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Neste måned"
          >
            <Icon name="chevron_right" className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-[#7A8C85] uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((date) => {
            const inMonth = isSameMonth(date, currentMonth);
            const disabled = isDisabled(date);
            const isSelected = selected && isSameDay(date, selected);
            const todayDate = isToday(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !disabled && inMonth && onSelect(date)}
                disabled={disabled || !inMonth}
                className="relative aspect-square flex items-center justify-center text-sm transition-colors duration-150"
                aria-label={format(date, "d. MMMM yyyy", { locale: nb })}
              >
                {isSelected ? (
                  <motion.div
                    layoutId="booking-date-selected"
                    className="absolute inset-1 bg-black rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                ) : null}
                <span
                  className={[
                    "relative z-10 w-full h-full flex items-center justify-center rounded-lg",
                    isSelected
                      ? "text-white font-semibold"
                      : !inMonth
                        ? "text-transparent cursor-default"
                        : disabled
                          ? "text-grey-300 cursor-not-allowed"
                          : "text-black font-medium hover:bg-grey-50 cursor-pointer",
                    todayDate && !isSelected && inMonth ? "ring-1 ring-accent-cta" : "",
                  ].join(" ")}
                >
                  {format(date, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </PremiumCard>
  );
}
