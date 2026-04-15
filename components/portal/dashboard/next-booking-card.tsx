"use client";

import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarPlus, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NextBooking {
  id: string;
  instructorName: string;
  serviceName: string;
  duration: number;
  startTime: Date | string;
}

interface NextBookingCardProps {
  booking: NextBooking | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NextBookingCard({ booking }: NextBookingCardProps) {
  if (!booking) {
    return (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-grey-300 bg-white p-6 shadow-sm">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-grey-50">
            <CalendarPlus className="h-6 w-6 text-grey-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-black">
            Du har ingen kommende bookinger
          </h3>
          <p className="mt-1 text-sm text-grey-400">
            Book din neste okt for a fortsette utviklingen.
          </p>
        </div>
        <Button variant="primary" size="md" className="mt-5 w-full" asChild>
          <Link href="/portal/bookinger/ny">
            Book din neste okt
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const start = new Date(booking.startTime);
  const initials = getInitials(booking.instructorName);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-l-4 border-l-accent-cta bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-grey-400">
            Neste booking
          </p>
          <h3 className="mt-1 text-lg font-semibold text-black">
            {booking.instructorName}
          </h3>
          <p className="text-sm text-grey-500">{booking.serviceName}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-grey-500">
          <CalendarPlus className="h-4 w-4 text-grey-400" />
          <span>
            {format(start, "EEEE d. MMMM 'kl' HH:mm", { locale: nb })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-grey-500">
          <Clock className="h-4 w-4 text-grey-400" />
          <span>{booking.duration} min</span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/portal/bookinger/${booking.id}`}>Se detaljer</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/portal/bookinger/${booking.id}/endre`}>Endre</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-error-text hover:bg-error-light hover:text-error-text"
          asChild
        >
          <Link href={`/portal/bookinger/${booking.id}`}>Avbestill</Link>
        </Button>
      </div>
    </div>
  );
}
