"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { X, AlertTriangle, StickyNote, UserX } from "lucide-react";
import { markNoShow, addAdminNote } from "@/app/portal/(dashboard)/admin/kalender/actions";
import type { CalendarBooking } from "@/app/portal/(dashboard)/admin/kalender/actions";

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
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  NO_SHOW: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export function BookingDetailSheet({ booking, onClose, onRefresh }: Props) {
  const [note, setNote] = useState(booking.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [markingNoShow, setMarkingNoShow] = useState(false);

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

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
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#0F2950]">
            Bookingdetaljer
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status badge */}
          <div>
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-600"
              }`}
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
              label="Instruktor"
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
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-2">
              <StickyNote className="w-3.5 h-3.5" />
              Admin-notat
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#B8975C]/40"
              placeholder="Legg til et notat..."
            />
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="mt-2 px-4 py-1.5 text-xs font-medium bg-[#0F2950] text-white rounded-lg hover:bg-[#0F2950]/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Lagrer..." : "Lagre notat"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 space-y-2">
          {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
            <button
              onClick={handleMarkNoShow}
              disabled={markingNoShow}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              <UserX className="w-4 h-4" />
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
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
