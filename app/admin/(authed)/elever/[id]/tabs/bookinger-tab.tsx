"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { McCard, McCardHeader, McEmpty, McPill } from "@/components/admin/mc-v2";
import type { getStudentProfile } from "../actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

// Supabase returnerer relasjoner som arrays
interface BookingItem {
  id: string;
  startTime: string;
  status: string;
  ServiceType?: { name?: string }[] | null;
}

export function BookingerTab({ profile }: { profile: Profile }) {
  const upcoming = profile.UpcomingBooking as unknown as BookingItem[];
  const past = (profile.Booking as unknown as BookingItem[]).slice(0, 10);

  return (
    <div className="pt-5 space-y-4">
      <McCard>
        <McCardHeader title="Kommende bookinger" sub="planlagt" />
        {upcoming.length === 0 ? (
          <McEmpty title="Ingen kommende" body="Ingen planlagte bookinger fremover." />
        ) : (
          <div className="flex flex-col">
            {upcoming.map((b, i) => (
              <BookingRow key={b.id} booking={b} isLast={i === upcoming.length - 1} />
            ))}
          </div>
        )}
      </McCard>

      <McCard>
        <McCardHeader title="Historikk" sub="siste 20" />
        {past.length === 0 ? (
          <McEmpty title="Ingen historikk" body="Ingen tidligere bookinger registrert." />
        ) : (
          <div className="flex flex-col">
            {past.map((b, i) => (
              <BookingRow key={b.id} booking={b} isLast={i === past.length - 1} />
            ))}
          </div>
        )}
      </McCard>
    </div>
  );
}

function BookingRow({ booking, isLast }: { booking: BookingItem; isLast: boolean }) {
  const start = new Date(booking.startTime);
  const status = booking.status;
  const isConfirmed = status === "CONFIRMED" || status === "COMPLETED";
  const isCancelled = status === "CANCELLED";
  const svcName = Array.isArray(booking.ServiceType) && booking.ServiceType.length > 0
    ? booking.ServiceType[0]?.name
    : null;

  return (
    <div
      className="grid items-center gap-3 py-3"
      style={{
        gridTemplateColumns: "32px 1fr auto",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="w-8 h-8 rounded-md grid place-items-center"
        style={{
          background: isCancelled ? "rgba(184,66,51,0.12)" : isConfirmed ? "rgba(42,125,90,0.12)" : "rgba(196,138,50,0.12)",
          color: isCancelled ? "#F49283" : isConfirmed ? "#6FCBA1" : "#E8B967",
        }}
      >
        {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : isConfirmed ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      </span>
      <div>
        <div className="text-[13px] font-medium text-white">{svcName ?? "Økt"}</div>
        <div className="font-mono text-[11px] text-white/45 mt-0.5">{format(start, "EEEE d. MMM · HH:mm", { locale: nb })}</div>
      </div>
      <McPill tone={isCancelled ? "danger" : isConfirmed ? "success" : "warning"}>{status}</McPill>
    </div>
  );
}
