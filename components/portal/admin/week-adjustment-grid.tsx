"use client";

import { useState } from "react";
import { Pencil, RotateCcw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DayCapacity } from "@/app/portal/(dashboard)/admin/kapasitet/week-actions";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface WeekAdjustmentGridProps {
  days: DayCapacity[];
  onSaveOverride: (
    date: Date,
    startTime: string,
    endTime: string
  ) => Promise<void>;
  onDeleteOverride: (date: Date) => Promise<void>;
  saving: boolean;
}

const TIME_OPTIONS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00",
];

export function WeekAdjustmentGrid({
  days,
  onSaveOverride,
  onDeleteOverride,
  saving,
}: WeekAdjustmentGridProps) {
  const [editingDay, setEditingDay] = useState<Date | null>(null);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  const startEditing = (day: DayCapacity) => {
    setEditingDay(day.date);
    if (day.hasOverride && day.override) {
      setEditStartTime(day.override.startTime);
      setEditEndTime(day.override.endTime);
    } else if (day.regularSlots.length > 0) {
      setEditStartTime(day.regularSlots[0].startTime);
      setEditEndTime(day.regularSlots[day.regularSlots.length - 1].endTime);
    } else {
      setEditStartTime("09:00");
      setEditEndTime("17:00");
    }
  };

  const cancelEditing = () => {
    setEditingDay(null);
    setEditStartTime("");
    setEditEndTime("");
  };

  const handleSave = async (date: Date) => {
    await onSaveOverride(date, editStartTime, editEndTime);
    cancelEditing();
  };

  const handleReset = async (date: Date) => {
    await onDeleteOverride(date);
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-grey-200)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[var(--color-grey-100)] border-b border-[var(--color-grey-200)]">
        <h3 className="font-semibold text-[var(--color-grey-900)]">
          Ukejustering
        </h3>
        <p className="text-xs text-[var(--color-grey-500)] mt-0.5">
          Klikk for a endre tilgjengelighet for spesifikke dager
        </p>
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 divide-x divide-[var(--color-grey-100)]">
        {days.map((day) => {
          const isEditing = editingDay?.getTime() === day.date.getTime();
          const shortDay = format(day.date, "EEE", { locale: nb });
          const dateNum = format(day.date, "d");

          return (
            <div
              key={day.date.toISOString()}
              className={`p-3 ${
                day.hasOverride
                  ? "bg-white"
                  : "bg-[var(--color-grey-100)]/50"
              } ${day.hasOverride ? "border-l-2 border-l-[var(--color-grey-900)]" : ""}`}
            >
              {/* Day Header */}
              <div className="text-center mb-2">
                <span className="text-xs font-medium text-[var(--color-grey-500)] uppercase">
                  {shortDay}
                </span>
                <p className="text-lg font-semibold text-[var(--color-grey-900)]">
                  {dateNum}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  /* Edit Mode */
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <div>
                      <label className="text-[10px] text-[var(--color-grey-500)] uppercase">
                        Fra
                      </label>
                      <select
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-[var(--color-grey-200)] rounded bg-white"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[var(--color-grey-500)] uppercase">
                        Til
                      </label>
                      <select
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-[var(--color-grey-200)] rounded bg-white"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSave(day.date)}
                        disabled={saving}
                        className="flex-1 p-1.5 bg-[var(--color-grey-900)] text-white rounded text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 p-1.5 bg-[var(--color-grey-100)] rounded text-xs flex items-center justify-center gap-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* View Mode */
                  <motion.div
                    key="viewing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    {/* Hours Display */}
                    <div className="text-center">
                      <span
                        className={`text-xl font-bold ${
                          day.hasOverride
                            ? "text-[var(--color-grey-900)]"
                            : "text-[var(--color-grey-500)]"
                        }`}
                      >
                        {day.effectiveHours.toFixed(0)}t
                      </span>
                      {day.hasOverride && (
                        <p className="text-[10px] text-[var(--color-grey-400)]">
                          (fast: {day.regularHours.toFixed(0)}t)
                        </p>
                      )}
                    </div>

                    {/* Time Range */}
                    {day.effectiveHours > 0 && (
                      <p className="text-[10px] text-center text-[var(--color-grey-500)]">
                        {day.hasOverride && day.override
                          ? `${day.override.startTime}-${day.override.endTime}`
                          : day.regularSlots.length > 0
                          ? `${day.regularSlots[0].startTime}-${day.regularSlots[day.regularSlots.length - 1].endTime}`
                          : "Ingen"}
                      </p>
                    )}

                    {/* Booked indicator */}
                    {day.bookedHours > 0 && (
                      <div className="text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
                          {day.bookedHours.toFixed(1)}t booket
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => startEditing(day)}
                        className="p-1.5 rounded hover:bg-[var(--color-grey-100)] transition-colors"
                        title="Rediger"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[var(--color-grey-500)]" />
                      </button>
                      {day.hasOverride && (
                        <button
                          onClick={() => handleReset(day.date)}
                          disabled={saving}
                          className="p-1.5 rounded hover:bg-[var(--color-grey-100)] transition-colors disabled:opacity-50"
                          title="Tilbakestill til fast"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[var(--color-grey-500)]" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-[var(--color-grey-100)]/50 border-t border-[var(--color-grey-200)] flex items-center gap-4 text-[10px] text-[var(--color-grey-500)]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[var(--color-grey-100)]/50" />
          <span>Fast tilgjengelighet</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-white border-l-2 border-l-[var(--color-grey-900)]" />
          <span>Override aktiv</span>
        </div>
      </div>
    </div>
  );
}
