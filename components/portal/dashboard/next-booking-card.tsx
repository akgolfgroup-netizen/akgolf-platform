"use client";

import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ArrowRight, Calendar, Clock, MapPin, User } from "lucide-react";
import { motion } from "framer-motion";

interface NextBooking {
  id: string;
  instructorName: string;
  serviceName: string;
  duration: number;
  startTime: Date | string;
}

interface NextBookingCardProps {
  booking: NextBooking | null;
  delay?: number;
}

export function NextBookingCard({ booking, delay = 0 }: NextBookingCardProps) {
  if (!booking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
        className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-grey-200 bg-white p-6"
      >
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-grey-50">
            <Calendar className="h-5 w-5 text-black" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-black">
            Ingen kommende coaching
          </h3>
          <p className="mt-1 text-xs text-grey-400">
            Book en coaching-time for å komme videre.
          </p>
        </div>
        <Link
          href="/portal/bookinger/ny"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-[13px] font-semibold text-white transition-all hover:bg-grey-800"
        >
          Book coaching-time
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    );
  }

  const start = new Date(booking.startTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white p-6"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-grey-400">
        Neste økt
      </p>
      <span className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-black tabular-nums">
        {format(start, "HH:mm")}
      </span>
      <span className="mt-0.5 text-[13px] text-grey-400">
        {format(start, "EEEE d. MMMM", { locale: nb })}
      </span>

      <div className="mt-3.5 space-y-[5px]">
        <BookingRow icon={User} text={`${booking.instructorName} (Instruktør)`} />
        <BookingRow icon={MapPin} text="Fredrikstad Golfklubb" />
        <BookingRow icon={Clock} text={`${booking.duration} min coaching`} />
      </div>

      <button className="mt-4 w-full rounded-xl border border-grey-200 bg-grey-50 px-4 py-2.5 text-center text-[13px] font-medium text-black transition-colors hover:bg-grey-50">
        Se detaljer
      </button>
    </motion.div>
  );
}

function BookingRow({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-grey-400">
      <Icon className="h-[13px] w-[13px] text-grey-300" />
      {text}
    </div>
  );
}
