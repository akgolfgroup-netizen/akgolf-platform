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
        className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-[var(--color-portal-border)] bg-white p-5"
        style={{ boxShadow: "var(--shadow-portal-card)" }}
      >
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[var(--color-portal-text)]">
            Ingen kommende coaching
          </h3>
          <p className="mt-1 text-xs text-[var(--color-portal-muted)]">
            Book en coaching-time for aa komme videre.
          </p>
        </div>
        <Link
          href="/portal/bookinger/ny"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-[20px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-alt"
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
      className="relative flex flex-col overflow-hidden rounded-2xl p-5"
      style={{
        background: "linear-gradient(145deg, var(--color-primary), #1B4332)",
        border: "1px solid rgba(0,88,64,0.3)",
        boxShadow: "var(--shadow-portal-card)",
      }}
    >
      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-[120px] w-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(0,88,64,0.25) 0%, transparent 70%)",
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
