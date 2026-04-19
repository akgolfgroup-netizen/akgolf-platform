"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { Plus, CheckCircle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/portal/mission-control/ui";
import type { Instructor } from "./actions";
import type { CalendarAvailability, CalendarBlockedTime } from "./actions";
import {
  getInstructorAvailabilityPrisma,
  upsertInstructorAvailabilityPrisma,
  getBlockedTimesForPeriod,
} from "./actions";
import AvailabilityBlockedTimes from "./availability-blocked-times";

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0];

interface KalenderAvailabilityPanelProps {
  instructors: Instructor[];
  selectedInstructorId: string;
}

export default function KalenderAvailabilityPanel({
  instructors,
  selectedInstructorId,
}: KalenderAvailabilityPanelProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();

  const [availability, setAvailability] = useState<CalendarAvailability[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<CalendarBlockedTime[]>([]);
  const [editingSlots, setEditingSlots] = useState<
    Record<number, Array<{ start: string; end: string }>>
  >({});


  const loadData = useCallback(async () => {
    if (!selectedInstructorId) return;
    startTransition(async () => {
      const now = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 2);

      const [availData, blockedData] = await Promise.all([
        getInstructorAvailabilityPrisma(selectedInstructorId),
        getBlockedTimesForPeriod(now.toISOString(), end.toISOString(), selectedInstructorId),
      ]);

      setAvailability(availData);
      setBlockedTimes(blockedData);

      const slots: Record<number, Array<{ start: string; end: string }>> = {};
      DAY_INDICES.forEach((d) => (slots[d] = []));
      availData.forEach((slot) => {
        if (!slots[slot.dayOfWeek]) slots[slot.dayOfWeek] = [];
        slots[slot.dayOfWeek].push({
          start: slot.startTime,
          end: slot.endTime,
        });
      });
      setEditingSlots(slots);
    });
  }, [selectedInstructorId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = () => {
    if (!selectedInstructorId) return;
    startSaveTransition(async () => {
      const slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }> = [];
      Object.entries(editingSlots).forEach(([dow, daySlots]) => {
        daySlots.forEach((s) =>
          slots.push({
            dayOfWeek: parseInt(dow),
            startTime: s.start,
            endTime: s.end,
          })
        );
      });
      await upsertInstructorAvailabilityPrisma(selectedInstructorId, slots);
      toast({ variant: "success", title: "Tilgjengelighet lagret" });
      loadData();
    });
  };

  const handleAddSlot = (dayIndex: number) => {
    setEditingSlots((prev) => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), { start: "09:00", end: "17:00" }],
    }));
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    setEditingSlots((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter((_, i) => i !== slotIndex),
    }));
  };



  return (
    <div className="space-y-6">
      {/* Recurring availability */}
      <div className="bg-white rounded-xl border border-grey-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-black">
              Faste arbeidstider
            </h3>
            <div className="flex items-center gap-1 text-xs text-grey-500">
              <Repeat className="w-3.5 h-3.5" />
              Gjentas ukentlig
            </div>
          </div>
          <Button variant="accent" onClick={handleSave} isLoading={isSaving}>
            <CheckCircle className="w-4 h-4" />
            Lagre
          </Button>
        </div>
        <div className="divide-y divide-grey-200">
          {DAYS.map((day, i) => {
            const dayIndex = DAY_INDICES[i];
            const slots = editingSlots[dayIndex] || [];
            return (
              <div key={day} className="px-4 py-3 flex items-start gap-4">
                <div className="w-12 shrink-0 pt-1">
                  <span className="text-sm font-semibold text-black">{day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {slots.length > 0 ? (
                      slots.map((slot, j) => (
                        <div
                          key={j}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-grey-100 rounded-full text-sm text-success-text"
                        >
                          <span className="tabular-nums">
                            {slot.start} – {slot.end}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(dayIndex, j)}
                            className="w-5 h-5 rounded-full hover:bg-grey-200 flex items-center justify-center text-grey-500 hover:text-error transition-colors"
                            aria-label="Fjern"
                          >
                            <span className="text-xs leading-none">×</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-grey-500 py-1.5">Fri</span>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => handleAddSlot(dayIndex)}
                      className="text-sm px-3 py-1.5 h-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Legg til
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AvailabilityBlockedTimes
        instructorId={selectedInstructorId}
        blockedTimes={blockedTimes}
        onChange={loadData}
      />
    </div>
  );
}
