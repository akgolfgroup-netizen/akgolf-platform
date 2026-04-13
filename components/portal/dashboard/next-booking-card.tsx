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
        className="flex h-full flex-col justify-between rounded-[28px] border border-dashed border-[#154212]/15 bg-white p-6"
        style={{ boxShadow: "var(--shadow-portal-card)" }}
      >
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d2f000]/20">
            <Calendar className="h-5 w-5 text-[#154212]" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[#1c1c16]">
            Ingen kommende coaching
          </h3>
          <p className="mt-1 text-xs text-[#8a8a82]">
            Book en coaching-time for aa komme videre.
          </p>
        </div>
        <Link
          href="/portal/bookinger/ny"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#154212] px-5 py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#0f2f0d] hover:shadow-[0_4px_16px_rgba(21,66,18,0.3)]"
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
      className="relative flex flex-col overflow-hidden rounded-[28px] p-6"
      style={{
        background: "linear-gradient(145deg, #154212, #1B4332)",
        border: "1px solid rgba(21,66,18,0.2)",
        boxShadow: "0 20px 60px rgba(21,66,18,0.15), 0 0 0 1px rgba(21,66,18,0.1)",
      }}
    >
      {/* Lime glow orb */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-[150px] w-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(210,240,0,0.2) 0%, transparent 70%)",
        }}
      />

      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50">
        Neste okt
      </p>
      <span className="mt-2 text-4xl font-extrabold tracking-[-0.04em] text-white tabular-nums">
        {format(start, "HH:mm")}
      </span>
      <span className="mt-0.5 text-[13px] text-white/60">
        {format(start, "EEEE d. MMMM", { locale: nb })}
      </span>

      <div className="mt-3.5 space-y-[5px]">
        <BookingRow icon={User} text={`${booking.instructorName} (Instruktoer)`} />
        <BookingRow icon={MapPin} text="Fredrikstad Golfklubb" />
        <BookingRow icon={Clock} text={`${booking.duration} min coaching`} />
      </div>

      <button className="mt-3.5 w-full rounded-[10px] border border-white/[0.12] bg-white/10 px-4 py-2.5 text-center text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/[0.16]">
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
    <div className="flex items-center gap-2 text-xs text-white/70">
      <Icon className="h-[13px] w-[13px] text-white/40" />
      {text}
    </div>
  );
}
