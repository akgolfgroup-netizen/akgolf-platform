"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  serviceTypeId: string;
  instructorId: string;
  instructorName: string;
  serviceName: string;
  duration: number;
}

interface Slot {
  startTime: string;
}

export function RescheduleForm({
  bookingId,
  serviceTypeId,
  instructorId,
  instructorName,
  serviceName,
  duration,
}: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSlots = async (date: string) => {
    setLoading(true);
    setSelectedSlot(null);
    try {
      const portalUrl =
        process.env.NEXT_PUBLIC_PORTAL_URL ?? "";
      const res = await fetch(
        `${portalUrl}/api/public/slots?serviceTypeId=${serviceTypeId}&instructorId=${instructorId}&date=${date}`
      );
      if (res.ok) {
        setSlots(await res.json());
      } else {
        setSlots([]);
      }
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots on date change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  // Initialize
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchSlots(selectedDate);
  }

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/portal/api/booking/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          newStartTime: selectedSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kunne ikke endre tidspunkt");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/bookinger"), 2000);
    } catch {
      setError("Noe gikk galt");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <p className="text-green-800 font-semibold">Tidspunktet er endret!</p>
        <p className="text-green-600 text-sm mt-1">
          Du sendes tilbake til bookingene dine...
        </p>
      </div>
    );
  }

  // Generate date buttons (next 14 days)
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return format(d, "yyyy-MM-dd");
  });

  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Velg dato</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => {
            const d = new Date(date);
            const isSelected = date === selectedDate;
            return (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-center transition-colors ${
                  isSelected
                    ? "bg-[#0F2950] text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <p className="text-[10px] uppercase">
                  {format(d, "EEE", { locale: nb })}
                </p>
                <p className="text-sm font-semibold">{format(d, "d")}</p>
                <p className="text-[10px]">
                  {format(d, "MMM", { locale: nb })}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Ledige tider
        </h3>
        {loading ? (
          <div className="py-8 text-center text-gray-400">
            <Clock className="w-5 h-5 animate-pulse mx-auto mb-2" />
            Laster tider...
          </div>
        ) : slots.length === 0 ? (
          <p className="py-8 text-center text-gray-400 text-sm">
            Ingen ledige tider denne dagen
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot) => {
              const t = new Date(slot.startTime);
              const isSelected = selectedSlot === slot.startTime;
              return (
                <button
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(slot.startTime)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-[#B8975C] text-white"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {format(t, "HH:mm")}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Confirm button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedSlot || submitting}
        className="w-full py-3 px-4 bg-[#0F2950] text-white font-medium rounded-xl hover:bg-[#0F2950]/90 disabled:opacity-50 transition-colors"
      >
        {submitting ? "Endrer tidspunkt..." : "Bekreft nytt tidspunkt"}
      </button>
    </div>
  );
}
