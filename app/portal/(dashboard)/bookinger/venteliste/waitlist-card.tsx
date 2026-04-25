"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { cancelWaitlistEntry } from "./actions";

export interface WaitlistEntryView {
  id: string;
  position: number;
  status: "WAITING" | "NOTIFIED";
  expiresAt: string | null;
  notifiedAt: string | null;
  serviceName: string;
  instructorName: string;
  bookingStartTime: string;
}

interface WaitlistCardProps {
  entry: WaitlistEntryView;
}

export function WaitlistCard({ entry }: WaitlistCardProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const startTime = new Date(entry.bookingStartTime);
  const dateStr = format(startTime, "EEEE d. MMMM", { locale: nb });
  const timeStr = format(startTime, "HH:mm", { locale: nb });

  const isNotified = entry.status === "NOTIFIED";
  const expiresAt = entry.expiresAt ? new Date(entry.expiresAt) : null;
  const expiresStr = expiresAt
    ? format(expiresAt, "EEEE d. MMMM HH:mm", { locale: nb })
    : null;

  const handleCancel = () => {
    if (!confirm("Vil du melde deg av ventelisten?")) return;
    setError(null);
    startTransition(async () => {
      const result = await cancelWaitlistEntry(entry.id);
      if (!result.success) {
        setError(result.message ?? "Klarte ikke å kansellere.");
      }
    });
  };

  return (
    <article className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-semibold ${
                isNotified
                  ? "bg-secondary-fixed text-on-secondary-fixed"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              <Icon
                name={isNotified ? "notifications_active" : "schedule"}
                size={14}
              />
              {isNotified ? "Plass tilgjengelig" : `#${entry.position} i kø`}
            </span>
          </div>
          <h3 className="text-base font-semibold text-on-surface">
            {entry.serviceName}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {entry.instructorName} · {dateStr} kl. {timeStr}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          disabled={pending}
          className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface disabled:opacity-50"
        >
          {pending ? "Kansellerer…" : "Meld av"}
        </button>
      </div>

      {isNotified && expiresStr && (
        <div className="mt-4 rounded-xl bg-secondary-fixed/15 p-4">
          <p className="text-[13px] text-on-surface">
            Plassen er din til{" "}
            <strong className="font-semibold">{expiresStr}</strong>. Bekreft
            via lenken i e-posten du fikk for å sikre deg timen.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-[12px] font-medium text-error">{error}</p>
      )}
    </article>
  );
}
