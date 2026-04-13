"use client";

import { useState } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";
import {
  AdminDialog,
  AdminButton,
  AdminInput,
} from "@/components/portal/mission-control/ui";
import { format, addMinutes } from "date-fns";
import { nb } from "date-fns/locale";
import { adminRescheduleBooking } from "./actions";
import type { AdminBooking } from "./actions";

interface RescheduleDialogProps {
  booking: AdminBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RescheduleDialog({
  booking,
  onClose,
  onSuccess,
}: RescheduleDialogProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sett dato/tid fra booking ved apning
  function handleOpen() {
    if (!booking) return;
    const start = new Date(booking.startTime);
    setDate(format(start, "yyyy-MM-dd"));
    setTime(format(start, "HH:mm"));
    setError(null);
  }

  // Reset state nar booking endres
  if (booking && !date) {
    handleOpen();
  }

  async function handleSubmit() {
    if (!booking || !date || !time) return;

    const newStartTime = new Date(`${date}T${time}:00`);
    if (isNaN(newStartTime.getTime())) {
      setError("Ugyldig dato/tid");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adminRescheduleBooking(
        booking.id,
        newStartTime.toISOString()
      );

      setDate("");
      setTime("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setDate("");
    setTime("");
    setError(null);
    onClose();
  }

  const duration = booking?.ServiceType?.duration ?? 0;
  const newEnd =
    date && time && !isNaN(new Date(`${date}T${time}:00`).getTime())
      ? format(
          addMinutes(new Date(`${date}T${time}:00`), duration),
          "HH:mm"
        )
      : null;

  return (
    <AdminDialog
      open={booking !== null}
      onClose={handleClose}
      title="Endre tidspunkt"
      description={
        booking
          ? `${booking.ServiceType?.name ?? "Booking"} — ${booking.User?.name ?? booking.User?.email ?? "Ukjent elev"}`
          : undefined
      }
      footer={
        <>
          <AdminButton variant="ghost" onClick={handleClose}>
            Avbryt
          </AdminButton>
          <AdminButton
            variant="primary"
            loading={loading}
            onClick={handleSubmit}
            icon={loading ? undefined : <Calendar className="w-4 h-4" />}
          >
            Flytt booking
          </AdminButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Navarende tid */}
        {booking && (
          <div className="rounded-lg bg-[#F5F8F7] border border-[#D5DFDB] p-3">
            <p className="text-xs font-medium text-[#7A8C85] mb-1">
              Navarende tidspunkt
            </p>
            <p className="text-sm font-semibold text-[#0A1F18]">
              {format(
                new Date(booking.startTime),
                "EEEE d. MMMM 'kl.' HH:mm",
                { locale: nb }
              )}
            </p>
          </div>
        )}

        {/* Ny dato */}
        <div>
          <label className="block text-xs font-medium text-[#0A1F18] mb-1.5">
            Ny dato
          </label>
          <AdminInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>

        {/* Ny tid */}
        <div>
          <label className="block text-xs font-medium text-[#0A1F18] mb-1.5">
            Nytt klokkeslett
          </label>
          <AdminInput
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            step={300}
          />
        </div>

        {/* Forhåndsvisning */}
        {newEnd && (
          <div className="flex items-center gap-2 text-xs text-[#7A8C85]">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {time} – {newEnd} ({duration} min)
            </span>
          </div>
        )}

        {/* Feil */}
        {error && (
          <p className="text-xs text-[#EF4444] font-medium">
            {error}
          </p>
        )}
      </div>
    </AdminDialog>
  );
}
