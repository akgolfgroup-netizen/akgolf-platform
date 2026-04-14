"use client";

import { useState, useEffect, useId } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { X, AlertTriangle, StickyNote, UserX } from "lucide-react";
import { markNoShow, addAdminNote } from "@/app/admin/(authed)/kalender/actions";
import type { CalendarBooking } from "@/app/admin/(authed)/kalender/actions";

interface Props {
  booking: CalendarBooking;
  onClose: () => void;
  onRefresh: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Bekreftet",
  PENDING: "Venter",
  COMPLETED: "Fullfort",
  NO_SHOW: "Ikke mott",
  CANCELLED: "Avbestilt",
};

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  COMPLETED: "bg-grey-50 text-grey-400",
  NO_SHOW: "bg-error/10 text-error",
  CANCELLED: "bg-grey-50 text-grey-400",
};

export function BookingDetailSheet({ booking, onClose, onRefresh }: Props) {
  const [note, setNote] = useState(booking.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [markingNoShow, setMarkingNoShow] = useState(false);
  const titleId = useId();

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleMarkNoShow = async () => {
    if (!confirm("Markere denne bookingen som no-show?")) return;
    setMarkingNoShow(true);
    try {
      await markNoShow(booking.id);
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingNoShow(false);
    }
  };

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      await addAdminNote(booking.id, note);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col border-l border-grey-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <h2 id={titleId} className="text-lg font-semibold text-black">
            Bookingdetaljer
          </h2>
          <button
            onClick={onClose}
            aria-label="Lukk panel"
            className="p-1.5 rounded-lg hover:bg-grey-50 transition-colors text-grey-400 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
          {/* Status badge */}
          <div>
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${ STATUS_COLORS[booking.status] ?? "bg-grey-50 text-grey-400" }`}
            >
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <DetailRow label="Student" value={booking.student.name ?? "—"} />
            <DetailRow label="E-post" value={booking.student.email ?? "—"} />
            <DetailRow label="Tjeneste" value={booking.serviceType.name} />
            <DetailRow
              label="Instruktør"
              value={booking.instructor.user.name ?? "—"}
            />
            <DetailRow
              label="Dato"
              value={format(start, "EEEE d. MMMM yyyy", { locale: nb })}
            />
            <DetailRow
              label="Tid"
              value={`${format(start, "HH:mm")} — ${format(end, "HH:mm")}`}
            />
            <DetailRow
              label="Varighet"
              value={`${booking.serviceType.duration} min`}
            />
            {booking.location && (
              <DetailRow label="Sted" value={booking.location.name} />
            )}
          </div>

          {/* Admin note */}
          <div>
            <label className="text-xs font-medium text-grey-400 flex items-center gap-1.5 mb-2">
              <StickyNote className="w-3.5 h-3.5" aria-hidden="true" />
              Admin-notat
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl px-3 py-2 text-sm resize-none text-black placeholder:text-grey-400 bg-white border border-grey-200 focus:outline-none focus:ring-2 focus:ring-black/40"
              placeholder="Legg til et notat..."
            />
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="mt-2 px-4 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-black/90 disabled:opacity-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {saving ? "Lagrer..." : "Lagre notat"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-grey-200 p-6 space-y-2">
          {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
            <button
              onClick={handleMarkNoShow}
              disabled={markingNoShow}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-error bg-error/10 rounded-xl hover:bg-error/10 disabled:opacity-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <UserX className="w-4 h-4" aria-hidden="true" />
              {markingNoShow ? "Registrerer..." : "Marker som no-show"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-grey-400">{label}</span>
      <span className="font-medium text-black text-right">{value}</span>
    </div>
  );
}
