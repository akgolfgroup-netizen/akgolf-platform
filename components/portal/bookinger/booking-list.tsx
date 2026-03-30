"use client";

import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { BookingCard } from "./booking-card";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  serviceType: { name: string; color?: string | null; duration: number };
  instructor: { user: { name?: string | null }; title?: string | null };
  location?: { name: string } | null;
}

function groupByDate(bookings: Booking[]): [string, Booking[]][] {
  const groups = new Map<string, Booking[]>();
  for (const b of bookings) {
    const key = format(new Date(b.startTime), "yyyy-MM-dd");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(b);
  }
  return Array.from(groups.entries());
}

function dateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  if (isThisWeek(date)) return format(date, "EEEE", { locale: nb });
  return format(date, "d. MMMM yyyy", { locale: nb });
}

interface BookingListProps {
  bookings: Booking[];
  emptyMessage?: string;
}

export function BookingList({ bookings, emptyMessage = "Ingen bookinger" }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-[var(--color-grey-100)]/50"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-grey-200)] flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-[var(--color-grey-400)]" />
        </div>
        <p className="text-[var(--color-grey-500)] font-medium">{emptyMessage}</p>
      </motion.div>
    );
  }

  const groups = groupByDate(bookings);

  return (
    <div className="space-y-6">
      {groups.map(([dateStr, items], groupIndex) => (
        <motion.div
          key={dateStr}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 capitalize text-[var(--color-grey-900)]">
            {dateLabel(dateStr)}
          </p>
          <div className="space-y-3">
            {items.map((b, index) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
              >
                <BookingCard booking={b} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
