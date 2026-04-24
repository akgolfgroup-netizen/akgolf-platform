"use client";


import { Icon } from "@/components/ui/icon";
import { useEffect, useState } from "react";

import { Drawer } from "./Drawer";
import { DateChip } from "./DateChip";
import { TimeChip } from "./TimeChip";
import type { DayData, SmartSlot } from "./types";

interface DateTimeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTypeId: string | null;
  instructorId: string | null;
  serviceName: string;
  trainerFirstName: string;
  onConfirm: (date: string, time: string, slotIso: string) => void;
}

export function DateTimeDrawer({
  isOpen,
  onClose,
  serviceTypeId,
  instructorId,
  serviceName,
  trainerFirstName,
  onConfirm,
}: DateTimeDrawerProps) {
  const [days, setDays] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !serviceTypeId || !instructorId) return;

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/booking/smart-slots?serviceTypeId=${serviceTypeId}&instructorId=${instructorId}&weekOffset=0`
        );
        const data: { days?: DayData[] } = await res.json();
        if (cancelled) return;

        const allDays = data.days ?? [];
        const availableDays = allDays.filter((d) => d.slots.some((s) => s.available));
        setDays(availableDays);

        if (availableDays.length > 0) {
          const firstDay = availableDays[0];
          setSelectedDate(firstDay.date);
          const firstSlot = firstDay.slots.find((s) => s.available);
          if (firstSlot) setSelectedSlot(firstSlot);
        }
      } catch {
        // Silent fail — drawer will show "no available times"
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isOpen, serviceTypeId, instructorId]);

  const selectedDay = days.find((d) => d.date === selectedDate);
  const canConfirm = !!(selectedDate && selectedSlot?.available && selectedSlot.isoString);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const day = days.find((d) => d.date === date);
    const firstAvailable = day?.slots.find((s) => s.available);
    setSelectedSlot(firstAvailable ?? null);
  };

  const handleConfirm = () => {
    if (canConfirm && selectedDate && selectedSlot?.isoString) {
      onConfirm(selectedDate, selectedSlot.time, selectedSlot.isoString);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-bold text-on-surface">Velg dato og tid</div>
      <div className="text-xs text-on-surface-variant mb-5">
        {serviceName} med {trainerFirstName}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Icon name="progress_activity" className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : days.length === 0 ? (
        <div className="text-center py-8 text-sm text-on-surface-variant">
          Ingen ledige tider denne uken.
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {days.map((day) => (
              <DateChip
                key={day.date}
                dayName={day.dayName}
                dayNumber={day.dayNumber}
                month={day.month}
                isSelected={selectedDate === day.date}
                onClick={() => handleDateSelect(day.date)}
              />
            ))}
          </div>

          {selectedDay && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedDay.slots.map((slot) => (
                <TimeChip
                  key={slot.time}
                  time={slot.time}
                  isSelected={selectedSlot?.time === slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full mt-5 py-4 rounded-[14px] bg-secondary-fixed text-primary text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-95 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Bekreft tid
            <Icon name="chevron_right" className="w-4 h-4" />
          </button>
        </>
      )}
    </Drawer>
  );
}
