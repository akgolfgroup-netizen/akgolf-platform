"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { colors } from "@/lib/design-tokens";

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
      <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-lowest p-6 shadow-sm">
        <div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${colors.data.coral}15` }}
          >
            <Icon name="calendar_today"Plus className="h-6 w-6" style={{ color: colors.data.coral }} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-on-surface">
            Du har ingen kommende bookinger
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            Book din neste økt for å fortsette utviklingen.
          </p>
        </div>
        <Button variant="primary" size="md" className="mt-5 w-full" asChild>
          <Link href="/portal/bookinger/ny">
            Book din neste økt
          </Link>
        </Button>
      </div>
    );
  }

  const start = new Date(booking.startTime);
  const initials = getInitials(booking.instructorName);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-2xl p-5 text-surface shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${colors.data.coral} 0%, #C43A2A 100%)`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-surface/70">
            Neste booking
          </p>
          <h3 className="mt-1 text-lg font-bold">{booking.instructorName}</h3>
          <p className="text-sm text-surface/80">{booking.serviceName}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-surface-container-lowest/10 text-sm font-bold">
          {initials}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-surface/90">
          <Icon name="calendar_today"Plus className="h-4 w-4 text-surface/70" />
          <span>
            {format(start, "EEEE d. MMMM 'kl' HH:mm", { locale: nb })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface/90">
          <Icon name="schedule" className="h-4 w-4 text-surface/70" />
          <span>{booking.duration} min</span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <Button
          variant="secondary"
          size="sm"
          className="bg-surface-container-lowest/10 text-surface border-white/20 hover:bg-surface-container-lowest/20"
          asChild
        >
          <Link href={`/portal/bookinger/${booking.id}`}>Se detaljer</Link>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-surface-container-lowest/10 text-surface border-white/20 hover:bg-surface-container-lowest/20"
          asChild
        >
          <Link href={`/portal/bookinger/${booking.id}/endre`}>Endre</Link>
        </Button>
      </div>
    </div>
  );
}
